"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";

import { useReducedMotionPreference } from "@/lib/motion-preference";

/**
 * Una línea de tracción discreta: acompaña la lectura sin convertir la
 * interfaz en un tablero de auto ni introducir un segundo color de marca.
 */
export function ScrollProgress() {
  const reducedMotion = useReducedMotionPreference();

  if (reducedMotion) {
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[130] h-[3px]"
      >
      </div>
    );
  }

  return <AnimatedScrollProgress />;
}

function AnimatedScrollProgress() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });
  const nodePosition = useTransform(progress, (value) => `${value * 100}%`);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[130] h-[3px]"
    >
      {/* Tinta sobre el canto washi de la hoja: la regla que se va llenando. */}
      <motion.div
        style={{ scaleX: progress }}
        className="absolute inset-x-0 top-0 h-[3px] origin-left rounded-r-full bg-[hsl(160_36%_6%/0.85)]"
      />
      <motion.span
        style={{ left: nodePosition }}
        className="absolute top-[1.5px] size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-2 ring-[hsl(160_36%_6%)]"
      />
    </div>
  );
}
