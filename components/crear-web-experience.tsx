"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft } from "lucide-react";

import { SiteHeader } from "@/components/sections/site-header";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { Configurator } from "@/components/sections/configurator";
import { PageFrame } from "@/components/japan/page-frame";
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
  const { t, locale } = useLanguage();

  return (
    <>
      <PageFrame />
      <ScrollProgress />
      <SiteHeader />

      <main id="main-content" tabIndex={-1} className="sheet-main">
        <section className="panel panel-lime hero-in hero-in-left relative overflow-hidden px-6 pb-10 pt-[calc(var(--header-h)+2rem)] md:px-12 md:pb-14 lg:px-16">
          <span
            aria-hidden
            lang="ja"
            className="pointer-events-none absolute -right-6 -top-6 select-none font-jp text-[12rem] leading-none text-[hsl(150_42%_6%/0.08)] md:text-[18rem]"
          >
            始動
          </span>
          <div className="relative">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[hsl(150_42%_6%)] px-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[hsl(76_76%_58%)] transition-transform hover:-translate-x-1"
            >
              <ArrowLeft className="h-4 w-4" />
              {t.nav.inicio}
            </Link>
            <p className="mt-8 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em]">
              <span className="rounded-full border border-foreground/30 px-3 py-1.5">
                {t.configurator.eyebrow}
              </span>
              <span>
                <span lang="ja" className="font-jp">始動</span>
                {" / shidō"}
                {locale === "ja" ? null : ` / ${t.experience.start}`}
              </span>
            </p>
            <h1 className="display-xl mt-5 max-w-5xl text-[clamp(3.25rem,9vw,8.5rem)] text-foreground">
              {t.configurator.title}
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-foreground/80 md:text-lg">
              {t.configurator.subtitle}
            </p>
          </div>
        </section>

        <Configurator hideHeading />
      </main>

      <SiteFooter />
      <LuminaChat />
    </>
  );
}
