const { MercadoPagoConfig, Preference } = require("mercadopago");

function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    if (!process.env.MP_ACCESS_TOKEN) {
      return res.status(500).json({ error: "MP_ACCESS_TOKEN missing" });
    }

    const body = parseBody(req);
    const monto = Number(body.monto || 0);
    const modalidad = body.modalidad === "anticipo" ? "anticipo" : "liquidacion";
    const descripcion = String(body.descripcion || "Servicio web - BryanF Design");
    const siteUrl = String(process.env.SITE_URL || "https://example.com").replace(/\/$/, "");

    if (!Number.isFinite(monto) || monto <= 0) {
      return res.status(400).json({ error: "Monto invalido" });
    }

    const payable = Math.max(1, Math.round(monto * (modalidad === "anticipo" ? 0.5 : 1)));

    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            id: "bryanf-servicio",
            title: descripcion,
            quantity: 1,
            unit_price: payable,
            currency_id: "MXN"
          }
        ],
        back_urls: {
          success: `${siteUrl}/?status=success#fast-track-section`,
          failure: `${siteUrl}/?status=failure#fast-track-section`,
          pending: `${siteUrl}/?status=pending#fast-track-section`
        },
        auto_return: "approved"
      }
    });

    return res.status(200).json({
      preferenceId: result.id,
      initPoint: result.init_point || result.sandbox_init_point || "",
      amount: payable
    });
  } catch (error) {
    return res.status(500).json({ error: `Mercado Pago error: ${error.message}` });
  }
};
