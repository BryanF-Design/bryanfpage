import { NextResponse } from "next/server";

import { googleMailConfigured } from "@/lib/mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Estado del servicio. Sólo dice QUÉ está configurado (sí/no), nunca valores,
 * para revisar rápido en producción que los correos y pagos estén listos.
 */
export async function GET() {
  const has = (key: string) => Boolean(process.env[key]);
  return NextResponse.json({
    ok: true,
    service: "bryanf-payments-api",
    mail: googleMailConfigured() ? "google" : has("RESEND_API_KEY") ? "resend" : "none",
    configured: {
      stripe: has("STRIPE_SECRET") && has("STRIPE_WEBHOOK_SECRET"),
      mercadopago: has("MP_ACCESS_TOKEN"),
      briefLinks: has("BRIEF_LINK_SECRET"),
      admin: has("ADMIN_API_KEY"),
      cron: has("CRON_SECRET"),
    },
  });
}
