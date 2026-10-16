import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-auth";
import { EMAIL_SAMPLES, EMAIL_SAMPLE_NAMES } from "@/lib/email-samples";
import { googleMailConfigured, notificationEmail, sendMail, senderEmail } from "@/lib/mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Prueba de las plantillas en producción (Authorization: Bearer ADMIN_API_KEY).
 *
 * GET  /api/admin/test-emails                     → lista + configuración
 * GET  /api/admin/test-emails?preview=paymentFailed → HTML de la plantilla
 * POST /api/admin/test-emails { "to": "...", "only": ["paymentReceived"] }
 *      → envía las plantillas de ejemplo (por defecto a GOOGLE_NOTIFICATION_EMAIL)
 */
export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  const preview = req.nextUrl.searchParams.get("preview");
  if (preview) {
    const sample = EMAIL_SAMPLES[preview];
    if (!sample) return NextResponse.json({ error: "Plantilla no existe", templates: EMAIL_SAMPLE_NAMES }, { status: 404 });
    return new NextResponse(sample().html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
  }
  return NextResponse.json({
    templates: EMAIL_SAMPLE_NAMES,
    transport: googleMailConfigured() ? "google" : process.env.RESEND_API_KEY ? "resend" : "none",
    sender: senderEmail(),
    notifications: notificationEmail(),
  });
}

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  const body = (await req.json().catch(() => ({}))) as { to?: string; only?: string[] };
  const to = (body.to || notificationEmail()).trim();
  const names = Array.isArray(body.only) && body.only.length ? body.only.filter((n) => n in EMAIL_SAMPLES) : EMAIL_SAMPLE_NAMES;

  const results = [];
  for (const name of names) {
    const content = EMAIL_SAMPLES[name]();
    const res = await sendMail({ to, ...content, subject: `[Prueba] ${content.subject}` });
    results.push({ template: name, ...res });
  }
  return NextResponse.json({ to, results });
}
