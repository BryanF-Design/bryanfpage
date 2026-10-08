"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import {
  Calculator,
  CreditCard,
  MessageCircle,
  Rocket,
  Sparkle,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { Button, ButtonArrow } from "@/components/ui/button";
import { SectionHeading } from "@/components/sections/section-heading";
import { openLuminaChat } from "@/components/sections/lumina-feature";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";

// Un icono por paso, en el mismo orden que `luminaJourney.steps`:
// escucha → recomienda → cotiza → cobra → arranca.
const STEP_ICONS: LucideIcon[] = [MessageCircle, Sparkles, Calculator, CreditCard, Rocket];

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Avatar redondo con el recorte de Lumina encuadrado en la cara. El `sizes`
 * cubre el tamaño pintado × la escala (48px × 1.45 ≈ 70px), no la caja.
 */
function LuminaAvatar({ src, className }: { src: string; className?: string }) {
  return (
    <span
      className={cn(
        "relative block shrink-0 overflow-hidden rounded-full bg-lime-soft",
        className
      )}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="96px"
        className="origin-[40%_32%] translate-x-[7%] scale-[1.45] object-cover object-top"
      />
    </span>
  );
}

/**
 * Lumina te acompaña — el recorrido como una conversación.
 *
 * Panel blanco con una tarjeta tinta tipo app (como la de Paytin): la
 * cabecera del chat con el único avatar de Lumina y, debajo, los cinco pasos
 * como actividad, cada uno con su botón redondo. El riel entre pasos se llena
 * cuando cada paso entra en pantalla (lo marca el observer de `data-fx`, sin
 * escuchar el scroll). A un lado, la cabecera, una frase de Lumina y la
 * llamada al chat.
 */
export function LuminaJourney() {
  const { t } = useLanguage();

  const steps = t.luminaJourney.steps;
  const bubble = t.luminaSection.phrases[2] ?? t.luminaSection.phrases[0];

  return (
    <section id="lumina-journey" aria-label={t.luminaJourney.title} className="relative">
      <div data-fx="panel">
        <div className="panel relative grid gap-6 overflow-hidden p-4 shadow-soft sm:p-7 lg:grid-cols-12 lg:grid-rows-[auto_1fr_auto] lg:gap-x-12 lg:gap-y-8 lg:p-10">
          {/* Cabecera de la sección. */}
          <SectionHeading
            eyebrow={t.luminaJourney.eyebrow}
            title={t.luminaJourney.title}
            subtitle={t.luminaJourney.subtitle}
            chapter={{ index: 8 }}
            className="relative px-1 pt-1 sm:px-0 sm:pt-0 lg:col-span-5 lg:col-start-8 lg:row-start-1"
          />

          {/* Tarjeta tinta tipo app: el chat con los pasos como actividad. */}
          <div
            data-fx="up"
            className="relative min-w-0 lg:col-span-7 lg:col-start-1 lg:row-span-3 lg:row-start-1"
          >
            <div className="panel-ink flex h-full flex-col rounded-[calc(var(--r-panel)-0.75rem)] p-4 shadow-float sm:p-6 lg:p-7">
              {/* Cabecera del chat: el único avatar de la sección. */}
              <div className="flex items-center gap-3 border-b border-border pb-4 sm:pb-5">
                <span className="relative">
                  <LuminaAvatar
                    src="/img/brand/lumina-normal.webp"
                    className="size-12 ring-2 ring-lime"
                  />
                  <span
                    aria-hidden
                    className="absolute bottom-0 right-0 size-3.5 rounded-full bg-[hsl(142_70%_42%)] ring-[3px] ring-background"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-bold leading-tight">{t.lumina.name}</span>
                  <span className="block truncate text-sm text-muted-foreground">{t.lumina.online}</span>
                </span>
                <span
                  aria-hidden
                  className="grid size-11 shrink-0 place-items-center rounded-full bg-lime text-ink"
                >
                  <Sparkle className="h-5 w-5 fill-ink" />
                </span>
              </div>

              {/* Los pasos: filas de actividad unidas por el riel. */}
              <ol className="relative mt-1 flex flex-1 flex-col">
                {steps.map((step, i) => {
                  const isLast = i === steps.length - 1;
                  const Icon = STEP_ICONS[i] ?? Sparkle;
                  return (
                    <li
                      key={step.title}
                      data-fx="up"
                      style={{ "--fx-delay": `${120 + i * 80}ms` } as CSSProperties}
                      className="relative"
                    >
                      <div className="relative grid grid-cols-[3rem_minmax(0,1fr)] gap-x-3.5 sm:gap-x-5">
                        {/* Tramo del riel hacia el siguiente paso: arranca vacío
                            y se llena cuando el paso entra (sin JS o con
                            movimiento reducido, ya está lleno). */}
                        {!isLast && (
                          <span
                            aria-hidden
                            className="absolute left-6 top-10 h-full w-[3px] -translate-x-1/2 overflow-hidden rounded-full bg-white/10"
                          >
                            <span className="absolute inset-0 origin-top rounded-full bg-lime transition-transform duration-700 [transition-delay:calc(var(--fx-delay,0ms)_+_380ms)] [transition-timing-function:var(--ease-out)] [html.fx-on_[data-fx]:not([data-fx-in])_&]:scale-y-0" />
                          </span>
                        )}
                        <span
                          aria-hidden
                          className={cn(
                            "relative z-10 mt-4 grid size-12 place-items-center rounded-full ring-4 ring-background",
                            isLast ? "bg-lime text-ink" : "bg-card text-lime"
                          )}
                        >
                          <Icon className="h-5 w-5" strokeWidth={2.25} />
                        </span>
                        <div
                          className={cn(
                            "min-w-0 py-4 sm:py-5",
                            !isLast && "border-b border-border"
                          )}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="text-lg font-bold leading-snug tracking-[-0.01em] sm:text-xl">
                              {step.title}
                            </h3>
                            <span
                              aria-hidden
                              className={cn(
                                "inline-grid h-7 min-w-[2.5rem] shrink-0 place-items-center rounded-full px-2 text-xs font-bold tabular-nums",
                                isLast ? "bg-lime text-ink" : "bg-white/10 text-white/85"
                              )}
                            >
                              {pad(i + 1)}
                            </span>
                          </div>
                          <p className="mt-1.5 text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          {/* Frase de Lumina: su voz, en serif. */}
          <div
            data-fx="pop"
            style={{ "--fx-delay": "160ms" } as CSSProperties}
            className="relative lg:col-span-5 lg:col-start-8 lg:row-start-2 lg:self-center"
          >
            <div className="flex items-end gap-3">
              <span
                aria-hidden
                className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-lime"
              >
                <Sparkle className="h-5 w-5 fill-lime" />
              </span>
              <div className="relative rounded-[1.5rem] rounded-bl-md bg-canvas px-5 py-4 pr-7">
                <p className="font-serif text-[1.65rem] italic leading-[1.1] text-ink sm:text-[1.9rem]">
                  “{bubble}”
                </p>
                <p className="mt-1.5 text-xs font-semibold text-muted-foreground">{t.lumina.name}</p>
              </div>
            </div>
          </div>

          {/* Llamada al chat. */}
          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center lg:col-span-5 lg:col-start-8 lg:row-start-3">
            <Button
              size="lg"
              variant="ink"
              onClick={() => openLuminaChat()}
              className="w-full justify-between pl-6 pr-2.5 sm:w-auto"
            >
              {t.luminaJourney.cta}
              <ButtonArrow tone="lime" className="-mr-0.5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
