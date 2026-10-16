import { NextRequest, NextResponse } from "next/server";
import { forbidden, getClientIp, isSameOrigin, rateLimit, tooManyRequests } from "@/lib/api-guard";
import { BRIEF_SECTIONS, LONG_BRIEF_FIELDS, detectLinkType, normalizeUrl, purposeLabel } from "@/lib/brief";
import { briefNotice, briefReceived } from "@/lib/email-templates";
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

    // Brief armado por secciones (lib/brief.ts), con el mismo diseño que el sitio.
    const CONTACT_KEYS = ["fullName", "businessName", "contactPhone", "contactEmail"];
    const sections = BRIEF_SECTIONS.map((section) => ({
      title: section.title,
      rows: section.fields
        .filter((f) => !CONTACT_KEYS.includes(f.key) && form[f.key])
        .map((f) => [f.label, form[f.key]] as [string, string]),
      chips:
        section.id === "proyecto" && form.features
          ? form.features.split(/\s*,\s*/).filter(Boolean)
          : undefined,
    }));
    const legacy = [
      form.secondaryContact && ["Contacto secundario", form.secondaryContact],
      form.mainGoal && !form.projectType && ["Objetivos", form.mainGoal],
      form.references && ["Referencias", form.references],
    ].filter(Boolean) as Array<[string, string]>;
    if (legacy.length) sections.push({ title: "Más", rows: legacy, chips: undefined });

    const content = briefNotice({
      fullName: form.fullName,
      businessName: form.businessName,
      phone: form.contactPhone,
      email: form.contactEmail || null,
      sections,
      links,
      files: safeAttachments.map((f) => f.filename),
      notes: form.notes || null,
      payment: [
        ["Total del proyecto", totals.projectTotal ? formatMoney(totals.projectTotal) : null],
        ["Pagado / por pagar", totals.payableNow ? `${formatMoney(totals.payableNow)} ${String(totals.currency || "")}`.trim() : null],
        ["Método", payment.method ? String(payment.method) : null],
        ["Referencia", payment.reference ? String(payment.reference) : null],
        ["Cupón", coupon.code ? String(coupon.code) : null],
        ["Acción", action !== "start" ? action : null],
      ],
      services: summaryItems.map((item) => [String(item.source || "Módulo"), formatMoney(item.price || 0)] as [string, string]),
    });

    const sent = await sendMail({
      to,
      ...content,
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
