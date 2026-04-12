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

function formatMoney(value) {
  try {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0
    }).format(Number(value || 0));
  } catch {
    return `${value || 0} MXN`;
  }
}

function escapeHtml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const body = parseBody(req);
    const form = body.form && typeof body.form === "object" ? body.form : {};
    const action = String(body.action || "start");
    const totals = body.totals && typeof body.totals === "object" ? body.totals : {};
    const summaryItems = Array.isArray(body.summaryItems) ? body.summaryItems : [];
    const payment = body.payment && typeof body.payment === "object" ? body.payment : {};
    const coupon = body.coupon && typeof body.coupon === "object" ? body.coupon : {};
    const attachments = Array.isArray(body.attachments) ? body.attachments.slice(0, 5) : [];

    const requiredFields = ["fullName", "businessName", "contactPhone"];
    const missing = requiredFields.filter((field) => !String(form[field] || "").trim());
    if (missing.length) {
      return res.status(400).json({ error: "Missing required onboarding fields." });
    }

    if (!process.env.RESEND_API_KEY) {
      return res.status(503).json({ error: "RESEND_API_KEY is missing in environment variables." });
    }

    const fromEmail = process.env.MAIL_FROM || "BryanF Design <no-reply@bryanfdesign.com.mx>";
    const to = ["bryanf@bryanfdesign.com.mx", "pandita250599@gmail.com"];

    const summaryHtml = summaryItems
      .map((item) => `<li><strong>${escapeHtml(item.source || "Módulo")}</strong> - ${formatMoney(item.price || 0)}</li>`)
      .join("");

    const html = `
      <div style="font-family:Inter,Arial,sans-serif;max-width:720px;margin:0 auto;color:#171717;">
        <h2 style="margin:0 0 12px;">Nuevo onboarding de proyecto</h2>
        <p style="margin:0 0 16px;">Se recibió un nuevo briefing desde el flujo de pago rápido.</p>
        <h3 style="margin:18px 0 8px;">Acción solicitada</h3>
        <p style="margin:0 0 8px;"><strong>${escapeHtml(action)}</strong></p>
        <h3 style="margin:18px 0 8px;">Datos de contacto</h3>
        <ul style="margin:0 0 14px;padding-left:18px;">
          <li><strong>Nombre:</strong> ${escapeHtml(form.fullName)}</li>
          <li><strong>Negocio:</strong> ${escapeHtml(form.businessName)}</li>
          <li><strong>WhatsApp:</strong> ${escapeHtml(form.contactPhone)}</li>
          <li><strong>Correo:</strong> ${escapeHtml(form.contactEmail || "No compartido")}</li>
          <li><strong>Contacto secundario:</strong> ${escapeHtml(form.secondaryContact || "No compartido")}</li>
        </ul>
        <h3 style="margin:18px 0 8px;">Proyecto</h3>
        <ul style="margin:0 0 14px;padding-left:18px;">
          <li><strong>Productos/servicios:</strong> ${escapeHtml(form.services || "No especificado")}</li>
          <li><strong>Descripción:</strong> ${escapeHtml(form.projectBrief || "No especificado")}</li>
          <li><strong>Objetivos:</strong> ${escapeHtml(form.mainGoal || "No especificado")}</li>
          <li><strong>Referencias:</strong> ${escapeHtml(form.references || "No especificado")}</li>
        </ul>
        <h3 style="margin:18px 0 8px;">Cotización</h3>
        <ul style="margin:0 0 14px;padding-left:18px;">
          <li><strong>Total proyecto:</strong> ${formatMoney(totals.projectTotal || 0)}</li>
          <li><strong>Pago ahora:</strong> ${formatMoney(totals.payableNow || 0)}</li>
          <li><strong>Método:</strong> ${escapeHtml(payment.method || "pendiente")}</li>
          <li><strong>Cupón:</strong> ${escapeHtml(coupon.code || "Sin cupón")}</li>
        </ul>
        <h3 style="margin:18px 0 8px;">Servicios seleccionados</h3>
        <ul style="margin:0 0 14px;padding-left:18px;">${summaryHtml || "<li>Sin extras</li>"}</ul>
      </div>
    `;

    const resendPayload = {
      from: fromEmail,
      to,
      subject: `Onboarding BryanF Design - ${form.businessName}`,
      html
    };

    const safeAttachments = attachments
      .filter((file) => file && file.name && file.base64)
      .map((file) => ({
        filename: String(file.name).slice(0, 120),
        content: file.base64,
        type: file.type || "application/octet-stream"
      }));

    if (safeAttachments.length) resendPayload.attachments = safeAttachments;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(resendPayload)
    });

    const resendData = await resendResponse.json();
    if (!resendResponse.ok || resendData.error) {
      const detail = resendData && resendData.error ? resendData.error.message || JSON.stringify(resendData.error) : "Email service error";
      return res.status(502).json({ error: `Resend error: ${detail}` });
    }

    return res.status(200).json({ ok: true, id: resendData.id || null });
  } catch (error) {
    return res.status(500).json({ error: `Onboarding submit error: ${error.message}` });
  }
};
