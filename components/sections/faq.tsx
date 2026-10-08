"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkle } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { openLuminaChat } from "@/components/sections/lumina-feature";
import { SectionHeading } from "@/components/sections/section-heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button, ButtonArrow } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/context";

const WHATSAPP = "https://wa.me/525663012505";

/**
 * Preguntas frecuentes — una sola columna centrada sobre un panel bosque
 * (rompe la serie de "columna de color + columna blanca" de la página).
 * Arriba, el chip y el titular; en medio, el acordeón en una tarjeta blanca
 * con Lumina asomándose por su esquina superior derecha ("¿dudas?"); abajo,
 * las dos salidas: WhatsApp y el chat. Filas redondeadas tipo app, número en
 * círculo y un botón redondo "+" que gira a "×"; la abierta se enciende en lima.
 */
export function Faq() {
  const { t } = useLanguage();
  const items = t.faq.items.map((item, index) => ({
    id: String(index + 1),
    ...item,
  }));

  return (
    <section id="faq" aria-label={t.faq.title} className="relative">
      <div data-fx="panel">
        <div className="panel panel-forest overflow-hidden px-3 pb-6 pt-9 sm:px-7 sm:pb-9 sm:pt-12 lg:px-10 lg:pb-12 lg:pt-16">
          {/* Tramas de puntos lima en dos esquinas, como en las referencias. */}
          <div
            aria-hidden
            className="dot-cluster pointer-events-none absolute left-8 top-8 hidden h-[110px] w-[154px] opacity-80 [mask-image:linear-gradient(135deg,black_35%,transparent_75%)] md:block lg:left-10 lg:top-10"
          />
          <div
            aria-hidden
            className="dot-cluster pointer-events-none absolute bottom-10 right-10 hidden h-[110px] w-[154px] opacity-60 [mask-image:linear-gradient(315deg,black_35%,transparent_75%)] lg:block"
          />

          <SectionHeading
            eyebrow={t.faq.eyebrow}
            title={t.faq.title}
            subtitle={t.faq.subtitle}
            chapter={{ index: 10 }}
            align="center"
            className="relative px-2"
          />

          {/* Tarjeta del acordeón: Lumina se asoma por detrás de su esquina
              superior derecha; el canto de la tarjeta tapa su recorte. */}
          <div
            data-fx="up"
            className="relative mx-auto mt-2 max-w-3xl"
            style={{ "--fx-delay": "120ms" } as CSSProperties}
          >
            <div className="relative pt-[6.25rem] sm:pt-[7rem] lg:pt-[8.5rem]">
              <div
                aria-hidden
                className="pointer-events-none absolute right-3 top-0 z-0 w-[8.75rem] sm:right-8 sm:w-[10rem] lg:right-8 lg:w-[12.25rem]"
              >
                <Image
                  src="/img/brand/lumina-duda.webp"
                  alt=""
                  width={807}
                  height={1139}
                  sizes="(min-width: 1024px) 196px, (min-width: 640px) 160px, 140px"
                  className="h-auto w-full drop-shadow-[0_18px_24px_hsl(165_40%_8%/0.35)]"
                />
              </div>
              <span
                aria-hidden
                className="absolute right-[9.25rem] top-9 z-10 inline-flex items-center gap-1.5 rounded-[999px_999px_6px_999px] bg-white px-4 py-2.5 text-sm font-bold text-ink shadow-pop sm:right-[11.5rem] sm:top-10 lg:right-[13rem] lg:top-12 lg:text-[0.9375rem]"
              >
                <Sparkle className="h-3.5 w-3.5 fill-lime text-lime-deep" />
                {t.faq.bubble}
              </span>

              <div className="panel surface-white relative z-10 p-2 shadow-float sm:p-3">
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
                      className="rounded-card border-0 bg-mint px-3.5 ring-1 ring-ink/[0.05] transition-colors duration-300 data-[state=open]:bg-lime data-[state=open]:ring-0 data-[state=closed]:hover:bg-lime-soft/70 sm:px-5 lg:px-6"
                    >
                      <AccordionTrigger className="min-h-[4.5rem] gap-3 rounded-2xl py-3.5 text-ink sm:gap-4 md:min-h-[5.25rem]">
                        <span className="flex flex-1 items-center gap-3 sm:gap-4">
                          {/* Número en tinta al 75 %: AA sobre blanco (5.5:1). */}
                          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-xs font-bold tabular-nums text-ink/75 ring-1 ring-ink/[0.06] transition-colors duration-300 group-data-[state=open]/acc:bg-ink group-data-[state=open]/acc:text-lime group-data-[state=open]/acc:ring-0 md:size-11 md:text-sm">
                            {item.id.padStart(2, "0")}
                          </span>
                          <span className="display-title text-pretty text-[1.0625rem] leading-[1.15] tracking-[-0.02em] sm:text-[1.25rem] lg:text-[1.5rem]">
                            {item.title}
                          </span>
                        </span>
                      </AccordionTrigger>

                      <AccordionContent className="pb-5 pl-12 pr-1 text-[0.9375rem] leading-relaxed text-ink/80 sm:pl-[3.25rem] md:pb-7 md:pl-[3.75rem] md:pr-16 md:text-base">
                        {item.content}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>

          {/* Salidas: WhatsApp o el chat con Lumina, centradas bajo la tarjeta. */}
          <div
            data-fx="up"
            className="relative mx-auto mt-7 max-w-3xl sm:mt-9"
            style={{ "--fx-delay": "180ms" } as CSSProperties}
          >
            <div className="flex flex-col items-center gap-5 text-center">
              <p className="flex max-w-xl items-start gap-3 text-pretty text-left text-[0.9375rem] font-semibold leading-snug text-white sm:items-center md:text-base">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-lime">
                  <FaWhatsapp aria-hidden className="h-5 w-5" />
                </span>
                {t.faq.notFound}
              </p>
              <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="w-full justify-between pl-6 pr-2.5 sm:w-auto sm:gap-4"
                >
                  <Link href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                    {t.faq.sendWhatsapp}
                    <ButtonArrow tone="ink" className="-mr-0.5" />
                  </Link>
                </Button>
                <button
                  type="button"
                  onClick={() => openLuminaChat()}
                  className="group inline-flex h-14 w-full items-center gap-3 rounded-full bg-ink pl-2 pr-2.5 text-base font-semibold text-white shadow-pop transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98] sm:w-auto"
                >
                  <span aria-hidden className="relative size-10 shrink-0">
                    <span className="absolute inset-0 overflow-hidden rounded-full bg-lime">
                      <Image
                        src="/img/brand/lumina-normal.webp"
                        alt=""
                        fill
                        sizes="40px"
                        className="scale-[1.4] object-cover object-[50%_18%]"
                      />
                    </span>
                    {/* En línea: punto verde sobre el avatar. */}
                    <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-[hsl(142_70%_41%)] ring-2 ring-ink" />
                  </span>
                  <span className="flex-1 text-left">{t.lumina.open}</span>
                  <span aria-hidden className="btn-arrow size-9 bg-lime text-ink">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
