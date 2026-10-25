import Stripe from "stripe";
import { MercadoPagoConfig, PreApproval } from "mercadopago";

import { SUBSCRIPTION_PLAN } from "@/lib/catalog";

/**
 * Suscriptores para Panel BryanF, leídos en vivo de Stripe y Mercado Pago
 * (el sitio no guarda una base de datos propia: la fuente de verdad son los
 * cobros). Las transferencias mensuales se llevan a mano y no aparecen aquí.
 */

export type SubscriberStatus = "active" | "trialing" | "past_due" | "paused" | "pending" | "canceled" | "other";

export interface Subscriber {
  id: string;
  provider: "stripe" | "mercadopago";
  name: string;
  email: string;
  phone: string;
  status: SubscriberStatus;
  /** Estado tal como lo da el proveedor. */
  rawStatus: string;
  plan: string;
  amount: number;
  currency: string;
  /** Fechas en milisegundos (null si el proveedor no la da). */
  startedAt: number | null;
  periodStart: number | null;
  nextChargeAt: number | null;
  canceledAt: number | null;
  /** Stripe: se cancela al terminar el periodo pagado. */
  cancelAtPeriodEnd: boolean;
  /** Cobros hechos hasta hoy (si el proveedor lo informa). */
  charges: number | null;
  dashboardUrl: string;
  /** Stripe: cliente dueño de la suscripción (para abrir su portal). */
  customerId?: string;
}

export interface SubscribersResult {
  subscribers: Subscriber[];
  sources: Array<{ provider: "stripe" | "mercadopago"; configured: boolean; error?: string }>;
  fetchedAt: number;
}

const MONTH = 30 * 86_400_000;

function stripeStatus(status: Stripe.Subscription.Status): SubscriberStatus {
  switch (status) {
    case "active":
      return "active";
    case "trialing":
      return "trialing";
    case "past_due":
    case "unpaid":
      return "past_due";
    case "paused":
      return "paused";
    case "incomplete":
      return "pending";
    case "canceled":
    case "incomplete_expired":
      return "canceled";
    default:
      return "other";
  }
}

function mpStatus(status: string): SubscriberStatus {
  switch (status) {
    case "authorized":
      return "active";
    case "paused":
      return "paused";
    case "pending":
      return "pending";
    case "cancelled":
    case "canceled":
      return "canceled";
    default:
      return "other";
  }
}

function stripeClient() {
  return new Stripe(process.env.STRIPE_SECRET as string);
}

async function fromStripe(): Promise<Subscriber[]> {
  const list = await stripeClient()
    .subscriptions.list({ status: "all", limit: 100, expand: ["data.customer"] })
    .autoPagingToArray({ limit: 500 });
  return list.map(mapStripe);
}

function mapStripe(sub: Stripe.Subscription): Subscriber {
  {
    const customer = typeof sub.customer === "object" && !("deleted" in sub.customer && sub.customer.deleted)
      ? (sub.customer as Stripe.Customer)
      : null;
    const item = sub.items.data[0];
    // Desde la API 2025-03 el periodo vive en cada partida de la suscripción.
    const legacy = sub as unknown as { current_period_end?: number; current_period_start?: number };
    const periodEnd = item?.current_period_end ?? legacy.current_period_end ?? null;
    const periodStart = item?.current_period_start ?? legacy.current_period_start ?? null;
    const status = stripeStatus(sub.status);
    const unit = item?.price?.unit_amount ?? 0;
    return {
      id: sub.id,
      provider: "stripe" as const,
      name: customer?.name || "",
      email: customer?.email || "",
      phone: customer?.phone || "",
      status,
      rawStatus: sub.status,
      plan: item?.price?.nickname || (sub.metadata?.plan === SUBSCRIPTION_PLAN.id ? SUBSCRIPTION_PLAN.productName : "Suscripción"),
      amount: (unit * (item?.quantity ?? 1)) / 100,
      currency: (item?.price?.currency || "mxn").toUpperCase(),
      startedAt: sub.start_date ? sub.start_date * 1000 : null,
      periodStart: periodStart ? periodStart * 1000 : null,
      nextChargeAt: status === "canceled" || sub.cancel_at_period_end || !periodEnd ? null : periodEnd * 1000,
      canceledAt: sub.canceled_at ? sub.canceled_at * 1000 : sub.cancel_at_period_end && periodEnd ? periodEnd * 1000 : null,
      cancelAtPeriodEnd: sub.cancel_at_period_end,
      charges: null,
      dashboardUrl: `https://dashboard.stripe.com/subscriptions/${sub.id}`,
      customerId: typeof sub.customer === "string" ? sub.customer : sub.customer?.id,
    };
  }
}

function mpClient() {
  return new PreApproval(new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN as string }));
}

async function fromMercadoPago(payerEmail?: string): Promise<Subscriber[]> {
  const client = mpClient();
  const planId = (process.env.MP_SUBSCRIPTION_PLAN_ID || "").trim();
  const found: Array<{ id: string; raw: Record<string, unknown> }> = [];

  for (const status of ["authorized", "paused", "pending", "cancelled"]) {
    for (let offset = 0; offset < 500; offset += 100) {
      const page = await client.search({
        options: {
          status,
          limit: 100,
          offset,
          ...(planId ? { preapproval_plan_id: planId } : {}),
          ...(payerEmail ? { payer_email: payerEmail } : {}),
        },
      });
      const results = page.results || [];
      for (const r of results) if (r.id) found.push({ id: r.id, raw: r as unknown as Record<string, unknown> });
      if (results.length < 100) break;
    }
  }

  // La búsqueda no trae el correo: se consulta cada suscripción (en paralelo, de 8 en 8).
  const out: Subscriber[] = [];
  for (let i = 0; i < found.length; i += 8) {
    const batch = await Promise.all(
      found.slice(i, i + 8).map(async ({ id, raw }) => {
        const full = await client.get({ id }).catch(() => null);
        const first = String(raw.payer_first_name || "");
        const last = String(raw.payer_last_name || "");
        const rawStatus = String(full?.status || raw.status || "");
        const status = mpStatus(rawStatus);
        const next = full?.next_payment_date || raw.next_payment_date;
        const nextMs = next ? new Date(next as string).getTime() : NaN;
        const created = full?.date_created || raw.date_created;
        const createdMs = created ? new Date(created as string).getTime() : NaN;
        const modified = full?.last_modified || raw.last_modified;
        const recurring = full?.auto_recurring;
        return {
          id,
          provider: "mercadopago" as const,
          name: `${first} ${last}`.trim(),
          email: full?.payer_email || "",
          phone: "",
          status,
          rawStatus,
          plan: full?.reason || String(raw.reason || "Suscripción"),
          amount: Number(recurring?.transaction_amount ?? SUBSCRIPTION_PLAN.price),
          currency: (recurring?.currency_id || "MXN").toUpperCase(),
          startedAt: Number.isFinite(createdMs) ? createdMs : null,
          periodStart: Number.isFinite(nextMs) && status === "active" ? nextMs - MONTH : null,
          nextChargeAt: Number.isFinite(nextMs) && status === "active" ? nextMs : null,
          canceledAt: status === "canceled" && modified ? new Date(modified as string).getTime() : null,
          cancelAtPeriodEnd: false,
          charges: full?.summarized?.charged_quantity ?? null,
          dashboardUrl: "https://www.mercadopago.com.mx/subscriptions",
        } satisfies Subscriber;
      })
    );
    out.push(...batch);
  }
  return out;
}

export async function listSubscribers(): Promise<SubscribersResult> {
  const stripeOn = !!process.env.STRIPE_SECRET;
  const mpOn = !!process.env.MP_ACCESS_TOKEN;
  const [stripe, mp] = await Promise.allSettled([
    stripeOn ? fromStripe() : Promise.resolve([]),
    mpOn ? fromMercadoPago() : Promise.resolve([]),
  ]);

  const subscribers = [
    ...(stripe.status === "fulfilled" ? stripe.value : []),
    ...(mp.status === "fulfilled" ? mp.value : []),
  ];
  const errorText = (r: PromiseSettledResult<unknown>) => {
    if (r.status !== "rejected") return undefined;
    console.error("Panel BryanF:", r.reason);
    return r.reason instanceof Error ? r.reason.message : "Error al consultar";
  };

  return {
    subscribers,
    sources: [
      { provider: "stripe", configured: stripeOn, error: errorText(stripe) },
      { provider: "mercadopago", configured: mpOn, error: errorText(mp) },
    ],
    fetchedAt: Date.now(),
  };
}

/**
 * Suscripciones de una sola persona, por su correo (para /mi-panel). Se
 * comparan los correos sin mayúsculas: Stripe guarda el que escribió el
 * cliente en el pago.
 */
export async function findSubscriptionsByEmail(email: string): Promise<Subscriber[]> {
  const target = email.trim().toLowerCase();
  const out: Subscriber[] = [];
  const jobs: Promise<void>[] = [];

  if (process.env.STRIPE_SECRET) {
    jobs.push(
      (async () => {
        const stripe = stripeClient();
        const customers = await stripe.customers.list({ email: target, limit: 10 });
        for (const customer of customers.data) {
          const subs = await stripe.subscriptions.list({ customer: customer.id, status: "all", limit: 20 });
          out.push(...subs.data.map((sub) => mapStripe({ ...sub, customer })));
        }
      })().catch((error) => console.error("Mi panel (Stripe):", error))
    );
  }
  if (process.env.MP_ACCESS_TOKEN) {
    jobs.push(
      fromMercadoPago(target)
        .then((subs) => {
          out.push(...subs.filter((s) => s.email.toLowerCase() === target));
        })
        .catch((error) => console.error("Mi panel (Mercado Pago):", error))
    );
  }
  await Promise.all(jobs);

  // Primero lo activo; luego lo más reciente.
  const rank = (s: Subscriber) => (s.status === "active" || s.status === "trialing" ? 0 : s.status === "canceled" ? 2 : 1);
  return out.sort((a, b) => rank(a) - rank(b) || (b.startedAt || 0) - (a.startedAt || 0));
}
