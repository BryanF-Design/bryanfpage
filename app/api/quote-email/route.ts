import { NextRequest, NextResponse } from "next/server";

import { forbidden, getClientIp, isSameOrigin, rateLimit, tooManyRequests } from "@/lib/api-guard";
import { formatMoney, getUsdMxnRate, isCurrency, mxnToUsd, type Currency } from "@/lib/currency";
import { DICTIONARIES } from "@/lib/i18n/dictionaries";
import { notificationEmail, sendMail, senderEmail } from "@/lib/mailer";
import { buildQuoteLinesMxn, normalizeSelection, quotePayableNow, quoteProjectTotal } from "@/lib/quote";
import { getSiteUrl } from "@/lib/site-url";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']{2,}$/;
const WHATSAPP = "https://wa.me/525663012505";

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Envía la cotización del configurador al correo del visitante (y una copia
 * a Bryan, que es un prospecto). El total se recompone en el servidor desde
 * el catálogo, igual que en los cobros: nunca se confía en lo que mande el
 * navegador. Sale por Gmail API (o Resend de respaldo, ver lib/mailer.ts).
 */
export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return forbidden();
  const { ok } = rateLimit(`quote-email:${getClientIp(req)}`, { limit: 5, windowMs: 10 * 60 * 1000 });
  if (!ok) return tooManyRequests();

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const email = String(body.email || "").trim().slice(0, 200);
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  const currency: Currency = isCurrency(body.currency) ? body.currency : "MXN";
  const modalidad = body.modalidad === "anticipo" ? "anticipo" : "liquidacion";
  const selection = normalizeSelection(body.selection);
  const rate = getUsdMxnRate(process.env.NEXT_PUBLIC_USD_MXN_RATE);
  const total = quoteProjectTotal(selection, currency, rate);
  const payNow = quotePayableNow(total, modalidad);
  const rest = Math.max(0, total - payNow);

  // Nombres de las partidas en español (el correo sale en español).
  const t = DICTIONARIES.es.configurator;
  const label = (id: string) => {
    const [kind, value] = id.split(":");
    if (kind === "plan") return t.plans[value as keyof typeof t.plans]?.name ?? value;
    if (kind === "module") return t.modules[value as keyof typeof t.modules] ?? value;
    return t.additionalSectionsLabel(Number(value) || 0);
  };
  const money = (mxn: number) => formatMoney(currency === "MXN" ? mxn : mxnToUsd(mxn, rate), currency);
  const lines = buildQuoteLinesMxn(selection).map((line) => ({ name: label(line.id), price: money(line.price) }));

  const params = new URLSearchParams({ plan: selection.planId, mode: modalidad, currency });
  if (selection.moduleIds.length) params.set("modules", selection.moduleIds.join(","));
  if (selection.sections) params.set("sections", String(selection.sections));
  const resumeUrl = `${getSiteUrl()}/crear-web?${params.toString()}#precios`;

  const payLine =
    modalidad === "anticipo"
      ? t.todayAdvance(formatMoney(payNow, currency), formatMoney(rest, currency))
      : t.todayFull(formatMoney(payNow, currency));

  const rows = lines
    .map(
      (l) =>
        `<tr><td style="padding:10px 0;border-bottom:1px solid #e3e8dc;color:#33403a">${escapeHtml(l.name)}</td><td style="padding:10px 0;border-bottom:1px solid #e3e8dc;text-align:right;font-weight:700;color:#0e1a15">${escapeHtml(l.price)}</td></tr>`
    )
    .join("");

  const html = `<!doctype html><html lang="es"><body style="margin:0;background:#eef2e6;font-family:Arial,Helvetica,sans-serif;color:#0e1a15">
  <div style="max-width:560px;margin:0 auto;padding:28px 18px">
    <div style="background:#ffffff;border-radius:24px;padding:28px">
      <p style="margin:0 0 6px;font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#4d5b54">BryanF Design</p>
      <h1 style="margin:0 0 12px;font-size:26px;line-height:1.15">Tu cotización</h1>
      <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#33403a">Hola, aquí tienes la cotización que armaste en mi sitio. Puedes retomarla cuando quieras desde el botón de abajo, o contestar este correo si tienes dudas.</p>
      <table role="presentation" style="width:100%;border-collapse:collapse;font-size:15px">${rows}</table>
      <div style="margin-top:18px;background:#0e1a15;border-radius:18px;padding:20px;color:#ffffff">
        <p style="margin:0;font-size:13px;color:#b9c4bd">${escapeHtml(t.totalProject)}</p>
        <p style="margin:4px 0 12px;font-size:30px;font-weight:800;color:#b5e336">${escapeHtml(formatMoney(total, currency))}</p>
        <p style="margin:0;font-size:14px;line-height:1.55;color:#e6ece8">${escapeHtml(payLine)}</p>
      </div>
      <p style="margin:22px 0 0"><a href="${resumeUrl}" style="display:inline-block;background:#b5e336;color:#0e1a15;text-decoration:none;font-weight:700;padding:14px 22px;border-radius:999px">Retomar mi cotización</a></p>
      <p style="margin:16px 0 0;font-size:14px;line-height:1.6;color:#33403a">¿Prefieres platicarlo? Escríbeme por <a href="${WHATSAPP}" style="color:#2f5d4f;font-weight:700">WhatsApp</a>.</p>
      <p style="margin:22px 0 0;font-size:14px;color:#33403a">Bryan F.<br>BryanF Design</p>
    </div>
  </div></body></html>`;

  const sent = await sendMail({
    to: email,
    subject: "Tu cotización de BryanF Design",
    html,
    replyTo: senderEmail(),
  });
  if (!sent.ok) {
    console.error("quote-email:", sent.error);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }

  // Copia para Bryan: alguien pidió su cotización (prospecto).
  await sendMail({
    to: notificationEmail(),
    subject: `Cotización enviada a ${email}`,
    html: `<p>Se envió una cotización desde el configurador a <strong>${escapeHtml(email)}</strong>.</p>${`<table>${rows}</table>`}<p><strong>${escapeHtml(t.totalProject)}:</strong> ${escapeHtml(formatMoney(total, currency))}<br>${escapeHtml(payLine)}</p><p><a href="${resumeUrl}">Ver la cotización</a></p>`,
    replyTo: email,
  });

  return NextResponse.json({ ok: true });
}
