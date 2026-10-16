/**
 * Datos de ejemplo de cada plantilla de correo, para vistas previas y pruebas
 * (scripts/email-test.mjs y /api/admin/test-emails).
 */

import {
  briefReceived,
  internalNotice,
  monthlyPaymentReceived,
  paymentFailed,
  paymentReceived,
  paymentRequest,
  renewalReminder,
  subscriptionCancelled,
  subscriptionWelcome,
  type EmailContent,
} from "./email-templates";

const SITE = "https://www.bryanfdesign.com";
const DAY = 86_400_000;

export const EMAIL_SAMPLES: Record<string, () => EmailContent> = {
  paymentReceived: () =>
    paymentReceived({
      name: "Ana López",
      folio: "BF-7Q2K9XAM",
      amount: 1750,
      currency: "MXN",
      concept: "Desarrollo web — sitio de 5 secciones",
      method: "Mercado Pago",
      modalidad: "anticipo",
      briefUrl: `${SITE}/armar-mi-brief?provider=mercadopago&payment_id=123456789`,
    }),
  paymentReceivedBalance: () =>
    paymentReceived({
      name: "Ana López",
      folio: "BF-3MZP81QA",
      amount: 1750,
      currency: "MXN",
      concept: "Saldo del proyecto web (50 %)",
      method: "Tarjeta (Stripe)",
      modalidad: "saldo",
      briefUrl: `${SITE}/armar-mi-brief`,
    }),
  subscriptionWelcome: () =>
    subscriptionWelcome({
      name: "Carlos Méndez",
      folio: "BF-SUB8K2LQ",
      amount: 7000,
      currency: "MXN",
      method: "Mercado Pago",
      nextChargeDate: Date.now() + 30 * DAY,
      briefUrl: `${SITE}/armar-mi-brief?provider=mercadopago&preapproval_id=2c9380848f0a`,
      manageUrl: "https://www.mercadopago.com.mx/subscriptions",
      policyUrl: `${SITE}/suscripcion#politica`,
    }),
  monthlyPaymentReceived: () =>
    monthlyPaymentReceived({
      name: "Carlos Méndez",
      folio: "BF-INV4R7TZ",
      amount: 7000,
      currency: "MXN",
      method: "Tarjeta (Stripe)",
      period: "16 oct 2026 – 16 nov 2026",
      nextChargeDate: Date.now() + 30 * DAY,
      invoiceUrl: "https://invoice.stripe.com/i/acct_ejemplo",
      manageUrl: "https://billing.stripe.com/p/login/ejemplo",
    }),
  renewalReminder: () =>
    renewalReminder({
      name: "Carlos Méndez",
      amount: 7000,
      currency: "MXN",
      chargeDate: Date.now() + 3 * DAY,
      method: "Mercado Pago",
      manageUrl: "https://www.mercadopago.com.mx/subscriptions",
    }),
  paymentFailed: () =>
    paymentFailed({
      name: "Carlos Méndez",
      amount: 7000,
      currency: "MXN",
      payUrl: "https://invoice.stripe.com/i/acct_ejemplo",
      manageUrl: "https://billing.stripe.com/p/login/ejemplo",
      nextAttempt: Date.now() + 3 * DAY,
    }),
  paymentRequest: () =>
    paymentRequest({
      name: "Ana López",
      amount: 1750,
      currency: "MXN",
      concept: "Saldo del proyecto web (50 %)",
      folio: "BF-COBRO8QZ",
      dueDate: Date.now() + 5 * DAY,
      note: "Tu sitio ya está listo para publicarse; en cuanto se acredite el pago lo subimos.",
      payUrl: "https://www.mercadopago.com.mx/checkout/v1/redirect?pref_id=ejemplo",
      altPayUrl: "https://buy.stripe.com/ejemplo",
      altPayLabel: "Pagar con tarjeta (Stripe)",
    }),
  subscriptionCancelled: () => subscriptionCancelled({ name: "Carlos Méndez", endsAt: Date.now() + 12 * DAY }),
  briefReceived: () => briefReceived({ name: "Ana López", businessName: "Café La Esquina", links: 3, files: 2 }),
  internalNotice: () =>
    internalNotice({
      title: "Pago confirmado BF-7Q2K9XAM — $1,750 MXN",
      intro: "Se confirmó un pago. El cliente recibió su comprobante con el enlace para armar su brief.",
      tone: "lime",
      rows: [
        ["Folio", "BF-7Q2K9XAM"],
        ["Monto cobrado", "$1,750 MXN"],
        ["Método", "Mercado Pago"],
        ["Modalidad", "anticipo"],
        ["Cliente", "Ana López (ana@ejemplo.com)"],
        ["Origen", "google / cpc · campaña-diseno-web"],
      ],
    }),
};

export const EMAIL_SAMPLE_NAMES = Object.keys(EMAIL_SAMPLES);
