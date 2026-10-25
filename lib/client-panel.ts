import { briefUrl, createBriefToken } from "@/lib/brief-access";
import { dbConfigured, getAccount, listPurchases, type Account, type Purchase } from "@/lib/db";
import { findSubscriptionsByEmail, type Subscriber } from "@/lib/subscribers";
import type { ClientPanel, PanelData } from "@/components/subscriber-panel/panel-types";

/**
 * Todo lo de un cliente para Mi panel (y para "ver como cliente" en el Panel
 * BryanF): su suscripción de Stripe / Mercado Pago, su cuenta en la base
 * (compras únicas, transferencias, datos que capturó Bryan) y sus pagos.
 * `null` si ese correo no tiene nada con nosotros.
 */
export async function loadClientPanel(rawEmail: string): Promise<ClientPanel | null> {
  const email = rawEmail.trim().toLowerCase();
  const [subs, account, purchases] = await Promise.all([
    findSubscriptionsByEmail(email),
    dbConfigured() ? getAccount(email).catch(() => null) : Promise.resolve(null),
    dbConfigured() ? listPurchases(email).catch(() => [] as Purchase[]) : Promise.resolve([] as Purchase[]),
  ]);
  if (!subs.length && !account && !purchases.length) return null;

  const now = Date.now();
  const subscription = subs[0] ? fromSubscriber(subs[0], now) : manualSubscription(account, now);
  const name = account?.nombre || subs[0]?.name || purchases.find((p) => p.nombre)?.nombre || "";

  // Enlace firmado a "Armar mi brief" con lo que ya sabemos del cliente.
  const last = purchases[0];
  const brief = briefUrl({
    provider: "link",
    token: createBriefToken({
      reference: last?.id || `panel-${email}`,
      email,
      name,
      amount: last ? Number(last.monto) : subscription?.amount,
      currency: last?.moneda || subscription?.currency,
      subscription: !!subscription,
    }),
  });

  return {
    name,
    email,
    now,
    briefUrl: brief,
    subscription,
    service: account?.servicio || purchases[0]?.descripcion || "",
    kind: account?.tipo || (subs.length ? "suscripcion" : "compra"),
    hasPassword: !!account?.password_hash,
    purchases: purchases.map((p) => ({
      id: p.id,
      description: p.descripcion,
      amount: Number(p.monto),
      currency: p.moneda,
      provider: p.proveedor,
      at: Date.parse(p.creada),
      status: p.estado,
    })),
  };
}

function fromSubscriber(s: Subscriber, now: number): PanelData {
  return {
    name: s.name,
    email: s.email,
    status: s.status,
    provider: s.provider,
    amount: s.amount,
    currency: s.currency,
    startedAt: s.startedAt,
    periodStart: s.periodStart,
    nextChargeAt: s.nextChargeAt,
    cancelAtPeriodEnd: s.cancelAtPeriodEnd,
    charges: s.charges,
    now,
  };
}

/** Suscripción que se paga por transferencia (la lleva Bryan desde el panel). */
function manualSubscription(account: Account | null, now: number): PanelData | null {
  if (!account || account.tipo !== "suscripcion" && account.tipo !== "transferencia") return null;
  if (!account.proximo_cobro || !(Number(account.monto) > 0)) return null;
  const next = Date.parse(account.proximo_cobro);
  return {
    name: account.nombre,
    email: account.email,
    status: account.estado === "activa" ? "active" : account.estado === "pausada" ? "paused" : "canceled",
    provider: "transferencia",
    amount: Number(account.monto),
    currency: account.moneda || "MXN",
    startedAt: Date.parse(account.creada) || null,
    periodStart: next - 30 * 86_400_000,
    nextChargeAt: account.estado === "activa" ? next : null,
    cancelAtPeriodEnd: false,
    charges: null,
    now,
  };
}
