"use client";

import { Fragment, useState, type CSSProperties } from "react";
import { Pause, Play, Sparkle } from "lucide-react";

import { useLanguage } from "@/lib/i18n/context";
import { useReducedMotionPreference } from "@/lib/motion-preference";
import { cn } from "@/lib/utils";

interface MarqueeBandProps {
  words: string[];
  /** Invierte la dirección del desplazamiento. */
  reverse?: boolean;
  /** Grados de inclinación de la cinta (solo desde tableta: en teléfono va recta). */
  angle?: number;
  /** Cinta de tinta con rótulo blanco y destellos lima, en vez de cinta lima. */
  outline?: boolean;
  className?: string;
}

// El bucle vive en CSS: la pista lleva dos tramos idénticos y se desplaza
// -50 %, así que el corte nunca se ve. Solo anima transform.
const BAND_KEYFRAMES = "@keyframes band-x{to{transform:translate3d(-50%,0,0)}}";

/**
 * Botón redondo de pausa/reanudar para las cintas que corren solas (WCAG
 * 2.2.2): el nombre es fijo ("Pausar animación") y `aria-pressed` dice si
 * está detenida. Lo comparten la cinta de rótulos y la de logos.
 */
export function MarqueeToggle({
  paused,
  onToggle,
  className,
}: {
  paused: boolean;
  onToggle: () => void;
  className?: string;
}) {
  const { t } = useLanguage();
  const Icon = paused ? Play : Pause;

  return (
    <button
      type="button"
      aria-pressed={paused}
      aria-label={t.marquee.pause}
      title={paused ? t.marquee.play : t.marquee.pause}
      onClick={onToggle}
      className={cn(
        "grid size-11 shrink-0 place-items-center rounded-full transition-transform duration-200 hover:-translate-y-0.5 active:scale-95",
        className
      )}
    >
      <Icon aria-hidden className="size-4 fill-current" />
    </button>
  );
}

/**
 * Cinta de rótulos: una píldora lima (o tinta) a lo ancho de la columna, con
 * palabras grandes en Archivo y destellos en círculo entre ellas. Corre sola
 * a velocidad constante; se detiene bajo el puntero, con el foco dentro o con
 * el botón de pausa del extremo, y queda quieta con movimiento reducido (la
 * regla global corta la animación y el botón ya no hace falta).
 */
export function MarqueeBand({
  words,
  reverse = false,
  angle = 0,
  outline = false,
  className,
}: MarqueeBandProps) {
  const reduced = useReducedMotionPreference();
  const [paused, setPaused] = useState(false);
  // Cada tramo repite las palabras dos veces: siempre cubre la cinta, aun en
  // idiomas con palabras cortas.
  const run = [...words, ...words];
  // Duración proporcional al largo del tramo (los ideogramas miden el doble
  // que una letra latina), para que la velocidad sea igual en cada idioma.
  const width = Array.from(run.join("")).reduce(
    (sum, char) => sum + (char.charCodeAt(0) > 0x2e80 ? 2 : 1),
    0
  );
  const seconds = Math.max(24, Math.round(width * 0.47 + run.length * 1.3));

  return (
    <div
      className={cn("tape relative min-w-0", className)}
      style={{ "--band-angle": `${angle}deg` } as CSSProperties}
    >
      <style>{BAND_KEYFRAMES}</style>
      <div
        className={cn(
          "panel group/band overflow-hidden md:[transform:rotate(var(--band-angle))]",
          outline ? "panel-ink" : "panel-lime shadow-soft"
        )}
      >
        <div
          aria-hidden
          className="flex w-max hover:[animation-play-state:paused] group-focus-within/band:[animation-play-state:paused]"
          // Propiedades sueltas (no el atajo `animation`) para que la pausa
          // bajo el puntero, que vive en una clase, pueda ganar. La pausa del
          // botón solo se escribe cuando está activa.
          style={{
            animationName: "band-x",
            animationDuration: `${seconds}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationDirection: reverse ? "reverse" : "normal",
            animationPlayState: paused ? "paused" : undefined,
          }}
        >
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="flex shrink-0 items-center gap-4 py-3.5 pr-4 sm:gap-6 sm:py-5 sm:pr-6 lg:gap-9 lg:py-6 lg:pr-9"
            >
              {run.map((word, i) => (
                <Fragment key={i}>
                  {/* Alterna el rótulo pesado en mayúsculas con la itálica del
                      hero ("Haz que"), como el titular partido. */}
                  <span
                    className={cn(
                      "whitespace-nowrap text-[clamp(2.75rem,7.2vw,6.5rem)] leading-[0.95]",
                      i % 2 === 0 ? "display-xl" : "display-italic pr-[0.08em]",
                      outline ? "text-white" : "text-ink"
                    )}
                  >
                    {word}
                  </span>
                  <span
                    className={cn(
                      "grid size-10 shrink-0 place-items-center rounded-full sm:size-12 lg:size-16",
                      outline ? "bg-lime text-ink" : "bg-ink text-lime"
                    )}
                  >
                    <Sparkle className="size-5 fill-current sm:size-6 lg:size-8" />
                  </span>
                </Fragment>
              ))}
            </div>
          ))}
        </div>

        {!reduced && (
          <>
            {/* Desvanecido del color de la cinta: separa el botón del rótulo. */}
            <span
              aria-hidden
              className={cn(
                "pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l to-transparent sm:w-28",
                outline ? "from-ink from-40%" : "from-lime from-40%"
              )}
            />
            <MarqueeToggle
              paused={paused}
              onToggle={() => setPaused((p) => !p)}
              className="absolute right-2.5 top-1/2 z-10 -translate-y-1/2 bg-white text-ink shadow-pop hover:-translate-y-[calc(50%+2px)] sm:right-4 lg:right-5"
            />
          </>
        )}
      </div>
    </div>
  );
}
