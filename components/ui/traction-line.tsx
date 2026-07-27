"use client";

import { motion } from "framer-motion";

import { useReducedMotionPreference } from "@/lib/motion-preference";
import { cn } from "@/lib/utils";

interface TractionLineProps {
  className?: string;
}

/**
 * Firma visual de BryanF Design.
 *
 * El trazo nace como una línea de carrera, encuentra un nodo de ápex,
 * distribuye la tensión en tres hilos y vuelve a reunirse en una sola ruta.
 * Es deliberadamente abstracto: habla de velocidad, precisión y conexión
 * sin depender de un coche, personaje o emblema reconocible.
 */
export function TractionLine({ className }: TractionLineProps) {
  const reducedMotion = useReducedMotionPreference();
  const initial = reducedMotion ? false : { pathLength: 0, opacity: 0 };

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1200 420"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      className={cn("text-primary", className)}
    >
      <motion.path
        d="M38 338C156 334 218 302 286 246C352 192 410 170 474 170"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={initial}
        whileInView={{ pathLength: 1, opacity: 0.78 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: reducedMotion ? 0 : 0.85, ease: [0.2, 0, 0, 1] }}
      />

      <motion.circle
        cx="474"
        cy="170"
        r="7"
        fill="currentColor"
        initial={reducedMotion ? false : { scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 0.95 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{
          duration: reducedMotion ? 0 : 0.24,
          delay: reducedMotion ? 0 : 0.72,
          ease: [0.2, 0, 0, 1],
        }}
      />
      <circle
        cx="474"
        cy="170"
        r="17"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.32"
        vectorEffect="non-scaling-stroke"
      />

      {[
        "M474 170C596 42 706 52 804 170C854 230 904 224 958 186",
        "M474 170C610 122 714 120 804 170C860 202 906 202 958 186",
        "M474 170C610 282 722 292 812 220C864 178 910 178 958 186",
      ].map((path, index) => (
        <motion.path
          key={path}
          d={path}
          stroke="currentColor"
          strokeWidth={index === 1 ? 2.5 : 1.5}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={initial}
          whileInView={{ pathLength: 1, opacity: index === 1 ? 0.72 : 0.48 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            duration: reducedMotion ? 0 : 0.76,
            delay: reducedMotion ? 0 : 0.7 + index * 0.06,
            ease: [0.2, 0, 0, 1],
          }}
        />
      ))}

      <motion.circle
        cx="958"
        cy="186"
        r="5"
        fill="currentColor"
        initial={reducedMotion ? false : { scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 0.86 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{
          duration: reducedMotion ? 0 : 0.2,
          delay: reducedMotion ? 0 : 1.28,
        }}
      />

      <motion.path
        d="M958 186C1038 196 1090 148 1164 82"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={initial}
        whileInView={{ pathLength: 1, opacity: 0.78 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{
          duration: reducedMotion ? 0 : 0.56,
          delay: reducedMotion ? 0 : 1.2,
          ease: [0.2, 0, 0, 1],
        }}
      />
    </svg>
  );
}
