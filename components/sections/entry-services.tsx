"use client";

import type { CSSProperties } from "react";
import { ArrowUpRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/sections/section-heading";
import { openLuminaChat } from "@/components/sections/lumina-feature";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";

/**
 * 品書 — la carta de entrada.
 *
 * Productos de bajo costo y entrega rápida para quien todavía no necesita el
 * sitio completo del Configurador. Se presentan como las fichas de producto
 * de la referencia: precio grande, lista corta y una píldora de acción. Cada
 * ficha abre el chat de Lumina con la pregunta ya escrita.
 */
export function EntryServices() {
  const { t } = useLanguage();
  const items = t.entryServices.items;

  return (
    <section
      id="servicios-entrada"
      aria-label={t.entryServices.title}
      className="relative grid gap-gutter md:grid-cols-2 lg:grid-cols-3"
    >
      <div data-fx="panel" className="min-w-0 md:col-span-2">
        <div className="panel panel-moss relative flex h-full flex-col justify-end overflow-hidden p-6 md:p-10 lg:p-12">
          <span
            aria-hidden
            lang="ja"
            className="drift-y pointer-events-none absolute -right-6 -top-10 select-none font-jp text-[12rem] leading-none text-foreground/[0.05] md:text-[16rem]"
          >
            品書
          </span>
          <SectionHeading
            eyebrow={t.entryServices.eyebrow}
            title={t.entryServices.title}
            subtitle={t.entryServices.subtitle}
            chapter={{ kanji: "品書", romaji: "shinagaki", index: 7 }}
            className="relative"
          />
        </div>
      </div>

      {items.map((item, index) => (
        <div
          key={item.id}
          data-fx={index % 3 === 0 ? "right" : index % 3 === 1 ? "rise" : "left"}
          style={{ "--fx-delay": `${(index % 3) * 90}ms` } as CSSProperties}
          className="min-w-0"
        >
          <article
            className={cn(
              "panel group relative flex h-full min-h-[26rem] flex-col gap-5 overflow-hidden p-6 transition-transform duration-500 [transition-timing-function:var(--ease-material)] hover:-translate-y-1.5 md:p-7",
              index === items.length - 1 && "panel-lime"
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <span className="display-xl text-[4rem] leading-[0.8] text-foreground/15 transition-colors duration-300 group-hover:text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="grid size-11 place-items-center rounded-full bg-secondary text-primary transition-transform duration-500 [transition-timing-function:var(--ease-pop)] group-hover:rotate-45 group-hover:scale-110">
                <ArrowUpRight className="h-5 w-5" />
              </span>
            </div>

            <div>
              <h3 className="display-xl text-[2.1rem] leading-[0.92] text-foreground">
                {item.name}
              </h3>
              <p className="mt-3 inline-flex rounded-full bg-primary px-3.5 py-1.5 font-display text-xl font-black uppercase leading-none tracking-[0.02em] text-primary-foreground">
                {item.price}
              </p>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>

            <ul className="flex flex-1 flex-col gap-2">
              {item.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[13px] text-foreground/80">
                  <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-primary/20 text-primary">
                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <Button
              variant={index === items.length - 1 ? "default" : "outline"}
              size="sm"
              onClick={() => openLuminaChat(item.question)}
              className="mt-1 w-full"
            >
              {t.entryServices.cta}
            </Button>
          </article>
        </div>
      ))}

      <div data-fx="up" className="min-w-0 lg:col-span-2">
        <div className="panel flex h-full min-h-40 items-end overflow-hidden p-6 md:p-7">
          <p className="max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
            <span aria-hidden className="mb-4 block size-2.5 rounded-full bg-signal" />
            {t.entryServices.note}
          </p>
        </div>
      </div>
    </section>
  );
}
