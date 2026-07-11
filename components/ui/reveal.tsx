"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Segundos de espera (para escalonar hermanos: 0, 0.08, 0.16…). */
  delay?: number;
  /** Desplazamiento inicial en px. */
  y?: number;
  /** Desenfoque inicial en px (0 lo apaga). */
  blur?: number;
  once?: boolean;
  className?: string;
}

/**
 * Revelado por scroll — la interacción base de todo el sitio: los bloques
 * entran con subida + desenfoque cuando cruzan el viewport. Es un client
 * component a propósito: puede envolver contenido de páginas de servidor
 * (landings SEO) sin arrastrarlas al cliente, y el HTML sigue en el
 * documento para los crawlers.
 */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  blur = 6,
  once = true,
  className,
}: RevealProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y, filter: `blur(${blur}px)` }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-60px 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0, 0, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
