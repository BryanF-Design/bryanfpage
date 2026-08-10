"use client";

import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ChapterMark } from "@/components/japan/chapter-mark";
import { CHAPTER_TOTAL } from "@/components/sections/section-heading";
import { useLanguage } from "@/lib/i18n/context";

const WHATSAPP = "https://wa.me/525663012505";

/**
 * 問答 — dudas y cierre.
 *
 * Las preguntas y la llamada final eran dos secciones con 6rem de aire entre
 * ellas, y el acordeón abría con la primera respuesta desplegada. Aquí es un
 * solo cierre: todas las preguntas plegadas —quien no tiene la duda no la
 * lee— y debajo, en el mismo bloque, la última acción.
 */
export function ClosingChapter() {
  const { t } = useLanguage();
  const items = t.faq.items.map((item, index) => ({
    id: String(index + 1),
    ...item,
  }));

  return (
    <section
      id="faq"
      aria-label={t.faq.title}
      className="relative isolate overflow-hidden py-16 md:py-24"
    >
      <div aria-hidden className="japan-halftone absolute inset-0 opacity-15" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,hsl(var(--primary)/0.1),transparent_38%)]"
      />

      <div className="container relative">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <ChapterMark
              kanji="問答"
              romaji="mondō"
              label={t.faq.eyebrow}
              index={7}
              total={CHAPTER_TOTAL}
              className="mb-6"
            />
            <h2 className="max-w-md font-display text-[clamp(1.9rem,4.4vw,3.2rem)] font-bold uppercase leading-[0.92] tracking-[-0.04em] text-foreground">
              {t.faq.title}
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t.faq.subtitle}
            </p>

            <div className="mt-7 hidden flex-col items-start gap-4 border-l border-primary/35 pl-5 lg:flex">
              <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                {t.faq.notFound}
              </p>
              <Button asChild size="lg">
                <Link href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                  {t.faq.sendWhatsapp}
                </Link>
              </Button>
            </div>
          </div>

          <div className="editorial-panel overflow-hidden lg:col-span-8">
            <Accordion type="single" collapsible className="w-full">
              {items.map((item) => (
                <AccordionItem
                  value={item.id}
                  key={item.id}
                  className="border-b border-border px-4 last:border-b-0 md:px-6"
                >
                  <AccordionTrigger className="group min-h-[4rem] py-4 text-left text-foreground transition-colors duration-200 hover:text-primary hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary data-[state=open]:text-primary md:min-h-[4.5rem] md:py-5 [&>svg]:ml-4 [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-muted-foreground">
                    <div className="flex flex-1 items-start gap-4 md:gap-6">
                      <span className="pt-1 font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground transition-colors group-data-[state=open]:text-primary">
                        {item.id.padStart(2, "0")}
                      </span>
                      <span className="max-w-2xl font-display text-base font-semibold leading-tight tracking-tight md:text-xl">
                        {item.title}
                      </span>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="pb-6 pl-8 pr-6 text-sm leading-relaxed text-muted-foreground md:max-w-2xl md:pl-12">
                    <div className="border-l border-primary/45 pl-4 md:pl-5">
                      {item.content}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="flex flex-col items-start gap-4 border-l border-primary/35 pl-5 lg:col-span-4 lg:hidden">
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t.faq.notFound}
            </p>
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                {t.faq.sendWhatsapp}
              </Link>
            </Button>
          </div>
        </div>

        {/* ——— El cierre ——————————————————————————————————— */}
        <div className="editorial-panel chapter-rule relative mt-14 overflow-hidden px-6 pb-8 pt-10 sm:px-8 md:mt-20 md:px-12 md:pb-10 md:pt-14">
          <div
            aria-hidden
            className="japan-halftone pointer-events-none absolute inset-0 opacity-25"
          />

          <div className="relative grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
            <h2 className="max-w-4xl text-balance font-display text-[clamp(2rem,5vw,4rem)] font-bold uppercase leading-[0.92] tracking-[-0.04em] text-foreground lg:col-span-8">
              {t.closingCta.title}
            </h2>

            <div className="lg:col-span-4">
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
                {t.closingCta.subtitle}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="#precios">{t.closingCta.ctaPrimary}</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                  <Link href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                    {t.closingCta.ctaSecondary}
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div aria-hidden className="relative mt-10 flex items-center md:mt-12">
            <span className="size-2.5 shrink-0 bg-signal shadow-[0_0_18px_hsl(var(--signal)/0.4)]" />
            <span className="h-px flex-1 bg-gradient-to-r from-signal via-primary to-primary/20" />
            <span className="size-2.5 shrink-0 bg-primary" />
          </div>
        </div>
      </div>
    </section>
  );
}
