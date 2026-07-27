"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import { subscribeVtec } from "@/lib/vtec";

/**
 * Tacómetro de lectura: la barra lima crece con el scroll y entra en zona roja
 * en el último tramo de la página — el bermellón aparece justo donde un
 * cuentavueltas lo pondría. Teclear "vtec" la manda al corte, pase lo que pase
 * con el scroll.
 *
 * La zona roja es una segunda capa encima de la lima en vez de una
 * interpolación de color: así ambas siguen leyendo sus tokens CSS y el modo de
 * alto contraste del panel de accesibilidad las sigue afectando.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  // El nivel de VTEC se escribe en un motion value, no en estado de React:
  // el easter egg emite un valor por frame durante casi dos segundos y no
  // vale la pena re-renderizar por cada uno.
  const rev = useMotionValue(0);
  useEffect(() => subscribeVtec((level) => rev.set(level)), [rev]);

  // Con VTEC la aguja se va al tope aunque estés arriba del todo.
  const fill = useTransform([scaleX, rev], ([s, r]: number[]) => Math.max(s, r));
  const scrollRed = useTransform(scrollYProgress, [0.84, 0.97], [0, 1]);
  const red = useTransform([scrollRed, rev], ([s, r]: number[]) => Math.max(s, r));

  return (
    <>
      {/* Marcas del cuentavueltas: estáticas, como la esfera de un reloj. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[129] h-[2px] opacity-[0.18] [background-image:repeating-linear-gradient(90deg,hsl(var(--primary))_0_1px,transparent_1px_5%)]"
      />
      <motion.div
        aria-hidden
        style={{ scaleX: fill }}
        className="fixed inset-x-0 top-0 z-[130] h-[2px] origin-left bg-primary shadow-[0_0_12px_hsl(76_76%_54%/0.7)]"
      />
      {/* Zona roja: se enciende encima de la lima al final del recorrido. */}
      <motion.div
        aria-hidden
        style={{ scaleX: fill, opacity: red }}
        className="fixed inset-x-0 top-0 z-[131] h-[2px] origin-left bg-redline shadow-[0_0_14px_hsl(6_78%_52%/0.8)]"
      />
      {/* Testigo de corte. Solo existe mientras el easter egg está vivo. */}
      <motion.span
        aria-hidden
        style={{ opacity: rev }}
        className="tech-label pointer-events-none fixed right-4 top-3 z-[131] text-redline"
      >
        VTEC
      </motion.span>
    </>
  );
}
