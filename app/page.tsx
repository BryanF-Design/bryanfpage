"use client";

import dynamic from "next/dynamic";

import { HeroEditorial } from "@/components/sections/hero-editorial";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { SiteHeader } from "@/components/sections/site-header";
import { MarqueeBand } from "@/components/sections/marquee-band";
import {
  IGNITION_STORAGE_KEY,
  IgnitionPreloader,
} from "@/components/japan/ignition-preloader";
import { PageFrame } from "@/components/japan/page-frame";
import { useLanguage } from "@/lib/i18n/context";

// Below-the-fold sections: code-split so the initial hydration bundle stays
// small (main lever on mobile TBT). SSR stays on (default) for all of these
// so their text/links are still present in the server HTML for SEO/crawlers
// — only the client JS is deferred into separate chunks.
const CapabilityBand = dynamic(() =>
  import("@/components/sections/capability-band").then((m) => m.CapabilityBand)
);
const CivicChapter = dynamic(() =>
  import("@/components/sections/civic-chapter").then((m) => m.CivicChapter)
);
const WorkGrid = dynamic(() =>
  import("@/components/sections/work-grid").then((m) => m.WorkGrid)
);
const StackStrip = dynamic(() =>
  import("@/components/sections/stack-strip").then((m) => m.StackStrip)
);
const AboutChapter = dynamic(() =>
  import("@/components/sections/about-chapter").then((m) => m.AboutChapter)
);
const LuminaChapter = dynamic(() =>
  import("@/components/sections/lumina-chapter").then((m) => m.LuminaChapter)
);
const ServicesList = dynamic(() =>
  import("@/components/sections/services-list").then((m) => m.ServicesList)
);
const Configurator = dynamic(() =>
  import("@/components/sections/configurator").then((m) => m.Configurator)
);
const TrustBand = dynamic(() =>
  import("@/components/sections/trust-band").then((m) => m.TrustBand)
);
const ClosingChapter = dynamic(() =>
  import("@/components/sections/closing-chapter").then((m) => m.ClosingChapter)
);
const SiteFooter = dynamic(() =>
  import("@/components/sections/site-footer").then((m) => m.SiteFooter)
);
// Client-only widget, no SEO content: skip SSR entirely to shave initial payload.
const LuminaChat = dynamic(
  () => import("@/components/lumina-chat").then((m) => m.LuminaChat),
  { ssr: false }
);

/**
 * 版面 — el recorrido.
 *
 * Antes eran veinte bloques: hero de 218svh, banda de cifras, portafolio con
 * seis dossieres abiertos, autor, marquesina, proceso, stack, olas, Lumina,
 * recorrido de Lumina, olas, servicios, cotizador, presencia, marcas, otra
 * marquesina, más olas, FAQ y cierre. Leerlo entero era un trabajo.
 *
 * Ahora son nueve capítulos numerados —章 01/07 más portada y proceso— y todo
 * lo que no hace falta para decidir vive plegado dentro del capítulo al que
 * pertenece. La página sigue teniendo exactamente la misma información: lo
 * que cambió es cuánta se te enseña de golpe.
 */
export default function HomePage() {
  const { t } = useLanguage();
  const ignitionBootstrap = `(function(){try{document.documentElement.dataset.ignitionSeen=sessionStorage.getItem(${JSON.stringify(
    IGNITION_STORAGE_KEY
  )})==="1"?"1":"0"}catch(e){document.documentElement.dataset.ignitionSeen="0"}})();`;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: ignitionBootstrap }} />
      <noscript>
        <style>{`.ignition-loader{display:none!important}`}</style>
      </noscript>
      <IgnitionPreloader />
      {/* El marco que el preloader acaba de trazar. Es el mismo rectángulo:
          mismo inset, mismas marcas de registro. */}
      <PageFrame />
      <ScrollProgress />
      <SiteHeader />

      <main id="main-content" tabIndex={-1} className="relative">
        {/* Portada: titular, rostro y cifras. Una pantalla. */}
        <HeroEditorial />

        {/* El índice del recorrido: cinco pasos, cinco destinos. */}
        <CapabilityBand />

        {/* 章 01 — de dónde sale la manera de trabajar. Aquí vive el Civic. */}
        <CivicChapter />

        {/* 章 02 — la evidencia, antes que el relato. */}
        <WorkGrid />

        {/* Pie del capítulo de trabajo: con qué está hecho. */}
        <StackStrip />

        {/* La hoja de papel: quién firma esto. */}
        <AboutChapter />

        <MarqueeBand words={t.marquee.words} />

        {/* 章 03 — Lumina guía el tramo comercial. */}
        <LuminaChapter />

        {/* 章 04 y 05 — qué se ofrece y cuánto cuesta, uno detrás del otro. */}
        <ServicesList />

        <Configurator />

        {/* 章 06 — alcance y confianza, ya con la oferta entendida. */}
        <TrustBand />

        {/* 章 07 — dudas y última acción, en el mismo bloque. */}
        <ClosingChapter />
      </main>

      <LuminaChat />
      <SiteFooter />
    </>
  );
}
