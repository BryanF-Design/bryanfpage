"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Hand, Play } from "lucide-react";

import type { CvDict } from "@/lib/cv/i18n";
import type { Locale } from "@/lib/i18n/locales";
import { cn } from "@/lib/utils";

import { CvAppLanes } from "./cv-app-lanes";
import { CvLanguageSelect } from "./cv-language-select";
import { cvStyles as s } from "./cv-parts";

/**
 * Menú principal: papel cuadriculado, "Curriculum" en serif itálica y
 * "VITAE." en un bloque lima con asas de selección. Bryan se asoma por
 * detrás y, al fondo, las apps cruzan la pantalla jaladas por cursores (se
 * pueden agarrar). Enter o el botón entran.
 *
 * La capa de contenido no recibe el puntero (salvo botones), para que las
 * pegatinas del fondo se puedan arrastrar en cualquier parte.
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
      <CvAppLanes />

      <div className="pointer-events-none relative mx-auto flex min-h-full max-w-6xl flex-col items-center px-4 pb-8 pt-4 sm:px-6 sm:pt-5">
        {/* Barra superior: marca e idioma. */}
        <div className="relative z-20 flex w-full items-center justify-between gap-3">
          <Image
            src="/img/brand/logo-dark.png"
            alt="BryanF Design"
            width={720}
            height={253}
            priority
            sizes="120px"
            className="h-auto w-[100px] sm:w-[124px]"
          />
          <div className="pointer-events-auto">
            <CvLanguageSelect lang={lang} onChange={onLanguage} label={t.ui.language} tone="light" />
          </div>
        </div>

        <div className="flex w-full flex-1 flex-col items-center justify-center">
          <p
            className={cn(
              s.rise,
              "relative z-10 mt-6 rounded-full bg-[#f6f7f2]/80 px-3 text-center text-[0.78rem] font-semibold uppercase tracking-[0.5em] backdrop-blur-sm sm:text-base"
            )}
          >
            {t.start.welcome}
          </p>

          {/* Título: Bryan se asoma por detrás del bloque. */}
          <div className="relative z-10 mt-1 flex w-full max-w-3xl flex-col items-center">
            <div className="relative h-[178px] w-[200px] overflow-hidden sm:h-[250px] sm:w-[270px]">
              <span
                aria-hidden
                className="absolute inset-x-[8%] bottom-0 top-[26%] rounded-t-full bg-[#b4e332] [background-image:linear-gradient(rgb(12_21_18/0.12)_1px,transparent_1px),linear-gradient(90deg,rgb(12_21_18/0.12)_1px,transparent_1px)] [background-size:14px_14px]"
              />
              <Image
                src="/img/cv/bryan-photo.webp"
                alt=""
                width={760}
                height={1013}
                priority
                sizes="(min-width: 640px) 270px, 200px"
                className={cn(s.peek, "absolute inset-x-0 top-[2%] mx-auto h-auto w-[86%] max-w-none")}
              />
            </div>

            <h1 id="cv-start-title" className="relative -mt-9 flex flex-col items-center sm:-mt-12">
              <span
                className={cn(
                  s.scriptWord,
                  s.rise,
                  "relative z-20 -mb-2 -ml-[16%] -rotate-6 text-[3rem] text-[#0c1512] [text-shadow:0_2px_0_var(--cv-paper),0_-2px_0_var(--cv-paper),2px_0_0_var(--cv-paper),-2px_0_0_var(--cv-paper)] sm:-mb-7 sm:-ml-[30%] sm:text-[6.5rem]"
                )}
                style={{ animationDelay: "0.15s" }}
              >
                {t.start.script}
              </span>
              <span
                className={cn(s.selected, s.rise, "relative z-10 bg-[var(--cv-lime)] px-5 py-1 sm:px-9")}
                style={{ animationDelay: "0.3s" }}
              >
                <span className="block font-display text-[4.2rem] font-black leading-[0.95] tracking-[-0.045em] text-[#0c1512] [font-stretch:125%] sm:text-[8.5rem]">
                  {t.start.block}
                </span>
                <span aria-hidden className={s.handleBl} />
                <span aria-hidden className={s.handleBr} />
              </span>
            </h1>
          </div>

          {/* Banda con el nombre completo. */}
          <div className={cn(s.startBand, s.rise, "relative z-10 mt-8 w-screen py-3")} style={{ animationDelay: "0.45s" }}>
            <p className={cn(s.pixel, "text-center text-[0.7rem] uppercase tracking-[0.3em] text-[var(--cv-lime)] sm:text-sm")}>
              Bryan Fernando López López
            </p>
          </div>

          <p
            className={cn(s.rise, "relative z-10 mt-5 rounded-2xl bg-[#f6f7f2]/85 px-3 py-1 text-center text-base font-bold backdrop-blur-sm sm:text-lg")}
            style={{ animationDelay: "0.55s" }}
          >
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
              "pointer-events-auto relative z-10 mt-7 inline-flex items-center gap-3 rounded-2xl bg-[var(--cv-lime)] px-7 py-4 text-base font-bold uppercase text-[#0c1512] sm:px-10 sm:text-xl"
            )}
            style={{ animationDelay: "0.7s" }}
          >
            <Play aria-hidden className={cn(s.blink, "h-5 w-5 fill-[#0c1512]")} />
            {t.ui.pressStart}
          </button>
          <p className="relative z-10 mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#f6f7f2]/85 px-3 py-1 text-center text-xs text-[#0c1512]/60 backdrop-blur-sm">
            <Hand aria-hidden className="h-3.5 w-3.5" />
            {t.ui.dragHint}
          </p>
        </div>
      </div>
    </div>
  );
}
