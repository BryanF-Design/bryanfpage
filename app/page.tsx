"use client";

import type { CSSProperties } from "react";
import dynamic from "next/dynamic";
import { Sparkle } from "lucide-react";
import { HeroPop } from "@/components/sections/hero-pop";
import { StatCounter } from "@/components/ui/stat-counter";
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
const ProjectCases = dynamic(() =>
  import("@/components/sections/projects-showcase").then((m) => m.ProjectCases)
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <ScrollProgress />
      <SiteHeader />

      <main id="main-content" tabIndex={-1} className="sheet-main">
        {/* Hero + cifras: un solo grupo (las tarjetas cuelgan del hero a
            distancia de canal; entre secciones la separación es mayor). */}
        <div className="flex flex-col gap-gutter">
          <HeroPop />

          {/* Cifras reales del estudio, en tarjetas tipo app. En teléfono la
              lima va a todo lo ancho y las otras dos, lado a lado. */}
          <section
            aria-label={t.experience.statsAria}
            className="grid grid-cols-2 gap-gutter sm:grid-cols-3"
          >
            <div data-fx="up" className="col-span-2 min-w-0 sm:col-span-1">
              <div className="panel flex h-full min-h-[10rem] flex-col justify-between gap-5 p-5 shadow-soft sm:min-h-[13.5rem] sm:p-6 md:p-8">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold">{t.experience.statsRecord}</span>
                  <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-lime">
                    2020
                  </span>
                </div>
                <div>
                  <p className="display-xl text-[clamp(3.5rem,16vw,4.5rem)] leading-[0.82] sm:text-[clamp(3.5rem,7.5vw,7.5rem)] lg:text-[clamp(4.5rem,9vw,7.5rem)]">
                    <StatCounter value={5} prefix="+" />
                  </p>
                  <p className="mt-2 text-sm font-semibold text-muted-foreground">
                    {t.trust.years} {t.trust.yearsCaption}
                  </p>
                  <span aria-hidden className="mt-4 flex gap-1.5">
                    {Array.from({ length: 10 }, (_, i) => (
                      <span
                        key={i}
                        className={i < 7 ? "size-2.5 rounded-full bg-lime" : "size-2.5 rounded-full bg-ink/10"}
                      />
                    ))}
                  </span>
                </div>
              </div>
            </div>
            <div data-fx="up" className="min-w-0" style={{ "--fx-delay": "90ms" } as CSSProperties}>
              <div className="panel panel-ink flex h-full min-h-[10rem] flex-col justify-between gap-5 overflow-hidden p-5 sm:min-h-[13.5rem] sm:p-6 md:p-8">
                <div aria-hidden className="mesh-glow-a opacity-70" />
                <Sparkle aria-hidden className="relative h-6 w-6 self-end fill-lime text-lime sm:h-7 sm:w-7" />
                <div className="relative">
                  <p className="display-xl text-[clamp(2.75rem,12vw,4.5rem)] leading-[0.82] text-lime sm:text-[clamp(3.5rem,7.5vw,7.5rem)] lg:text-[clamp(4.5rem,9vw,7.5rem)]">
                    <StatCounter value={100} prefix="+" />
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white/80">
                    {t.trust.projects} {t.trust.projectsCaption}
                  </p>
                </div>
              </div>
            </div>
            <div data-fx="up" className="min-w-0" style={{ "--fx-delay": "180ms" } as CSSProperties}>
              <div className="panel flex h-full min-h-[10rem] flex-col justify-between gap-5 p-5 shadow-soft sm:min-h-[13.5rem] sm:p-6 md:p-8">
                <span aria-hidden className="flex h-10 items-end gap-1.5 self-end sm:h-16 sm:gap-2">
                  {[38, 62, 46, 84, 70, 100].map((h, i) => (
                    <span
                      key={i}
                      style={{ height: `${h}%` }}
                      className={
                        i === 5
                          ? "w-2.5 rounded-full bg-lime sm:w-3.5"
                          : "w-2.5 rounded-full bg-ink/10 sm:w-3.5"
                      }
                    />
                  ))}
                </span>
                <div>
                  {/* "Desde" va como etiqueta sobre la cifra; el pie ya trae la unidad. */}
                  <span className="mb-3 inline-flex rounded-full bg-ink px-3 py-1 text-xs font-semibold text-lime">
                    {t.trust.deliveryPrefix}
                  </span>
                  <p className="display-xl text-[clamp(2.75rem,12vw,4.5rem)] leading-[0.82] sm:text-[clamp(3.5rem,7.5vw,7.5rem)] lg:text-[clamp(4.5rem,9vw,7.5rem)]">
                    <StatCounter value={3} />
                  </p>
                  <p className="mt-2 text-sm font-semibold text-muted-foreground">
                    {t.trust.deliveryCaption}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <ProjectsShowcase withCases={false} />

        <MarqueeBand words={t.marquee.words} outline />

        {/* Casos de estudio: después de la cinta, para que el portafolio no
            sea un solo bloque de tres pantallas. */}
        <ProjectCases />

        <MeetBryan />

        <ProcessOrbital />

        <StackOrbit />

        <LuminaFeature />

        <EntryServices />

        <Configurator />

        {/* El recorrido con Lumina termina en el pago: va después del cotizador
            y así las dos secciones de Lumina no quedan seguidas. */}
        <LuminaJourney />

        <WorldPresence />

        <ClientsMarquee />

        <Faq />

        <ClosingCta />
      </main>

      <LuminaChat />
      <SiteFooter />
    </>
  );
}
