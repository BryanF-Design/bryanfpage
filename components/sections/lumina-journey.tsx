"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/sections/section-heading";
import { openLuminaChat } from "@/components/sections/lumina-feature";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";

// El estado (mood) de Lumina cambia con cada paso — reutiliza las mismas
// imágenes del avatar del chat, en el mismo orden que `luminaJourney.steps`:
// escucha → responde → analiza/cotiza → enfoca el pago → celebra.
const STEP_MOODS = [
  "/img/lumina/Enfocada.png",
  "/img/lumina/Normal.png",
  "/img/lumina/Duda.png",
  "/img/lumina/Enfocada.png",
  "/img/lumina/Sorprendida.png",
] as const;

/**
 * 道筋 — el recorrido con Lumina.
 *
 * Un riel central se llena con el scroll y los pasos se reparten a los dos
 * lados, entrando desde fuera del lienzo por el lado que les toca. El avatar
 * de cada paso se monta sobre el riel, mordiendo el canto de su ficha. En
 * teléfono el riel pasa al margen izquierdo y todo entra desde la derecha.
 */
export function LuminaJourney() {
  const { t } = useLanguage();
  const reduced = useReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 75%", "end 55%"],
  });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const steps = t.luminaJourney.steps;

  return (
    <section
      id="lumina-journey"
      aria-label={t.luminaJourney.title}
      className="panel relative overflow-hidden px-5 py-12 md:px-10 md:py-16 lg:px-14 lg:py-20"
    >
      <div aria-hidden className="mesh-glow-c opacity-60" />
      <div aria-hidden className="dot-grid absolute inset-0 rounded-[inherit] opacity-25" />

      <div className="relative">
        <SectionHeading
          eyebrow={t.luminaJourney.eyebrow}
          title={t.luminaJourney.title}
          subtitle={t.luminaJourney.subtitle}
          chapter={{ kanji: "道筋", romaji: "michisuji", index: 6 }}
          align="center"
        />

        <div ref={railRef} className="relative mx-auto mt-14 max-w-5xl md:mt-20">
          {/* Riel base + relleno que sigue el scroll. */}
          <div
            aria-hidden
            className="absolute bottom-6 left-[27px] top-6 w-[3px] rounded-full bg-foreground/10 md:left-1/2 md:-translate-x-1/2"
          />
          <motion.div
            aria-hidden
            style={reduced ? { scaleY: 1 } : { scaleY: fill }}
            className="absolute bottom-6 left-[27px] top-6 w-[3px] origin-top rounded-full bg-primary shadow-[0_0_14px_hsl(var(--primary)/0.6)] md:left-1/2 md:-translate-x-1/2"
          />

          <ol className="flex flex-col gap-6 md:gap-4">
            {steps.map((step, i) => {
              const right = i % 2 === 1;
              return (
                <li
                  key={step.title}
                  className={cn(
                    "relative grid grid-cols-[56px_1fr] items-center gap-4 md:grid-cols-[1fr_72px_1fr] md:gap-6"
                  )}
                >
                  {/* Nodo: avatar de Lumina en su ánimo del paso, sobre el riel. */}
                  <div
                    data-fx="pop"
                    style={{ "--fx-delay": "120ms" } as CSSProperties}
                    className="relative z-10 flex justify-center md:col-start-2 md:row-start-1"
                  >
                    <span className="relative flex size-14 items-center justify-center overflow-hidden rounded-full bg-background ring-4 ring-primary/70 md:size-[72px]">
                      <Image
                        src={STEP_MOODS[i % STEP_MOODS.length]}
                        alt=""
                        fill
                        sizes="72px"
                        className="object-cover"
                      />
                    </span>
                  </div>

                  <div
                    data-fx={right ? "right" : "left"}
                    className={cn(
                      "min-w-0 md:row-start-1",
                      right ? "md:col-start-3" : "md:col-start-1"
                    )}
                  >
                    <div
                      className={cn(
                        "group rounded-inner p-5 transition-transform duration-500 hover:-translate-y-1 md:p-6",
                        i === steps.length - 1
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary ring-1 ring-foreground/10"
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={cn(
                            "display-xl text-4xl leading-none",
                            i === steps.length - 1 ? "text-primary-foreground" : "text-primary"
                          )}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="display-xl text-[1.7rem] leading-none md:text-[2rem]">
                          {step.title}
                        </span>
                      </span>
                      <p
                        className={cn(
                          "mt-3 text-pretty text-sm md:text-base",
                          i === steps.length - 1 ? "text-primary-foreground/80" : "text-muted-foreground"
                        )}
                      >
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div data-fx="pop" className="mt-12 flex justify-center md:mt-16">
          <Button size="lg" onClick={() => openLuminaChat()}>
            {t.luminaJourney.cta}
          </Button>
        </div>
      </div>
    </section>
  );
}
