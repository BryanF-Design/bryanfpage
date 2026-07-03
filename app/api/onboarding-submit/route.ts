import { NextRequest, NextResponse } from "next/server";
import { forbidden, getClientIp, isSameOrigin, rateLimit, tooManyRequests } from "@/lib/api-guard";

export const runtime = "nodejs";

const FIELD_MAX = 500;
const LONG_FIELD_MAX = 4000;
const LONG_FIELDS = new Set(["projectBrief", "references"]);
const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024; // 5MB per file (base64-decoded estimate)
const MAX_TOTAL_ATTACHMENT_BYTES = 15 * 1024 * 1024;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clampField(value: unknown, key: string) {
  const max = LONG_FIELDS.has(key) ? LONG_FIELD_MAX : FIELD_MAX;
  return String(value ?? "").trim().slice(0, max);
}

function formatMoney(value: unknown) {
  try {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));
  } catch {
    return `${value || 0} MXN`;
  }
}

function escapeHtml(text: unknown) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    if (!isSameOrigin(req)) return forbidden();

    const { ok } = rateLimit(`onboarding-submit:${getClientIp(req)}`, {
      limit: 5,
      windowMs: 10 * 60 * 1000,
    });
    if (!ok) return tooManyRequests();

    const body = (await req
      .json()
      .catch(() => ({}))) as Record<string, unknown>;

    const rawForm =
      body.form && typeof body.form === "object"
        ? (body.form as Record<string, unknown>)
        : {};
    const form = Object.fromEntries(
      Object.entries(rawForm).map(([k, v]) => [k, clampField(v, k)])
    ) as Record<string, string>;
    const action = String(body.action || "start").slice(0, 60);
    const totals =
      body.totals && typeof body.totals === "object"
        ? (body.totals as Record<string, unknown>)
        : {};
    const summaryItems = Array.isArray(body.summaryItems)
      ? (body.summaryItems as Array<Record<string, unknown>>).slice(0, 30)
      : [];
    const payment =
      body.payment && typeof body.payment === "object"
        ? (body.payment as Record<string, unknown>)
        : {};
    const coupon =
      body.coupon && typeof body.coupon === "object"
        ? (body.coupon as Record<string, unknown>)
        : {};
    const attachments = Array.isArray(body.attachments)
      ? (body.attachments as Array<Record<string, unknown>>).slice(0, 5)
      : [];

    const requiredFields = ["fullName", "businessName", "contactPhone"];
    const missing = requiredFields.filter(
      (field) => !String(form[field] || "").trim()
    );
    if (missing.length) {
      return NextResponse.json(
        { error: "Missing required onboarding fields." },
        { status: 400 }
      );
    }
    if (form.contactEmail && !EMAIL_RE.test(form.contactEmail)) {
      return NextResponse.json(
        { error: "Invalid contact email." },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "RESEND_API_KEY is missing in environment variables." },
        { status: 503 }
      );
    }

    const fromEmail =
      process.env.MAIL_FROM ||
      "BryanF Design <no-reply@bryanfdesign.com.mx>";
    const to = ["bryanf@bryanfdesign.com.mx", "pandita250599@gmail.com"];

    const summaryHtml = summaryItems
      .map(
        (item) =>
          `<li><strong>${escapeHtml(
            item.source || "Módulo"
          )}</strong> - ${formatMoney(item.price || 0)}</li>`
      )
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

    const resendPayload: Record<string, unknown> = {
      from: fromEmail,
      to,
      subject: `Onboarding BryanF Design - ${form.businessName}`,
      html,
    };

    let totalAttachmentBytes = 0;
    const safeAttachments = attachments
      .filter((file) => file && file.name && typeof file.base64 === "string")
      .filter((file) => {
        // base64 decodes to ~3/4 its string length; use that as a size estimate.
        const bytes = ((file.base64 as string).length * 3) / 4;
        if (bytes > MAX_ATTACHMENT_BYTES) return false;
        totalAttachmentBytes += bytes;
        return totalAttachmentBytes <= MAX_TOTAL_ATTACHMENT_BYTES;
      })
      .map((file) => ({
        filename: String(file.name).slice(0, 120),
        content: file.base64,
        type: file.type || "application/octet-stream",
      }));

    if (safeAttachments.length) resendPayload.attachments = safeAttachments;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resendPayload),
    });

    const resendData = await resendResponse.json();
    if (!resendResponse.ok || resendData.error) {
      console.error("Resend error:", resendData?.error || resendResponse.status);
      return NextResponse.json(
        { error: "No se pudo enviar el briefing. Intenta de nuevo o escríbenos por WhatsApp." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, id: resendData.id || null });
  } catch (error) {
    console.error("Onboarding submit error:", error);
    return NextResponse.json(
      { error: "No se pudo enviar el briefing. Intenta de nuevo o escríbenos por WhatsApp." },
      { status: 500 }
    );
  }
}
