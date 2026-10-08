import { cn } from "@/lib/utils";

interface ChapterMarkProps {
  /** Se conservan por compatibilidad; el chip ya no muestra kanji. */
  kanji?: string;
  romaji?: string;
  /** Etiqueta de la sección. */
  label: string;
  /** Número de sección dentro del recorrido. */
  index: number;
  total?: number;
  className?: string;
}

/** Chip de sección: número en círculo de tinta + nombre de la sección. */
export function ChapterMark({ label, index, className }: ChapterMarkProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <span className="eyebrow">
        <b>{String(index).padStart(2, "0")}</b>
        {label}
      </span>
    </div>
  );
}
