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
  /** Tamaño del rótulo: `xl` para cabeceras que ocupan su propio panel. */
  size?: "lg" | "xl";
  /**
   * Marca de capítulo. Cuando se pasa, el eyebrow se convierte en píldora con
   * sello + numeración de serie. Sin ella, eyebrow simple.
   */
  chapter?: SectionChapter;
}

/** Total de capítulos del recorrido principal. */
export const CHAPTER_TOTAL = 10;

/**
 * Cabecera de sección: píldora de capítulo, rótulo condensado XXL y bajada.
 * El rótulo se compone como los de las referencias — alto, apretado, en
 * mayúsculas — y entra con una máscara que sube desde abajo.
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
  size = "lg",
  chapter,
}: SectionHeadingProps) {
  return (
    <Reveal>
      <div
        className={cn(
          "flex flex-col gap-5 md:gap-6",
          align === "center" ? "mx-auto max-w-3xl items-center text-center" : "items-start",
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
            className={align === "center" ? "justify-center" : undefined}
          />
        ) : (
          eyebrow && (
            <span className="tag-pill pl-4">
              <span aria-hidden className="size-1.5 rounded-full bg-primary" />
              {eyebrow}
            </span>
          )
        )}
        <div data-fx="up" className="max-w-full">
          <h2
            className={cn(
              "display-xl max-w-4xl text-balance text-foreground",
              size === "xl"
                ? "text-[clamp(3.25rem,9vw,8rem)]"
                : "text-[clamp(2.9rem,6.4vw,5.75rem)]"
            )}
          >
            {title}
          </h2>
        </div>
        {subtitle && (
          <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </Reveal>
  );
}
