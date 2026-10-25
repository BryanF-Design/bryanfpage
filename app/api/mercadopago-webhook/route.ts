import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { MercadoPagoConfig, Payment, PreApproval } from "mercadopago";

import { SUBSCRIPTION_PLAN } from "@/lib/catalog";
import { briefUrl } from "@/lib/brief-access";
import { sendOrderConfirmation, sendPaymentPending, sendSubscriptionNotice } from "@/lib/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Idempotencia best-effort dentro de una instancia caliente (ver stripe-webhook).
const processed = new Set<string>();

/**
 * Verificación de firma de Mercado Pago (opcional, si MP_WEBHOOK_SECRET está
 * configurado). El manifiesto es `id:<dataId>;request-id:<x-request-id>;ts:<ts>;`
 * firmado con HMAC-SHA256. Aun sin secreto, NO confiamos en el cuerpo: el estado
 * "approved" se confirma re-consultando el pago con nuestro token.
 */
function verifySignature(req: NextRequest, dataId: string): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) return true; // sin secreto: la autenticidad la da la re-consulta

  const xSignature = req.headers.get("x-signature") || "";
  const xRequestId = req.headers.get("x-request-id") || "";
  const parts = Object.fromEntries(
    xSignature.split(",").map((kv) => {
      const [k, v] = kv.split("=");
      return [k?.trim(), v?.trim()];
    })
  );
  const ts = parts["ts"];
  const v1 = parts["v1"];
  if (!ts || !v1) return false;

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(manifest)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(v1));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "MP no configurado" }, { status: 500 });
  }

  // El id del pago puede venir en el cuerpo o en el query, según el formato.
  const url = new URL(req.url);
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const type =
    (body.type as string) ||
    url.searchParams.get("type") ||
    url.searchParams.get("topic") ||
    "";
  const data = (body.data as Record<string, unknown>) || {};
  const dataId =
    (data.id != null ? String(data.id) : "") ||
    url.searchParams.get("data.id") ||
    url.searchParams.get("id") ||
    "";

  // Suscripción (preapproval): alta o cancelación del plan mensual.
  if (/subscription_preapproval|^preapproval$/i.test(type) && dataId) {
    if (!verifySignature(req, dataId)) {
      return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
    }
    try {
      const client = new MercadoPagoConfig({ accessToken: token });
      const sub = await new PreApproval(client).get({ id: dataId });
      const key = `pre:${dataId}:${sub.status}`;
      if (!processed.has(key)) {
        processed.add(key);
        if (sub.status === "authorized") {
          await sendOrderConfirmation({
            provider: "mercadopago",
            amount: Number(sub.auto_recurring?.transaction_amount ?? SUBSCRIPTION_PLAN.price),
            currency: (sub.auto_recurring?.currency_id || "MXN").toUpperCase(),
            reference: String(sub.id ?? dataId),
            description: `${SUBSCRIPTION_PLAN.productName} (mensual)`,
            customerEmail: sub.payer_email ?? null,
            subscription: true,
            briefUrl: briefUrl({ provider: "mercadopago", preapprovalId: String(sub.id ?? dataId) }),
            nextChargeDate: sub.next_payment_date ?? null,
          });
        } else if (sub.status === "cancelled") {
          await sendSubscriptionNotice({
            event: "cancelled",
            provider: "mercadopago",
            reference: String(sub.id ?? dataId),
            customerEmail: sub.payer_email ?? null,
          });
        }
      }
    } catch (err) {
      console.error("Mercado Pago preapproval webhook error:", err);
    }
    return NextResponse.json({ received: true });
  }

  // Los cobros mensuales de la suscripción también llegan como `payment`
  // normal; el aviso de "authorized_payment" sería un duplicado.
  if (/authorized_payment/i.test(type)) {
    return NextResponse.json({ received: true, ignored: true });
  }

  // Sólo nos interesan notificaciones de pago con id.
  if (!/payment/i.test(type) || !dataId) {
    return NextResponse.json({ received: true, ignored: true });
  }

  if (!verifySignature(req, dataId)) {
    return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
  }

  if (processed.has(dataId)) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  try {
    const client = new MercadoPagoConfig({ accessToken: token });
    const payment = await new Payment(client).get({ id: dataId });

    const name =
      [payment.payer?.first_name, payment.payer?.last_name].filter(Boolean).join(" ") || null;
    // Cobro mensual de una suscripción (preapproval), no una compra nueva.
    const recurring =
      payment.operation_type === "recurring_payment" ||
      /subscription/i.test(String(payment.point_of_interaction?.type || ""));

    if (recurring && (payment.status === "approved" || payment.status === "rejected")) {
      const key = `${dataId}:${payment.status}`;
      if (!processed.has(key)) {
        processed.add(key);
        const approved = payment.status === "approved";
        const next = new Date(payment.date_approved || payment.date_created || Date.now());
        next.setMonth(next.getMonth() + 1);
        await sendSubscriptionNotice({
          event: approved ? "renewal" : "payment_failed",
          provider: "mercadopago",
          reference: String(payment.id ?? dataId),
          amount: Number(payment.transaction_amount ?? SUBSCRIPTION_PLAN.price),
          currency: (payment.currency_id || "MXN").toUpperCase(),
          customerEmail: payment.payer?.email ?? null,
          customerName: name,
          nextChargeDate: approved ? next : null,
          payUrl: approved ? null : "https://www.mercadopago.com.mx/subscriptions",
        });
      }
    } else if (payment.status === "approved") {
      processed.add(dataId);
      await sendOrderConfirmation({
        provider: "mercadopago",
        amount: Number(payment.transaction_amount ?? 0),
        currency: (payment.currency_id || "MXN").toUpperCase(),
        reference: String(payment.id ?? dataId),
        description: payment.description || "Proyecto web",
        customerEmail: payment.payer?.email ?? null,
        customerName: name,
        modalidad:
          (payment.metadata as Record<string, unknown> | undefined)?.modalidad?.toString() ??
          null,
        attribution: (payment.metadata as Record<string, unknown> | undefined) ?? undefined,
        briefUrl: briefUrl({ provider: "mercadopago", paymentId: String(payment.id ?? dataId) }),
      });
    } else if (!recurring && (payment.status === "pending" || payment.status === "in_process")) {
      // Ficha de OXXO / SPEI por pagar, o pago en revisión. No se marca el id
      // como procesado: cuando se apruebe llega otra notificación y se manda
      // el comprobante normal.
      const key = `${dataId}:pending`;
      if (!processed.has(key)) {
        processed.add(key);
        const ticket =
          payment.status === "pending" &&
          ["ticket", "atm", "bank_transfer"].includes(String(payment.payment_type_id || ""));
        await sendPaymentPending({
          provider: "mercadopago",
          reference: String(payment.id ?? dataId),
          amount: Number(payment.transaction_amount ?? 0),
          currency: (payment.currency_id || "MXN").toUpperCase(),
          kind: ticket ? "ticket" : "review",
          description: payment.description || "Proyecto web",
          customerEmail: payment.payer?.email ?? null,
          customerName: name,
          ticketUrl: payment.transaction_details?.external_resource_url ?? null,
          expiresAt: payment.date_of_expiration ?? null,
        });
      }
    }
  } catch (err) {
    // No forzamos reintentos por un fallo de correo/consulta transitorio: MP
    // reintrega igualmente si respondemos != 2xx, pero preferimos registrar.
    console.error("Mercado Pago webhook error:", err);
  }

  return NextResponse.json({ received: true });
}
