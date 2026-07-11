"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

interface TiltProps {
  children: ReactNode;
  className?: string;
  /** Grados máximos de inclinación. */
  max?: number;
  /** Entra revelándose con el scroll (subida + fade). */
  reveal?: boolean;
  revealDelay?: number;
}

/**
 * Inclinación 3D que sigue al puntero (CSS transform, sin three.js): las
 * tarjetas se sienten físicas al pasar el mouse. Solo actúa en dispositivos
 * con hover real y se desactiva con reduced-motion — en touch no hace nada.
 * Con `reveal` la tarjeta además entra animada al cruzar el viewport.
 */
export function Tilt({ children, className, max = 4, reveal = false, revealDelay = 0 }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  function reset() {
    const el = ref.current;
    if (el) el.style.transform = "";
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg)`;
  }

  const inner = (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      className={cn(
        "h-full transition-transform duration-200 will-change-transform [transform-style:preserve-3d]",
        !reveal && className
      )}
    >
      {children}
    </div>
  );

  if (!reveal || reduced) {
    return reveal ? <div className={className}>{inner}</div> : inner;
  }

  // El reveal vive en un wrapper aparte: su transform (y) no pelea con el
  // transform del tilt, que se escribe inline sobre el div interno.
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: revealDelay, ease: [0.2, 0, 0, 1] }}
      className={className}
    >
      {inner}
    </motion.div>
  );
}
