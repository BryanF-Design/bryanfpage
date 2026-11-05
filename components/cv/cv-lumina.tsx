"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Globe, RotateCcw, X } from "lucide-react";

import type { LevelId } from "@/lib/cv/data";
import type { CvDict } from "@/lib/cv/i18n";
import { useReducedMotionPreference } from "@/lib/motion-preference";
import { cn } from "@/lib/utils";

import { cvStyles as s } from "./cv-parts";

const EXPRESSION: Record<LevelId, string> = {
  perfil: "/img/brand/lumina-normal.webp",
  misiones: "/img/brand/lumina-enfocada.webp",
  inventario: "/img/brand/lumina-sorprendida.webp",
  logros: "/img/brand/lumina-sorprendida.webp",
  academia: "/img/brand/lumina-duda.webp",
  contacto: "/img/brand/lumina-normal.webp",
};

const DESKTOP = "(min-width: 1024px)";

/** Texto que se escribe letra por letra, como en un RPG. */
function useTypewriter(text: string, enabled: boolean) {
  const chars = useRef<string[]>([]);
  // Por grafemas: no parte acentos ni caracteres CJK.
  chars.current = Array.from(text);
  const [count, setCount] = useState(enabled ? 0 : chars.current.length);

  useEffect(() => {
    const total = chars.current.length;
    if (!enabled) {
      setCount(total);
      return;
    }
    setCount(0);
    let i = 0;
    const id = window.setInterval(() => {
      i += 2;
      setCount(Math.min(i, total));
      if (i >= total) window.clearInterval(id);
    }, 22);
    return () => window.clearInterval(id);
  }, [text, enabled]);

  const done = count >= chars.current.length;
  return { shown: done ? text : chars.current.slice(0, count).join(""), done, finish: () => setCount(chars.current.length) };
}

/**
 * Lumina guía el recorrido sin estorbar:
 *  - Teléfono: un dock de una sola fila abajo (◀ Lumina ▶). Muestra dos
 *    líneas; al tocarla se abre el texto completo.
 *  - Escritorio: una tarjeta en la columna derecha (no encima del contenido)
 *    que se abre en cada nivel y se encoge sola al hacer scroll.
 *  - La X la guarda en un botoncito; tocarlo la trae de vuelta.
 */
export function LuminaGuide({
  t,
  level,
  levelIndex,
  total,
  open,
  detectedNote,
  onClose,
  onOpen,
  onPrev,
  onNext,
}: {
  t: CvDict;
  level: LevelId;
  levelIndex: number;
  total: number;
  open: boolean;
  detectedNote: string | null;
  onClose: () => void;
  onOpen: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const reduced = useReducedMotionPreference();
  const line = t.lumina.lines[level];
  const { shown, done, finish } = useTypewriter(line, open && !reduced);
  const [expanded, setExpanded] = useState(false);
  const isLast = levelIndex === total - 1;

  // Cada nivel nuevo: en escritorio se abre; en teléfono queda en dos líneas.
  useEffect(() => {
    setExpanded(window.matchMedia(DESKTOP).matches);
  }, [level]);

  // Al leer (scroll), Lumina se hace a un lado.
  useEffect(() => {
    const y0 = window.scrollY;
    const onScroll = () => {
      if (Math.abs(window.scrollY - y0) > 160) setExpanded(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [level]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={onOpen}
        aria-label={t.ui.showGuide}
        className="fixed bottom-[var(--fab-edge)] right-3 z-[118] grid size-[3.4rem] place-items-center overflow-hidden rounded-full bg-[var(--cv-lime)] ring-4 ring-[#050a08] transition-transform duration-200 hover:scale-105 print:hidden sm:right-6"
      >
        <Image src={EXPRESSION[level]} alt="" width={120} height={156} sizes="64px" className="mt-3 h-auto w-[3.2rem] scale-[1.3]" />
      </button>
    );
  }

  const progress = (levelIndex + 1) / total;

  return (
    <div
      role="region"
      aria-label={t.ui.guideOn}
      className={cn(
        "fixed bottom-[var(--fab-edge)] z-[118] print:hidden",
        "left-[calc(var(--fab-size)+1rem)] right-3 sm:left-[calc(var(--fab-size)+2.25rem)] sm:right-6",
        "lg:left-auto lg:right-[max(1.25rem,calc((100vw-1440px)/2+1.25rem))] lg:w-[300px] xl:w-[330px]"
      )}
    >
      <div className={cn(s.dock, s.dialogIn, "relative rounded-[1.3rem]")}>
        {/* Avance del recorrido. */}
        <span aria-hidden className="absolute inset-x-5 -top-[2px] h-[3px] overflow-hidden rounded-full bg-white/10">
          <span className={cn(s.progressFill, "block h-full bg-[var(--cv-lime)]")} style={{ transform: `scaleX(${progress})` }} />
        </span>

        {/* Retrato grande al estar abierta en escritorio. */}
        {expanded ? (
          <div className="pointer-events-none absolute bottom-[calc(100%-8px)] left-3 hidden w-[4.6rem] lg:block">
            <div className={s.luminaBob}>
              <Image
                key={EXPRESSION[level]}
                src={EXPRESSION[level]}
                alt=""
                width={864}
                height={1121}
                sizes="96px"
                className={cn(s.luminaSwap, "h-auto w-full drop-shadow-[0_10px_18px_rgb(0_0_0/0.6)]")}
              />
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={onClose}
          aria-label={t.ui.muteGuide}
          className="absolute -right-2 -top-2.5 z-10 grid size-7 place-items-center rounded-full bg-[#0c1512] text-white/70 ring-1 ring-white/15 transition-colors hover:text-white"
        >
          <X aria-hidden className="h-3.5 w-3.5" />
        </button>

        <div className="flex items-center gap-2 p-2 pl-2.5">
          <button
            type="button"
            onClick={onPrev}
            disabled={levelIndex === 0}
            aria-label={t.ui.prev}
            className="grid size-10 shrink-0 lg:hidden place-items-center rounded-full bg-white/[0.07] text-white transition-colors hover:bg-white/15 disabled:opacity-30"
          >
            <ChevronLeft aria-hidden className="h-5 w-5" />
          </button>

          {/* Avatar pequeño (en escritorio abierto lo reemplaza el retrato). */}
          <span
            aria-hidden
            className={cn(
              "relative size-11 shrink-0 overflow-hidden rounded-full bg-[var(--cv-lime)] ring-2 ring-[var(--cv-lime)]",
              expanded && "lg:hidden"
            )}
          >
            <Image
              key={EXPRESSION[level]}
              src={EXPRESSION[level]}
              alt=""
              width={120}
              height={156}
              sizes="56px"
              className={cn(s.luminaSwap, "absolute left-1/2 top-1 h-auto w-[3.1rem] max-w-none -translate-x-1/2 scale-[1.25]")}
            />
          </span>

          <button
            type="button"
            onClick={() => {
              if (!done) finish();
              setExpanded((v) => !v);
            }}
            aria-expanded={expanded}
            className="min-w-0 flex-1 text-left"
          >
            <span className="flex items-center gap-1.5">
              <span className={cn(s.pixel, "rounded bg-[var(--cv-lime)] px-1.5 py-px text-[0.6rem] font-bold text-[#0c1512]")}>
                {t.lumina.name}
              </span>
              <span className={cn(s.pixel, "text-[0.58rem] text-white/45")}>
                {String(levelIndex + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
              </span>
              {!expanded ? (
                <span className="ml-auto truncate text-[0.62rem] font-semibold text-[var(--cv-lime)]">{t.ui.readMore}</span>
              ) : null}
            </span>
            <span className="sr-only" aria-live="polite">
              {line}
            </span>
            <span
              aria-hidden
              className={cn(
                "mt-0.5 block text-[0.8rem] leading-snug text-white/90",
                expanded ? "lg:text-[0.86rem]" : "line-clamp-2"
              )}
            >
              {shown}
              {!done && <span className={s.caret} />}
            </span>
          </button>

          <button
            type="button"
            onClick={onNext}
            aria-label={isLast ? t.ui.restart : t.ui.next}
            className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--cv-lime)] text-[#0c1512] transition-transform duration-200 hover:scale-105"
          >
            {isLast ? (
              <RotateCcw aria-hidden className="h-4 w-4" />
            ) : (
              <ChevronRight aria-hidden className={cn("h-5 w-5", s.nextArrow)} />
            )}
          </button>
        </div>

        {expanded && detectedNote ? (
          <p className="-mt-1 flex items-start gap-1.5 px-3.5 pb-2.5 text-[0.68rem] leading-snug text-[var(--cv-lime)]">
            <Globe aria-hidden className="mt-0.5 h-3 w-3 shrink-0" />
            {detectedNote}
          </p>
        ) : null}
      </div>
    </div>
  );
}
