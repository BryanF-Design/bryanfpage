"use client";

import Link from "next/link";

import { SectionHeading } from "@/components/sections/section-heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/context";

const WHATSAPP = "https://wa.me/525663012505";

export function Faq() {
  const { t } = useLanguage();
  const items = t.faq.items.map((item, index) => ({
    id: String(index + 1),
    ...item,
  }));

  return (
    <section
      id="faq"
      aria-label={t.faq.title}
      className="relative overflow-hidden border-t border-border py-20 md:py-28"
    >
      <div
        aria-hidden
        className="japan-halftone pointer-events-none absolute inset-0 opacity-15"
      />

      <div className="container relative grid gap-10 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-8">
        <div className="lg:col-span-4">
          <SectionHeading
            eyebrow={t.faq.eyebrow}
            title={t.faq.title}
            subtitle={t.faq.subtitle}
            chapter={{ kanji: "問答", romaji: "mondō", index: 10 }}
          />
        </div>

        <div className="editorial-panel overflow-hidden lg:col-span-8 lg:row-span-2">
          <Accordion
            type="single"
            defaultValue="1"
            collapsible
            className="w-full"
          >
            {items.map((item) => (
              <AccordionItem
                value={item.id}
                key={item.id}
                className="border-b border-border px-4 last:border-b-0 md:px-7"
              >
                <AccordionTrigger className="group min-h-[5.25rem] py-5 text-left text-foreground transition-colors duration-200 hover:text-primary hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary data-[state=open]:text-primary md:min-h-24 md:py-6 [&>svg]:ml-4 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0 [&>svg]:text-muted-foreground">
                  <div className="flex flex-1 items-start gap-4 md:gap-7">
                    <span className="pt-1 font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground transition-colors group-data-[state=open]:text-primary">
                      {item.id.padStart(2, "0")}
                    </span>
                    <span className="max-w-2xl font-display text-lg font-semibold leading-tight tracking-tight md:text-2xl">
                      {item.title}
                    </span>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="pb-7 pl-8 pr-8 text-sm leading-relaxed text-muted-foreground md:max-w-2xl md:pb-8 md:pl-14 md:text-base">
                  <div className="border-l border-primary/45 pl-4 md:pl-6">
                    {item.content}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="flex flex-col items-start gap-5 border-l border-primary/35 pl-5 lg:col-span-4 lg:self-end">
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
    </section>
  );
}
