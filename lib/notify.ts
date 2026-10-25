/**
 * NOTIFICACIONES DE PAGO (correo transaccional).
 *
 * Los webhooks de Stripe y Mercado Pago, el recordatorio diario y los
 * endpoints de administración llaman aquí. Cada función manda el aviso
 * interno (a GOOGLE_NOTIFICATION_EMAIL) y, si tenemos su correo, el del
 * cliente con la plantilla de lib/email-templates.ts. El envío va por Gmail API
 * (lib/mailer.ts) con Resend de respaldo.
 *
 * El folio se deriva de la referencia del pago (id de sesión/pago), así que es
 * estable: si el webhook se reintrega, el mismo pago produce el mismo folio.
 */

import { describeAttribution, sanitizeAttribution, type Attribution } from "./attribution";
import {
  internalNotice,
  monthlyPaymentReceived,
  paymentFailed,
  paymentPending,
  paymentReceived,
  renewalReminder,
  subscriptionCancelled,
  subscriptionWelcome,
  formatMoney,
} from "./email-templates";
import { notificationEmail, sendMail, type MailResult } from "./mailer";
import { getSiteUrl } from "./site-url";

export { escapeHtml } from "./email-templates";

export type PaymentProvider = "stripe" | "mercadopago" | "transfer";

export const PROVIDER_LABEL: Record<PaymentProvider, string> = {
  stripe: "Tarjeta (Stripe)",
  mercadopago: "Mercado Pago",
  transfer: "Transferencia",
};

/** Dónde administra o cancela su suscripción el cliente. */
export function manageSubscriptionUrl(provider: PaymentProvider): string | null {
  if (provider === "stripe") return process.env.NEXT_PUBLIC_STRIPE_PORTAL_URL || null;
  if (provider === "mercadopago") return "https://www.mercadopago.com.mx/subscriptions";
  return null;
}

/**
 * Portal de clientes (Bitácora). Sólo se enlaza en los correos cuando
 * CLIENT_PORTAL_URL está configurado, es decir, cuando las cuentas de los
 * clientes ya se crean solas al pagar.
 */
export function clientPortalUrl(): string | null {
  return process.env.CLIENT_PORTAL_URL?.trim() || null;
}

/** Folio estable a partir de la referencia del proveedor. */
export function makeFolio(reference: string): string {
  const tail = reference.replace(/[^a-zA-Z0-9]/g, "").slice(-8).toUpperCase();
  return `BF-${tail || Date.now().toString(36).toUpperCase()}`;
}

/** Compatibilidad: envío simple de HTML. */
export async function sendEmail(
  to: string | string[],
  subject: string,
  html: string,
  replyTo?: string
): Promise<MailResult> {
  return sendMail({ to, subject, html, replyTo });
}

export interface OrderConfirmation {
  provider: PaymentProvider;
  /** Monto cobrado ahora, en la moneda de `currency`. */
  amount: number;
  currency: string;
  /** Referencia del proveedor (checkout session id / payment id). */
  reference: string;
  description?: string;
  customerEmail?: string | null;
  customerName?: string | null;
  modalidad?: string | null;
  /** Campaña de origen (gclid/utm) guardada en la metadata del pago. */
  attribution?: Attribution;
  /** Alta de la suscripción mensual (cambia el correo del cliente). */
  subscription?: boolean;
  /** Enlace a "Armar mi brief" (ver lib/brief-access.ts). */
  briefUrl?: string;
  nextChargeDate?: Date | string | number | null;
}

/**
 * Envía el aviso interno (siempre) y, si hay correo del cliente, su comprobante.
 * No lanza: devuelve el estado para que el webhook responda 200 igualmente.
 */
export async function sendOrderConfirmation(
  order: OrderConfirmation
): Promise<{ folio: string; internal: boolean; customer: boolean }> {
  const folio = makeFolio(order.reference);
  const amount = formatMoney(order.amount, order.currency);
  const method = PROVIDER_LABEL[order.provider];
  const attribution = sanitizeAttribution(order.attribution);
  const briefLink = order.briefUrl || `${getSiteUrl()}/armar-mi-brief`;

  const internal = internalNotice({
    title: `${order.subscription ? "Nueva suscripción" : "Pago confirmado"} ${folio} — ${amount}`,
    intro: order.subscription
      ? "Un cliente se suscribió al plan mensual Todo Digital. Escríbele para recibir su primera solicitud."
      : "Se confirmó un pago. El cliente recibió su comprobante con el enlace para armar su brief.",
    tone: "lime",
    eyebrow: order.subscription ? "Nueva suscripción" : "Nueva venta",
    figure: amount,
    figureNote: order.subscription ? "primer mes · Todo Digital" : order.description || "Proyecto web",
    actions: order.customerEmail
      ? [{ label: "Escribirle al cliente", href: `mailto:${order.customerEmail}?subject=${encodeURIComponent(`Tu proyecto con BryanF Design · ${folio}`)}` }]
      : undefined,
    rows: [
      ["Folio", folio],
      ["Monto cobrado", amount],
      ["Método", method],
      ["Modalidad", order.modalidad || "—"],
      ["Concepto", order.description || "Proyecto web"],
      ["Cliente", `${order.customerName || "—"}${order.customerEmail ? ` (${order.customerEmail})` : ""}`],
      ["Referencia", order.reference],
      ["Origen", describeAttribution(attribution)],
      ["GCLID", attribution.gclid],
    ],
  });
  const internalRes = await sendMail({
    to: notificationEmail(),
    ...internal,
    replyTo: order.customerEmail || undefined,
  });

  let customerOk = false;
  if (order.customerEmail) {
    const content = order.subscription
      ? subscriptionWelcome({
          name: order.customerName,
          folio,
          amount: order.amount,
          currency: order.currency,
          method,
          nextChargeDate: order.nextChargeDate,
          briefUrl: briefLink,
          manageUrl: manageSubscriptionUrl(order.provider),
          policyUrl: `${getSiteUrl()}/suscripcion#politica`,
          // Los suscriptores tienen su panel en el sitio (/mi-panel).
          portalUrl: clientPortalUrl() || `${getSiteUrl()}/mi-panel`,
        })
      : paymentReceived({
          name: order.customerName,
          folio,
          amount: order.amount,
          currency: order.currency,
          concept: order.description,
          method,
          modalidad: order.modalidad,
          briefUrl: briefLink,
          portalUrl: clientPortalUrl(),
        });
    const customerRes = await sendMail({ to: order.customerEmail, ...content, replyTo: notificationEmail() });
    customerOk = customerRes.ok;
  }

  return { folio, internal: internalRes.ok, customer: customerOk };
}

export type SubscriptionEvent = "renewal" | "payment_failed" | "cancelled" | "upcoming";

/**
 * Evento de la suscripción (renovación cobrada, cobro fallido, cancelación o
 * próximo cobro). Avisa internamente y, si hay correo, al cliente. No lanza.
 */
export async function sendSubscriptionNotice(notice: {
  event: SubscriptionEvent;
  provider: PaymentProvider;
  reference: string;
  amount?: number;
  currency?: string;
  customerEmail?: string | null;
  customerName?: string | null;
  /** Fecha del próximo cobro (o del cobro anunciado, en `upcoming`). */
  nextChargeDate?: Date | string | number | null;
  period?: string | null;
  invoiceUrl?: string | null;
  /** Enlace para pagar un cobro fallido. */
  payUrl?: string | null;
  endsAt?: Date | string | number | null;
  /** false = sólo cliente (p. ej. recordatorios, para no llenar tu bandeja). */
  internal?: boolean;
}) {
  const currency = notice.currency || "MXN";
  const amountNum = notice.amount ?? 0;
  const method = PROVIDER_LABEL[notice.provider];
  const manageUrl = manageSubscriptionUrl(notice.provider);

  const titles: Record<SubscriptionEvent, string> = {
    renewal: "Renovación cobrada 🔁",
    payment_failed: "Cobro de suscripción fallido ⚠️",
    cancelled: "Suscripción cancelada",
    upcoming: "Recordatorio de cobro enviado",
  };
  const notes: Record<SubscriptionEvent, string> = {
    renewal: "Se cobró un mes más de la suscripción Todo Digital. Se envió la confirmación al cliente.",
    payment_failed:
      "No pasó el cobro mensual. Se le pidió al cliente actualizar su método de pago; la plataforma lo reintentará. Si sigue pendiente 7 días, la política dice pausar solicitudes.",
    cancelled: "El cliente canceló o la suscripción terminó. Entrégale archivos y accesos si los pide.",
    upcoming: "Se le avisó al cliente de su próximo cobro.",
  };

  let internalOk = true;
  if (notice.internal !== false) {
    const content = internalNotice({
      title: `${titles[notice.event]} — ${notice.customerEmail || notice.reference}`,
      intro: notes[notice.event],
      tone: notice.event === "payment_failed" ? "alert" : notice.event === "renewal" ? "lime" : "ink",
      eyebrow: "Suscripción",
      figure: notice.amount != null ? formatMoney(amountNum, currency) : undefined,
      actions: notice.customerEmail ? [{ label: "Escribirle al cliente", href: `mailto:${notice.customerEmail}` }] : undefined,
      rows: [
        ["Cliente", `${notice.customerName || "—"}${notice.customerEmail ? ` (${notice.customerEmail})` : ""}`],
        ["Monto", notice.amount != null ? formatMoney(amountNum, currency) : "—"],
        ["Método", method],
        ["Próximo cobro", notice.nextChargeDate ? new Date(notice.nextChargeDate).toISOString().slice(0, 10) : null],
        ["Referencia", notice.reference],
      ],
    });
    internalOk = (await sendMail({ to: notificationEmail(), ...content })).ok;
  }

  let customerOk = false;
  if (notice.customerEmail) {
    const folio = makeFolio(notice.reference);
    const content =
      notice.event === "renewal"
        ? monthlyPaymentReceived({
            name: notice.customerName,
            folio,
            amount: amountNum,
            currency,
            method,
            period: notice.period,
            nextChargeDate: notice.nextChargeDate,
            invoiceUrl: notice.invoiceUrl,
            manageUrl,
          })
        : notice.event === "payment_failed"
          ? paymentFailed({
              name: notice.customerName,
              amount: amountNum,
              currency,
              payUrl: notice.payUrl,
              manageUrl,
              nextAttempt: notice.nextChargeDate,
            })
          : notice.event === "upcoming"
            ? renewalReminder({
                name: notice.customerName,
                amount: amountNum,
                currency,
                chargeDate: notice.nextChargeDate || Date.now(),
                method,
                manageUrl,
              })
            : subscriptionCancelled({ name: notice.customerName, endsAt: notice.endsAt });
    customerOk = (await sendMail({ to: notice.customerEmail, ...content, replyTo: notificationEmail() })).ok;
  }

  return { internal: internalOk, customer: customerOk };
}

/**
 * Pago que todavía no se acredita: ficha de OXXO / SPEI por pagar o pago en
 * revisión antifraude. Le dice al cliente qué sigue y te avisa a ti. No lanza.
 */
export async function sendPaymentPending(p: {
  provider: PaymentProvider;
  reference: string;
  amount: number;
  currency: string;
  kind: "review" | "ticket";
  description?: string | null;
  customerEmail?: string | null;
  customerName?: string | null;
  ticketUrl?: string | null;
  expiresAt?: Date | string | number | null;
}) {
  const folio = makeFolio(p.reference);
  const method = PROVIDER_LABEL[p.provider];
  const amount = formatMoney(p.amount, p.currency);

  const internal = internalNotice({
    title: `${p.kind === "ticket" ? "Ficha de pago generada" : "Pago en revisión"} ${folio} — ${amount}`,
    intro:
      p.kind === "ticket"
        ? "Un cliente generó una ficha de OXXO o transferencia. Todavía no paga: si en 24 h no se acredita, escríbele para ayudarle."
        : "Mercado Pago está revisando un pago. Si lo aprueba, el cliente recibe su comprobante y el brief solo.",
    eyebrow: "Pago pendiente",
    tone: "white",
    figure: amount,
    figureNote: p.kind === "ticket" ? "por pagar" : "en revisión",
    rows: [
      ["Folio", folio],
      ["Concepto", p.description || "Proyecto web"],
      ["Cliente", `${p.customerName || "—"}${p.customerEmail ? ` (${p.customerEmail})` : ""}`],
      ["Vence", p.expiresAt ? new Date(p.expiresAt).toISOString().slice(0, 10) : null],
      ["Referencia", p.reference],
    ],
    actions: p.customerEmail ? [{ label: "Escribirle", href: `mailto:${p.customerEmail}` }] : undefined,
  });
  const internalOk = (await sendMail({ to: notificationEmail(), ...internal, replyTo: p.customerEmail || undefined })).ok;

  let customerOk = false;
  if (p.customerEmail) {
    const content = paymentPending({
      name: p.customerName,
      folio,
      amount: p.amount,
      currency: p.currency,
      concept: p.description,
      kind: p.kind,
      method,
      ticketUrl: p.ticketUrl,
      expiresAt: p.expiresAt,
    });
    customerOk = (await sendMail({ to: p.customerEmail, ...content, replyTo: notificationEmail() })).ok;
  }
  return { folio, internal: internalOk, customer: customerOk };
}
