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
        <div className="absolute inset-x-0 top-0 h-px bg-border/60" />
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
      <div className="absolute inset-x-0 top-0 h-px bg-border/60" />
      <motion.div
        style={{ scaleX: progress }}
        className="absolute inset-x-0 top-0 h-[2px] origin-left bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.45)]"
      />
      <motion.span
        style={{ left: nodePosition }}
        className="absolute top-px size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary bg-background shadow-[0_0_10px_hsl(var(--primary)/0.65)]"
      />
    </div>
  );
}
