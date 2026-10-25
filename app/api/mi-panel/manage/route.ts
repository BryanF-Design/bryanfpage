import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { forbidden, getClientIp, isSameOrigin, rateLimit, tooManyRequests } from "@/lib/api-guard";
import { CLIENT_COOKIE, readClientSession } from "@/lib/client-session";
import { getSiteUrl } from "@/lib/site-url";
import { findSubscriptionsByEmail } from "@/lib/subscribers";

export const runtime = "nodejs";

/**
 * Administrar la suscripción (tarjeta, facturas, cancelar). Con Stripe se
 * abre el portal de clientes ya con su sesión; con Mercado Pago, su sección
 * de suscripciones.
 */
export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return forbidden();
  if (!rateLimit(`mi-panel-manage:${getClientIp(req)}`, { limit: 10, windowMs: 10 * 60 * 1000 }).ok) {
    return tooManyRequests();
  }
  const email = readClientSession(req.cookies.get(CLIENT_COOKIE)?.value);
  if (!email) return NextResponse.json({ error: "Tu sesión terminó. Vuelve a entrar." }, { status: 401 });

  const subs = await findSubscriptionsByEmail(email);
  const current = subs[0];
  if (!current) return NextResponse.json({ error: "No encontramos tu suscripción." }, { status: 404 });

  if (current.provider === "mercadopago") {
    return NextResponse.json({ url: "https://www.mercadopago.com.mx/subscriptions" });
  }

  const fallback = process.env.NEXT_PUBLIC_STRIPE_PORTAL_URL || "";
  try {
    if (!current.customerId || !process.env.STRIPE_SECRET) throw new Error("sin cliente de Stripe");
    const stripe = new Stripe(process.env.STRIPE_SECRET);
    const session = await stripe.billingPortal.sessions.create({
      customer: current.customerId,
      return_url: `${getSiteUrl()}/mi-panel`,
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    // Sin el portal activado en Stripe, se usa el enlace público si existe.
    console.error("Mi panel: portal de Stripe", error);
    if (fallback) return NextResponse.json({ url: fallback });
    return NextResponse.json(
      { error: "No se pudo abrir la administración. Escríbenos por WhatsApp y lo hacemos por ti." },
      { status: 502 }
    );
  }
}
