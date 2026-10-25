/**
 * Datos de ejemplo de cada plantilla de correo, para vistas previas y pruebas
 * (scripts/email-test.mjs y /api/admin/test-emails).
 */

import {
  briefNotice,
  briefReceived,
  internalNotice,
  leadNotice,
  leadReceived,
  paymentPending,
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
const MP_SUBSCRIPTIONS = "https://www.mercadopago.com.mx/subscriptions";
const PORTAL = "https://access.bryanfdesign.com";

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
      briefUrl: `${SITE}/armar-mi-brief`,
      portalUrl: PORTAL,
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
      briefUrl: `${SITE}/armar-mi-brief`,
      manageUrl: MP_SUBSCRIPTIONS,
      policyUrl: `${SITE}/suscripcion#politica`,
      portalUrl: PORTAL,
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
      manageUrl: MP_SUBSCRIPTIONS,
    }),
  renewalReminder: () =>
    renewalReminder({
      name: "Carlos Méndez",
      amount: 7000,
      currency: "MXN",
      chargeDate: Date.now() + 3 * DAY,
      method: "Mercado Pago",
      manageUrl: MP_SUBSCRIPTIONS,
    }),
  paymentFailed: () =>
    paymentFailed({
      name: "Carlos Méndez",
      amount: 7000,
      currency: "MXN",
      payUrl: MP_SUBSCRIPTIONS,
      manageUrl: MP_SUBSCRIPTIONS,
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
      payUrl: "https://www.mercadopago.com.mx/",
    }),
  subscriptionCancelled: () => subscriptionCancelled({ name: "Carlos Méndez", endsAt: Date.now() + 12 * DAY }),
  briefReceived: () => briefReceived({ name: "Ana López", businessName: "Café La Esquina", links: 3, files: 2 }),
  leadReceived: () => leadReceived({ name: "Mariana Ruiz", service: "Página web para mi negocio" }),
  paymentPendingTicket: () =>
    paymentPending({
      name: "Ana López",
      folio: "BF-OXX0K2P9",
      amount: 1750,
      currency: "MXN",
      concept: "Desarrollo web — sitio de 5 secciones",
      kind: "ticket",
      method: "Mercado Pago (OXXO)",
      ticketUrl: "https://www.mercadopago.com.mx/activities",
      expiresAt: Date.now() + 3 * DAY,
    }),
  paymentPendingReview: () =>
    paymentPending({
      name: "Ana López",
      folio: "BF-REV7Q2KA",
      amount: 3500,
      currency: "MXN",
      concept: "Desarrollo web — pago completo",
      kind: "review",
      method: "Mercado Pago",
    }),

  // ——— Lo que te llega a ti ———
  leadNotice: () =>
    leadNotice({
      name: "Mariana Ruiz",
      phone: "55 1234 5678",
      email: "mariana@floreriaruiz.mx",
      service: "Página web para mi negocio",
      timeline: "Este mes",
      message:
        "Hola, tengo una florería en Coyoacán y quiero una página donde la gente vea los arreglos y pida por WhatsApp. Ya tengo logo y fotos.",
      quote: "Sitio profesional + Catálogo + Botón de WhatsApp · $6,900 MXN",
      page: "/diseno-web-mexico (diseno-web-mexico)",
      campaign: "Google Ads · fuente: google · medio: cpc · campaña: diseno-web-cdmx · palabra clave: pagina web para negocio",
      gclid: "Cj0KCQjw-ejemplo",
    }),
  briefNotice: () =>
    briefNotice({
      fullName: "Ana López",
      businessName: "Café La Esquina",
      phone: "55 9876 5432",
      email: "ana@cafelaesquina.mx",
      sections: [
        {
          title: "Tu negocio",
          rows: [
            ["Giro o industria", "Cafetería de especialidad"],
            ["Ciudad y país", "Ciudad de México (Roma Norte)"],
            ["¿Qué vendes o qué servicios das?", "Café de especialidad, pan dulce artesanal, desayunos y cursos de barismo los sábados. También vendemos café en grano por kilo."],
            ["¿A quién le vendes?", "Oficinistas de la zona entre semana y familias el fin de semana. Gente de 25 a 45 que busca buen café."],
          ],
        },
        {
          title: "Tu proyecto",
          rows: [
            ["Tipo de proyecto", "Sitio web corporativo"],
            ["Objetivo principal", "Recibir mensajes por WhatsApp"],
            ["Cuéntanos tu proyecto", "Queremos una página bonita con el menú, la ubicación, fotos del lugar y que la gente pueda reservar los cursos de barismo. Que se vea cálida, como el café."],
            ["Fecha ideal", "Antes del 15 de noviembre"],
          ],
          chips: ["Botón de WhatsApp", "Mapa y horarios", "Menú o catálogo", "Reservaciones"],
        },
        {
          title: "Tu marca y tu estilo",
          rows: [
            ["¿Ya tienes logo?", "Sí, en buena calidad"],
            ["Colores", "Café, crema y un verde oliva"],
            ["Estilo que te gusta", "Cálido y artesanal"],
          ],
        },
      ],
      links: [
        { label: "Instagram", purpose: "Mi red social actual", url: "https://instagram.com/cafelaesquina" },
        { label: "Google Drive", purpose: "Materiales (logo, fotos)", url: "https://drive.google.com/" },
        { label: "Sitio web", purpose: "Referencia que me gusta", url: "https://www.bluebottlecoffee.com" },
      ],
      files: ["logo-cafe-la-esquina.png", "menu-otono-2026.pdf"],
      notes: "Los sábados no puedo hacer llamadas; entre semana después de las 4 pm.",
      payment: [
        ["Total del proyecto", "$3,500 MXN"],
        ["Pagado / por pagar", "$1,750 MXN"],
        ["Método", "Mercado Pago"],
        ["Referencia", "123456789"],
      ],
    }),
  internalSale: () =>
    internalNotice({
      title: "Pago confirmado BF-7Q2K9XAM — $1,750 MXN",
      intro: "Se confirmó un pago. El cliente recibió su comprobante con el enlace para armar su brief.",
      tone: "lime",
      eyebrow: "Nueva venta",
      figure: "$1,750 MXN",
      figureNote: "Desarrollo web — sitio de 5 secciones",
      actions: [{ label: "Escribirle al cliente", href: "mailto:ana@ejemplo.com" }],
      rows: [
        ["Folio", "BF-7Q2K9XAM"],
        ["Monto cobrado", "$1,750 MXN"],
        ["Método", "Mercado Pago"],
        ["Modalidad", "anticipo"],
        ["Cliente", "Ana López (ana@ejemplo.com)"],
        ["Origen", "Google Ads · fuente: google · campaña: diseno-web-cdmx"],
      ],
    }),
  internalSubscription: () =>
    internalNotice({
      title: "Nueva suscripción BF-SUB8K2LQ — $7,000 MXN",
      intro: "Un cliente se suscribió al plan mensual Todo Digital. Escríbele para recibir su primera solicitud.",
      tone: "lime",
      eyebrow: "Nueva suscripción",
      figure: "$7,000 MXN",
      figureNote: "primer mes · Todo Digital",
      actions: [{ label: "Escribirle al cliente", href: "mailto:carlos@ejemplo.com" }],
      rows: [
        ["Folio", "BF-SUB8K2LQ"],
        ["Método", "Mercado Pago"],
        ["Cliente", "Carlos Méndez (carlos@ejemplo.com)"],
        ["Origen", "Directo / orgánico (sin datos de campaña)"],
      ],
    }),
  internalPaymentFailed: () =>
    internalNotice({
      title: "Cobro de suscripción fallido ⚠️ — carlos@ejemplo.com",
      intro:
        "No pasó el cobro mensual. Se le pidió al cliente actualizar su método de pago; la plataforma lo reintentará. Si sigue pendiente 7 días, la política dice pausar solicitudes.",
      tone: "alert",
      eyebrow: "Suscripción",
      figure: "$7,000 MXN",
      actions: [{ label: "Escribirle al cliente", href: "mailto:carlos@ejemplo.com" }],
      rows: [
        ["Cliente", "Carlos Méndez (carlos@ejemplo.com)"],
        ["Método", "Tarjeta (Stripe)"],
        ["Referencia", "in_1Q2w3E4r5T"],
      ],
    }),
};

export const EMAIL_SAMPLE_NAMES = Object.keys(EMAIL_SAMPLES);
