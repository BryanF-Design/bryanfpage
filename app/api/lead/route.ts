import { NextRequest, NextResponse } from "next/server";

import { forbidden, getClientIp, isSameOrigin, rateLimit, tooManyRequests } from "@/lib/api-guard";
import { describeAttribution, sanitizeAttribution } from "@/lib/attribution";
import { leadNotice, leadReceived } from "@/lib/email-templates";
import { notificationEmail, sendMail } from "@/lib/mailer";

export const runtime = "nodejs";

/**
 * Solicitud de cotización (formulario corto).
 *
 * Es la conversión principal de la campaña para quien todavía no está listo
 * para pagar en línea: nombre + WhatsApp bastan. Llega a tu correo con la
 * cotización que haya armado en el configurador y la campaña de origen
 * (gclid/utm), lista para contestar por WhatsApp. Si dejó correo, le llega
 * una respuesta automática con los siguientes pasos.
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

    const notice = leadNotice({
      name,
      phone,
      email,
      service,
      timeline,
      message,
      quote,
      page,
      campaign: describeAttribution(attribution),
      gclid: attribution.gclid || null,
    });
    const result = await sendMail({ to: notificationEmail(), ...notice, replyTo: email || undefined });
    if (!result.ok) {
      console.error("Lead email error:", result.error);
      return NextResponse.json(
        { error: "No se pudo enviar. Escríbenos por WhatsApp y te contestamos enseguida." },
        { status: 502 }
      );
    }

    // Respuesta automática al cliente (si dejó correo). Si falla, la
    // solicitud ya está con nosotros: no se reporta como error.
    if (email) {
      await sendMail({ to: email, ...leadReceived({ name, service }), replyTo: notificationEmail() });
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
