"use client";

import dynamic from "next/dynamic";
import { HeroPop } from "@/components/sections/hero-pop";
import { INTRO_BOOTSTRAP, IntroGate } from "@/components/intro/intro-gate";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { SiteHeader } from "@/components/sections/site-header";
import { MarqueeBand } from "@/components/sections/marquee-band";
import { useLanguage } from "@/lib/i18n/context";
import { DICTIONARIES } from "@/lib/i18n/dictionaries";
import { SITE_URL } from "@/lib/seo/service-pages";
import { STUDIO_FACTS } from "@/lib/catalog";

// Below-the-fold sections: code-split so the initial hydration bundle stays
// small (main lever on mobile TBT). SSR stays on (default) for all of these
// so their text/links are still present in the server HTML for SEO/crawlers
// — only the client JS is deferred into separate chunks.
const HomeCases = dynamic(() => import("@/components/home/home-cases").then((m) => m.HomeCases));
const HomePricing = dynamic(() =>
  import("@/components/home/home-pricing").then((m) => m.HomePricing)
);
const HomeLuminaDiagonal = dynamic(() =>
  import("@/components/home/home-diagonals").then((m) => m.HomeLuminaDiagonal)
);
const HomeAboutDiagonal = dynamic(() =>
  import("@/components/home/home-diagonals").then((m) => m.HomeAboutDiagonal)
);
const ClosingCta = dynamic(() =>
  import("@/components/sections/closing-cta").then((m) => m.ClosingCta)
);
const ProcessOrbital = dynamic(() =>
  import("@/components/sections/process-orbital").then((m) => m.ProcessOrbital)
);
const ClientsMarquee = dynamic(() =>
  import("@/components/sections/clients-marquee").then((m) => m.ClientsMarquee)
);
// El configurador pesa ~47 KB de HTML: en el inicio se arma en el navegador
// (los precios ya van en las tarjetas del HTML para los buscadores) y ocupa
// su lugar desde el principio para que nada salte. /crear-web lo trae completo.
const Configurator = dynamic(
  () => import("@/components/sections/configurator").then((m) => m.Configurator),
  {
    ssr: false,
    loading: () => (
      <div id="configurador" aria-hidden className="panel min-h-[175rem] shadow-soft sm:min-h-[162rem] lg:min-h-[130rem] xl:min-h-[101rem]" />
    ),
  }
);
const Faq = dynamic(() => import("@/components/sections/faq").then((m) => m.Faq));
const SiteFooter = dynamic(() =>
  import("@/components/sections/site-footer").then((m) => m.SiteFooter)
);
// Client-only widgets, no SEO content: skip SSR entirely to shave initial payload.
const LegacyHashRedirect = dynamic(
  () => import("@/components/legacy-hash-redirect").then((m) => m.LegacyHashRedirect),
  { ssr: false }
);
const LuminaChat = dynamic(
  () => import("@/components/lumina-chat").then((m) => m.LuminaChat),
  { ssr: false }
);

/** Clientes con sitio en línea, en la cinta lenta bajo los casos (nombres propios, sin traducir). */
const CLIENT_NAMES = ["CortMart", "MC Spine", "Golden Muuse", "Koi Arquitectura", "Mixteca"];

/**
 * Preguntas clave que se quedan en el inicio (índices del diccionario):
 * tiempos, costos, qué se necesita para empezar y qué se entrega. Todas las
 * demás viven en /contacto.
 */
const KEY_FAQ = [0, 3, 4, 5] as const;

// Las preguntas frecuentes del home como FAQPage (solo las visibles). Se arman
// con el diccionario en español porque el HTML del servidor siempre sale en
// español: el marcado coincide palabra por palabra con lo que lee el rastreador.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${SITE_URL}/#faq`,
  url: `${SITE_URL}/`,
  inLanguage: "es-MX",
  mainEntity: KEY_FAQ.map((i) => DICTIONARIES.es.faq.items[i]).map((item) => ({
    "@type": "Question",
    name: item.title,
    acceptedAnswer: { "@type": "Answer", text: item.content },
  })),
};

/**
 * Inicio: vende en la primera pantalla y luego enamora. Orden: hero con
 * precio y WhatsApp → casos con resultado → precios → configurador → Lumina
 * → proceso → Bryan → marcas → FAQ → cierre. Cada bloque es titular + una
 * línea + un botón; el detalle vive en su página.
 *
 * En escritorio, la primera visita de la sesión abre con la intro 3D (0.8 s,
 * con "Saltar"); en móvil nunca hay intro ni preloader.
 */
export default function HomePage() {
  const { t } = useLanguage();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/* Antes de pintar el hero: decide si la intro corre (escritorio) y deja
          el telón con "Saltar" listo desde el primer instante. */}
      <script dangerouslySetInnerHTML={{ __html: INTRO_BOOTSTRAP }} />
      <IntroGate />
      <ScrollProgress />
      <SiteHeader />

      <main id="main-content" tabIndex={-1} className="sheet-main">
        <HeroPop />

        <HomeCases />

        <MarqueeBand words={CLIENT_NAMES} outline />

        <HomePricing />

        <Configurator chapter={4} sectionId="configurador" />

        <HomeLuminaDiagonal />

        <ProcessOrbital chapter={6} compact />

        <HomeAboutDiagonal />

        <ClientsMarquee />

        <Faq chapter={9} only={KEY_FAQ} moreHref="/contacto#faq" />

        <ClosingCta />
      </main>

      <LuminaChat />
      <LegacyHashRedirect />
      <SiteFooter />
    </>
  );
}
