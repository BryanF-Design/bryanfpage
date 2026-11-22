"use client";

import type { CSSProperties } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowUpRight, Globe2 } from "lucide-react";
import { DeviceIntro } from "@/components/intro/device-intro";
import { HeroPop } from "@/components/sections/hero-pop";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { SiteHeader } from "@/components/sections/site-header";
import { MarqueeBand } from "@/components/sections/marquee-band";
import { useLanguage } from "@/lib/i18n/context";
import { DICTIONARIES } from "@/lib/i18n/dictionaries";
import { SITE_URL } from "@/lib/seo/service-pages";

// Below-the-fold sections: code-split so the initial hydration bundle stays
// small (main lever on mobile TBT). SSR stays on (default) for all of these
// so their text/links are still present in the server HTML for SEO/crawlers
// — only the client JS is deferred into separate chunks.
const ClosingCta = dynamic(() =>
  import("@/components/sections/closing-cta").then((m) => m.ClosingCta)
);
const ProcessOrbital = dynamic(() =>
  import("@/components/sections/process-orbital").then((m) => m.ProcessOrbital)
);
const SocialProof = dynamic(() =>
  import("@/components/home/social-proof").then((m) => m.SocialProof)
);
const HomePricing = dynamic(() =>
  import("@/components/home/home-pricing").then((m) => m.HomePricing)
);
const HomeTeasers = dynamic(() =>
  import("@/components/sections/home-teasers").then((m) => m.HomeTeasers)
);
const ClientsMarquee = dynamic(() =>
  import("@/components/sections/clients-marquee").then((m) => m.ClientsMarquee)
);
const EntryServices = dynamic(() =>
  import("@/components/sections/entry-services").then((m) => m.EntryServices)
);
const Configurator = dynamic(() =>
  import("@/components/sections/configurator").then((m) => m.Configurator)
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

/**
 * Preguntas clave que se quedan en el inicio (índices del diccionario):
 * tiempos, costos, qué se necesita para empezar y qué se entrega. Todas las
 * demás viven en /contacto.
 */
const KEY_FAQ = [0, 3, 4, 5] as const;

/** Clientes con su sitio en línea (nombres reales) para la cinta. */
const CLIENT_NAMES = [
  "CortMart",
  "MC Spine",
  "Golden Muuse",
  "Koi Arquitectura",
  "Mixteca",
  "Efficient Plasticolors",
  "NKMOH Café",
  "Gecomex",
];

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

// En teléfono (o pantalla vertical) la intro no corre: el hero entra directo.
const INTRO_BOOTSTRAP = `(function(){try{var d=document.documentElement;var r=window.matchMedia("(prefers-reduced-motion: reduce)").matches||d.classList.contains("a11y-reduce-motion");var m=window.matchMedia("(max-width: 767px), (max-aspect-ratio: 3/4)").matches;d.dataset.intro=(r||m)?"off":"pending"}catch(e){}})();`;

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/* Antes de pintar el hero: si la intro va a correr, su entrada espera a
          que la cámara entre a la pantalla (`html[data-intro="pending"]`). */}
      <script dangerouslySetInnerHTML={{ __html: INTRO_BOOTSTRAP }} />
      <noscript>
        <style>{`.device-intro{display:none!important}`}</style>
      </noscript>
      <ScrollProgress />
      <SiteHeader />

      {/* Intro: laptop (o teléfono) que se enciende con el preloader en
          pantalla; al deslizar, la cámara entra y aparece la web. */}
      <DeviceIntro />

      <main id="main-content" tabIndex={-1} className="sheet-main">
        {/* Hero + presencia: un solo grupo. Las cifras viven en los casos. */}
        <div className="flex flex-col gap-gutter">
          <HeroPop />

          {/* Presencia: una sola línea (el mapa completo está en /contacto). */}
          <Link
            href="/contacto#presencia"
            data-fx="up"
            style={{ "--fx-delay": "240ms" } as CSSProperties}
            className="group flex min-h-14 items-center gap-3 rounded-full bg-white py-1.5 pl-1.5 pr-2 shadow-soft transition-transform duration-200 hover:-translate-y-0.5 sm:col-span-3"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-lime">
              <Globe2 aria-hidden className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1 text-pretty text-sm font-semibold leading-snug text-ink sm:text-base">
              {t.home.presence}
            </span>
            <span className="hidden text-sm font-semibold text-ink/60 sm:inline">{t.home.presenceLink}</span>
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-lime text-ink">
              <ArrowUpRight aria-hidden className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
            </span>
          </Link>
        </div>

        {/* Prueba social: 3 casos grandes con resultado (antes, la tira de 7
            miniaturas y las cifras sueltas). */}
        <SocialProof />

        {/* Nombres de clientes en Fraunces, cinta lenta solo con CSS. */}
        <MarqueeBand words={CLIENT_NAMES} outline />

        {/* Precios a la vista: Landing, Sitio completo y Software. */}
        <HomePricing />

        <Configurator chapter={5} />

        {/* Bryan y Lumina, en corto: su historia completa vive en /conoceme y
            /lumina. */}
        <HomeTeasers />

        <ProcessOrbital chapter={3} />

        <EntryServices chapter={4} />

        <ClientsMarquee />

        <Faq chapter={6} only={KEY_FAQ} moreHref="/contacto#faq" />

        <ClosingCta />
      </main>

      <LuminaChat />
      <LegacyHashRedirect />
      <SiteFooter />
    </>
  );
}
