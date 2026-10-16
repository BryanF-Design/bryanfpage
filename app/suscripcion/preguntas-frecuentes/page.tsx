import type { Metadata } from "next";

import { SubscriptionFaqPage } from "@/components/subscription-faq-page";
import { SITE_URL } from "@/lib/seo/service-pages";
import { SUBSCRIPTION_FAQ_ALL } from "@/lib/subscription";

const URL = `${SITE_URL}/suscripcion/preguntas-frecuentes`;

export const metadata: Metadata = {
  title: "Preguntas frecuentes de la suscripción de diseño web | BryanF Design",
  description:
    "Qué incluye la suscripción Todo Digital de $7,000 MXN al mes, tiempos de entrega, pagos, factura, cancelación, dominio, hosting y más. Todas las respuestas en un solo lugar.",
  alternates: { canonical: "/suscripcion/preguntas-frecuentes" },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: URL,
    siteName: "BryanF Design",
    title: "Preguntas frecuentes de la Suscripción Todo Digital | BryanF Design",
    description: "Qué incluye, cómo pides, cuánto tardamos, cómo se cobra y cómo cancelas.",
    images: [{ url: "/img/og-bryanf-apex.png", width: 1200, height: 630, alt: "BryanF Design" }],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${URL}#preguntas`,
  url: URL,
  inLanguage: "es-MX",
  mainEntity: SUBSCRIPTION_FAQ_ALL.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Suscripción", item: `${SITE_URL}/suscripcion` },
    { "@type": "ListItem", position: 3, name: "Preguntas frecuentes", item: URL },
  ],
};

export default function SuscripcionPreguntasPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SubscriptionFaqPage />
    </>
  );
}
