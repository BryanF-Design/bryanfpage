"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

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

/**
 * 問答 — preguntas frecuentes. Panel musgo con la cabecera y la salida a
 * WhatsApp; panel de tinta con el acordeón, cada pregunta como una píldora
 * que se abre en ficha.
 */
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
      className="relative grid gap-gutter lg:grid-cols-12"
    >
      <div data-fx="left" className="min-w-0 lg:col-span-5">
        <div className="panel panel-moss flex h-full flex-col justify-between gap-10 overflow-hidden p-6 md:p-10">
          <span
            aria-hidden
            lang="ja"
            className="pointer-events-none absolute -bottom-8 -right-4 select-none font-jp text-[11rem] leading-none text-foreground/[0.05]"
          >
            問答
          </span>
          <SectionHeading
            eyebrow={t.faq.eyebrow}
            title={t.faq.title}
            subtitle={t.faq.subtitle}
            chapter={{ kanji: "問答", romaji: "mondō", index: 10 }}
            className="relative"
          />

          <div className="relative flex flex-col items-start gap-5 rounded-inner bg-background/55 p-5 md:p-6">
            <p className="max-w-sm text-sm leading-relaxed text-foreground/80">
              {t.faq.notFound}
            </p>
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                <FaWhatsapp className="h-4 w-4" />
                {t.faq.sendWhatsapp}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div data-fx="right" className="min-w-0 lg:col-span-7" style={{ "--fx-delay": "100ms" } as CSSProperties}>
        <div className="panel h-full p-[var(--gutter)] md:p-4">
          <Accordion
            type="single"
            defaultValue="1"
            collapsible
            className="flex w-full flex-col gap-2"
          >
            {items.map((item) => (
              <AccordionItem
                value={item.id}
                key={item.id}
                className="overflow-hidden rounded-inner border-0 bg-secondary/70 px-4 ring-1 ring-foreground/5 transition-colors data-[state=open]:bg-moss md:px-6"
              >
                <AccordionTrigger className="group min-h-[4.5rem] py-4 text-left text-foreground transition-colors duration-200 hover:text-primary hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary data-[state=open]:text-primary md:min-h-20 [&>svg]:ml-4 [&>svg]:h-9 [&>svg]:w-9 [&>svg]:shrink-0 [&>svg]:rounded-full [&>svg]:bg-background [&>svg]:p-2.5 [&>svg]:text-primary">
                  <div className="flex flex-1 items-center gap-4 md:gap-6">
                    <span className="display-xl w-9 shrink-0 text-3xl leading-none text-foreground/25 transition-colors group-data-[state=open]:text-primary">
                      {item.id.padStart(2, "0")}
                    </span>
                    <span className="max-w-2xl font-display text-[1.35rem] font-extrabold uppercase leading-[1.02] tracking-[0.01em] md:text-[1.7rem]">
                      {item.title}
                    </span>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="pb-6 pl-[3.25rem] pr-4 text-sm leading-relaxed text-foreground/75 md:pl-[3.75rem] md:text-base">
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
