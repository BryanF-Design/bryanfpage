"use client";

import { createContext, useContext, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Numeración por página. Cada sección trae su número "de la home" (`index`);
 * desde que el sitio se dividió en páginas (/, /lumina, /conoce-a-bryan…),
 * cada página declara el orden en que monta sus secciones y el chip muestra
 * la posición real (01, 02, 03…) en vez de saltar de 03 a 09.
 */
const ChapterOrderContext = createContext<number[] | null>(null);

export function ChapterOrder({ order, children }: { order: number[]; children: ReactNode }) {
  return <ChapterOrderContext.Provider value={order}>{children}</ChapterOrderContext.Provider>;
}

interface ChapterMarkProps {
  /** Se conservan por compatibilidad; el chip ya no muestra kanji. */
  kanji?: string;
  romaji?: string;
  /** Etiqueta de la sección. */
  label: string;
  /** Número de sección dentro del recorrido de la home. */
  index: number;
  total?: number;
  className?: string;
}

/** Chip de sección: número en círculo de tinta + nombre de la sección. */
export function ChapterMark({ label, index, className }: ChapterMarkProps) {
  const order = useContext(ChapterOrderContext);
  const position = order ? order.indexOf(index) : -1;
  const shown = position >= 0 ? position + 1 : index;
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <span className="eyebrow">
        <b>{String(shown).padStart(2, "0")}</b>
        {label}
      </span>
    </div>
  );
}
