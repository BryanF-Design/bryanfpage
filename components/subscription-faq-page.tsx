"use client";

import Link from "next/link";
import { Sparkle } from "lucide-react";

import { Button, ButtonArrow } from "@/components/ui/button";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { SiteFooter } from "@/components/sections/site-footer";
import { SiteHeader } from "@/components/sections/site-header";
import { SpanishPageLanguage } from "@/components/seo/spanish-page-language";
import { SubscriptionFaqCenter } from "@/components/subscription-faq-center";
import { SUBSCRIPTION_PRICE_LABEL } from "@/lib/subscription";

/**
 * /suscripcion/preguntas-frecuentes — todas las dudas de la suscripción en
 * un solo lugar, con buscador. Página en español, como /suscripcion.
 */
export function SubscriptionFaqPage() {
  return (
    <>
      <SpanishPageLanguage />
      <ScrollProgress />
      <SiteHeader spanishOnly />

      <main id="main-content" tabIndex={-1} className="sheet-main">
        <section aria-labelledby="faq-title" className="panel flex flex-col gap-5 p-5 pt-6 shadow-soft sm:p-8 lg:p-10">
          <nav aria-label="Ruta" className="text-sm text-muted-foreground">
            <Link href="/suscripcion" className="font-semibold text-ink underline-offset-4 hover:underline">
              Suscripción
            </Link>{" "}
            / Preguntas frecuentes
          </nav>
          <span className="eyebrow w-fit pl-3">
            <Sparkle aria-hidden className="h-3.5 w-3.5 fill-lime text-lime-deep" />
            Suscripción Todo Digital
          </span>
          <h1
            id="faq-title"
            className="display-title max-w-4xl text-balance text-[clamp(2.4rem,5.5vw,4.75rem)] leading-[0.96] text-ink"
          >
            Todo lo que quieras saber de la suscripción
          </h1>
          <p className="max-w-2xl text-pretty text-[0.975rem] leading-relaxed text-muted-foreground md:text-lg">
            Qué incluye, cómo pides, cuánto tardamos, cómo se cobra, cómo cancelas y qué pasa con tus sitios. Si no está
            aquí, pregúntale a Lumina o escríbenos.
          </p>
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <Button asChild size="lg" variant="ink" className="justify-between pl-6 pr-2.5">
              <Link href="/suscripcion#plan">
                Suscribirme · {SUBSCRIPTION_PRICE_LABEL}/mes
                <ButtonArrow tone="lime" className="ml-3 -mr-0.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/suscripcion#politica">Leer la política</Link>
            </Button>
          </div>
        </section>

        <section aria-label="Preguntas" className="panel p-5 pt-6 shadow-soft sm:p-8 lg:p-10">
          <div className="mx-auto max-w-3xl">
            <SubscriptionFaqCenter />
          </div>
        </section>
      </main>

      <SiteFooter spanishOnly />
    </>
  );
}
