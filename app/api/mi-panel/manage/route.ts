import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { forbidden, getClientIp, isSameOrigin, rateLimit, tooManyRequests } from "@/lib/api-guard";
import { CLIENT_COOKIE, readClientSession } from "@/lib/client-session";
import { getSiteUrl } from "@/lib/site-url";
import { loadClientPanel } from "@/lib/client-panel";

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

  const panel = await loadClientPanel(email);
  const current = panel?.subscription;
  if (!current) return NextResponse.json({ error: "No encontramos tu suscripción." }, { status: 404 });

  if (current.provider === "mercadopago") {
    return NextResponse.json({ url: "https://www.mercadopago.com.mx/subscriptions" });
  }
  // Mensualidad por transferencia: se arregla directo con Bryan.
  if (current.provider === "transferencia") {
    const text = `Hola Bryan, soy ${panel.name || email}. Quiero pagar o hacer un cambio en mi plan mensual.`;
    return NextResponse.json({ url: `https://wa.me/525663012505?text=${encodeURIComponent(text)}` });
  }

  const fallback = process.env.NEXT_PUBLIC_STRIPE_PORTAL_URL || "";
  try {
    if (!process.env.STRIPE_SECRET) throw new Error("sin Stripe");
    const stripe = new Stripe(process.env.STRIPE_SECRET);
    const customer = (await stripe.customers.list({ email, limit: 1 })).data[0];
    if (!customer) throw new Error("sin cliente de Stripe");
    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
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
