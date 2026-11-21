"use client";

import dynamic from "next/dynamic";
import { SiteHeader } from "@/components/sections/site-header";
import { HeroPop } from "@/components/sections/hero-pop";
import { DICTIONARIES } from "@/lib/i18n/dictionaries";
import { SITE_URL } from "@/lib/seo/service-pages";

// Debajo del hero todo se divide en trozos (menos JS al hidratar), con SSR
// activo para que el texto y los enlaces sigan en el HTML del servidor.
const HomeCases = dynamic(() => import("@/components/home/home-cases").then((m) => m.HomeCases));
const NameMarquee = dynamic(() => import("@/components/home/name-marquee").then((m) => m.NameMarquee));
const HomePricing = dynamic(() => import("@/components/home/home-pricing").then((m) => m.HomePricing));
const Configurator = dynamic(() =>
  import("@/components/sections/configurator").then((m) => m.Configurator)
);
const LuminaDiagonal = dynamic(() =>
  import("@/components/home/home-diagonals").then((m) => m.LuminaDiagonal)
);
const AboutDiagonal = dynamic(() =>
  import("@/components/home/home-diagonals").then((m) => m.AboutDiagonal)
);
const HomeFaq = dynamic(() => import("@/components/home/home-faq-closing").then((m) => m.HomeFaq));
const HomeClosing = dynamic(() =>
  import("@/components/home/home-faq-closing").then((m) => m.HomeClosing)
);
const SiteFooter = dynamic(() =>
  import("@/components/sections/site-footer").then((m) => m.SiteFooter)
);
// Solo cliente, sin contenido para buscadores.
const LegacyHashRedirect = dynamic(
  () => import("@/components/legacy-hash-redirect").then((m) => m.LegacyHashRedirect),
  { ssr: false }
);
const LuminaChat = dynamic(
  () => import("@/components/lumina-chat").then((m) => m.LuminaChat),
  { ssr: false }
);

// FAQPage con las 4 preguntas visibles de la home, en español (el HTML del
// servidor siempre sale en español: coincide palabra por palabra).
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${SITE_URL}/#faq`,
  url: `${SITE_URL}/`,
  inLanguage: "es-MX",
  mainEntity: DICTIONARIES.es.homeV2.faq.items.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

/**
 * Home en bloques, cada uno con titular, una línea y un botón que funciona:
 * hero → 3 casos con número → precios → configurador → diagonal Lumina →
 * diagonal Nosotros → FAQ → cierre. Sin intro 3D, sin preloader, sin WebGL.
 * El detalle de cada tema vive en su página.
 */
export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <SiteHeader />

      <main id="main-content" tabIndex={-1} className="sheet-main sheet-main--home">
        <HeroPop />
        <HomeCases />
        <NameMarquee />
        <HomePricing />
        <Configurator chapter={0} />
        <LuminaDiagonal />
        <AboutDiagonal />
        <HomeFaq />
        <HomeClosing />
      </main>

      <LuminaChat />
      <LegacyHashRedirect />
      <SiteFooter />
    </>
  );
}
