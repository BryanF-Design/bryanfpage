import type { ImageLoaderProps } from "next/image";

/**
 * Topes de ancho para el optimizador de imágenes de Next. El navegador elige
 * del `srcset` según su pantalla; con estos cargadores ninguna variante pasa
 * del tope aunque el teléfono tenga densidad 3x:
 *  - hero: máximo 1600 px
 *  - tarjetas: máximo 800 px
 *  - miniaturas: máximo 400 px
 * Los anchos deben existir en `images.deviceSizes`/`imageSizes`
 * (next.config.mjs); 400, 800 y 1600 están ahí.
 */
function capped(max: number) {
  return function loader({ src, width, quality }: ImageLoaderProps) {
    const w = Math.min(width, max);
    return `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=${quality ?? 75}`;
  };
}

export const heroLoader = capped(1600);
export const cardLoader = capped(800);
export const thumbLoader = capped(400);
