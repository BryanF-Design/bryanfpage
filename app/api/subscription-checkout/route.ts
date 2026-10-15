import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { forbidden, getClientIp, isSameOrigin, rateLimit, tooManyRequests } from "@/lib/api-guard";
import { sanitizeAttribution } from "@/lib/attribution";
import { SUBSCRIPTION_PLAN } from "@/lib/catalog";
import { getSiteUrl } from "@/lib/site-url";

export const runtime = "nodejs";

/**
 * Alta de la suscripción mensual con Stripe Checkout (mode: "subscription").
 *
 * Si existe STRIPE_SUBSCRIPTION_PRICE_ID (un precio recurrente creado en el
 * Dashboard de Stripe) se usa ese; si no, el precio se arma aquí desde el
 * catálogo. El precio nunca viene del navegador.
 */
export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET) {
      return NextResponse.json({ error: "STRIPE_SECRET missing" }, { status: 500 });
    }
    if (!isSameOrigin(req)) return forbidden();

    const { ok } = rateLimit(`subscription-checkout:${getClientIp(req)}`, {
      limit: 10,
      windowMs: 5 * 60 * 1000,
    });
    if (!ok) return tooManyRequests();

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const attribution = sanitizeAttribution(body.attribution);
    const siteUrl = getSiteUrl();
    const stripe = new Stripe(process.env.STRIPE_SECRET);

    const priceId = (process.env.STRIPE_SUBSCRIPTION_PRICE_ID || "").trim();
    const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = priceId.startsWith("price_")
      ? { price: priceId, quantity: 1 }
      : {
          quantity: 1,
          price_data: {
            currency: "mxn",
            unit_amount: SUBSCRIPTION_PLAN.price * 100,
            recurring: { interval: SUBSCRIPTION_PLAN.interval },
            product_data: { name: SUBSCRIPTION_PLAN.productName },
          },
        };

    const metadata = { plan: SUBSCRIPTION_PLAN.id, ...attribution };
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [lineItem],
      locale: "es-419",
      phone_number_collection: { enabled: true },
      billing_address_collection: "auto",
      allow_promotion_codes: true,
      metadata,
      // La metadata también vive en la suscripción: los correos de renovación
      // y cancelación saben de qué campaña vino el cliente.
      subscription_data: { metadata },
      success_url: `${siteUrl}/gracias?status=success&provider=stripe&plan=${SUBSCRIPTION_PLAN.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/suscripcion?status=cancel`,
    });

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error("Stripe subscription error:", error);
    return NextResponse.json(
      { error: "No se pudo iniciar la suscripción con tarjeta. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
