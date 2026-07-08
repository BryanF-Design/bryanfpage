"use client";

import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/sections/section-heading";
import { useLanguage } from "@/lib/i18n/context";

const WHATSAPP = "https://wa.me/525663012505";

export function Faq() {
  const { t } = useLanguage();
  const items = t.faq.items.map((item, i) => ({ id: String(i + 1), ...item }));

  return (
    <section
      id="faq"
      aria-label="Preguntas frecuentes"
      className="relative overflow-hidden border-t border-border py-20 md:py-28"
    >
      <div aria-hidden className="mesh-glow-a opacity-40" />
      <div className="container relative">
        <SectionHeading
          eyebrow={t.faq.eyebrow}
          title={t.faq.title}
          subtitle={t.faq.subtitle}
        />

        <div className="glass mx-auto mt-14 w-full max-w-3xl rounded-3xl px-4 md:px-8">
          <Accordion type="single" defaultValue="1" collapsible className="w-full">
            {items.map((item) => (
              <AccordionItem
                value={item.id}
                key={item.id}
                className="last:border-b"
              >
                <AccordionTrigger className="-space-y-6 overflow-hidden pl-2 text-left text-foreground/20 duration-200 hover:no-underline data-[state=open]:space-y-0 data-[state=open]:text-primary md:pl-6 [&>svg]:hidden">
                  <div className="flex flex-1 items-start gap-4">
                    <span className="pt-1 font-mono text-xs">{item.id}</span>
                    <h3 className="font-display text-2xl uppercase tracking-tight md:text-4xl">
                      {item.title}
                    </h3>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="max-w-xl pb-6 pl-8 text-base text-muted-foreground md:pl-12">
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mx-auto mt-12 flex max-w-3xl flex-col items-center gap-4 text-center">
          <p className="text-sm text-muted-foreground">{t.faq.notFound}</p>
          <Button asChild size="lg">
            <Link href={WHATSAPP} target="_blank" rel="noopener noreferrer">
              {t.faq.sendWhatsapp}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
