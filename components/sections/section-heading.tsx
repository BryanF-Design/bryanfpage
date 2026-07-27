import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";
import { ChapterMark } from "@/components/japan/chapter-mark";

interface SectionChapter {
  /** Kanji de la sección. */
  kanji: string;
  /** Lectura en romaji — el japonés nunca viaja solo. */
  romaji: string;
  /** Posición dentro de la serie. */
  index: number;
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
  /**
   * Marca de capítulo. Cuando se pasa, el eyebrow se convierte en sello +
   * numeración de serie. Sin ella la cabecera se comporta como antes, que es
   * lo que necesitan las landings de servicio.
   */
  chapter?: SectionChapter;
}

/** Total de capítulos del recorrido principal. */
export const CHAPTER_TOTAL = 10;

/**
 * Cabecera de sección.
 *
 * El eyebrow abría con un cuadrito lima genérico, igual en las diez
 * secciones: no situaba nada. Con `chapter` pasa a ser un sello con el kanji
 * de la sección y su lugar en la serie —`章 04 / 10`—, que es el recurso con
 * el que los pósters de la carpeta numeran sus láminas.
 *
 * Sin `chapter` el comportamiento es el de antes, para no alterar las
 * landings de servicio.
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
  chapter,
}: SectionHeadingProps) {
  return (
    <Reveal>
      <div
        className={cn(
          "flex flex-col gap-5 border-t border-border pt-6",
          align === "center" ? "mx-auto max-w-2xl items-center text-center" : "items-start",
          className
        )}
      >
        {eyebrow && chapter ? (
          <ChapterMark
            kanji={chapter.kanji}
            romaji={chapter.romaji}
            label={eyebrow}
            index={chapter.index}
            total={CHAPTER_TOTAL}
            className={align === "center" ? "justify-center" : "w-full"}
          />
        ) : (
          eyebrow && (
            <span className="tech-label inline-flex items-center gap-3 text-primary">
              <span className="h-1.5 w-1.5 bg-primary" />
              {eyebrow}
            </span>
          )
        )}
        <h2 className="max-w-3xl font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          {title}
        </h2>
        {subtitle && (
          <p className="max-w-2xl text-pretty text-base text-muted-foreground md:text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </Reveal>
  );
}
