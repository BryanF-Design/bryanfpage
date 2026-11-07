import { ContactoPage } from "@/components/pages/contacto-page";
import { DICTIONARIES } from "@/lib/i18n/dictionaries";
import { createPageMetadata } from "@/lib/seo/page-metadata";
import { SITE_URL } from "@/lib/seo/service-pages";

export const metadata = createPageMetadata({
  path: "/contacto",
  title: "Contacto y preguntas frecuentes | BryanF Design",
  description:
    "Escríbeme por WhatsApp, correo o teléfono. Aquí también resuelvo las dudas más comunes sobre tiempos, costos y entregables de tu página web."
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
