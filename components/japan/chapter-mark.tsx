import { cn } from "@/lib/utils";

interface ChapterMarkProps {
  /** Kanji de la sección. Va dentro del sello. */
  kanji: string;
  /** Lectura del kanji en romaji. */
  romaji: string;
  /** Etiqueta latina — la que realmente informa. */
  label: string;
  /** Número de capítulo dentro de la serie. */
  index: number;
  /** Total de capítulos. Los pósters de referencia numeran así: 001/182. */
  total?: number;
  className?: string;
}

/**
 * 章 — marca de capítulo.
 *
 * Un scroll de 18 000 px no tenía columna vertebral: cada sección aparecía
 * sin lugar dentro de una serie. Los pósters de la carpeta sí lo resuelven —
 * `Poster No. 001/182`, código de barras, sello — y esa es exactamente la
 * pieza que faltaba.
 *
 * El sello lleva el kanji; la lectura y la traducción viajan al lado, nunca
 * sueltas. El bermellón vive aquí y en el preloader: nunca en una acción.
 */
export function ChapterMark({
  kanji,
  romaji,
  label,
  index,
  total = 8,
  className,
}: ChapterMarkProps) {
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <span aria-hidden className="chapter-seal">
        <span lang="ja">{kanji}</span>
      </span>

      <span className="flex min-w-0 flex-col gap-1">
        <span className="tech-label text-primary">{label}</span>
        <span className="chapter-index flex items-center gap-2">
          <span aria-hidden lang="ja" className="font-jp tracking-[0.2em]">
            章
          </span>
          <span>
            <b>{pad(index)}</b> / {pad(total)}
          </span>
          <span aria-hidden className="opacity-50">
            ·
          </span>
          <span aria-hidden className="uppercase">
            {romaji}
          </span>
        </span>
      </span>

      <span aria-hidden className="rule-flank hidden min-w-0 flex-1 sm:block" />
    </div>
  );
}
