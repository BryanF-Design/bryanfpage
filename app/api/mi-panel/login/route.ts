import { NextRequest, NextResponse } from "next/server";

import { forbidden, getClientIp, isSameOrigin, rateLimit, tooManyRequests } from "@/lib/api-guard";
import { LOGIN_LINK_MINUTES, clientSessionConfigured, createLoginToken } from "@/lib/client-session";
import { clientLoginLink } from "@/lib/email-templates";
import { mailConfigured, notificationEmail, sendMail } from "@/lib/mailer";
import { getSiteUrl } from "@/lib/site-url";
import { findSubscriptionsByEmail } from "@/lib/subscribers";

export const runtime = "nodejs";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Pide el enlace de acceso a Mi panel. La respuesta es la misma exista o no
 * la suscripción, para no revelar quién es cliente.
 */
export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return forbidden();
  const ip = getClientIp(req);
  if (!rateLimit(`mi-panel-login:${ip}`, { limit: 5, windowMs: 15 * 60 * 1000 }).ok) return tooManyRequests();

  if (!clientSessionConfigured() || !mailConfigured()) {
    return NextResponse.json(
      { error: "El acceso por correo aún no está disponible. Escríbenos por WhatsApp y te ayudamos." },
      { status: 503 }
    );
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 160) : "";
  if (!EMAIL.test(email)) {
    return NextResponse.json({ error: "Escribe un correo válido." }, { status: 400 });
  }
  // Un correo no recibe más de 3 enlaces cada 15 minutos.
  if (!rateLimit(`mi-panel-login:${email}`, { limit: 3, windowMs: 15 * 60 * 1000 }).ok) return tooManyRequests();

  const subscriptions = await findSubscriptionsByEmail(email);
  if (subscriptions.length) {
    const url = `${getSiteUrl()}/api/mi-panel/verify?t=${encodeURIComponent(createLoginToken(email))}`;
    const content = clientLoginLink({ url, minutes: LOGIN_LINK_MINUTES });
    const sent = await sendMail({ to: email, ...content, replyTo: notificationEmail() });
    if (!sent.ok) console.error("Mi panel: no se pudo enviar el enlace", sent.error);
  }

  return NextResponse.json({ ok: true });
}
