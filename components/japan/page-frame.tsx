"use client";

import { useLanguage } from "@/lib/i18n/context";

/**
 * 版面 — el marco de página.
 *
 * Las once referencias de la carpeta comparten esto antes que el color o el
 * kanji: todas están enmarcadas. El contenido vive dentro de una hoja, no en
 * un lienzo negro infinito.
 *
 * El marco es fijo, no intercepta punteros y arranca por debajo del header
 * para no cruzarle la marca. El preloader traza este mismo rectángulo antes
 * de levantarse, así que la secuencia de entrada no es una animación previa a
 * la página: es la página construyéndose.
 */
export function PageFrame() {
  const { t } = useLanguage();

  return (
    <div aria-hidden className="page-frame">
      <span className="frame-edge frame-edge-left">
        <span>BryanF Design</span>
        <span className="h-px w-8 bg-current opacity-40" />
        <span lang="ja" className="font-jp tracking-[0.2em]">
          精度
        </span>
        <span>{t.experience.precision}</span>
      </span>

      <span className="frame-edge frame-edge-right">
        <span>19.4326° N · 99.1332° W</span>
        <span className="h-px w-8 bg-current opacity-40" />
        <span>CDMX / MX</span>
      </span>
    </div>
  );
}
