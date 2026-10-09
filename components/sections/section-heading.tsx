import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { ChapterMark } from "@/components/sections/chapter-mark";

interface SectionChapter {
  /** Se conservan por compatibilidad con las llamadas existentes. */
  kanji?: string;
  romaji?: string;
  /** Posición dentro del recorrido. */
  index: number;
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "left";
  className?: string;
  /** `xl` para cabeceras que ocupan su propio panel. */
  size?: "lg" | "xl";
  chapter?: SectionChapter;
}

/** Total de secciones del recorrido principal. */
export const CHAPTER_TOTAL = 10;

/**
 * Cabecera de sección: chip numerado, titular en Archivo y bajada. La clase
 * va en el elemento externo para que funcione como celda de una retícula.
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
    <div
      className={cn(
        "flex flex-col gap-4 md:gap-5",
        align === "center" ? "mx-auto max-w-3xl items-center text-center" : "items-start",
        className
      )}
    >
      {eyebrow && chapter ? (
        <ChapterMark
          label={eyebrow}
          index={chapter.index}
          className={align === "center" ? "justify-center" : undefined}
        />
      ) : (
        eyebrow && (
          <span className="eyebrow pl-3">
            <span aria-hidden className="size-2 rounded-full bg-lime" />
            {eyebrow}
          </span>
        )
      )}
      <div data-fx="up" className="max-w-full">
        <h2
          className={cn(
            "display-title max-w-4xl text-balance text-foreground",
            size === "xl"
              ? "text-[clamp(2.6rem,6.4vw,5.75rem)]"
              : "text-[clamp(2.25rem,4.6vw,4.25rem)]"
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
  );
}
