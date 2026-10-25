/** Datos de Mi panel (los arma lib/client-panel.ts en el servidor). */

export interface PanelData {
  name: string;
  email: string;
  status: "active" | "trialing" | "past_due" | "paused" | "pending" | "canceled" | "other";
  /** "transferencia": mensualidad que Bryan lleva a mano desde el panel. */
  provider: "stripe" | "mercadopago" | "transferencia";
  amount: number;
  currency: string;
  startedAt: number | null;
  periodStart: number | null;
  nextChargeAt: number | null;
  cancelAtPeriodEnd: boolean;
  charges: number | null;
  /** Momento de la consulta: servidor y navegador cuentan igual. */
  now: number;
}

export interface PanelPurchase {
  id: string;
  description: string;
  amount: number;
  currency: string;
  provider: "stripe" | "mercadopago" | "transferencia" | "manual";
  at: number;
  status: string;
}

export interface ClientPanel {
  name: string;
  email: string;
  now: number;
  /** Enlace firmado a "Armar mi brief". */
  briefUrl: string;
  /** Suscripción mensual (Stripe, Mercado Pago o transferencia), si tiene. */
  subscription: PanelData | null;
  /** Servicio contratado (desarrollo web, tarjeta digital…). */
  service: string;
  kind: "suscripcion" | "compra" | "transferencia" | "manual";
  hasPassword: boolean;
  purchases: PanelPurchase[];
}
