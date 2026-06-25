import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

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

    const body = await req.json().catch(() => ({}) as Record<string, unknown>);
    const monto = Number((body as Record<string, unknown>).monto || 0);
    const modalidad =
      (body as Record<string, unknown>).modalidad === "anticipo"
        ? "anticipo"
        : "liquidacion";
    const descripcion = String(
      (body as Record<string, unknown>).descripcion || "Servicio web - BryanF Design"
    ).slice(0, 200);
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

    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN,
    });
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            id: "bryanf-servicio",
            title: descripcion,
            quantity: 1,
            unit_price: payable,
            currency_id: "MXN",
          },
        ],
        back_urls: {
          success: `${siteUrl}/?status=success#fast-track-section`,
          failure: `${siteUrl}/?status=failure#fast-track-section`,
          pending: `${siteUrl}/?status=pending#fast-track-section`,
        },
        auto_return: "approved",
      },
    });

    return NextResponse.json({
      preferenceId: result.id,
      initPoint: result.init_point || result.sandbox_init_point || "",
      amount: payable,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    return NextResponse.json(
      { error: `Mercado Pago error: ${message}` },
      { status: 500 }
    );
  }
}
