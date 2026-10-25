import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { forbidden, getClientIp, isSameOrigin, rateLimit, tooManyRequests } from "@/lib/api-guard";
import { sanitizeAttribution } from "@/lib/attribution";
import { getUsdMxnRate, isCurrency, usdToMxn } from "@/lib/currency";
import { normalizeSelection, quotePayableNow, quoteProjectTotal } from "@/lib/quote";
import { discountFor } from "@/lib/seasons";
import { getSiteSettings } from "@/lib/site-settings";
import { getSiteUrl } from "@/lib/site-url";

export const runtime = "nodejs";

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.MP_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: "MP_ACCESS_TOKEN missing" },
        { status: 500 }
      );
    }

    if (!isSameOrigin(req)) return forbidden();

    const { ok } = rateLimit(`mercadopago:${getClientIp(req)}`, {
      limit: 10,
      windowMs: 5 * 60 * 1000,
    });
    if (!ok) return tooManyRequests();

    const body = await req.json().catch(() => ({}) as Record<string, unknown>);
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
    const attribution = sanitizeAttribution((body as Record<string, unknown>).attribution);
    const siteUrl = getSiteUrl();

    // Precio autoritativo del lado del servidor (ver stripe-checkout).
    const rawSelection = (body as Record<string, unknown>).selection;
    if (!rawSelection || typeof rawSelection !== "object") {
      return NextResponse.json({ error: "Falta la selección del cotizador" }, { status: 400 });
    }
    // El descuento vigente (Panel BryanF) se aplica aquí, con el mismo dato
    // que pinta el cotizador.
    const settings = await getSiteSettings();
    const now = Date.now();
    const projectTotal = quoteProjectTotal(
      normalizeSelection(rawSelection),
      currency,
      getUsdMxnRate(process.env.NEXT_PUBLIC_USD_MXN_RATE),
      (key) => discountFor(settings, key, now)
    );

    if (!Number.isFinite(projectTotal) || projectTotal <= 0 || projectTotal > 2_000_000) {
      return NextResponse.json({ error: "Monto invalido" }, { status: 400 });
    }

    const payable = quotePayableNow(projectTotal, modalidad);

    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN,
    });
    const preference = new Preference(client);

    const externalReference = `bf-${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;

    const createPreference = (unitPrice: number, currencyId: "MXN" | "USD") =>
      preference.create({
        body: {
          items: [
            {
              id: "bryanf-servicio",
              title: descripcion,
              quantity: 1,
              unit_price: unitPrice,
              currency_id: currencyId,
            },
          ],
          back_urls: {
            success: `${siteUrl}/gracias?status=success&provider=mercadopago`,
            failure: `${siteUrl}/gracias?status=failure&provider=mercadopago`,
            pending: `${siteUrl}/gracias?status=pending&provider=mercadopago`,
          },
          auto_return: "approved",
          // El webhook confirma el pago del lado del servidor (idempotencia +
          // correo). external_reference correlaciona la preferencia con el pago.
          notification_url: `${siteUrl}/api/mercadopago-webhook`,
          external_reference: externalReference,
          // Campaña de origen (gclid/utm), para atribuir la venta (ver Stripe).
          metadata: { modalidad, moneda: currency, ...attribution },
        },
      });

    // USD solo funciona en cuentas de países que lo permiten; si Mercado Pago
    // lo rechaza, se cobra el equivalente redondeado en MXN — el flujo de
    // pago nunca se rompe por la moneda elegida.
    let chargedCurrency: "MXN" | "USD" = currency;
    let chargedAmount = payable;
    let result;
    if (currency === "USD") {
      try {
        result = await createPreference(payable, "USD");
      } catch {
        chargedCurrency = "MXN";
        chargedAmount = usdToMxn(payable, getUsdMxnRate(process.env.USD_MXN_RATE));
        result = await createPreference(chargedAmount, "MXN");
      }
    } else {
      result = await createPreference(payable, "MXN");
    }

    return NextResponse.json({
      preferenceId: result.id,
      initPoint: result.init_point || result.sandbox_init_point || "",
      amount: chargedAmount,
      currency: chargedCurrency,
    });
  } catch (error) {
    console.error("Mercado Pago error:", error);
    return NextResponse.json(
      { error: "No se pudo iniciar el pago con Mercado Pago. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
