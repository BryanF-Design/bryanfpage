import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { forbidden, getClientIp, isSameOrigin, rateLimit, tooManyRequests } from "@/lib/api-guard";
import { getUsdMxnRate, isCurrency } from "@/lib/currency";
import { normalizeSelection, quotePayableNow, quoteProjectTotal } from "@/lib/quote";

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
    // Moneda elegida en el configurador; MXN por defecto (comportamiento previo).
    const rawCurrency = (body as Record<string, unknown>).currency;
    const currency = isCurrency(rawCurrency) ? rawCurrency : "MXN";
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

    // Precio autoritativo del lado del servidor: si el cliente manda la
    // selección estructurada (plan + módulos + secciones), el total se
    // recompone desde el catálogo y se cobra ESE número — nunca el que venga
    // calculado en el navegador. Sin selección, se conserva el flujo previo
    // validando el monto en un rango sano (compatibilidad hacia atrás).
    const rawSelection = (body as Record<string, unknown>).selection;
    let projectTotal: number;
    if (rawSelection && typeof rawSelection === "object") {
      const selection = normalizeSelection(rawSelection);
      projectTotal = quoteProjectTotal(
        selection,
        currency,
        getUsdMxnRate(process.env.NEXT_PUBLIC_USD_MXN_RATE)
      );
    } else {
      projectTotal = monto;
    }

    if (!Number.isFinite(projectTotal) || projectTotal <= 0 || projectTotal > 2_000_000) {
      return NextResponse.json({ error: "Monto invalido" }, { status: 400 });
    }

    const payable = quotePayableNow(projectTotal, modalidad);
    const stripe = new Stripe(process.env.STRIPE_SECRET);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: currency.toLowerCase(),
            unit_amount: payable * 100,
            product_data: { name: descripcion },
          },
        },
      ],
      metadata: {
        modalidad,
        montoProyecto: String(projectTotal),
        montoCliente: String(monto),
        moneda: currency,
        ...metadata,
      },
      success_url: `${siteUrl}/gracias?status=success&provider=stripe`,
      cancel_url: `${siteUrl}/gracias?status=cancel&provider=stripe`,
    });

    return NextResponse.json({ checkoutUrl: session.url, amount: payable, currency });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "No se pudo iniciar el pago con tarjeta. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
