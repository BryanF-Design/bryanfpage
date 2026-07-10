"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Hairline de progreso de lectura: una línea lima que crece con el scroll,
 * pegada al borde superior por encima de la navegación. HUD de taller.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[130] h-[2px] origin-left bg-primary shadow-[0_0_12px_hsl(76_76%_54%/0.7)]"
    />
  );
}
