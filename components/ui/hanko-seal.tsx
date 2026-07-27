"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

interface HankoSealProps {
  /** Tamaño del sello en px. */
  size?: number;
  className?: string;
  /** Etiqueta accesible: el sello es una firma, no decoración muda. */
  label?: string;
}

/**
 * 判子 — el sello del artesano.
 *
 * En Japón un trabajo se firma estampando el sello personal en bermellón. Aquí
 * cierra el sitio: el nombre en katakana, en dos columnas de derecha a
 * izquierda como manda el tategaki, dentro del cuadro rojo.
 *
 * Se estampa al aparecer, con el golpe seco de un sello de verdad — entra
 * grande y torcido y se asienta. Al tocarlo se vuelve a estampar.
 */
export function HankoSeal({ size = 58, className, label = "Bryan F." }: HankoSealProps) {
  const reduced = useReducedMotion();
  const [stamps, setStamps] = useState(0);

  const stamp = reduced
    ? {}
    : {
        initial: { scale: 1.6, opacity: 0, rotate: -16 },
        whileInView: { scale: 1, opacity: 1, rotate: -4 },
        viewport: { once: true, margin: "-30px" },
        transition: { type: "spring" as const, stiffness: 520, damping: 17 },
      };

  return (
    <motion.button
      type="button"
      // La clave cambia en cada toque: React remonta y la animación de
      // estampado se vuelve a reproducir desde cero.
      key={stamps}
      onClick={() => setStamps((n) => n + 1)}
      aria-label={label}
      title={label}
      {...stamp}
      whileTap={reduced ? undefined : { scale: 0.88, rotate: -9 }}
      // El cuerpo se deriva del tamaño del sello: tres katakana tienen que
      // llenar la columna de arriba abajo, como en un sello tallado de verdad.
      style={{ width: size, height: size, fontSize: size * 0.26 }}
      className={cn(
        "hanko shrink-0 cursor-pointer flex-row-reverse items-start gap-[1px] p-[3px]",
        className
      )}
    >
      <span className="vertical-jp !tracking-normal leading-none">ブライ</span>
      <span className="vertical-jp !tracking-normal leading-none">アン</span>
    </motion.button>
  );
}
