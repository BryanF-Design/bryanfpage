import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { MercadoPagoConfig, Payment } from "mercadopago";

import { forbidden, getClientIp, isSameOrigin, rateLimit, tooManyRequests } from "@/lib/api-guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Estado real de un pago, para /gracias.
 *
 * Stripe y Mercado Pago regresan al cliente a /gracias con el id del pago en la
 * URL. Esa URL la puede escribir cualquiera, así que la página no se cree el
 * `status=success`: pregunta aquí, y aquí se consulta al proveedor con nuestra
 * llave. Sólo un pago confirmado muestra "pago recibido" y cuenta como venta
 * (conversión `purchase`) en GA4 y Google Ads — con el monto real cobrado.
 */

type OrderState = "paid" | "pending" | "failed" | "unknown";

interface OrderStatus {
  state: OrderState;
  provider: "stripe" | "mercadopago";
  transactionId?: string;
  value?: number;
  currency?: string;
  /** Para precargar el briefing y la conversión mejorada. */
  email?: string;
  name?: string;
  phone?: string;
}

const STRIPE_SESSION_RE = /^cs_(test|live)_[A-Za-z0-9]{10,200}$/;
const MP_PAYMENT_RE = /^\d{1,24}$/;

function json(body: OrderStatus | { error: string }, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

async function stripeStatus(sessionId: string): Promise<OrderStatus> {
  if (!process.env.STRIPE_SECRET) return { state: "unknown", provider: "stripe" };
  const stripe = new Stripe(process.env.STRIPE_SECRET);
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  const state: OrderState =
    session.payment_status === "paid" || session.payment_status === "no_payment_required"
      ? "paid"
      : session.status === "complete"
        ? "pending" // pago asíncrono aún sin acreditar
        : session.status === "expired"
          ? "failed"
          : "unknown";

  return {
    state,
    provider: "stripe",
    transactionId: session.id,
    value: (session.amount_total ?? 0) / 100,
    currency: (session.currency || "mxn").toUpperCase(),
    email: session.customer_details?.email ?? undefined,
    name: session.customer_details?.name ?? undefined,
    phone: session.customer_details?.phone ?? undefined,
  };
}

async function mercadoPagoStatus(paymentId: string): Promise<OrderStatus> {
  if (!process.env.MP_ACCESS_TOKEN) return { state: "unknown", provider: "mercadopago" };
  const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
  const payment = await new Payment(client).get({ id: paymentId });

  const status = payment.status || "";
  const state: OrderState =
    status === "approved"
      ? "paid"
      : ["pending", "in_process", "authorized", "in_mediation"].includes(status)
        ? "pending"
        : ["rejected", "cancelled", "refunded", "charged_back"].includes(status)
          ? "failed"
          : "unknown";

  const name = [payment.payer?.first_name, payment.payer?.last_name].filter(Boolean).join(" ");
  const phone = [payment.payer?.phone?.area_code, payment.payer?.phone?.number]
    .filter(Boolean)
    .join("");

  return {
    state,
    provider: "mercadopago",
    transactionId: String(payment.id ?? paymentId),
    value: Number(payment.transaction_amount ?? 0),
    currency: (payment.currency_id || "MXN").toUpperCase(),
    email: payment.payer?.email || undefined,
    name: name || undefined,
    phone: phone || undefined,
  };
}

export async function GET(req: NextRequest) {
  if (!isSameOrigin(req)) return forbidden();

  const { ok } = rateLimit(`order-status:${getClientIp(req)}`, {
    limit: 20,
    windowMs: 5 * 60 * 1000,
  });
  if (!ok) return tooManyRequests();

  const params = req.nextUrl.searchParams;
  const provider = params.get("provider");

  try {
    if (provider === "stripe") {
      const sessionId = params.get("session_id") || "";
      if (!STRIPE_SESSION_RE.test(sessionId)) return json({ error: "session_id inválido" }, 400);
      return json(await stripeStatus(sessionId));
    }
    if (provider === "mercadopago") {
      const paymentId = params.get("payment_id") || params.get("collection_id") || "";
      if (!MP_PAYMENT_RE.test(paymentId)) return json({ error: "payment_id inválido" }, 400);
      return json(await mercadoPagoStatus(paymentId));
    }
    return json({ error: "Proveedor inválido" }, 400);
  } catch (error) {
    console.error("Order status error:", error);
    // Id inexistente o proveedor caído: la página muestra el estado genérico.
    return json({ state: "unknown", provider: provider === "stripe" ? "stripe" : "mercadopago" });
  }
}
