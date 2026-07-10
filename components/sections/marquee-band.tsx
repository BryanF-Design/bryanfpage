"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

import { cn } from "@/lib/utils";

interface MarqueeBandProps {
  words: string[];
  /** Invierte la dirección del desplazamiento. */
  reverse?: boolean;
  /** Grados de inclinación de la banda (energía editorial). */
  angle?: number;
  /** Texto delineado (stroke lima) en vez de relleno. */
  outline?: boolean;
  className?: string;
}

/**
 * Banda de titulares ligada al scroll: el texto gigante se desplaza en
 * horizontal conforme bajas (no con un timer — CON tu scroll), como créditos
 * de taller cruzando la pantalla. El truco parallax más barato que existe:
 * un transform, cero JS por frame.
 */
export function MarqueeBand({
  words,
  reverse = false,
  angle = 0,
  outline = false,
  className,
}: MarqueeBandProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    reverse ? ["-32%", "0%"] : ["0%", "-32%"]
  );

  // Cuatro copias del tren de palabras: siempre hay banda visible.
  const train = Array.from({ length: 4 }, () => words).flat();

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("relative overflow-hidden border-y border-border py-5 md:py-7", className)}
      style={{ transform: angle ? `rotate(${angle}deg) scale(1.06)` : undefined }}
    >
      <motion.div
        style={reduced ? undefined : { x }}
        className="flex w-max items-center gap-8 whitespace-nowrap md:gap-14"
      >
        {train.map((word, i) => (
          <span key={i} className="flex items-center gap-8 md:gap-14">
            <span
              className={cn(
                "font-display text-4xl font-bold uppercase leading-none tracking-tight md:text-6xl",
                outline ? "text-stroke-lime" : i % 2 ? "text-foreground/90" : "text-primary"
              )}
            >
              {word}
            </span>
            <span className="h-2 w-2 shrink-0 bg-primary md:h-2.5 md:w-2.5" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}
