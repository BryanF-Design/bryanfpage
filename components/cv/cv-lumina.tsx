"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Globe, RotateCcw, X } from "lucide-react";

import type { LevelId } from "@/lib/cv/data";
import type { CvDict } from "@/lib/cv/i18n";
import { useReducedMotionPreference } from "@/lib/motion-preference";
import { cn } from "@/lib/utils";

import { cvStyles as s } from "./cv-parts";


// Miniaturas: la cara recortada de cada expresión (160 px), sin escalar ni
// mover con CSS, para que siempre quede centrada.
const FACE: Record<LevelId, string> = {
  perfil: "/img/cv/lumina-face-normal.webp",
  misiones: "/img/cv/lumina-face-enfocada.webp",
  inventario: "/img/cv/lumina-face-sorprendida.webp",
  logros: "/img/cv/lumina-face-sorprendida.webp",
  academia: "/img/cv/lumina-face-duda.webp",
  contacto: "/img/cv/lumina-face-normal.webp",
};


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
  variant = "fixed",
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
  /** "fixed": dock flotante (teléfono y tableta). "aside": dentro de la
   *  columna derecha en escritorio, debajo de la ficha, sin encimarse. */
  variant?: "fixed" | "aside";
}) {
  const aside = variant === "aside";
  const reduced = useReducedMotionPreference();
  const line = t.lumina.lines[level];
  const { shown, done, finish } = useTypewriter(line, open && !reduced);
  const [expanded, setExpanded] = useState(false);
  const isLast = levelIndex === total - 1;

  // Cada nivel nuevo: en la columna se abre; en el dock queda en dos líneas.
  useEffect(() => {
    setExpanded(aside);
  }, [level, aside]);

  // Al leer (scroll), Lumina se hace a un lado.
  useEffect(() => {
    if (aside) return; // en la columna no tapa nada: se queda abierta
    const y0 = window.scrollY;
    const onScroll = () => {
      if (Math.abs(window.scrollY - y0) > 160) setExpanded(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [level, aside]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={onOpen}
        aria-label={t.ui.showGuide}
        className={cn(
          "grid size-[3.4rem] place-items-center overflow-hidden rounded-full bg-[var(--cv-lime)] ring-4 ring-[#050a08] transition-transform duration-200 hover:scale-105 print:hidden",
          aside ? "relative mt-4" : "fixed bottom-[var(--fab-edge)] right-3 z-[118] sm:right-6 lg:hidden"
        )}
      >
        <Image src={FACE[level]} alt="" width={160} height={160} sizes="56px" className="size-full rounded-full object-cover" />
      </button>
    );
  }

  const progress = (levelIndex + 1) / total;

  // Escritorio: tarjeta vertical en la columna derecha, texto a todo lo ancho.
  if (aside) {
    return (
      <div role="region" aria-label={t.ui.guideOn} className="relative mt-4 print:hidden">
        <div className={cn(s.dock, s.dialogIn, "relative rounded-[1.3rem] p-3")}>
          <span aria-hidden className="absolute inset-x-5 -top-[2px] h-[3px] overflow-hidden rounded-full bg-white/10">
            <span className={cn(s.progressFill, "block h-full bg-[var(--cv-lime)]")} style={{ transform: `scaleX(${progress})` }} />
          </span>
          <div className="flex items-center gap-2.5">
            <span aria-hidden className="relative size-11 shrink-0 overflow-hidden rounded-full bg-[var(--cv-lime)] ring-2 ring-[var(--cv-lime)]">
              <Image key={FACE[level]} src={FACE[level]} alt="" width={160} height={160} sizes="48px" className={cn(s.luminaSwap, "size-full object-cover")} />
            </span>
            <span className="min-w-0 flex-1">
              <span className={cn(s.pixel, "rounded bg-[var(--cv-lime)] px-1.5 py-px text-[0.6rem] font-bold text-[#0c1512]")}>{t.lumina.name}</span>
              <span className="mt-0.5 block text-[0.68rem] text-white/50">{t.lumina.role}</span>
            </span>
            <span className={cn(s.pixel, "text-[0.6rem] text-white/45")}>
              {String(levelIndex + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label={t.ui.muteGuide}
              className="grid size-7 place-items-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X aria-hidden className="h-4 w-4" />
            </button>
          </div>
          <p className="sr-only" aria-live="polite">
            {line}
          </p>
          <p aria-hidden onClick={finish} className="mt-2.5 min-h-[3.6rem] text-[0.84rem] leading-snug text-white/90">
            {shown}
            {!done && <span className={s.caret} />}
          </p>
          {detectedNote ? (
            <p className="mt-2 flex items-start gap-1.5 text-[0.68rem] leading-snug text-[var(--cv-lime)]">
              <Globe aria-hidden className="mt-0.5 h-3 w-3 shrink-0" />
              {detectedNote}
            </p>
          ) : null}
          <div className="mt-3 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={onPrev}
              disabled={levelIndex === 0}
              className="inline-flex h-9 items-center gap-1 rounded-full px-3 text-xs font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronLeft aria-hidden className="h-4 w-4" />
              {t.ui.prev}
            </button>
            <button
              type="button"
              onClick={onNext}
              className={cn(
                s.pixel,
                "inline-flex h-9 items-center gap-1.5 rounded-full bg-[var(--cv-lime)] px-4 text-[0.68rem] font-bold uppercase text-[#0c1512] transition-transform duration-200 hover:-translate-y-0.5"
              )}
            >
              {isLast ? t.ui.restart : t.ui.next}
              {isLast ? <RotateCcw aria-hidden className="h-3.5 w-3.5" /> : <ChevronRight aria-hidden className={cn("h-4 w-4", s.nextArrow)} />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label={t.ui.guideOn}
      className={cn(
        "print:hidden",
        aside
          ? "relative mt-4"
          : "fixed bottom-[var(--fab-edge)] left-[calc(var(--fab-size)+1rem)] right-3 z-[118] sm:left-[calc(var(--fab-size)+2.25rem)] sm:right-6 lg:hidden"
      )}
    >
      <div className={cn(s.dock, s.dialogIn, "relative rounded-[1.3rem]")}>
        {/* Avance del recorrido. */}
        <span aria-hidden className="absolute inset-x-5 -top-[2px] h-[3px] overflow-hidden rounded-full bg-white/10">
          <span className={cn(s.progressFill, "block h-full bg-[var(--cv-lime)]")} style={{ transform: `scaleX(${progress})` }} />
        </span>


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
            className="grid size-10 shrink-0 place-items-center rounded-full bg-white/[0.07] text-white transition-colors hover:bg-white/15 disabled:opacity-30"
          >
            <ChevronLeft aria-hidden className="h-5 w-5" />
          </button>

          {/* Avatar pequeño (en escritorio abierto lo reemplaza el retrato). */}
          <span
            aria-hidden
            className={cn(
              "relative size-11 shrink-0 overflow-hidden rounded-full bg-[var(--cv-lime)] ring-2 ring-[var(--cv-lime)]",
            )}
          >
            <Image
              key={FACE[level]}
              src={FACE[level]}
              alt=""
              width={160}
              height={160}
              sizes="48px"
              className={cn(s.luminaSwap, "size-full object-cover")}
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
