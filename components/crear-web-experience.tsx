"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft } from "lucide-react";

import { SiteHeader } from "@/components/sections/site-header";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { Configurator } from "@/components/sections/configurator";
import { useLanguage } from "@/lib/i18n/context";

const SiteFooter = dynamic(() =>
  import("@/components/sections/site-footer").then((m) => m.SiteFooter)
);
// Widget cliente sin contenido SEO: sin SSR para no cargar el bundle de más.
const LuminaChat = dynamic(
  () => import("@/components/lumina-chat").then((m) => m.LuminaChat),
  { ssr: false }
);

/**
 * Página propia del cotizador. El Configurador vive también en la home
 * (`/#precios`), pero aquí tiene URL, encabezado y metadatos propios: es la
 * página que Lumina recomienda y que se puede compartir para "cotiza y paga".
 */
export function CrearWebExperience() {
  const { t } = useLanguage();

  return (
    <main className="relative">
      <ScrollProgress />
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-border pb-10 pt-28 md:pt-36">
        <div aria-hidden className="mesh-glow-a opacity-50" />
        <div className="container relative">
          <Link
            href="/"
            className="tech-label inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.nav.inicio}
          </Link>
          <p className="tech-label mt-6 inline-flex items-center gap-3 text-primary">
            <span className="h-1.5 w-1.5 bg-primary" />
            {t.configurator.eyebrow}
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-5xl xl:text-6xl">
            {t.configurator.title}
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-muted-foreground md:text-lg">
            {t.configurator.subtitle}
          </p>
        </div>
      </section>

      <Configurator hideHeading />

      <SiteFooter />
      <LuminaChat />
    </main>
  );
}
