"use client";

import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Disclosure } from "@/components/ui/disclosure";
import { ChapterMark } from "@/components/japan/chapter-mark";
import { CHAPTER_TOTAL } from "@/components/sections/section-heading";
import { openLuminaChat } from "@/components/sections/lumina-chapter";
import { useLanguage } from "@/lib/i18n/context";

/**
 * 品書 — la carta de servicios de entrada.
 *
 * Eran cinco tarjetas de 25rem de alto, todas con su lista de características
 * desplegada: 125rem de scroll para cinco precios. Una carta de restaurante no
 * se imprime así, y esto es literalmente una carta —de ahí el kanji.
 *
 * Ahora es una lista: número, nombre, una línea y el precio alineado a la
 * derecha. Lo que incluye cada servicio se abre por renglón, que es cuando de
 * verdad interesa.
 */
export function ServicesList() {
  const { t } = useLanguage();

  return (
    <section
      id="servicios-entrada"
      aria-label={t.entryServices.title}
      className="relative isolate overflow-hidden border-b border-border py-16 md:py-24"
    >
      <div aria-hidden className="mesh-glow-c absolute inset-0 opacity-35" />
      <div aria-hidden className="route-grid absolute inset-0 opacity-20" />

      <div className="container relative">
        <div className="grid gap-6 border-b border-border pb-7 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <ChapterMark
              kanji="品書"
              romaji="shinagaki"
              label={t.entryServices.eyebrow}
              index={4}
              total={CHAPTER_TOTAL}
              className="mb-6"
            />
            <h2 className="max-w-2xl font-display text-[clamp(1.75rem,3.4vw,2.9rem)] font-bold uppercase leading-[0.95] tracking-[-0.035em] text-foreground">
              {t.entryServices.title}
            </h2>
          </div>
          <p className="max-w-md text-pretty text-sm leading-relaxed text-muted-foreground lg:col-span-5 lg:text-right md:text-base">
            {t.entryServices.subtitle}
          </p>
        </div>

        <ul className="mt-2">
          {t.entryServices.items.map((item, index) => (
            <li key={item.id} className="border-b border-border">
              <div className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-start gap-x-4 gap-y-3 py-6 sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:gap-x-6">
                <span className="pt-1 font-display text-2xl font-semibold leading-none tabular-nums text-foreground/20 sm:text-3xl">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0">
                  <h3 className="font-display text-lg font-bold uppercase leading-tight tracking-tight text-foreground sm:text-xl">
                    {item.name}
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>

                  <Disclosure
                    label={t.ui.expand}
                    labelOpen={t.ui.collapse}
                    className="mt-3"
                    contentClassName="pt-4"
                  >
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {item.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"
                        >
                          <Check aria-hidden className="mt-0.5 size-3.5 shrink-0 text-primary" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openLuminaChat(item.question)}
                      className="mt-5 rounded-none"
                    >
                      {t.entryServices.cta}
                    </Button>
                  </Disclosure>
                </div>

                {/* El precio: en la columna de la derecha en pantalla ancha,
                    bajo el nombre en teléfono. Nunca escondido. */}
                <p className="col-start-2 font-mono text-xl font-medium leading-none text-primary sm:col-start-3 sm:pt-1 sm:text-right sm:text-2xl">
                  {item.price}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-8 max-w-2xl text-xs leading-relaxed text-muted-foreground">
          {t.entryServices.note}
        </p>
      </div>
    </section>
  );
}
