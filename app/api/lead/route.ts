import { NextRequest, NextResponse } from "next/server";

import { forbidden, getClientIp, isSameOrigin, rateLimit, tooManyRequests } from "@/lib/api-guard";
import { describeAttribution, sanitizeAttribution } from "@/lib/attribution";
import { escapeHtml, sendEmail } from "@/lib/notify";
import { notificationEmail } from "@/lib/mailer";

export const runtime = "nodejs";

/**
 * Solicitud de cotización (formulario corto).
 *
 * Es la conversión principal de la campaña para quien todavía no está listo
 * para pagar en línea: nombre + WhatsApp bastan. Llega a tu correo con la
 * cotización que haya armado en el configurador y la campaña de origen
 * (gclid/utm), lista para contestar por WhatsApp.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(value: unknown, max = 200) {
  return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);
}

export async function POST(req: NextRequest) {
  try {
    if (!isSameOrigin(req)) return forbidden();

    const { ok } = rateLimit(`lead:${getClientIp(req)}`, { limit: 5, windowMs: 10 * 60 * 1000 });
    if (!ok) return tooManyRequests();

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

    // Trampa para bots: un campo oculto que una persona nunca llena. Se
    // responde "ok" para no darle pistas al bot.
    if (field(body.website)) return NextResponse.json({ ok: true });

    const name = field(body.name, 120);
    const phone = field(body.phone, 40);
    const email = field(body.email, 160);
    const service = field(body.service, 120);
    const timeline = field(body.timeline, 120);
    const message = String(body.message ?? "").trim().slice(0, 2000);
    const quote = String(body.quote ?? "").trim().slice(0, 1500);
    const page = field(body.page, 200);
    const attribution = sanitizeAttribution(body.attribution);

    const phoneDigits = phone.replace(/\D/g, "");
    if (!name || phoneDigits.length < 8 || phoneDigits.length > 15) {
      return NextResponse.json(
        { error: "Escribe tu nombre y un WhatsApp válido." },
        { status: 400 }
      );
    }
    if (email && !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Revisa tu correo." }, { status: 400 });
    }

    const waText = encodeURIComponent(
      `Hola ${name.split(" ")[0]}, soy Bryan de BryanF Design. Recibí tu solicitud de cotización${
        service ? ` para ${service}` : ""
      }. ¿Te parece si lo platicamos?`
    );
    const waLink = `https://wa.me/${phoneDigits.length === 10 ? `52${phoneDigits}` : phoneDigits}?text=${waText}`;

    const row = (label: string, value: string) =>
      value ? `<li><strong>${label}:</strong> ${escapeHtml(value)}</li>` : "";

    const html = `
      <div style="font-family:Inter,Arial,sans-serif;max-width:640px;margin:0 auto;color:#171717;">
        <h2 style="margin:0 0 8px;">Nueva solicitud de cotización 🔔</h2>
        <p style="margin:0 0 16px;">Contesta pronto: los prospectos de anuncios se enfrían en horas.</p>
        <p style="margin:0 0 18px;">
          <a href="${waLink}" style="display:inline-block;background:#25D366;color:#fff;padding:10px 16px;border-radius:999px;text-decoration:none;font-weight:700;">
            Responder por WhatsApp
          </a>
        </p>
        <ul style="margin:0 0 14px;padding-left:18px;">
          ${row("Nombre", name)}
          ${row("WhatsApp", phone)}
          ${row("Correo", email)}
          ${row("Le interesa", service)}
          ${row("¿Para cuándo?", timeline)}
        </ul>
        ${
          message
            ? `<h3 style="margin:18px 0 8px;">Mensaje</h3><p style="margin:0 0 14px;white-space:pre-wrap;">${escapeHtml(message)}</p>`
            : ""
        }
        ${
          quote
            ? `<h3 style="margin:18px 0 8px;">Cotización que armó en el sitio</h3><p style="margin:0 0 14px;white-space:pre-wrap;">${escapeHtml(quote)}</p>`
            : ""
        }
        <h3 style="margin:18px 0 8px;">Origen</h3>
        <ul style="margin:0 0 14px;padding-left:18px;">
          ${row("Campaña", describeAttribution(attribution))}
          ${row("GCLID", attribution.gclid || "")}
          ${row("Formulario en", page)}
        </ul>
      </div>`;

    const result = await sendEmail(
      notificationEmail(),
      `Cotización: ${name}${service ? ` — ${service}` : ""}`,
      html,
      email || undefined
    );
    if (!result.ok) {
      console.error("Lead email error:", result.error);
      return NextResponse.json(
        { error: "No se pudo enviar. Escríbenos por WhatsApp y te contestamos enseguida." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Lead submit error:", error);
    return NextResponse.json(
      { error: "No se pudo enviar. Escríbenos por WhatsApp y te contestamos enseguida." },
      { status: 500 }
    );
  }
}
