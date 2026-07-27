"use client";

import dynamic from "next/dynamic";
import { Hero } from "@/components/ui/hero";
import { StatCounter } from "@/components/ui/stat-counter";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { SiteHeader } from "@/components/sections/site-header";
import { MarqueeBand } from "@/components/sections/marquee-band";
import {
  IGNITION_STORAGE_KEY,
  IgnitionPreloader,
} from "@/components/japan/ignition-preloader";
import { useLanguage } from "@/lib/i18n/context";

// Below-the-fold sections: code-split so the initial hydration bundle stays
// small (main lever on mobile TBT). SSR stays on (default) for all of these
// so their text/links are still present in the server HTML for SEO/crawlers
// — only the client JS is deferred into separate chunks.
const MeetBryan = dynamic(() =>
  import("@/components/sections/meet-bryan").then((m) => m.MeetBryan)
);
const ClosingCta = dynamic(() =>
  import("@/components/sections/closing-cta").then((m) => m.ClosingCta)
);
const ProcessOrbital = dynamic(() =>
  import("@/components/sections/process-orbital").then((m) => m.ProcessOrbital)
);
const StackOrbit = dynamic(() =>
  import("@/components/sections/stack-orbit").then((m) => m.StackOrbit)
);
const ProjectsShowcase = dynamic(() =>
  import("@/components/sections/projects-showcase").then((m) => m.ProjectsShowcase)
);
const WorldPresence = dynamic(() =>
  import("@/components/sections/world-presence").then((m) => m.WorldPresence)
);
const ClientsMarquee = dynamic(() =>
  import("@/components/sections/clients-marquee").then((m) => m.ClientsMarquee)
);
const LuminaFeature = dynamic(() =>
  import("@/components/sections/lumina-feature").then((m) => m.LuminaFeature)
);
const LuminaJourney = dynamic(() =>
  import("@/components/sections/lumina-journey").then((m) => m.LuminaJourney)
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
const LuminaChat = dynamic(
  () => import("@/components/lumina-chat").then((m) => m.LuminaChat),
  { ssr: false }
);

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
      <ScrollProgress />
      <SiteHeader />

      <main id="main-content" tabIndex={-1} className="relative">
        <Hero
          id="home"
          eyebrow={t.hero.eyebrow}
          title={
            <>
              <span className="block">{t.hero.titlePrefix}</span>
              <span className="block text-primary drop-shadow-[0_0_32px_hsl(var(--primary)/0.14)]">
                {t.hero.titleHighlight}
              </span>
            </>
          }
          subtitle={t.hero.subtitle}
          scrollHint={t.hero.scrollHint}
          actions={[
            { label: t.nav.armaTuWeb, href: "#precios", variant: "default" },
            { label: t.nav.verProyectos, href: "#projects", variant: "outline" },
          ]}
        />

        {/* Pit board con cifras reales. Ningún dato automotriz inventado. */}
        <section
          aria-label={t.experience.statsAria}
          className="relative overflow-hidden border-y border-border bg-card/45"
        >
          <div aria-hidden className="japan-halftone absolute inset-0 opacity-10" />
          <div className="container relative">
            <div className="flex items-center justify-between border-b border-border py-3 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground sm:text-[10px]">
              <span>{t.experience.statsRecord}</span>
              <span className="inline-flex items-center gap-2 text-primary">
                <span className="size-1.5 bg-signal" />
                Est. 2020
              </span>
            </div>
            <dl className="grid grid-cols-3 divide-x divide-border">
              <div className="group flex flex-col gap-1 py-6 pr-3 sm:py-9 sm:pr-8">
                <dt className="order-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground sm:text-[10px]">
                  {t.trust.years} <span className="hidden sm:inline">{t.trust.yearsCaption}</span>
                </dt>
                <dd className="order-1 font-display text-3xl font-bold leading-none text-foreground sm:text-4xl md:text-5xl xl:text-6xl">
                  <StatCounter value={5} prefix="+" />
                </dd>
              </div>
              <div className="group flex flex-col gap-1 px-3 py-6 sm:px-8 sm:py-9">
                <dt className="order-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground sm:text-[10px]">
                  {t.trust.projects} <span className="hidden sm:inline">{t.trust.projectsCaption}</span>
                </dt>
                <dd className="order-1 font-display text-3xl font-bold leading-none text-foreground sm:text-4xl md:text-5xl xl:text-6xl">
                  <StatCounter value={100} prefix="+" />
                </dd>
              </div>
              <div className="group flex flex-col gap-1 py-6 pl-3 sm:py-9 sm:pl-8">
                <dt className="order-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground sm:text-[10px]">
                  {t.trust.deliveryCaption}
                </dt>
                <dd className="order-1 font-display text-3xl font-bold leading-none text-foreground sm:text-4xl md:text-5xl xl:text-6xl">
                  <span className="hidden sm:inline">{t.trust.deliveryPrefix} </span>
                  <StatCounter value={3} /> <span className="text-primary">{t.trust.days}</span>
                </dd>
              </div>
            </dl>
          </div>
        </section>

      {/* El trabajo aparece antes que el relato: capacidad primero. */}
      <ProjectsShowcase />

      {/* Puente de autor: una sola historia de precisión, ritmo y conexión. */}
      <MeetBryan />

      <MarqueeBand words={t.marquee.words} />

      {/* Tras demostrar capacidad y presentar al autor, explicamos el oficio. */}
      <ProcessOrbital />

      <StackOrbit />

      {/* Lumina guía el tramo comercial sin desplazar el trabajo real. */}
      <LuminaFeature />

      {/* Narrativa por pasos: cómo Lumina te lleva de la idea al proyecto. */}
      <LuminaJourney />

      {/* Qué ofrecemos → cotiza y paga. Servicios y cotizador quedan juntos
          para que descubrir la oferta y armar el proyecto sea un solo tramo. */}
      <EntryServices />

      <Configurator />

      {/* Alcance y confianza después de entender la oferta. */}
      <WorldPresence />

      <ClientsMarquee />

      <MarqueeBand words={t.marquee.words} reverse outline />

      {/* Dudas y cierre. */}
      <Faq />

      {/* Después del cierre comercial solo queda la firma del footer. */}
      <ClosingCta />
      </main>

      <LuminaChat />
      <SiteFooter />
    </>
  );
}
