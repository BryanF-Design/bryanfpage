import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { MercadoPagoConfig, Payment } from "mercadopago";

import { sendOrderConfirmation } from "@/lib/notify";

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

    if (payment.status === "approved") {
      processed.add(dataId);
      await sendOrderConfirmation({
        provider: "mercadopago",
        amount: Number(payment.transaction_amount ?? 0),
        currency: (payment.currency_id || "MXN").toUpperCase(),
        reference: String(payment.id ?? dataId),
        description: payment.description || "Proyecto web",
        customerEmail: payment.payer?.email ?? null,
        customerName:
          [payment.payer?.first_name, payment.payer?.last_name]
            .filter(Boolean)
            .join(" ") || null,
        modalidad:
          (payment.metadata as Record<string, unknown> | undefined)?.modalidad?.toString() ??
          null,
      });
    }
  } catch (err) {
    // No forzamos reintentos por un fallo de correo/consulta transitorio: MP
    // reintrega igualmente si respondemos != 2xx, pero preferimos registrar.
    console.error("Mercado Pago webhook error:", err);
  }

  return NextResponse.json({ received: true });
}
