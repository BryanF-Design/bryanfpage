const Stripe = require("stripe");

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
    if (!process.env.STRIPE_SECRET) {
      return res.status(500).json({ error: "STRIPE_SECRET missing" });
    }

    const body = parseBody(req);
    const monto = Number(body.monto || 0);
    const modalidad = body.modalidad === "anticipo" ? "anticipo" : "liquidacion";
    const descripcion = String(body.descripcion || "Servicio web - BryanF Design");
    const metadata = body.metadata && typeof body.metadata === "object" ? body.metadata : {};
    const siteUrl = String(process.env.SITE_URL || "https://example.com").replace(/\/$/, "");

    if (!Number.isFinite(monto) || monto <= 0) {
      return res.status(400).json({ error: "Monto invalido" });
    }

    const payable = Math.max(1, Math.round(monto * (modalidad === "anticipo" ? 0.5 : 1)));
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
            product_data: { name: descripcion }
          }
        }
      ],
      metadata: {
        modalidad,
        montoOriginal: String(monto),
        ...metadata
      },
      success_url: `${siteUrl}/?status=success#fast-track-section`,
      cancel_url: `${siteUrl}/?status=cancel#fast-track-section`
    });

    return res.status(200).json({
      checkoutUrl: session.url,
      amount: payable
    });
  } catch (error) {
    return res.status(500).json({ error: `Stripe checkout error: ${error.message}` });
  }
};
