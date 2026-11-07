import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { forbidden, getClientIp, isSameOrigin, rateLimit, tooManyRequests } from "@/lib/api-guard";

export const runtime = "nodejs";

type PaymentState = "paid" | "pending" | "failed" | "not_found";

/**
 * "¿Ya terminaste tu pago?": el configurador pregunta aquí por el pago que
 * abrió en otra pestaña. Stripe se consulta por el id de la sesión de cobro;
 * Mercado Pago, por la referencia externa de la preferencia. Solo devuelve el
 * estado y el monto (nada del cliente).
 */
export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return forbidden();
  const { ok } = rateLimit(`payment-status:${getClientIp(req)}`, { limit: 20, windowMs: 5 * 60 * 1000 });
  if (!ok) return tooManyRequests();

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const provider = body.provider;
  const ref = String(body.ref || "").slice(0, 200);
  if (!ref || !/^[A-Za-z0-9_\-]+$/.test(ref)) {
    return NextResponse.json({ error: "invalid_ref" }, { status: 400 });
  }

  try {
    if (provider === "stripe") {
      if (!process.env.STRIPE_SECRET) return NextResponse.json({ error: "not_configured" }, { status: 503 });
      const stripe = new Stripe(process.env.STRIPE_SECRET);
      const session = await stripe.checkout.sessions.retrieve(ref);
      const state: PaymentState =
        session.payment_status === "paid"
          ? "paid"
          : session.status === "expired"
            ? "failed"
            : "pending";
      return NextResponse.json({
        state,
        amount: session.amount_total != null ? session.amount_total / 100 : undefined,
        currency: session.currency?.toUpperCase(),
      });
    }

    if (provider === "mercadopago") {
      if (!process.env.MP_ACCESS_TOKEN) return NextResponse.json({ error: "not_configured" }, { status: 503 });
      const url = `https://api.mercadopago.com/v1/payments/search?sort=date_created&criteria=desc&external_reference=${encodeURIComponent(ref)}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` } });
      if (!res.ok) return NextResponse.json({ error: "provider_error" }, { status: 502 });
      const data = (await res.json()) as {
        results?: { status?: string; transaction_amount?: number; currency_id?: string; id?: number }[];
      };
      const payments = data.results || [];
      const approved = payments.find((p) => p.status === "approved");
      const latest = approved || payments[0];
      let state: PaymentState = "not_found";
      if (approved) state = "paid";
      else if (latest && ["pending", "in_process", "authorized"].includes(String(latest.status))) state = "pending";
      else if (latest) state = "failed";
      return NextResponse.json({
        state,
        amount: latest?.transaction_amount,
        currency: latest?.currency_id,
        paymentId: latest?.id ? String(latest.id) : undefined,
      });
    }

    return NextResponse.json({ error: "invalid_provider" }, { status: 400 });
  } catch (error) {
    console.error("payment-status error:", error);
    return NextResponse.json({ error: "lookup_failed" }, { status: 502 });
  }
}
