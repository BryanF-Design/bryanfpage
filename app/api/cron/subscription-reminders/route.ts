import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, PreApproval } from "mercadopago";

import { SUBSCRIPTION_PLAN } from "@/lib/catalog";
import { sendSubscriptionNotice } from "@/lib/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DAY = 86_400_000;

/**
 * Recordatorio de mensualidad para suscriptores de Mercado Pago.
 *
 * Mercado Pago no avisa antes de cobrar (Stripe sí: `invoice.upcoming`), así
 * que Vercel Cron llama aquí una vez al día (vercel.json). Se avisa a quien se
 * le cobra dentro de REMINDER_DAYS días (3 por defecto). La ventana es de un
 * día exacto, así que cada cobro recibe un solo recordatorio.
 *
 * Protegido con CRON_SECRET (Vercel lo manda como `Authorization: Bearer`).
 * Prueba manual: GET /api/cron/subscription-reminders?dry=1 con ese header.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) return NextResponse.json({ error: "MP_ACCESS_TOKEN missing" }, { status: 500 });

  const dry = req.nextUrl.searchParams.get("dry") === "1";
  const days = Math.min(15, Math.max(1, Number(process.env.REMINDER_DAYS || 3)));
  const from = Date.now() + days * DAY;
  const to = from + DAY;
  const planId = (process.env.MP_SUBSCRIPTION_PLAN_ID || "").trim();

  const preapprovals = new PreApproval(new MercadoPagoConfig({ accessToken: token }));
  const due: Array<{ id: string; next: number; amount: number; currency: string }> = [];

  for (let offset = 0; offset < 1000; offset += 100) {
    const page = await preapprovals.search({ options: { status: "authorized", limit: 100, offset } });
    const results = page.results || [];
    for (const sub of results) {
      const ours = planId
        ? sub.preapproval_plan_id === planId
        : (sub.reason || "").includes("Todo Digital");
      const next = sub.next_payment_date ? new Date(sub.next_payment_date).getTime() : NaN;
      if (ours && sub.id && next >= from && next < to) {
        due.push({
          id: sub.id,
          next,
          amount: Number(sub.auto_recurring?.transaction_amount ?? SUBSCRIPTION_PLAN.price),
          currency: (sub.auto_recurring?.currency_id || "MXN").toUpperCase(),
        });
      }
    }
    if (results.length < 100) break;
  }

  const sent: Array<{ id: string; email: string | null; ok: boolean }> = [];
  for (const item of due) {
    // La búsqueda no trae el correo: se consulta cada suscripción.
    const full = await preapprovals.get({ id: item.id }).catch(() => null);
    const email = full?.payer_email || null;
    if (dry || !email) {
      sent.push({ id: item.id, email, ok: false });
      continue;
    }
    const res = await sendSubscriptionNotice({
      event: "upcoming",
      provider: "mercadopago",
      reference: item.id,
      amount: item.amount,
      currency: item.currency,
      customerEmail: email,
      nextChargeDate: item.next,
      internal: false,
    });
    sent.push({ id: item.id, email, ok: res.customer });
  }

  return NextResponse.json({ dry, days, due: due.length, sent });
}
