"use client";

import dynamic from "next/dynamic";
import { Hero } from "@/components/ui/hero";
import { StatCounter } from "@/components/ui/stat-counter";
import { SiteHeader } from "@/components/sections/site-header";
import { SocialRail } from "@/components/social-rail";
import { useLanguage } from "@/lib/i18n/context";

// Below-the-fold sections: code-split so the initial hydration bundle stays
// small (main lever on mobile TBT). SSR stays on (default) for all of these
// so their text/links are still present in the server HTML for SEO/crawlers
// — only the client JS is deferred into separate chunks.
const AboutPhoto = dynamic(() =>
  import("@/components/sections/about-photo").then((m) => m.AboutPhoto)
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
const Configurator = dynamic(() =>
  import("@/components/sections/configurator").then((m) => m.Configurator)
);
const Faq = dynamic(() => import("@/components/sections/faq").then((m) => m.Faq));
const SiteFooter = dynamic(() =>
  import("@/components/sections/site-footer").then((m) => m.SiteFooter)
);
// Client-only widget, no SEO content: skip SSR entirely to shave initial payload.
const LuminaChat = dynamic(
  () => import("@/components/lumina-chat").then((m) => m.LuminaChat),
  { ssr: false }
);

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <main id="home" className="relative">
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

      {/* Franja de datos: cifras en display expandido sobre hairlines. */}
      <section className="relative overflow-hidden border-b border-border">
        <div aria-hidden className="mesh-glow-b opacity-50" />
        <div className="container relative grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="flex flex-col gap-1 py-8 sm:pr-8">
            <p className="font-display text-3xl font-bold text-foreground md:text-4xl xl:text-5xl">
              <StatCounter value={5} prefix="+" />
            </p>
            <p className="tech-label text-muted-foreground">
              {t.trust.years} {t.trust.yearsCaption}
            </p>
          </div>
          <div className="flex flex-col gap-1 py-8 sm:px-8">
            <p className="font-display text-3xl font-bold text-foreground md:text-4xl xl:text-5xl">
              <StatCounter value={100} prefix="+" />
            </p>
            <p className="tech-label text-muted-foreground">
              {t.trust.projects} — {t.trust.projectsCaption}
            </p>
          </div>
          <div className="flex flex-col gap-1 py-8 sm:pl-8">
            <p className="font-display text-3xl font-bold text-foreground md:text-4xl xl:text-5xl">
              {t.trust.deliveryPrefix} <StatCounter value={3} /> {t.trust.days}
            </p>
            <p className="tech-label text-muted-foreground">
              {t.trust.deliveryCaption}
            </p>
          </div>
        </div>
      </section>

      <ProcessOrbital />

      <StackOrbit />

      <ProjectsShowcase />

      <WorldPresence />

      <ClientsMarquee />

      <Configurator />

      <Faq />

      <ClosingCta />

      <AboutPhoto />

      <SiteFooter />

      <LuminaChat />
    </main>
  );
}
