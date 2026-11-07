import { ContactoPage } from "@/components/pages/contacto-page";
import { DICTIONARIES } from "@/lib/i18n/dictionaries";
import { createPageMetadata } from "@/lib/seo/page-metadata";
import { SITE_URL } from "@/lib/seo/service-pages";

export const metadata = createPageMetadata({
  path: "/contacto",
  title: "Contacto | BryanF Design",
  description:
    "Escríbenos por WhatsApp, correo o teléfono. Respuestas a las preguntas frecuentes sobre tiempos, costos y entregables, y proyectos en México, España y Francia.",
});

// Todas las preguntas frecuentes viven aquí; el HTML del servidor sale en
// español, así que el marcado coincide con lo que lee el rastreador.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${SITE_URL}/contacto#faq`,
  url: `${SITE_URL}/contacto`,
  inLanguage: "es-MX",
  mainEntity: DICTIONARIES.es.faq.items.map((item) => ({
    "@type": "Question",
    name: item.title,
    acceptedAnswer: { "@type": "Answer", text: item.content },
  })),
};

export default function Page() {
  return <ContactoPage faqJsonLd={faqJsonLd} />;
}
