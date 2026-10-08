"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Sparkle } from "lucide-react";

import { Button, ButtonArrow } from "@/components/ui/button";
import { SectionHeading } from "@/components/sections/section-heading";
import { openLuminaChat } from "@/components/sections/lumina-feature";
import { useReducedMotionPreference } from "@/lib/motion-preference";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";

// El ánimo de Lumina cambia con cada paso, en el mismo orden que
// `luminaJourney.steps`: escucha → recomienda → cotiza → enfoca el pago → celebra.
const STEP_MOODS = [
  "/img/brand/lumina-enfocada.webp",
  "/img/brand/lumina-normal.webp",
  "/img/brand/lumina-duda.webp",
  "/img/brand/lumina-enfocada.webp",
  "/img/brand/lumina-sorprendida.webp",
] as const;

const pad = (n: number) => String(n).padStart(2, "0");

/** Avatar redondo con el recorte de Lumina encuadrado en la cara. */
function LuminaAvatar({ src, className }: { src: string; className?: string }) {
  return (
    <span
      className={cn(
        "relative block shrink-0 overflow-hidden rounded-full bg-lime-soft ring-4 ring-white",
        className
      )}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="64px"
        className="origin-[40%_32%] translate-x-[7%] scale-[1.45] object-cover object-top"
      />
    </span>
  );
}

/** Tramo del riel entre dos avatares: se llena con el scroll (solo transform). */
function RailSegment({
  progress,
  index,
  count,
  reduced,
}: {
  progress: MotionValue<number>;
  index: number;
  count: number;
  reduced: boolean;
}) {
  const start = index / count;
  const fill = useTransform(progress, [start, start + 1 / count], [0, 1]);
  return (
    <span
      aria-hidden
      className="absolute left-7 top-[2.75rem] h-full w-[3px] -translate-x-1/2 overflow-hidden rounded-full bg-ink/10 sm:left-8 sm:top-[3rem]"
    >
      <motion.span
        style={reduced ? { scaleY: 1 } : { scaleY: fill }}
        className="absolute inset-0 origin-top rounded-full bg-lime-deep"
      />
    </span>
  );
}

/**
 * Lumina te acompaña — el recorrido como una conversación.
 *
 * Panel lima con una tarjeta blanca tipo app: la cabecera del chat y, debajo,
 * los cinco pasos como actividad reciente, cada uno con el ánimo de Lumina en
 * su avatar. Un riel une los avatares y se llena al hacer scroll. A un lado,
 * la cabecera de la sección, una burbuja de Lumina y la llamada al chat.
 */
export function LuminaJourney() {
  const { t } = useLanguage();
  const reduced = useReducedMotionPreference();
  const listRef = useRef<HTMLOListElement>(null);

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 80%", "end 60%"],
  });

  const steps = t.luminaJourney.steps;
  const segments = steps.length - 1;
  const bubble = t.luminaSection.phrases[2] ?? t.luminaSection.phrases[0];

  return (
    <section id="lumina-journey" aria-label={t.luminaJourney.title} className="relative">
      <div data-fx="panel">
        <div className="panel panel-lime relative grid gap-6 overflow-hidden p-4 sm:p-7 lg:grid-cols-12 lg:grid-rows-[auto_1fr_auto] lg:gap-x-12 lg:gap-y-8 lg:p-10">
          {/* Cabecera de la sección. */}
          <SectionHeading
            eyebrow={t.luminaJourney.eyebrow}
            title={t.luminaJourney.title}
            subtitle={t.luminaJourney.subtitle}
            chapter={{ index: 6 }}
            className="relative px-1 pt-1 sm:px-0 sm:pt-0 lg:col-span-5 lg:col-start-8 lg:row-start-1"
          />

          {/* Tarjeta tipo app: el chat con los pasos como actividad. */}
          <div
            data-fx="up"
            className="relative min-w-0 lg:col-span-7 lg:col-start-1 lg:row-span-3 lg:row-start-1"
          >
            <div className="panel-card card-pop flex h-full flex-col rounded-[calc(var(--r-panel)-0.75rem)] p-4 shadow-float sm:p-6 lg:p-7">
              {/* Cabecera del chat. */}
              <div className="flex items-center gap-3 border-b border-border pb-4 sm:pb-5">
                <span className="relative">
                  <LuminaAvatar src="/img/brand/lumina-normal.webp" className="size-12 ring-2 ring-lime" />
                  <span
                    aria-hidden
                    className="absolute bottom-0 right-0 size-3.5 rounded-full bg-[hsl(142_70%_42%)] ring-[3px] ring-white"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-bold leading-tight">{t.lumina.name}</span>
                  <span className="block truncate text-sm text-muted-foreground">{t.lumina.online}</span>
                </span>
                <span
                  aria-hidden
                  className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-lime"
                >
                  <Sparkle className="h-5 w-5 fill-lime" />
                </span>
              </div>

              {/* Los pasos: filas de actividad unidas por el riel. */}
              <ol ref={listRef} className="relative mt-1 flex flex-1 flex-col">
                {steps.map((step, i) => {
                  const isLast = i === steps.length - 1;
                  return (
                    <li
                      key={step.title}
                      data-fx="up"
                      style={{ "--fx-delay": `${120 + i * 80}ms` } as CSSProperties}
                      className="relative"
                    >
                      <div className="relative grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-3.5 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-x-4">
                        {!isLast && (
                          <RailSegment
                            progress={scrollYProgress}
                            index={i}
                            count={segments}
                            reduced={reduced}
                          />
                        )}
                        <LuminaAvatar
                          src={STEP_MOODS[i % STEP_MOODS.length]}
                          className={cn(
                            "z-10 mt-4 size-14 sm:size-16",
                            isLast && "ring-lime"
                          )}
                        />
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
                                isLast ? "bg-ink text-lime" : "bg-mint text-ink ring-1 ring-ink/10"
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

          {/* Burbuja de Lumina: su voz, en serif. */}
          <div
            data-fx="pop"
            style={{ "--fx-delay": "160ms" } as CSSProperties}
            className="relative lg:col-span-5 lg:col-start-8 lg:row-start-2 lg:self-center"
          >
            <div className="flex items-end gap-3">
              <LuminaAvatar
                src="/img/brand/lumina-sorprendida.webp"
                className="size-12 ring-[3px] ring-ink"
              />
              <div className="relative rounded-[1.5rem] rounded-bl-md bg-white px-5 py-4 pr-9 shadow-soft">
                <Sparkle
                  aria-hidden
                  className="absolute -right-2.5 -top-3 h-8 w-8 fill-ink text-ink"
                />
                <p className="font-serif text-[1.65rem] italic leading-[1.1] text-ink sm:text-[1.9rem]">
                  “{bubble}”
                </p>
                <p className="mt-1.5 text-xs font-semibold text-ink/60">{t.lumina.name}</p>
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
