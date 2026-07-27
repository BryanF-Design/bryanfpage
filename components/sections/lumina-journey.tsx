"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/sections/section-heading";
import { openLuminaChat } from "@/components/sections/lumina-feature";
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
 * Narrativa por pasos de Lumina: cuenta, de arriba hacia abajo, cómo te lleva
 * del "no sé qué necesito" hasta el proyecto arrancado. Un riel vertical se va
 * llenando con el scroll (capa primaria sobre la hairline) y cada paso revela
 * su tarjeta con el avatar de Lumina en el ánimo que le toca a esa etapa.
 * Respeta prefers-reduced-motion: sin riel animado ni deslizamientos.
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
      className="relative overflow-hidden border-t border-border py-20 md:py-28"
    >
      <div aria-hidden className="mesh-glow-c opacity-40" />
      <div className="container relative">
        <SectionHeading
          eyebrow={t.luminaJourney.eyebrow}
          title={t.luminaJourney.title}
          subtitle={t.luminaJourney.subtitle}
        />

        <div ref={railRef} className="relative mx-auto mt-14 max-w-3xl md:mt-20">
          {/* Riel base (hairline) + relleno que sigue el scroll. */}
          <div
            aria-hidden
            className="absolute bottom-3 left-[23px] top-3 w-px bg-border"
          />
          <motion.div
            aria-hidden
            style={reduced ? { scaleY: 1 } : { scaleY: fill }}
            className="absolute bottom-3 left-[23px] top-3 w-px origin-top bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.5)]"
          />

          <ol className="flex flex-col gap-8 md:gap-12">
            {steps.map((step, i) => (
              <motion.li
                key={step.title}
                initial={reduced ? false : { opacity: 0, y: 20 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, ease: [0.2, 0, 0, 1] }}
                className="relative grid grid-cols-[48px_1fr] gap-4 md:gap-6"
              >
                {/* Nodo: avatar de Lumina en su ánimo del paso, sobre el riel. */}
                <div className="relative flex justify-center">
                  <span className="relative z-10 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-background ring-1 ring-primary/45">
                    <Image
                      src={STEP_MOODS[i % STEP_MOODS.length]}
                      alt=""
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </span>
                </div>

                <div className="glass elevate corner-ticks rounded-lg p-5 md:p-6">
                  <span className="tech-label text-primary">
                    {String(i + 1).padStart(2, "0")} · {step.title}
                  </span>
                  <p className="mt-2 text-pretty text-sm text-muted-foreground md:text-base">
                    {step.desc}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        <div className="mt-12 flex justify-center md:mt-16">
          <Button size="lg" onClick={() => openLuminaChat()}>
            {t.luminaJourney.cta}
          </Button>
        </div>
      </div>
    </section>
  );
}
