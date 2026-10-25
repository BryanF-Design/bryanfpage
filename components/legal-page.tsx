"use client";

import Link from "next/link";
import { Sparkle } from "lucide-react";

import { ScrollProgress } from "@/components/ui/scroll-progress";
import { SiteFooter } from "@/components/sections/site-footer";
import { SiteHeader } from "@/components/sections/site-header";
import { SpanishPageLanguage } from "@/components/seo/spanish-page-language";

/**
 * Páginas legales (/terminos y /privacidad) con el diseño del sitio. Antes
 * eran HTML estáticos aparte (otro estilo, sin cabecera ni Lumina). Solo en
 * español, como la suscripción.
 */
export function LegalPage({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <SpanishPageLanguage />
      <ScrollProgress />
      <SiteHeader spanishOnly />

      <main id="main-content" tabIndex={-1} className="sheet-main">
        <section aria-labelledby="legal-title" className="panel flex flex-col gap-5 p-5 pt-6 shadow-soft sm:p-8 lg:p-10">
          <nav aria-label="Ruta" className="text-sm text-muted-foreground">
            <Link href="/" className="font-semibold text-ink underline-offset-4 hover:underline">
              Inicio
            </Link>{" "}
            / {eyebrow}
          </nav>
          <span className="eyebrow w-fit pl-3">
            <Sparkle aria-hidden className="h-3.5 w-3.5 fill-lime text-lime-deep" />
            {eyebrow}
          </span>
          <h1
            id="legal-title"
            className="display-title max-w-4xl text-balance text-[clamp(2.4rem,5.5vw,4.75rem)] leading-[0.96] text-ink"
          >
            {title}
          </h1>
          <p className="text-sm text-muted-foreground">Última actualización: {updated}</p>
        </section>

        <section aria-label={title} className="panel p-5 pt-6 shadow-soft sm:p-8 lg:p-10">
          <div className="legal-prose mx-auto max-w-3xl">{children}</div>
        </section>
      </main>

      <SiteFooter spanishOnly />
    </>
  );
}
