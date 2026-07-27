"use client";

import dynamic from "next/dynamic";
import { Hero } from "@/components/ui/hero";
import { StatCounter } from "@/components/ui/stat-counter";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { SiteHeader } from "@/components/sections/site-header";
import { MarqueeBand } from "@/components/sections/marquee-band";
import { SocialRail } from "@/components/social-rail";
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

  return (
    <main id="home" className="relative">
      <ScrollProgress />
      <SiteHeader />
      <SocialRail />

      <Hero
        eyebrow={t.hero.eyebrow}
        title={
          <>
            {t.hero.titlePrefix} <span className="text-primary">{t.hero.titleHighlight}</span>
          </>
        }
        subtitle={t.hero.subtitle}
        scrollHint={t.hero.scrollHint}
        actions={[
          { label: t.nav.armaTuWeb, href: "#precios", variant: "default" },
          { label: t.nav.verProyectos, href: "#projects", variant: "outline" },
        ]}
      />

      {/* Prueba rápida: cifras legibles, sin otra escena compitiendo con el hero. */}
      <section className="relative overflow-hidden border-b border-border">
        <div aria-hidden className="mesh-glow-b opacity-50" />
        <div className="container relative grid grid-cols-3 divide-x divide-border">
          <div className="flex flex-col gap-1 py-6 pr-3 sm:py-8 sm:pr-8">
            <p className="font-display text-2xl font-bold text-foreground sm:text-3xl md:text-4xl xl:text-5xl">
              <StatCounter value={5} prefix="+" />
            </p>
            <p className="tech-label text-muted-foreground">
              <span className="sm:hidden">{t.trust.years}</span>
              <span className="hidden sm:inline">
                {t.trust.years} {t.trust.yearsCaption}
              </span>
            </p>
          </div>
          <div className="flex flex-col gap-1 px-3 py-6 sm:px-8 sm:py-8">
            <p className="font-display text-2xl font-bold text-foreground sm:text-3xl md:text-4xl xl:text-5xl">
              <StatCounter value={100} prefix="+" />
            </p>
            <p className="tech-label text-muted-foreground">
              <span className="sm:hidden">{t.trust.projects}</span>
              <span className="hidden sm:inline">
                {t.trust.projects} — {t.trust.projectsCaption}
              </span>
            </p>
          </div>
          <div className="flex flex-col gap-1 py-6 pl-3 sm:py-8 sm:pl-8">
            <p className="font-display text-2xl font-bold text-foreground sm:text-3xl md:text-4xl xl:text-5xl">
              <span className="hidden sm:inline">{t.trust.deliveryPrefix} </span>
              <StatCounter value={3} /> {t.trust.days}
            </p>
            <p className="tech-label text-muted-foreground">{t.trust.deliveryCaption}</p>
          </div>
        </div>
      </section>

      {/* El trabajo aparece antes que el relato: capacidad primero. */}
      <ProjectsShowcase />

      {/* Puente de autor: una sola historia de precisión, ritmo y conexión. */}
      <MeetBryan />

      <MarqueeBand words={t.marquee.words} />

      <ProcessOrbital />

      <StackOrbit />

      <LuminaFeature />

      <WorldPresence />

      <Configurator />

      <ClientsMarquee />

      <MarqueeBand words={t.marquee.words} reverse outline />

      <Faq />

      <LuminaChat />

      {/* Después del cierre comercial solo queda la firma del footer. */}
      <ClosingCta />
      <SiteFooter />
    </main>
  );
}
