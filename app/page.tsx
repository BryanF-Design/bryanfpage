import Link from "next/link";
import Image from "next/image";

import { Hero } from "@/components/ui/hero";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/sections/site-header";
import { ProcessOrbital } from "@/components/sections/process-orbital";
import { StackOrbit } from "@/components/sections/stack-orbit";
import { ProjectsParallax } from "@/components/sections/projects-parallax";
import { ProjectsShowcase } from "@/components/sections/projects-showcase";
import { WorldPresence } from "@/components/sections/world-presence";
import { Faq } from "@/components/sections/faq";

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
          { label: "Ver proyectos", href: "#projects", variant: "default" },
          {
            label: "Hablar por WhatsApp",
            href: WHATSAPP,
            variant: "outline",
          },
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
            <p className="text-sm text-muted-foreground">
              hábiles de entrega
            </p>
          </div>
        </div>
      </section>

      <ProcessOrbital />

      <StackOrbit />

      <ProjectsParallax />

      <ProjectsShowcase />

      <WorldPresence />

      <Faq />

      {/* Closing CTA */}
      <section className="border-t border-border py-24 md:py-32">
        <div className="container flex flex-col items-center gap-6 text-center">
          <h2 className="max-w-2xl font-display text-4xl font-semibold tracking-tight md:text-5xl">
            ¿Listo para que tu marca se vea como lo que vale?
          </h2>
          <p className="max-w-xl text-muted-foreground">
            Cuéntanos tu idea y la convertimos en una web que vende. Proyectos
            desde $3,500 MXN.
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                Empezar mi proyecto
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#proceso">Ver el proceso</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="container flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <Image
            src="/img/logotipo-blanco-320.png"
            alt="BryanF Design"
            width={132}
            height={33}
            className="h-8 w-auto"
          />
          <span>© {new Date().getFullYear()} BryanF Design · Hecho en México</span>
        </div>
      </footer>
    </main>
  );
}
