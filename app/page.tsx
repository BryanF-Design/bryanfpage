import { Hero } from "@/components/ui/hero";
import { StatCounter } from "@/components/ui/stat-counter";
import { SiteHeader } from "@/components/sections/site-header";
import { AboutPhoto } from "@/components/sections/about-photo";
import { ClosingCta } from "@/components/sections/closing-cta";
import { SocialRail } from "@/components/social-rail";
import { ProcessOrbital } from "@/components/sections/process-orbital";
import { StackOrbit } from "@/components/sections/stack-orbit";
import { ProjectsParallax } from "@/components/sections/projects-parallax";
import { ProjectsShowcase } from "@/components/sections/projects-showcase";
import { WorldPresence } from "@/components/sections/world-presence";
import { ClientsMarquee } from "@/components/sections/clients-marquee";
import { Configurator } from "@/components/sections/configurator";
import { Faq } from "@/components/sections/faq";
import { SiteFooter } from "@/components/sections/site-footer";
import { LuminaChat } from "@/components/lumina-chat";

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
      <section className="border-y border-border bg-secondary/30">
        <div className="container flex flex-col items-center justify-between gap-6 py-10 text-center sm:flex-row sm:text-left">
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
