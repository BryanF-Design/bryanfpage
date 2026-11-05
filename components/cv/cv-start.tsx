"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import { Play } from "lucide-react";

import { START_STICKERS } from "@/lib/cv/data";
import type { CvDict } from "@/lib/cv/i18n";
import { cn } from "@/lib/utils";

import { cvStyles as s } from "./cv-parts";
import { CvLanguageSelect } from "./cv-language-select";
import type { Locale } from "@/lib/i18n/locales";

// Posiciones de las pegatinas: siempre en los bordes, lejos del centro.
const STICKER_SPOTS: CSSProperties[] = [
  { left: "6%", top: "30%", "--rot": "-8deg" } as CSSProperties,
  { right: "7%", top: "26%", "--rot": "7deg", animationDelay: "-1.5s" } as CSSProperties,
  { left: "9%", bottom: "16%", "--rot": "6deg", animationDelay: "-3s" } as CSSProperties,
  { right: "10%", bottom: "20%", "--rot": "-5deg", animationDelay: "-2.2s" } as CSSProperties,
  { left: "22%", top: "8%", "--rot": "4deg", animationDelay: "-4s" } as CSSProperties,
  { right: "24%", bottom: "6%", "--rot": "-7deg", animationDelay: "-0.8s" } as CSSProperties,
];

/**
 * Pantalla de título: papel cuadriculado, "Curriculum" en serif itálica y
 * "VITAE." en un bloque lima con asas de selección; Bryan se asoma por
 * detrás y las herramientas flotan como pegatinas. Enter o el botón entran.
 */
export function CvStart({
  t,
  lang,
  leaving,
  onStart,
  onLanguage,
}: {
  t: CvDict;
  lang: Locale;
  leaving: boolean;
  onStart: () => void;
  onLanguage: (l: Locale) => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    buttonRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div
      className={cn(s.start, leaving && s.startLeaving, "print:hidden")}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cv-start-title"
    >
      <div className="relative mx-auto flex min-h-full max-w-6xl flex-col items-center px-4 pb-10 pt-5 sm:px-6">
        {/* Barra superior: marca e idioma. */}
        <div className="relative z-20 flex w-full items-center justify-between gap-3">
          <Image
            src="/img/brand/logo-dark.png"
            alt="BryanF Design"
            width={720}
            height={253}
            priority
            sizes="120px"
            className="h-auto w-[104px] sm:w-[124px]"
          />
          <CvLanguageSelect lang={lang} onChange={onLanguage} label={t.ui.language} tone="light" />
        </div>

        {/* Pegatinas flotantes (decorativas). */}
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden sm:block">
          {START_STICKERS.map((st, i) => (
            <span key={st.src} className={s.sticker} style={STICKER_SPOTS[i]}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={st.src} alt="" />
            </span>
          ))}
        </div>

        <div className="flex w-full flex-1 flex-col items-center justify-center">
        <p className={cn(s.rise, "relative z-10 mt-8 text-center text-[0.8rem] font-semibold uppercase tracking-[0.55em] sm:mt-6 sm:text-base")}>
          {t.start.welcome}
        </p>

        {/* Título: Bryan se asoma por detrás del bloque. */}
        <div className="relative z-10 mt-2 flex w-full max-w-3xl flex-col items-center">
          <div className="relative h-[170px] w-[190px] overflow-hidden sm:h-[230px] sm:w-[250px]">
            <Image
              src="/img/brand/bryan-cutout.webp"
              alt=""
              width={1122}
              height={1114}
              priority
              sizes="260px"
              className={cn(s.peek, "absolute inset-x-0 bottom-[-28%] h-auto w-full")}
            />
          </div>

          <h1 id="cv-start-title" className="relative -mt-8 flex flex-col items-center sm:-mt-10">
            <span
              className={cn(
                s.scriptWord,
                s.rise,
                "relative z-20 -mb-2 -ml-[16%] -rotate-6 text-[3rem] text-[#0c1512] sm:-mb-7 sm:-ml-[30%] sm:text-[6.5rem]"
              )}
              style={{ animationDelay: "0.15s" }}
            >
              {t.start.script}
            </span>
            <span
              className={cn(s.selected, s.rise, "relative z-10 bg-[var(--cv-lime)] px-5 py-1 sm:px-9")}
              style={{ animationDelay: "0.3s" }}
            >
              <span className="block font-display text-[4.4rem] font-black leading-[0.95] tracking-[-0.045em] text-[#0c1512] [font-stretch:125%] sm:text-[8.5rem]">
                {t.start.block}
              </span>
              <span aria-hidden className={s.handleBl} />
              <span aria-hidden className={s.handleBr} />
            </span>
          </h1>
        </div>

        {/* Banda con el nombre completo. */}
        <div className={cn(s.startBand, s.rise, "relative z-10 mt-9 w-screen py-3")} style={{ animationDelay: "0.45s" }}>
          <p className={cn(s.pixel, "text-center text-[0.72rem] uppercase tracking-[0.3em] text-[var(--cv-lime)] sm:text-sm")}>
            Bryan Fernando López López
          </p>
        </div>

        <p className={cn(s.rise, "relative z-10 mt-5 text-center text-base font-bold sm:text-lg")} style={{ animationDelay: "0.55s" }}>
          {t.start.role}
          <span className={cn(s.pixel, "ml-2 rounded-md bg-[#0c1512] px-2 py-0.5 align-middle text-[0.65rem] font-normal text-[var(--cv-lime)]")}>
            {t.start.edition}
          </span>
        </p>

        <button
          ref={buttonRef}
          type="button"
          onClick={onStart}
          className={cn(
            s.pixel,
            s.startButton,
            s.rise,
            "relative z-10 mt-8 inline-flex items-center gap-3 rounded-2xl bg-[var(--cv-lime)] px-7 py-4 text-base font-bold uppercase text-[#0c1512] sm:px-10 sm:text-xl"
          )}
          style={{ animationDelay: "0.7s" }}
        >
          <Play aria-hidden className={cn(s.blink, "h-5 w-5 fill-[#0c1512]")} />
          {t.ui.pressStart}
        </button>
        <p className="relative z-10 mt-4 text-center text-xs text-[#0c1512]/55">{t.ui.startHint}</p>
        </div>
      </div>
    </div>
  );
}
