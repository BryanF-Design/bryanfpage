import type { Metadata } from "next";

import { BRAND_NAME, SITE_URL, WHATSAPP_URL } from "@/lib/seo/service-pages";

/**
 * Barber OS — sistema de reservas y lealtad para barberías y salones.
 * Todo el texto de la página vive aquí para poder ajustar oferta, cifras o
 * preguntas sin tocar el diseño (`components/barber-os/barber-os-page.tsx`).
 */

export const BARBER_OS_SLUG = "sistema-para-barberias";
export const BARBER_OS_PATH = `/${BARBER_OS_SLUG}`;
export const BARBER_OS_NAME = "Barber OS";
export const BARBER_OS_SERVICE = "Sistema para barberías";

/** Días de prueba gratis. */
export const TRIAL_DAYS = 14;

/** WhatsApp con el mensaje listo para pedir la prueba. */
export const BARBER_OS_TRIAL_URL = `${WHATSAPP_URL}?text=${encodeURIComponent(
  `Hola, quiero la prueba gratis de ${TRIAL_DAYS} días del Sistema para barberías (Barber OS).`
)}`;

/** Regla de lealtad que usa CortMart (configurable por negocio). */
export const LOYALTY = { stamps: 5, discount: 20 } as const;

/** El caso en vivo. Cifras reales tomadas del panel de administración. */
export const LIVE_CASE = {
  name: "Barbería CortMart",
  url: "https://barberia-partum.vercel.app/",
  cutoff: "Corte: noviembre de 2026",
  revenue: 12070,
  stats: [
    { value: 51, suffix: "", label: "Visitas atendidas", caption: "Citas confirmadas con QR" },
    { value: 98, suffix: "%", label: "Asistencia", caption: "Clientes que sí llegaron a su cita" },
    { value: 50, suffix: "", label: "Clientes atendidos", caption: "Personas distintas en la silla" },
    { value: 56, suffix: "", label: "Clientes registrados", caption: "Con cuenta y tarjeta de lealtad" },
  ],
} as const;

export type FeatureIcon =
  | "calendar"
  | "stamp"
  | "qr"
  | "dashboard"
  | "card"
  | "app"
  | "team"
  | "brand";

export interface BarberFeature {
  icon: FeatureIcon;
  title: string;
  text: string;
}

export const FEATURES: BarberFeature[] = [
  {
    icon: "calendar",
    title: "Reservas en línea",
    text: "Tus clientes eligen servicio, barbero y horario desde el celular. Cada espacio se bloquea al reservar: cero citas encimadas.",
  },
  {
    icon: "stamp",
    title: "Tarjeta de lealtad",
    text: `Con Google Wallet y código QR. Un sello por visita; con ${LOYALTY.stamps} sellos, ${LOYALTY.discount}% de descuento.`,
  },
  {
    icon: "qr",
    title: "Confirmación por QR",
    text: "El barbero escanea el QR de la cita con la cámara: queda como asistida y el sello se suma solo.",
  },
  {
    icon: "dashboard",
    title: "Panel de administración",
    text: "Agenda, caja, inventario, reportes y marketing en un solo lugar, desde la compu o el celular.",
  },
  {
    icon: "card",
    title: "Pagos en línea",
    text: "Stripe y Mercado Pago, además de efectivo y tarjeta en mostrador. Caja y reportes los separan.",
  },
  {
    icon: "app",
    title: "App instalable y avisos",
    text: "Se instala en Android, iPhone o computadora. Notificaciones de reservas, cambios, cancelaciones y llegadas.",
  },
  {
    icon: "team",
    title: "Equipo y permisos",
    text: "Cada barbero con su agenda. Tú decides qué puede ver y hacer cada quien; el sistema lo respeta.",
  },
  {
    icon: "brand",
    title: "Con tu marca",
    text: "Tu logo, colores, servicios, precios y horario. La portada muestra en vivo si estás abierto o cerrado.",
  },
];

/** Recorrido de una visita, del lado del cliente y del negocio. */
export const FLOW = [
  {
    who: "Cliente",
    title: "Reserva en un minuto",
    text: "Elige servicio, barbero y horario. Recibe su cita con QR.",
  },
  {
    who: "Barbería",
    title: "Confirma con QR",
    text: "Al llegar se escanea su código y la cita pasa a «Asistió».",
  },
  {
    who: "Cliente",
    title: "Suma su sello",
    text: "La visita se registra sola en su tarjeta, también en Google Wallet.",
  },
  {
    who: "Barbería",
    title: "Cobra y mide",
    text: "El cobro entra a caja y los reportes se actualizan al momento.",
  },
];

/** Módulos del panel de administración. */
export const ADMIN_MODULES = [
  "Agenda y citas",
  "Escáner de QR",
  "Caja y finanzas",
  "Inventario",
  "Reportes",
  "Marketing (GA4 y Google Ads)",
  "Clientes",
  "Tarjetas de lealtad",
  "Equipo y permisos",
  "Servicios y precios",
  "Disponibilidad",
  "Google Calendar",
];

/** Lo que entra en la prueba gratis. */
export const TRIAL_INCLUDES = [
  "Configuración con tu marca: logo, colores y nombre del negocio.",
  "Tu menú de servicios con duración y precio.",
  "Tus barberos dados de alta, cada uno con su agenda.",
  "Tus horarios de atención y datos de contacto.",
  "Reservas, tarjeta de lealtad, QR y panel funcionando con tus clientes.",
];

/** Lo que NO entra en la prueba (se cotiza aparte). */
export const TRIAL_EXCLUDES = [
  "Cambios de código a medida: funciones nuevas, integraciones especiales o pantallas fuera del sistema.",
];

export const FAQS = [
  {
    question: `¿Qué incluye la prueba gratis de ${TRIAL_DAYS} días?`,
    answer: `Configuramos el sistema para tu negocio: tu marca, tus servicios, tus barberos y tus horarios. Durante ${TRIAL_DAYS} días lo usas con clientes reales para reservar, confirmar con QR y entregar sellos de lealtad.`,
  },
  {
    question: "¿Los cambios a medida entran en la prueba?",
    answer:
      "No. La prueba cubre la configuración del sistema tal como existe. Cualquier cambio de código a medida, como una función nueva o una integración especial, se cotiza y se cobra aparte.",
  },
  {
    question: "¿Mis clientes tienen que descargar una app?",
    answer:
      "No. Reservan desde el navegador del celular. Si quieren, pueden instalarla como app en Android o iPhone y guardar su tarjeta de lealtad en Google Wallet.",
  },
  {
    question: "¿Cómo funciona la tarjeta de lealtad?",
    answer: `Cada visita confirmada con QR suma un sello automáticamente. En CortMart, ${LOYALTY.stamps} sellos dan ${LOYALTY.discount}% de descuento; la regla se ajusta a tu negocio.`,
  },
  {
    question: "¿Qué formas de pago acepta?",
    answer:
      "Pagos en línea con Stripe y Mercado Pago, y en mostrador efectivo o tarjeta. Caja y reportes separan cada método.",
  },
  {
    question: "¿Sirve para salones de belleza?",
    answer:
      "Sí. Funciona para barberías y salones: los servicios, el equipo y los horarios se configuran según tu negocio.",
  },
  {
    question: "¿Qué pasa cuando termina la prueba?",
    answer:
      "Si decides seguir, te compartimos el plan para continuar con tu sistema tal como quedó configurado. Si no, la prueba termina sin compromiso.",
  },
];

/** Servicios del sitio que se conectan con este. */
export const RELATED = [
  { label: "Software a medida", href: "/software-a-medida-mexico" },
  { label: "Páginas para negocios", href: "/paginas-web-para-negocios" },
  { label: "Mantenimiento web", href: "/mantenimiento-web-mexico" },
];

const META_TITLE = "Sistema para barberías: reservas y lealtad | BryanF Design";
const META_DESCRIPTION = `Barber OS: reservas en línea, tarjeta de lealtad con Google Wallet y QR, panel de administración y pagos con Stripe y Mercado Pago. Pruébalo ${TRIAL_DAYS} días gratis.`;

export const barberOsMetadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: { canonical: BARBER_OS_PATH },
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: BRAND_NAME,
    url: BARBER_OS_PATH,
    title: META_TITLE,
    description: META_DESCRIPTION,
    images: [
      {
        url: "/img/og-bryanf-apex.png",
        width: 1200,
        height: 630,
        alt: `${BRAND_NAME}: Haz que pase`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: META_TITLE,
    description: META_DESCRIPTION,
    images: ["/img/og-bryanf-apex.png"],
  },
  robots: { index: true, follow: true },
};

export function barberOsJsonLd() {
  const url = `${SITE_URL}${BARBER_OS_PATH}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${url}#service`,
      name: `${BARBER_OS_SERVICE} (${BARBER_OS_NAME})`,
      serviceType: "Sistema de reservas y lealtad para barberías",
      description: META_DESCRIPTION,
      areaServed: { "@type": "Country", name: "México" },
      audience: { "@type": "BusinessAudience", audienceType: "Barberías y salones de belleza" },
      provider: {
        "@type": "ProfessionalService",
        "@id": `${SITE_URL}/#organization`,
        name: BRAND_NAME,
        url: SITE_URL,
      },
      offers: {
        "@type": "Offer",
        name: `Prueba gratis de ${TRIAL_DAYS} días`,
        price: 0,
        priceCurrency: "MXN",
        description:
          "Incluye la configuración con la marca, servicios, barberos y horarios del negocio. Los cambios de código a medida se cotizan aparte.",
        url,
      },
      url,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: BARBER_OS_SERVICE, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ];
}
