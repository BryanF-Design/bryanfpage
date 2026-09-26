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
 * Una píldora de tinta con el kanji en un sello lima: es la etiqueta que
 * ocupa el recorte superior de cada panel. La numeración de serie viaja al
 * lado, como el `No. 001/182` de los pósters; la lectura en romaji acompaña
 * siempre al kanji.
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
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <span className="tag-pill">
        <span aria-hidden lang="ja" className="seal">
          {kanji.slice(0, 1)}
        </span>
        <span>{label}</span>
      </span>
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
          <span lang="ja" className="font-jp normal-case tracking-[0.2em]">
            {kanji}
          </span>{" "}
          {romaji}
        </span>
      </span>
    </div>
  );
}
