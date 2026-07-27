import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { sendOrderConfirmation } from "@/lib/notify";

export const runtime = "nodejs";
// El cuerpo crudo es obligatorio para verificar la firma de Stripe: nada de
// caché ni de parseo previo.
export const dynamic = "force-dynamic";

// Idempotencia best-effort dentro de una instancia caliente. Stripe reintenta
// entregas; procesar dos veces enviaría correos duplicados. Para garantía dura
// entre instancias/arranques en frío haría falta un store (Vercel KV/DB).
const processed = new Set<string>();

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripeKey = process.env.STRIPE_SECRET;
  if (!secret || !stripeKey) {
    // 500 para que Stripe reintente cuando la config esté completa.
    return NextResponse.json(
      { error: "Stripe webhook no configurado" },
      { status: 500 }
    );
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Sin firma" }, { status: 400 });

  const raw = await req.text();
  const stripe = new Stripe(stripeKey);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (err) {
    // Firma inválida: nunca reintentar ni procesar.
    console.error("Stripe webhook signature error:", err);
    return NextResponse.json({ error: "Firma inválida" }, { status: 400 });
  }

  if (processed.has(event.id)) {
    return NextResponse.json({ received: true, duplicate: true });
  }
  processed.add(event.id);

  try {
    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      const session = event.data.object as Stripe.Checkout.Session;
      // Sólo confirmamos pagos realmente cobrados.
      if (session.payment_status === "paid" || session.status === "complete") {
        await sendOrderConfirmation({
          provider: "stripe",
          amount: (session.amount_total ?? 0) / 100,
          currency: (session.currency || "mxn").toUpperCase(),
          reference: session.id,
          description:
            session.metadata?.montoProyecto
              ? `Proyecto web (${session.metadata?.moneda || ""})`
              : "Proyecto web",
          customerEmail: session.customer_details?.email ?? null,
          customerName: session.customer_details?.name ?? null,
          modalidad: session.metadata?.modalidad ?? null,
        });
      }
    }
  } catch (err) {
    // No propagamos el error: el evento ya quedó verificado. Registramos y
    // devolvemos 200 para no forzar reintentos por un fallo de correo.
    console.error("Stripe webhook handling error:", err);
  }

  return NextResponse.json({ received: true });
}
