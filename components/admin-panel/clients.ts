import type { Account, Purchase } from "@/lib/db";
import type { Subscriber } from "@/lib/subscribers";

import type { AdminData } from "./admin-app";

/** Un cliente en el panel: todo lo que hay de un correo, venga de donde venga. */
export interface ClientRow {
  email: string;
  name: string;
  phone: string;
  account: Account | null;
  subscriptions: Subscriber[];
  payments: Purchase[];
  /** Suscripción activa (Stripe / MP) o mensualidad por transferencia activa. */
  subscribed: boolean;
  /** Total cobrado en pagos únicos, en MXN. */
  paidMxn: number;
  lastActivity: number;
  tags: Array<"Suscripción" | "Compra" | "Transferencia" | "Manual">;
}

const activeSub = (s: Subscriber) => s.status === "active" || s.status === "trialing" || s.status === "past_due";

export function buildClients(data: AdminData): ClientRow[] {
  const map = new Map<string, ClientRow>();
  const get = (raw: string) => {
    const email = raw.trim().toLowerCase();
    if (!email) return null;
    let row = map.get(email);
    if (!row) {
      row = { email, name: "", phone: "", account: null, subscriptions: [], payments: [], subscribed: false, paidMxn: 0, lastActivity: 0, tags: [] };
      map.set(email, row);
    }
    return row;
  };

  for (const a of data.accounts) {
    const row = get(a.email);
    if (!row) continue;
    row.account = a;
    row.name ||= a.nombre;
    row.phone ||= a.telefono;
    row.lastActivity = Math.max(row.lastActivity, Date.parse(a.ultimo_acceso || a.actualizada) || 0);
  }
  for (const s of data.subscribers.subscribers) {
    const row = get(s.email);
    if (!row) continue;
    row.subscriptions.push(s);
    row.name ||= s.name;
    row.phone ||= s.phone;
    row.lastActivity = Math.max(row.lastActivity, s.periodStart || s.startedAt || 0);
  }
  for (const p of data.payments) {
    const row = get(p.email);
    if (!row) continue;
    row.payments.push(p);
    row.name ||= p.nombre;
    if (p.moneda === "MXN") row.paidMxn += Number(p.monto) || 0;
    row.lastActivity = Math.max(row.lastActivity, Date.parse(p.creada) || 0);
  }

  for (const row of Array.from(map.values())) {
    const manualMonthly =
      !!row.account &&
      (row.account.tipo === "transferencia" || row.account.tipo === "suscripcion") &&
      row.account.estado === "activa" &&
      !!row.account.proximo_cobro;
    row.subscribed = row.subscriptions.some(activeSub) || manualMonthly;
    const tags = new Set<ClientRow["tags"][number]>();
    if (row.subscriptions.length || row.account?.tipo === "suscripcion") tags.add("Suscripción");
    if (row.payments.some((p) => p.proveedor !== "transferencia") || row.account?.tipo === "compra") tags.add("Compra");
    if (row.payments.some((p) => p.proveedor === "transferencia") || row.account?.tipo === "transferencia") tags.add("Transferencia");
    if (!tags.size) tags.add("Manual");
    row.tags = Array.from(tags);
  }

  return Array.from(map.values()).sort((a, b) => b.lastActivity - a.lastActivity);
}
