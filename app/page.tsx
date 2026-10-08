"use client";

import type { CSSProperties } from "react";
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
import { PageFrame } from "@/components/japan/page-frame";
import { SeigaihaRule } from "@/components/japan/seigaiha-rule";
import { useLanguage } from "@/lib/i18n/context";
import { DICTIONARIES } from "@/lib/i18n/dictionaries";
import { SITE_URL } from "@/lib/seo/service-pages";

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

// Las preguntas frecuentes del home como FAQPage. Se arman con el diccionario
// en español porque el HTML del servidor siempre sale en español: el marcado
// coincide palabra por palabra con lo que lee el rastreador.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${SITE_URL}/#faq`,
  url: `${SITE_URL}/`,
  inLanguage: "es-MX",
  mainEntity: DICTIONARIES.es.faq.items.map((item) => ({
    "@type": "Question",
    name: item.title,
    acceptedAnswer: { "@type": "Answer", text: item.content },
  })),
};

export default function HomePage() {
  const { t } = useLanguage();
  const ignitionBootstrap = `(function(){try{document.documentElement.dataset.ignitionSeen=sessionStorage.getItem(${JSON.stringify(
    IGNITION_STORAGE_KEY
  )})==="1"?"1":"0"}catch(e){document.documentElement.dataset.ignitionSeen="0"}})();`;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: ignitionBootstrap }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <noscript>
        <style>{`.ignition-loader{display:none!important}`}</style>
      </noscript>
      <IgnitionPreloader />
      {/* La hoja: el paspartú washi en el que se recortan paneles y cabecera. */}
      <PageFrame />
      <ScrollProgress />
      <SiteHeader />

      <main id="main-content" tabIndex={-1} className="sheet-main">
        <Hero
          id="home"
          eyebrow={t.hero.eyebrow}
          title={
            <>
              <span className="hero-line" style={{ "--hd": "220ms" } as CSSProperties}>
                <span>{t.hero.titlePrefix}</span>
              </span>
              <span className="hero-line" style={{ "--hd": "330ms" } as CSSProperties}>
                <span className="text-primary">{t.hero.titleHighlight}</span>
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

        {/* Pit board con cifras reales, en tres fichas que entran de golpe.
            Ningún dato automotriz inventado. */}
        <section aria-label={t.experience.statsAria} className="relative">
          <div className="grid gap-gutter sm:grid-cols-3">
            <div data-fx="rise" className="min-w-0">
              <div className="panel panel-lime group flex h-full min-h-[15rem] flex-col justify-between overflow-hidden p-6 sm:min-h-[18rem] md:p-8">
                <div className="flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.2em]">
                  <span>{t.experience.statsRecord}</span>
                  <span className="rounded-full bg-[hsl(150_42%_6%)] px-2.5 py-1 text-[hsl(76_76%_58%)]">Est. 2020</span>
                </div>
                <dl className="flex flex-col-reverse gap-2">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.18em]">
                    {t.trust.years} · {t.trust.yearsCaption}
                  </dt>
                  <dd className="display-xl text-[clamp(5rem,13vw,10rem)] leading-[0.8] transition-transform duration-500 group-hover:-translate-y-1">
                    <StatCounter value={5} prefix="+" />
                  </dd>
                </dl>
              </div>
            </div>
            <div data-fx="rise" className="min-w-0" style={{ "--fx-delay": "110ms" } as CSSProperties}>
              <div className="panel group flex h-full min-h-[15rem] flex-col justify-between overflow-hidden p-6 sm:min-h-[18rem] md:p-8">
                <div aria-hidden className="dot-grid absolute inset-0 rounded-[inherit] opacity-40 [mask-image:linear-gradient(135deg,black,transparent_70%)]" />
                <span aria-hidden lang="ja" className="relative self-end font-jp text-2xl text-primary/70">記録</span>
                <dl className="relative flex flex-col-reverse gap-2">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    {t.trust.projects} · {t.trust.projectsCaption}
                  </dt>
                  <dd className="display-xl text-[clamp(5rem,13vw,10rem)] leading-[0.8] text-foreground transition-transform duration-500 group-hover:-translate-y-1">
                    <StatCounter value={100} prefix="+" />
                  </dd>
                </dl>
              </div>
            </div>
            <div data-fx="rise" className="min-w-0" style={{ "--fx-delay": "220ms" } as CSSProperties}>
              <div className="panel panel-moss group flex h-full min-h-[15rem] flex-col justify-between overflow-hidden p-6 sm:min-h-[18rem] md:p-8">
                <span aria-hidden className="size-3 self-end rounded-full bg-signal shadow-[0_0_16px_hsl(var(--signal)/0.7)]" />
                <dl className="flex flex-col-reverse gap-2">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    {t.trust.deliveryPrefix} · {t.trust.deliveryCaption}
                  </dt>
                  <dd className="display-xl flex items-end gap-3 text-[clamp(5rem,13vw,10rem)] leading-[0.8] text-foreground transition-transform duration-500 group-hover:-translate-y-1">
                    <StatCounter value={3} />
                    <span className="pb-[0.08em] text-[0.42em] text-primary">{t.trust.days}</span>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* El trabajo aparece antes que el relato: capacidad primero. */}
        <ProjectsShowcase />

        <MarqueeBand words={t.marquee.words} angle={-2.2} />

        {/* Puente de autor: una sola historia de precisión, ritmo y conexión. */}
        <MeetBryan />

        {/* Tras demostrar capacidad y presentar al autor, explicamos el oficio. */}
        <ProcessOrbital />

        <StackOrbit />

        {/* 青海波: la costura se ensancha y deja ver las olas de la hoja. */}
        <SeigaihaRule />

        {/* Lumina guía el tramo comercial sin desplazar el trabajo real. */}
        <LuminaFeature />

        {/* Narrativa por pasos: cómo Lumina te lleva de la idea al proyecto. */}
        <LuminaJourney />

        {/* Qué ofrecemos → cotiza y paga. Servicios y cotizador quedan juntos
            para que descubrir la oferta y armar el proyecto sea un solo tramo. */}
        <SeigaihaRule />

        <EntryServices />

        <Configurator />

        {/* Alcance y confianza después de entender la oferta. */}
        <WorldPresence />

        <ClientsMarquee />

        <MarqueeBand words={t.marquee.words} reverse outline angle={1.8} />

        {/* Dudas y cierre. */}
        <Faq />

        <SeigaihaRule signal />

        {/* Después del cierre comercial solo queda la firma del footer. */}
        <ClosingCta />
      </main>

      <LuminaChat />
      <SiteFooter />
    </>
  );
}
