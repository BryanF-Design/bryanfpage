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
 * Preguntas frecuentes — un bento de dos paneles. El bosque lleva la
 * cabecera y la salida a WhatsApp, con Lumina asomándose por detrás de la
 * tarjeta ("¿dudas?"). El blanco lleva el acordeón: filas redondeadas tipo
 * app, número en círculo y un botón redondo "+" que gira a "×"; la pregunta
 * abierta se enciende en lima.
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
        <div className="panel panel-forest flex h-full flex-col gap-8 p-5 sm:p-8 lg:p-10">
          {/* Puntos lima, como el patrón de las referencias. */}
          <div
            aria-hidden
            className="dot-cluster pointer-events-none absolute right-6 top-6 hidden h-[110px] w-[154px] opacity-90 [mask-image:linear-gradient(225deg,black_35%,transparent_75%)] sm:block lg:right-8 lg:top-8"
          />

          <SectionHeading
            eyebrow={t.faq.eyebrow}
            title={t.faq.title}
            subtitle={t.faq.subtitle}
            chapter={{ index: 10 }}
            size="xl"
            className="relative"
          />

          {/* Tarjeta de WhatsApp: Lumina se asoma por detrás de su canto. */}
          <div className="relative mt-auto pt-[7.25rem] sm:pt-[8rem] xl:pt-[10.5rem]">
            <div
              aria-hidden
              className="pointer-events-none absolute right-2 top-0 z-0 w-[10.5rem] sm:right-6 sm:w-[11.5rem] xl:right-8 xl:w-[15.5rem]"
            >
              <Image
                src="/img/brand/lumina-duda.webp"
                alt=""
                width={900}
                height={968}
                sizes="(min-width: 1280px) 248px, (min-width: 640px) 184px, 168px"
                className="h-auto w-full drop-shadow-[0_18px_24px_hsl(165_40%_8%/0.35)]"
              />
            </div>
            <span
              aria-hidden
              className="absolute right-[11rem] top-7 z-10 inline-flex items-center gap-1.5 rounded-[999px_999px_6px_999px] bg-white px-4 py-2.5 text-sm font-bold text-ink shadow-pop sm:right-[12.5rem] sm:top-8 xl:right-[14.25rem] xl:top-[4.25rem] xl:text-[0.9375rem]"
            >
              <Sparkle className="h-3.5 w-3.5 fill-lime text-lime-deep" />
              {t.faq.bubble}
            </span>

            <div className="card-pop surface-white relative z-10 flex flex-col gap-4 bg-white p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-lime">
                  <FaWhatsapp aria-hidden className="h-5 w-5" />
                </span>
                <p className="pt-0.5 text-[0.9375rem] font-semibold leading-snug text-ink">
                  {t.faq.notFound}
                </p>
              </div>
              <Button
                asChild
                size="lg"
                className="w-full justify-between pl-6 pr-2.5"
              >
                <Link href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                  {t.faq.sendWhatsapp}
                  <ButtonArrow tone="ink" className="-mr-0.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div
        data-fx="right"
        className="min-w-0 lg:col-span-7"
        style={{ "--fx-delay": "100ms" } as CSSProperties}
      >
        <div className="panel flex h-full flex-col p-2 shadow-soft sm:p-3 lg:p-4">
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
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-xs font-bold tabular-nums text-ink/55 ring-1 ring-ink/[0.06] transition-colors duration-300 group-data-[state=open]/acc:bg-ink group-data-[state=open]/acc:text-lime group-data-[state=open]/acc:ring-0 md:size-11 md:text-sm">
                      {item.id.padStart(2, "0")}
                    </span>
                    <span className="display-title text-pretty text-[1.0625rem] leading-[1.15] tracking-[-0.02em] sm:text-[1.2rem] lg:text-[1.375rem]">
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

          {/* Salida al chat: Lumina responde lo que no está aquí. */}
          <div className="mt-auto flex flex-col gap-3 px-2 pb-1.5 pt-5 sm:flex-row sm:items-center sm:justify-between sm:px-3 sm:pb-1">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <span
                aria-hidden
                className="size-2 rounded-full bg-[hsl(142_70%_41%)]"
              />
              {t.lumina.online}
            </span>
            <button
              type="button"
              onClick={() => openLuminaChat()}
              className="group inline-flex h-12 w-full items-center gap-3 rounded-full bg-ink pl-1.5 pr-2 text-[0.9375rem] font-semibold text-white shadow-pop transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98] sm:w-auto"
            >
              <span
                aria-hidden
                className="relative size-9 shrink-0 overflow-hidden rounded-full bg-lime"
              >
                <Image
                  src="/img/brand/lumina-normal.webp"
                  alt=""
                  fill
                  sizes="36px"
                  className="scale-[1.4] object-cover object-[50%_18%]"
                />
              </span>
              <span className="flex-1 text-left">{t.lumina.open}</span>
              <span aria-hidden className="btn-arrow size-8 bg-lime text-ink">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
