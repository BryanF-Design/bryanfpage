"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Globe, Sparkle, X } from "lucide-react";

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

/** Texto que se escribe letra por letra, como en un RPG. */
function useTypewriter(text: string, enabled: boolean) {
  const [count, setCount] = useState(enabled ? 0 : text.length);
  // Separa por grafemas para no partir acentos ni caracteres CJK.
  const chars = useRef<string[]>([]);
  chars.current = Array.from(text);

  useEffect(() => {
    if (!enabled) {
      setCount(chars.current.length);
      return;
    }
    setCount(0);
    let i = 0;
    const total = chars.current.length;
    const id = window.setInterval(() => {
      i += 2;
      setCount(Math.min(i, total));
      if (i >= total) window.clearInterval(id);
    }, 24);
    return () => window.clearInterval(id);
  }, [text, enabled]);

  const done = count >= chars.current.length;
  return {
    shown: done ? text : chars.current.slice(0, count).join(""),
    done,
    finish: () => setCount(chars.current.length),
  };
}

/**
 * Lumina guía el recorrido: caja de diálogo fija abajo, con su retrato
 * saliendo por arriba. Cambia de expresión según el nivel y lleva al
 * siguiente con "Siguiente".
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
  const isLast = levelIndex === total - 1;

  if (!open) {
    return (
      <button
        type="button"
        onClick={onOpen}
        aria-label={t.ui.showGuide}
        className="fixed bottom-[var(--fab-edge)] right-3 z-[118] grid size-[3.6rem] place-items-center overflow-hidden rounded-full bg-[var(--cv-lime)] ring-4 ring-[#050a08] transition-transform duration-200 hover:scale-105 print:hidden sm:right-6"
      >
        <Image
          src={EXPRESSION[level]}
          alt=""
          width={120}
          height={156}
          sizes="64px"
          className="mt-3 h-auto w-[3.4rem] scale-[1.3] object-cover"
        />
      </button>
    );
  }

  return (
    <div
      role="region"
      aria-label={t.ui.guideOn}
      className="pointer-events-none fixed bottom-[var(--fab-edge)] left-[calc(var(--fab-size)+1.1rem)] right-3 z-[118] print:hidden sm:left-[calc(var(--fab-size)+2.5rem)] sm:right-6 lg:left-1/2 lg:right-auto lg:w-[min(46rem,calc(100vw-12rem))] lg:-translate-x-1/2"
    >
      <div className={cn(s.dialog, s.dialogIn, "pointer-events-auto relative rounded-[1.4rem] pl-[4.6rem] pr-3 pt-3 pb-3 sm:pl-[7.5rem] sm:pr-4")}>
        {/* Retrato: sobresale por arriba de la caja. */}
        <div className="pointer-events-none absolute -top-11 left-0 w-[4.8rem] sm:-top-16 sm:left-1 sm:w-[7.25rem]">
          <div className={s.luminaBob}>
            <Image
              key={EXPRESSION[level]}
              src={EXPRESSION[level]}
              alt=""
              width={864}
              height={1121}
              sizes="(min-width: 640px) 120px, 80px"
              className={cn(s.luminaSwap, "h-auto w-full drop-shadow-[0_10px_18px_rgb(0_0_0/0.6)]")}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={cn(s.pixel, "rounded-md bg-[var(--cv-lime)] px-2 py-0.5 text-[0.68rem] font-bold text-[#0c1512]")}>
            {t.lumina.name}
          </span>
          <span className="hidden items-center gap-1 text-[0.7rem] text-white/50 sm:inline-flex">
            <Sparkle aria-hidden className="h-3 w-3 fill-[var(--cv-lime)] text-[var(--cv-lime)]" />
            {t.lumina.role}
          </span>
          <span className={cn(s.pixel, "ml-auto text-[0.62rem] text-white/45")}>
            {String(levelIndex + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.ui.muteGuide}
            className="-mr-1 grid size-8 place-items-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X aria-hidden className="h-4 w-4" />
          </button>
        </div>

        {detectedNote ? (
          <p className="mt-1.5 flex items-start gap-1.5 text-[0.72rem] leading-snug text-[var(--cv-lime)]">
            <Globe aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {detectedNote}
          </p>
        ) : null}

        {/* El texto completo vive para lectores de pantalla; lo visible se teclea. */}
        <p className="sr-only" aria-live="polite">
          {line}
        </p>
        <p
          aria-hidden
          onClick={finish}
          className="mt-1.5 min-h-[3.9rem] cursor-default text-[0.86rem] leading-snug text-white/90 sm:min-h-[3rem] sm:text-[0.95rem]"
        >
          {shown}
          {!done && <span className={s.caret} />}
        </p>

        <div className="mt-2 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onPrev}
            disabled={levelIndex === 0}
            className="inline-flex h-9 items-center gap-1 rounded-full px-3 text-xs font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronLeft aria-hidden className="h-4 w-4" />
            <span className="hidden sm:inline">{t.ui.prev}</span>
          </button>
          <button
            type="button"
            onClick={onNext}
            className={cn(
              s.pixel,
              "inline-flex h-9 items-center gap-1.5 rounded-full bg-[var(--cv-lime)] px-4 text-[0.72rem] font-bold uppercase text-[#0c1512] transition-transform duration-200 hover:-translate-y-0.5"
            )}
          >
            {isLast ? t.ui.restart : t.ui.next}
            <ChevronRight aria-hidden className={cn("h-4 w-4", s.nextArrow)} />
          </button>
        </div>
      </div>
    </div>
  );
}
