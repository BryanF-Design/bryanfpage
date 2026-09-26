"use client";

import { useLanguage } from "@/lib/i18n/context";

/**
 * 版面 — la hoja.
 *
 * Un paspartú de washi fijo alrededor del viewport, con las esquinas
 * interiores redondas. Los paneles del sitio se deslizan por debajo, así que
 * la página se lee como una sola lámina recortada — el recurso central de
 * las referencias bento — y no como bloques sueltos en un lienzo infinito.
 *
 * En los cantos laterales corre la misma tira de datos de los pósters:
 * coordenadas y lectura, en vertical, sin explicar nada. Solo cuando el
 * canto es lo bastante ancho para leerse.
 */
export function PageFrame() {
  const { t } = useLanguage();

  return (
    <div aria-hidden className="sheet-frame">
      <span />
      <p className="absolute bottom-[18%] left-0 hidden w-[var(--gutter)] justify-center font-mono text-[8px] uppercase leading-none tracking-[0.42em] text-[hsl(160_36%_6%/0.45)] xl:flex">
        <span className="vertical-jp whitespace-nowrap [transform:rotate(180deg)]">
          BryanF Design · <span className="font-jp">精度</span> · {t.experience.precision}
        </span>
      </p>
      <p className="absolute right-0 top-[22%] hidden w-[var(--gutter)] justify-center font-mono text-[8px] uppercase leading-none tracking-[0.42em] text-[hsl(160_36%_6%/0.45)] xl:flex">
        <span className="vertical-jp whitespace-nowrap">19.4326° N · 99.1332° W · CDMX / MX</span>
      </p>
    </div>
  );
}
