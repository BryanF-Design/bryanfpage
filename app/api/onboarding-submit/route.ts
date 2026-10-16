import { NextRequest, NextResponse } from "next/server";
import { forbidden, getClientIp, isSameOrigin, rateLimit, tooManyRequests } from "@/lib/api-guard";
import { BRIEF_SECTIONS, LONG_BRIEF_FIELDS, detectLinkType, normalizeUrl, purposeLabel } from "@/lib/brief";
import { briefReceived } from "@/lib/email-templates";
import { mailConfigured, notificationEmail, sendMail } from "@/lib/mailer";

export const runtime = "nodejs";

const FIELD_MAX = 500;
const LONG_FIELD_MAX = 4000;
const LONG_FIELDS = LONG_BRIEF_FIELDS;
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
    // Enlaces del briefing: se vuelven a validar y a clasificar aquí (no se
    // confía en el tipo que manda el navegador).
    const links = (Array.isArray(body.links) ? body.links : [])
      .slice(0, 20)
      .map((raw) => {
        const l = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
        const norm = normalizeUrl(String(l.url || ""));
        if (!("url" in norm)) return null;
        return {
          url: norm.url,
          label: detectLinkType(norm.url).label,
          purpose: purposeLabel(String(l.purpose || "")),
        };
      })
      .filter((l): l is { url: string; label: string; purpose: string } => l !== null);
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

    if (!mailConfigured()) {
      return NextResponse.json(
        { error: "El correo no está configurado (GOOGLE_* o RESEND_API_KEY)." },
        { status: 503 }
      );
    }

    const to = Array.from(new Set([notificationEmail(), "pandita250599@gmail.com"]));

    // Briefing de /gracias: cada sección con sus campos (lib/brief.ts).
    const li = (label: string, value: string) =>
      `<li style="margin:0 0 6px;"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value).replace(/\n/g, "<br>")}</li>`;
    const briefHtml = BRIEF_SECTIONS.map((section) => {
      const rows = section.fields
        .filter((f) => !["fullName", "businessName", "contactPhone", "contactEmail"].includes(f.key) && form[f.key])
        .map((f) => li(f.label, form[f.key]));
      if (section.id === "proyecto" && form.features) rows.push(li("Funciones", form.features));
      return rows.length
        ? `<h3 style="margin:18px 0 8px;">${escapeHtml(section.title)}</h3><ul style="margin:0 0 14px;padding-left:18px;">${rows.join("")}</ul>`
        : "";
    }).join("");
    const linksHtml = links.length
      ? `<h3 style="margin:18px 0 8px;">Enlaces (${links.length})</h3><ul style="margin:0 0 14px;padding-left:18px;">${links
          .map(
            (l) =>
              `<li style="margin:0 0 6px;"><strong>${escapeHtml(l.label)}</strong> · ${escapeHtml(l.purpose)}<br><a href="${escapeHtml(l.url)}">${escapeHtml(l.url)}</a></li>`
          )
          .join("")}</ul>`
      : "";
    const legacyHtml = [
      form.secondaryContact && li("Contacto secundario", form.secondaryContact),
      form.mainGoal && !form.projectType && li("Objetivos", form.mainGoal),
      form.references && li("Referencias", form.references),
      form.notes && li("Notas", form.notes),
    ]
      .filter(Boolean)
      .join("");

    const summaryHtml = summaryItems
      .map(
        (item) =>
          `<li><strong>${escapeHtml(
            item.source || "Módulo"
          )}</strong> - ${formatMoney(item.price || 0)}</li>`
      )
      .join("");

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

    const safeAttachmentsCount = safeAttachments.length;

    const html = `
      <div style="font-family:Inter,Arial,sans-serif;max-width:720px;margin:0 auto;color:#171717;">
        <h2 style="margin:0 0 12px;">Nuevo onboarding de proyecto</h2>
        <p style="margin:0 0 16px;">Se recibió un nuevo briefing${safeAttachmentsCount ? ` con ${safeAttachmentsCount} archivo(s) adjunto(s)` : ""}.</p>
        <h3 style="margin:18px 0 8px;">Acción solicitada</h3>
        <p style="margin:0 0 8px;"><strong>${escapeHtml(action)}</strong></p>
        <h3 style="margin:18px 0 8px;">Datos de contacto</h3>
        <ul style="margin:0 0 14px;padding-left:18px;">
          <li><strong>Nombre:</strong> ${escapeHtml(form.fullName)}</li>
          <li><strong>Negocio:</strong> ${escapeHtml(form.businessName)}</li>
          <li><strong>WhatsApp:</strong> ${escapeHtml(form.contactPhone)}</li>
          <li><strong>Correo:</strong> ${escapeHtml(form.contactEmail || "No compartido")}</li>
        </ul>
        ${briefHtml}
        ${linksHtml}
        ${legacyHtml ? `<h3 style="margin:18px 0 8px;">Más</h3><ul style="margin:0 0 14px;padding-left:18px;">${legacyHtml}</ul>` : ""}
        <h3 style="margin:18px 0 8px;">Pago</h3>
        <ul style="margin:0 0 14px;padding-left:18px;">
          ${totals.projectTotal ? `<li><strong>Total proyecto:</strong> ${formatMoney(totals.projectTotal)}</li>` : ""}
          ${totals.payableNow ? `<li><strong>Pagado / por pagar:</strong> ${formatMoney(totals.payableNow)} ${escapeHtml(totals.currency || "")}</li>` : ""}
          <li><strong>Método:</strong> ${escapeHtml(payment.method || "pendiente")}</li>
          <li><strong>Referencia de pago:</strong> ${escapeHtml(payment.reference || "—")}</li>
          ${coupon.code ? `<li><strong>Cupón:</strong> ${escapeHtml(coupon.code)}</li>` : ""}
        </ul>
        ${summaryHtml ? `<h3 style="margin:18px 0 8px;">Servicios seleccionados</h3><ul style="margin:0 0 14px;padding-left:18px;">${summaryHtml}</ul>` : ""}
      </div>
    `;

    const sent = await sendMail({
      to,
      subject: `Brief BryanF Design - ${form.businessName}`,
      html,
      replyTo: form.contactEmail || undefined,
      attachments: safeAttachments.map((file) => ({
        filename: file.filename,
        content: String(file.content),
        type: String(file.type),
      })),
    });
    if (!sent.ok) {
      console.error("Brief email error:", sent.error);
      return NextResponse.json(
        { error: "No se pudo enviar el briefing. Intenta de nuevo o escríbenos por WhatsApp." },
        { status: 502 }
      );
    }

    // Copia para el cliente: confirma que llegó y qué sigue. Si falla, el
    // briefing ya está con nosotros, así que no se reporta como error.
    if (form.contactEmail) {
      await sendMail({
        to: form.contactEmail,
        ...briefReceived({
          name: form.fullName,
          businessName: form.businessName,
          links: links.length,
          files: safeAttachmentsCount,
        }),
        replyTo: notificationEmail(),
      });
    }

    return NextResponse.json({ ok: true, id: sent.id || null });
  } catch (error) {
    console.error("Onboarding submit error:", error);
    return NextResponse.json(
      { error: "No se pudo enviar el briefing. Intenta de nuevo o escríbenos por WhatsApp." },
      { status: 500 }
    );
  }
}
