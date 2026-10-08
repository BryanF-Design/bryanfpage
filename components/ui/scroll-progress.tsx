"use client";

import { motion, useScroll, useSpring } from "framer-motion";

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

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[130] h-[3px]">
      <motion.div
        style={{ scaleX: progress }}
        className="absolute inset-0 origin-left rounded-r-full bg-lime"
      />
    </div>
  );
}
