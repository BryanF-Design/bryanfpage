import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { forbidden, getClientIp, isSameOrigin, rateLimit, tooManyRequests } from "@/lib/api-guard";

export const runtime = "nodejs";

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET) {
      return NextResponse.json({ error: "STRIPE_SECRET missing" }, { status: 500 });
    }

    if (!isSameOrigin(req)) return forbidden();

    const { ok } = rateLimit(`stripe-checkout:${getClientIp(req)}`, {
      limit: 10,
      windowMs: 5 * 60 * 1000,
    });
    if (!ok) return tooManyRequests();

    const body = await req.json().catch(() => ({}) as Record<string, unknown>);
    const monto = Number((body as Record<string, unknown>).monto || 0);
    const modalidad =
      (body as Record<string, unknown>).modalidad === "anticipo"
        ? "anticipo"
        : "liquidacion";
    const descripcion = String(
      (body as Record<string, unknown>).descripcion || "Servicio web - BryanF Design"
    ).slice(0, 200);
    const rawMeta = (body as Record<string, unknown>).metadata;
    const metadata =
      rawMeta && typeof rawMeta === "object"
        ? Object.fromEntries(
            Object.entries(rawMeta as Record<string, unknown>)
              .slice(0, 20)
              .map(([k, v]) => [
                String(k).slice(0, 40),
                String(v ?? "").slice(0, 480),
              ])
          )
        : {};
    const siteUrl = String(process.env.SITE_URL || "https://example.com").replace(
      /\/$/,
      ""
    );

    // Client-controlled amount: require a sane range to avoid bogus charges.
    if (!Number.isFinite(monto) || monto <= 0 || monto > 2_000_000) {
      return NextResponse.json({ error: "Monto invalido" }, { status: 400 });
    }

    const payable = Math.max(
      1,
      Math.round(monto * (modalidad === "anticipo" ? 0.5 : 1))
    );
    const stripe = new Stripe(process.env.STRIPE_SECRET);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "mxn",
            unit_amount: payable * 100,
            product_data: { name: descripcion },
          },
        },
      ],
      metadata: {
        modalidad,
        montoOriginal: String(monto),
        ...metadata,
      },
      success_url: `${siteUrl}/?status=success#fast-track-section`,
      cancel_url: `${siteUrl}/?status=cancel#fast-track-section`,
    });

    return NextResponse.json({ checkoutUrl: session.url, amount: payable });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "No se pudo iniciar el pago con tarjeta. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
