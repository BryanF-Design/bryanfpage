import Stripe from "stripe";
import { MercadoPagoConfig, Payment } from "mercadopago";

import { dbConfigured, listPurchases, type Purchase } from "@/lib/db";

/**
 * HISTORIAL DE PAGOS ÚNICOS para el Panel BryanF: lo registrado en la base
 * (webhooks y transferencias capturadas a mano) más los últimos cobros de
 * Stripe y Mercado Pago, por si alguno llegó antes de que existiera la base.
 * Se unen por id (`stripe:<sesión>`, `mercadopago:<pago>`), sin duplicados.
 */

export interface PaymentsResult {
  payments: Purchase[];
  errors: string[];
}

async function fromStripe(): Promise<Purchase[]> {
  const stripe = new Stripe(process.env.STRIPE_SECRET as string);
  const sessions = await stripe.checkout.sessions.list({ limit: 100, status: "complete" });
  return sessions.data
    .filter((s) => s.mode === "payment" && s.payment_status === "paid")
    .map((s) => ({
      id: `stripe:${s.id}`,
      email: (s.customer_details?.email || "").toLowerCase(),
      nombre: s.customer_details?.name || "",
      proveedor: "stripe" as const,
      descripcion: s.metadata?.modules ? `Proyecto web · ${s.metadata.modules}` : "Proyecto web",
      monto: (s.amount_total ?? 0) / 100,
      moneda: (s.currency || "mxn").toUpperCase(),
      estado: "pagado",
      creada: new Date(s.created * 1000).toISOString(),
      meta: { modalidad: s.metadata?.modalidad || "", telefono: s.customer_details?.phone || "" },
    }));
}

async function fromMercadoPago(): Promise<Purchase[]> {
  const client = new Payment(new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN as string }));
  const page = await client.search({
    options: { sort: "date_created", criteria: "desc", limit: 100, status: "approved" },
  });
  return (page.results || [])
    // Los cobros mensuales de la suscripción ya salen en Suscripciones.
    .filter((p) => p.operation_type !== "recurring_payment" && p.id)
    .map((p) => ({
      id: `mercadopago:${p.id}`,
      email: (p.payer?.email || "").toLowerCase(),
      nombre: [p.additional_info?.payer?.first_name, p.additional_info?.payer?.last_name].filter(Boolean).join(" "),
      proveedor: "mercadopago" as const,
      descripcion: p.description || "Proyecto web",
      monto: Number(p.transaction_amount ?? 0),
      moneda: (p.currency_id || "MXN").toUpperCase(),
      estado: "pagado",
      creada: p.date_created || new Date().toISOString(),
      meta: {},
    }));
}

export async function listAllPayments(): Promise<PaymentsResult> {
  const errors: string[] = [];
  const settle = async (label: string, job: () => Promise<Purchase[]>, on: boolean) => {
    if (!on) return [];
    try {
      return await job();
    } catch (error) {
      console.error(`Pagos (${label}):`, error);
      errors.push(`${label}: ${error instanceof Error ? error.message : "no se pudo leer"}`);
      return [];
    }
  };
  const [db, stripe, mp] = await Promise.all([
    settle("Base de datos", () => listPurchases(), dbConfigured()),
    settle("Stripe", fromStripe, !!process.env.STRIPE_SECRET),
    settle("Mercado Pago", fromMercadoPago, !!process.env.MP_ACCESS_TOKEN),
  ]);
  // Lo de la base manda (trae correcciones hechas a mano).
  const byId = new Map<string, Purchase>();
  for (const p of [...stripe, ...mp, ...db]) byId.set(p.id, { ...byId.get(p.id), ...p });
  const payments = Array.from(byId.values()).sort((a, b) => Date.parse(b.creada) - Date.parse(a.creada));
  return { payments, errors };
}
