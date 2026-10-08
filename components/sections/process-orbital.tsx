"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import {
  ArrowRight,
  ClipboardList,
  Code2,
  FileSpreadsheet,
  LifeBuoy,
  Rocket,
  Sparkle,
} from "lucide-react";

import { SectionHeading } from "@/components/sections/section-heading";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";

const ICONS = [FileSpreadsheet, ClipboardList, Code2, Rocket, LifeBuoy];

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Pone en serif itálica la última palabra del titular (acento editorial).
 * En japonés y chino no hay espacios: el titular se queda como viene.
 */
function accentLastWord(title: string): ReactNode {
  const cut = title.lastIndexOf(" ");
  if (cut <= 0) return title;
  return (
    <>
      {title.slice(0, cut + 1)}
      <span className="font-serif font-normal italic tracking-normal text-forest">
        {title.slice(cut + 1)}
      </span>
    </>
  );
}

/**
 * `true` por debajo de `md` (768px), donde el riel es un carrusel. Arranca en
 * `false` para que el HTML del servidor y la hidratación coincidan.
 */
function useBelowMd() {
  const [below, setBelow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setBelow(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return below;
}

/**
 * Proceso — cinco pasos en una línea de tiempo.
 *
 * Un solo panel blanco: cabecera arriba y, debajo, el riel. En escritorio los
 * pasos van en fila, unidos por una línea punteada que pasa por sus insignias
 * redondas; en tableta el riel baja por la izquierda; en teléfono vuelve a ir
 * en fila, como carrusel con imán que deja asomar la siguiente ficha. El
 * último paso (el seguimiento, lo que sigue después del lanzamiento) va en lima.
 */
export function ProcessOrbital() {
  const { t } = useLanguage();
  const steps = t.process.steps;
  const total = steps.length;
  const highlight = total - 1;
  // En teléfono el carrusel recibe foco para poder recorrerlo con flechas.
  const isCarousel = useBelowMd();

  return (
    <section id="proceso" aria-label={t.process.title} className="relative">
      <div data-fx="panel">
        <div className="panel relative overflow-hidden p-5 shadow-soft sm:p-7 lg:p-10">
          {/* Recorte con el rango del recorrido. */}
          <div className="notch notch-tr">
            <span className="tag-pill gap-2 pl-4">
              {pad(1)}
              <ArrowRight aria-hidden className="h-3.5 w-3.5 text-lime" />
              {pad(total)}
            </span>
          </div>

          {/* Cabecera: titular a la izquierda, bajada a la derecha. */}
          <div className="relative grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-10">
            <SectionHeading
              eyebrow={t.process.eyebrow}
              title={accentLastWord(t.process.title)}
              chapter={{ index: 4 }}
              className="lg:col-span-7"
            />
            <div className="flex flex-col gap-5 lg:col-span-5 lg:pb-2 lg:pt-14">
              <p className="max-w-md text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
                {t.process.subtitle}
              </p>
              {/* Barra de avance: cinco tramos, como las metas de las apps. */}
              <span aria-hidden className="flex max-w-md items-center gap-1.5">
                {steps.map((step, index) => (
                  <span
                    key={step.title}
                    className={cn(
                      "h-2 flex-1 rounded-full",
                      index === highlight ? "bg-lime" : "bg-ink"
                    )}
                  />
                ))}
                <Sparkle className="ml-1.5 h-5 w-5 fill-lime text-lime-deep" />
              </span>
            </div>
          </div>

          {/* La línea de tiempo: carrusel horizontal en teléfono (llega al
              borde del panel), vertical en tableta y en fila desde xl. En el
              carrusel, el relleno inferior invade el del panel (-mb) para que
              la sombra de la ficha lima no se corte en seco. */}
          <ol
            role="list"
            aria-label={t.process.stepsLabel}
            tabIndex={isCarousel ? 0 : undefined}
            className="relative mt-9 grid gap-3 md:mt-12 md:gap-4 xl:mt-14 xl:grid-cols-5 xl:gap-gutter max-md:mt-7 max-md:flex max-md:snap-x max-md:snap-mandatory max-md:overflow-x-auto max-md:overscroll-x-contain max-md:-mb-5 max-md:pb-7 max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden max-sm:-mx-5 max-sm:scroll-px-5 max-sm:px-5 sm:max-md:-mx-7 sm:max-md:scroll-px-7 sm:max-md:px-7 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ink"
          >
            {steps.map((step, index) => {
              const Icon = ICONS[index] ?? Sparkle;
              const isHighlight = index === highlight;
              const isLast = index === total - 1;

              return (
                <li
                  key={step.title}
                  data-fx="up"
                  style={{ "--fx-delay": `${index * 90}ms` } as CSSProperties}
                  className={cn(
                    "relative min-w-0 max-md:w-[82%] max-md:shrink-0 max-md:snap-start sm:max-md:w-[46%]",
                    // Fuera de la vista inicial del carrusel: entra sin esperar al escalonado.
                    index > 1 && "max-md:![--fx-delay:0ms]"
                  )}
                >
                  <div className="relative grid h-full grid-cols-[3rem_minmax(0,1fr)] gap-3 sm:grid-cols-[3.5rem_minmax(0,1fr)] md:gap-5 xl:flex xl:flex-col xl:gap-5 max-md:flex max-md:flex-col max-md:gap-4">
                    {/* Tramo del riel hacia el siguiente paso (vertical en
                        tableta, horizontal en teléfono y escritorio), con su flecha. */}
                    {!isLast && (
                      <span
                        aria-hidden
                        className="absolute left-6 top-6 z-0 h-[calc(100%+0.75rem)] sm:left-7 sm:top-7 w-0 border-l-2 border-dashed border-ink/20 md:h-[calc(100%+1rem)] xl:left-[2.25rem] xl:h-0 xl:w-[calc(100%+var(--gutter))] xl:border-l-0 xl:border-t-2 max-md:h-0 max-md:w-[calc(100%+0.75rem)] max-md:border-l-0 max-md:border-t-2"
                      >
                        <span className="absolute left-1/2 top-1/2 grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-ink/60 ring-1 ring-ink/10 xl:left-[55%] max-md:left-[55%]">
                          <ArrowRight className="h-3.5 w-3.5 rotate-90 xl:rotate-0 max-md:rotate-0" />
                        </span>
                      </span>
                    )}

                    {/* Insignia redonda del paso. */}
                    <span className="relative z-10 flex xl:pl-2">
                      <span
                        className={cn(
                          "grid size-12 place-items-center rounded-full ring-[6px] ring-white sm:size-14",
                          isHighlight ? "bg-lime text-ink" : "bg-ink text-lime"
                        )}
                      >
                        <Icon aria-hidden className="h-5 w-5 sm:h-6 sm:w-6" />
                      </span>
                    </span>

                    {/* Ficha del paso: en tableta, título a la izquierda y texto a la derecha. */}
                    <div
                      className={cn(
                        "group relative flex min-w-0 flex-1 flex-col rounded-card p-5 transition-transform duration-500 [transition-timing-function:var(--ease-out)] hover:-translate-y-1 md:grid md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] md:gap-x-8 md:p-6 xl:flex xl:min-h-[18rem] xl:p-5 2xl:p-6",
                        isHighlight
                          ? "panel-lime shadow-[0_22px_40px_-24px_hsl(var(--lime-deep)/0.9)]"
                          : "bg-[hsl(var(--canvas))]"
                      )}
                    >
                      <div className="min-w-0">
                        <span className="flex items-center justify-between gap-3">
                          <span aria-hidden className="flex items-baseline gap-1 text-sm font-bold tabular-nums">
                            {pad(index + 1)}
                            <span
                              className={cn(
                                "font-semibold",
                                isHighlight ? "text-ink/75" : "text-muted-foreground"
                              )}
                            >
                              / {pad(total)}
                            </span>
                          </span>
                          {isHighlight && (
                            <Sparkle
                              aria-hidden
                              className="h-5 w-5 fill-ink text-ink md:max-xl:hidden"
                            />
                          )}
                        </span>
                        <h3 className="display-title mt-3 hyphens-auto text-[clamp(1.25rem,6vw,1.625rem)] leading-[1.05] text-foreground md:text-[1.75rem] xl:mt-5 xl:text-[clamp(1.2rem,1.6vw,1.75rem)]">
                          {step.title}
                        </h3>
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <p
                          className={cn(
                            "mt-2.5 text-pretty text-[0.9375rem] leading-relaxed md:mt-0 md:text-base xl:mt-2.5 xl:text-[0.9375rem]",
                            isHighlight ? "text-ink/75" : "text-muted-foreground"
                          )}
                        >
                          {step.content}
                        </p>
                        {/* Avance: cuántos pasos llevas al llegar a este. */}
                        <span aria-hidden className="mt-auto flex gap-1.5 pt-5 md:pt-4 xl:pt-5">
                          {steps.map((s, dot) => (
                            <span
                              key={s.title}
                              className={cn(
                                "size-2 rounded-full",
                                dot <= index ? "bg-ink" : isHighlight ? "bg-ink/20" : "bg-ink/15"
                              )}
                            />
                          ))}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
