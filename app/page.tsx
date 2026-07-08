import dynamic from "next/dynamic";
import { Hero } from "@/components/ui/hero";
import { StatCounter } from "@/components/ui/stat-counter";
import { SiteHeader } from "@/components/sections/site-header";
import { SocialRail } from "@/components/social-rail";

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
const ProjectsParallax = dynamic(() =>
  import("@/components/sections/projects-parallax").then((m) => m.ProjectsParallax)
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
  return (
    <main id="home" className="relative">
      <SiteHeader />
      <SocialRail />

      <Hero
        eyebrow="Diseño y desarrollo web en México"
        title={
          <>
            Haz que <span className="text-primary">pase.</span>
          </>
        }
        subtitle="Creamos tu página web a medida: rápida, animada y orientada a conversión. Estrategia, performance y SEO real para que tu sitio se vea increíble y venda."
        actions={[
          { label: "Arma tu web", href: "#precios", variant: "default" },
          { label: "Ver proyectos", href: "#projects", variant: "outline" },
        ]}
      />

      {/* Trust strip */}
      <section className="relative overflow-hidden border-y border-white/10">
        <div aria-hidden className="mesh-glow-b opacity-60" />
        <div className="glass relative container my-6 flex flex-col items-center justify-between gap-6 rounded-2xl px-6 py-10 text-center sm:flex-row sm:text-left">
          <div className="transition-transform duration-300 hover:-translate-y-0.5">
            <p className="font-display text-3xl font-semibold text-foreground">
              <StatCounter value={5} prefix="+" />{" "}años
            </p>
            <p className="text-sm text-muted-foreground">de experiencia</p>
          </div>
          <div className="h-px w-16 bg-border sm:h-12 sm:w-px" />
          <div className="transition-transform duration-300 hover:-translate-y-0.5">
            <p className="font-display text-3xl font-semibold text-foreground">
              <StatCounter value={100} prefix="+" />{" "}proyectos
            </p>
            <p className="text-sm text-muted-foreground">
              digitales impulsados con éxito
            </p>
          </div>
          <div className="h-px w-16 bg-border sm:h-12 sm:w-px" />
          <div className="transition-transform duration-300 hover:-translate-y-0.5">
            <p className="font-display text-3xl font-semibold text-foreground">
              Desde <StatCounter value={3} /> días
            </p>
            <p className="text-sm text-muted-foreground">hábiles de entrega</p>
          </div>
        </div>
      </section>

      <ProcessOrbital />

      <StackOrbit />

      <ProjectsParallax />

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
