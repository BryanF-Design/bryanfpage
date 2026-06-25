import Link from "next/link";

import { Hero } from "@/components/ui/hero";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/sections/site-header";
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

const WHATSAPP = "https://wa.me/525663012505";

export default function HomePage() {
  return (
    <main id="home" className="relative">
      <SiteHeader />

      <Hero
        eyebrow="BryanF Design"
        title={
          <>
            Haz que <span className="text-primary">pase.</span>
          </>
        }
        subtitle="Webs rápidas, animadas y orientadas a conversión. Estrategia, performance y SEO real para que tu sitio se vea increíble y venda."
        actions={[
          { label: "Arma tu web", href: "#precios", variant: "default" },
          { label: "Ver proyectos", href: "#projects", variant: "outline" },
        ]}
      />

      {/* Trust strip */}
      <section className="border-y border-border bg-secondary/30">
        <div className="container flex flex-col items-center justify-between gap-6 py-10 text-center sm:flex-row sm:text-left">
          <div>
            <p className="font-display text-3xl font-semibold text-foreground">
              +5 años
            </p>
            <p className="text-sm text-muted-foreground">de experiencia</p>
          </div>
          <div className="h-px w-16 bg-border sm:h-12 sm:w-px" />
          <div>
            <p className="font-display text-3xl font-semibold text-foreground">
              +100 proyectos
            </p>
            <p className="text-sm text-muted-foreground">
              digitales impulsados con éxito
            </p>
          </div>
          <div className="h-px w-16 bg-border sm:h-12 sm:w-px" />
          <div>
            <p className="font-display text-3xl font-semibold text-foreground">
              Desde 3 días
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

      {/* Closing CTA */}
      <section className="border-t border-border py-24 md:py-32">
        <div className="container flex flex-col items-center gap-6 text-center">
          <h2 className="max-w-2xl font-display text-4xl font-semibold tracking-tight md:text-5xl">
            ¿Listo para que tu marca se vea como lo que vale?
          </h2>
          <p className="max-w-xl text-muted-foreground">
            Arma tu web, elige cómo pagar (tarjeta, Mercado Pago o transferencia)
            y arrancamos. Proyectos desde $3,500 MXN.
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="#precios">Arma tu web</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                WhatsApp directo
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />

      <LuminaChat />
    </main>
  );
}
