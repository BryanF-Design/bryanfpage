/**
 * SUSCRIPCIÓN "TODO DIGITAL" — contenido, política y preguntas frecuentes.
 *
 * Fuente única del texto comercial de la suscripción: la página /suscripcion,
 * su marcado FAQPage, el prompt de Lumina y los correos leen de aquí. El
 * precio vive en lib/catalog.ts (SUBSCRIPTION_PLAN). Para cambiar una regla de
 * la política, se edita aquí y se actualiza en todo el sitio.
 */

import { SUBSCRIPTION_PLAN } from "./catalog";

const price = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
}).format(SUBSCRIPTION_PLAN.price);

/** "$7,000 MXN" — para textos. */
export const SUBSCRIPTION_PRICE_LABEL = `${price} MXN`;

/** Lo que entra en la suscripción, agrupado para la página. */
export const SUBSCRIPTION_INCLUDES: { title: string; items: string[] }[] = [
  {
    title: "Sitios y páginas",
    items: [
      "Páginas web, landing pages y micrositios: los que necesites",
      "Tienda en línea y pasarela de pagos",
      "Rediseños y nuevas secciones",
      "Hosting de tus sitios mientras la suscripción esté activa",
    ],
  },
  {
    title: "Cambios ilimitados",
    items: [
      "Textos, fotos, precios, productos y promociones",
      "Ajustes de diseño y nuevas versiones",
      "Correcciones y mejoras de velocidad",
      "Mantenimiento, respaldos y actualizaciones",
    ],
  },
  {
    title: "Identidad digital",
    items: [
      "Tarjetas de presentación digitales",
      "Firmas de correo profesionales",
      "Kits de presencia digital y códigos QR",
      "Gráficos para redes sociales y banners",
    ],
  },
  {
    title: "Crecimiento",
    items: [
      "SEO técnico y Google Business Profile",
      "Medición: Google Analytics y conversiones",
      "Formularios, WhatsApp y automatizaciones",
      "Asesoría directa con Bryan",
    ],
  },
];

/** Cómo funciona, en pasos. */
export const SUBSCRIPTION_STEPS: { title: string; body: string }[] = [
  {
    title: "Te suscribes",
    body: `${SUBSCRIPTION_PRICE_LABEL} al mes, con tarjeta o Mercado Pago. Sin plazo forzoso.`,
  },
  {
    title: "Mandas tu solicitud",
    body: "Por WhatsApp o correo: qué necesitas, con ejemplos o referencias si los tienes.",
  },
  {
    title: "La entregamos en 1 a 2 días hábiles",
    body: "Según la complejidad. Los proyectos grandes se entregan por partes, cada una en ese tiempo.",
  },
  {
    title: "Pides cambios sin límite",
    body: "Revisas, ajustamos y seguimos con lo siguiente de tu lista.",
  },
];

/**
 * Política de la suscripción. Cada punto es una regla corta; la página los
 * pinta como lista y Términos y Condiciones enlaza aquí.
 */
export const SUBSCRIPTION_POLICY: { title: string; body: string }[] = [
  {
    title: "Cobro",
    body: `${SUBSCRIPTION_PRICE_LABEL} al mes, cobrados automáticamente el mismo día de cada mes con el método que elegiste. El acceso empieza en cuanto se confirma el primer pago.`,
  },
  {
    title: "Qué incluye",
    body: "Todo lo digital que necesites para tu negocio: sitios y páginas web, cambios ilimitados, tarjetas digitales, firmas de correo, gráficos para redes, SEO técnico, mantenimiento y hosting de los sitios que hagamos mientras la suscripción esté activa.",
  },
  {
    title: "Tiempos de entrega",
    body: "Cada solicitud se entrega en 1 a 2 días hábiles, según su complejidad. Lo que no cabe en ese tiempo (por ejemplo, una tienda completa) se divide en entregas más chicas, y cada una llega en ese plazo. El reloj corre desde que tenemos la información completa.",
  },
  {
    title: "Una solicitud a la vez",
    body: "Trabajamos tu lista por orden de prioridad, una solicitud activa a la vez. Puedes mandar todas las que quieras: en cuanto entregamos una, empezamos la siguiente.",
  },
  {
    title: "Horario",
    body: "Lunes a viernes de 9:00 a 19:00, hora de Ciudad de México. Las solicitudes que llegan fuera de horario o en días festivos se empiezan el siguiente día hábil.",
  },
  {
    title: "Costos de terceros",
    body: "No incluye lo que se le paga a otras empresas: pauta publicitaria (Google Ads, Meta), licencias o plugins de pago, dominios adicionales, comisiones de pasarelas de pago ni impresión física. Te avisamos antes de cualquier gasto y tú decides.",
  },
  {
    title: "Uso justo",
    body: "Es una suscripción para un negocio (una marca). Si necesitas atender varias marcas o empresas, lo platicamos y armamos un plan a tu medida.",
  },
  {
    title: "Cancelación",
    body: "Sin plazo forzoso: cancelas cuando quieras y no se vuelve a cobrar. Conservas el acceso hasta el final del mes ya pagado; no hay reembolsos por meses parciales.",
  },
  {
    title: "Tus archivos y sitios",
    body: "Todo lo que entregamos es tuyo. Si cancelas, te pasamos los archivos y accesos, y te ayudamos a mover tus sitios a tu propio hosting.",
  },
  {
    title: "Pagos fallidos",
    body: "Si un cobro no pasa, la plataforma lo reintenta y te avisamos. Si sigue pendiente después de 7 días, pausamos las solicitudes hasta que se regularice; tus sitios siguen en línea.",
  },
];

/** Preguntas frecuentes de la suscripción (también van como FAQPage). */
export const SUBSCRIPTION_FAQ: { question: string; answer: string }[] = [
  {
    question: "¿Qué incluye exactamente la suscripción?",
    answer: `Todo lo digital que tu negocio necesite por ${SUBSCRIPTION_PRICE_LABEL} al mes: páginas web, tienda en línea, cambios ilimitados, tarjetas digitales, firmas de correo, gráficos para redes, SEO técnico, mantenimiento y hosting de tus sitios.`,
  },
  {
    question: "¿Cuánto tardan en entregar cada solicitud?",
    answer: "Entre 1 y 2 días hábiles, según la complejidad. Si algo es grande (una tienda completa, un sitio de muchas secciones), lo dividimos en entregas más chicas y cada una llega en ese tiempo.",
  },
  {
    question: "¿De verdad los cambios son ilimitados?",
    answer: "Sí. Puedes pedir todos los cambios que quieras. Los trabajamos uno a la vez, por orden de prioridad, para entregarte cada uno rápido y bien hecho.",
  },
  {
    question: "¿Puedo pedir varias cosas al mismo tiempo?",
    answer: "Puedes mandar tu lista completa cuando quieras. Trabajamos una solicitud activa a la vez y, en cuanto la entregamos, seguimos con la siguiente.",
  },
  {
    question: "¿Hay plazo forzoso? ¿Cómo cancelo?",
    answer: "No hay plazo forzoso. Cancelas cuando quieras desde el portal de tu suscripción o escribiéndonos, y ya no se vuelve a cobrar. Mantienes el acceso hasta el final del mes pagado.",
  },
  {
    question: "¿Qué pasa con mi sitio si cancelo?",
    answer: "Es tuyo. Te entregamos los archivos y accesos, y te ayudamos a moverlo a tu propio hosting para que siga en línea.",
  },
  {
    question: "¿Qué no está incluido?",
    answer: "Los pagos a terceros: anuncios en Google o Meta, licencias o plugins de pago, dominios adicionales, comisiones de pasarelas e impresión física. Siempre te avisamos antes y tú decides.",
  },
  {
    question: "¿Me conviene más la suscripción o un proyecto de pago único?",
    answer: "Si solo necesitas un sitio y casi no lo vas a cambiar, el pago único (desde $3,500 MXN) es suficiente. Si tu negocio se mueve, lanzas promociones o necesitas varias piezas digitales cada mes, la suscripción sale más barata y vas más rápido.",
  },
  {
    question: "¿Cómo pago y cuándo se cobra?",
    answer: "Con tarjeta (Stripe) o Mercado Pago. El cobro es automático, el mismo día de cada mes en que te suscribiste. Si prefieres transferencia mensual, escríbenos.",
  },
  {
    question: "¿Cómo mando mis solicitudes?",
    answer: "Por WhatsApp o correo, en horario de lunes a viernes de 9:00 a 19:00 (CDMX). Mientras más claro (texto, fotos, ejemplos), más rápido entregamos.",
  },
];

/** Resumen corto para el prompt de Lumina. */
export const SUBSCRIPTION_PROMPT = `Suscripción "Todo Digital": ${SUBSCRIPTION_PRICE_LABEL} al mes, sin plazo forzoso. Incluye todo lo digital: páginas web y tiendas, cambios ilimitados, tarjetas digitales, firmas de correo, gráficos para redes, SEO técnico, mantenimiento y hosting. Cada solicitud tarda 1 a 2 días hábiles según complejidad; una solicitud activa a la vez. No incluye pagos a terceros (anuncios, licencias, dominios extra, impresión). Cancela cuando quiera. Página: suscripcion.`;
