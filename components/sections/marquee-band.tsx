"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import { useReducedMotionPreference } from "@/lib/motion-preference";
import { cn } from "@/lib/utils";

interface MarqueeBandProps {
  words: string[];
  /** Invierte la dirección del desplazamiento. */
  reverse?: boolean;
  /** Grados de inclinación de la cinta. */
  angle?: number;
  /** Cinta de tinta con rótulo delineado lima, en vez de cinta lima. */
  outline?: boolean;
  className?: string;
}

/**
 * Cinta de rótulos ligada al scroll. Cruza la costura entre dos paneles,
 * inclinada y más ancha que la hoja, así que muerde el canto de ambos: es el
 * objeto que rompe la retícula, como la cinta de un póster pegada encima.
 * El texto avanza CON tu scroll, no con un temporizador.
 */
export function MarqueeBand({
  words,
  reverse = false,
  angle = 0,
  outline = false,
  className,
}: MarqueeBandProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionPreference();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    reverse ? ["-30%", "0%"] : ["0%", "-30%"]
  );

  // Cuatro copias del tren de palabras: siempre hay cinta visible.
  const train = Array.from({ length: 4 }, () => words).flat();

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("tape relative -my-4 md:-my-6", className)}
      style={{ transform: angle ? `rotate(${angle}deg)` : undefined }}
    >
      <div
        className={cn(
          "overflow-hidden py-3 md:py-4",
          outline
            ? "bg-background ring-1 ring-foreground/10"
            : "bg-primary text-primary-foreground"
        )}
      >
        <motion.div
          style={reduced ? undefined : { x }}
          className="flex w-max items-center gap-6 whitespace-nowrap md:gap-10"
        >
          {train.map((word, i) => (
            <span key={i} className="flex items-center gap-6 md:gap-10">
              <span
                className={cn(
                  "display-xl text-[2.6rem] leading-none md:text-[4.25rem]",
                  outline && "text-stroke-lime"
                )}
              >
                {word}
              </span>
              <span
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-full font-jp text-[0.7rem] md:size-9 md:text-sm",
                  outline
                    ? "bg-primary text-primary-foreground"
                    : "bg-[hsl(150_42%_6%)] text-[hsl(76_76%_58%)]"
                )}
              >
                {i % 3 === 0 ? "走" : i % 3 === 1 ? "技" : "結"}
              </span>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
