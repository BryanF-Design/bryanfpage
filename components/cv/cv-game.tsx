"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import {
  Backpack,
  Gamepad2,
  GraduationCap,
  Printer,
  Swords,
  Trophy,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import { LEVELS, type LevelId } from "@/lib/cv/data";
import { CV_DICTIONARIES } from "@/lib/cv/i18n";
import { useLanguage } from "@/lib/i18n/context";
import { LOCALE_META, isLocale, type Locale } from "@/lib/i18n/locales";
import { cn } from "@/lib/utils";

import { CvBackdrop } from "./cv-backdrop";
import { CvLanguageSelect } from "./cv-language-select";
import {
  AcademyLevel,
  ContactLevel,
  InventoryLevel,
  ProfileLevel,
  QuestsLevel,
  TrophiesLevel,
} from "./cv-levels";
import { LuminaGuide } from "./cv-lumina";
import { cvStyles as s } from "./cv-parts";
import { PlayerCard } from "./cv-player-card";
import { CvStart } from "./cv-start";

const LEVEL_ICONS: Record<LevelId, LucideIcon> = {
  perfil: UserRound,
  misiones: Swords,
  inventario: Backpack,
  logros: Trophy,
  academia: GraduationCap,
  contacto: Gamepad2,
};

const LEVEL_COMPONENTS = {
  perfil: ProfileLevel,
  misiones: QuestsLevel,
  inventario: InventoryLevel,
  logros: TrophiesLevel,
  academia: AcademyLevel,
  contacto: ContactLevel,
} as const;

const SESSION_KEY = "cv-started";

/** Idioma del navegador, si es uno de los que tiene el sitio. */
function browserLocale(): Locale | null {
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const tag of langs) {
    const base = tag?.toLowerCase().split("-")[0];
    if (isLocale(base)) return base;
  }
  return null;
}

/** El visitante ya eligió idioma a mano alguna vez (el selector lo guarda aquí). */
function hasExplicitChoice() {
  try {
    return isLocale(window.localStorage.getItem("bryanf_lang"));
  } catch {
    return false;
  }
}

function isTypingTarget(el: EventTarget | null) {
  const node = el as HTMLElement | null;
  if (!node) return false;
  const tag = node.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || node.isContentEditable;
}

/**
 * CV interactivo como selector de niveles de videojuego.
 *
 * Idioma: arranca con el del sitio (cookie por geo/Accept-Language) y, si el
 * visitante nunca eligió uno a mano, adopta el idioma de su navegador. Lumina
 * lo anuncia en su primer diálogo. Elegir otro en el selector lo guarda para
 * todo el sitio.
 *
 * Todo el contenido está en el HTML desde el servidor (los niveles inactivos
 * solo se ocultan), así que buscadores, lectores y la impresión lo ven entero.
 */
export function CvGame() {
  const { locale, setLocale } = useLanguage();
  const [autoLocale, setAutoLocale] = useState<Locale | null>(null);
  const lang = autoLocale ?? locale;
  const t = CV_DICTIONARIES[lang];

  const [started, setStarted] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [level, setLevel] = useState<LevelId>("perfil");
  const [guideOpen, setGuideOpen] = useState(true);
  const [showDetected, setShowDetected] = useState(true);
  const stageRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const focusTab = useCallback((id: LevelId) => {
    // Hay dos listas (riel y fila móvil); se enfoca la que está visible.
    for (const o of ["vertical", "horizontal"]) {
      const el = tabRefs.current[`${o}-${id}`];
      if (el && el.offsetParent !== null) {
        el.focus();
        return;
      }
    }
  }, []);

  const levelIndex = LEVELS.indexOf(level);

  // Detección de idioma + recordar si ya se pasó la pantalla de título.
  useEffect(() => {
    if (!hasExplicitChoice()) {
      const nav = browserLocale();
      if (nav) setAutoLocale(nav);
    }
    try {
      if (window.sessionStorage.getItem(SESSION_KEY) === "1") setStarted(true);
    } catch {
      /* storage bloqueado */
    }
    const fromHash = window.location.hash.replace("#", "") as LevelId;
    if ((LEVELS as readonly string[]).includes(fromHash)) setLevel(fromHash);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const chooseLanguage = useCallback(
    (next: Locale) => {
      setAutoLocale(null);
      setLocale(next);
      setShowDetected(false);
    },
    [setLocale]
  );

  const start = useCallback(() => {
    setLeaving(true);
    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* storage bloqueado */
    }
    window.setTimeout(() => {
      setStarted(true);
      setLeaving(false);
    }, 650);
  }, []);

  const goTo = useCallback((next: LevelId, withFocus = false) => {
    setLevel(next);
    setShowDetected(false);
    history.replaceState(null, "", `#${next}`);
    const stage = stageRef.current;
    if (stage && stage.getBoundingClientRect().top < 0) {
      stage.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (withFocus) focusTab(next);
  }, [focusTab]);

  const step = useCallback(
    (delta: number, withFocus = false) => {
      const i = LEVELS.indexOf(level);
      const next = LEVELS[(i + delta + LEVELS.length) % LEVELS.length];
      goTo(next, withFocus);
    },
    [level, goTo]
  );

  // Atajos globales: ← → cambian de nivel y 1–6 saltan; Enter arranca.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      if (isTypingTarget(e.target)) return;
      if (!started) {
        if (e.key === "Enter" || e.key === " ") {
          if ((e.target as HTMLElement)?.tagName === "BUTTON") return;
          e.preventDefault();
          start();
        }
        return;
      }
      const inTablist = (e.target as HTMLElement)?.closest?.('[role="tablist"]');
      if (inTablist) return; // la lista de niveles maneja sus propias flechas
      if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      } else if (/^[1-6]$/.test(e.key)) {
        goTo(LEVELS[Number(e.key) - 1]);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started, start, step, goTo]);

  // Patrón de pestañas: flechas dentro de la lista, con foco que sigue.
  function onTabKey(e: ReactKeyboardEvent<HTMLDivElement>) {
    const keysNext = ["ArrowRight", "ArrowDown"];
    const keysPrev = ["ArrowLeft", "ArrowUp"];
    if (keysNext.includes(e.key)) {
      e.preventDefault();
      step(1, true);
    } else if (keysPrev.includes(e.key)) {
      e.preventDefault();
      step(-1, true);
    } else if (e.key === "Home") {
      e.preventDefault();
      goTo(LEVELS[0], true);
    } else if (e.key === "End") {
      e.preventDefault();
      goTo(LEVELS[LEVELS.length - 1], true);
    }
  }

  // Primer diálogo: Lumina dice qué idioma detectó (se va al cambiar de nivel).
  const detectedNote = showDetected
    ? t.lumina.detected.replace("{lang}", `${LOCALE_META[lang].flag} ${t.langName}`)
    : null;

  const levelTabs = (orientation: "vertical" | "horizontal") => (
    <div
      role="tablist"
      aria-label={t.ui.levelSelect}
      aria-orientation={orientation}
      onKeyDown={onTabKey}
      className={cn(
        orientation === "vertical"
          ? "flex flex-col gap-2"
          : "-mx-3 flex gap-2 overflow-x-auto px-3 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      )}
    >
      {LEVELS.map((id, i) => {
        const Icon = LEVEL_ICONS[id];
        const active = id === level;
        return (
          <button
            key={id}
            ref={(el) => {
              tabRefs.current[`${orientation}-${id}`] = el;
            }}
            type="button"
            role="tab"
            id={`cv-tab-${orientation}-${id}`}
            aria-selected={active}
            aria-controls={`cv-panel-${id}`}
            tabIndex={active ? 0 : -1}
            onClick={() => goTo(id)}
            className={cn(
              "group relative shrink-0 transition-all duration-300",
              orientation === "vertical"
                ? "flex w-full flex-col items-center gap-1 rounded-[1.3rem] px-1 py-2.5"
                : "flex items-center gap-2 rounded-full py-2 pl-2 pr-4",
              active
                ? "bg-[var(--cv-lime)] text-[#0c1512] shadow-[0_10px_30px_-10px_rgb(180_227_50/0.8)]"
                : cn(s.glass, "text-white/75 hover:text-white")
            )}
          >
            <span
              className={cn(
                "grid place-items-center rounded-full transition-transform duration-300 group-hover:scale-110",
                orientation === "vertical" ? "size-10" : "size-8",
                active ? "bg-[#0c1512] text-[var(--cv-lime)]" : "bg-white/[0.06]"
              )}
            >
              <Icon aria-hidden className={orientation === "vertical" ? "h-5 w-5" : "h-4 w-4"} />
            </span>
            <span className={cn("font-bold leading-tight", orientation === "vertical" ? "text-[0.72rem]" : "text-sm")}>
              {t.levels[id].name}
            </span>
            <span
              aria-hidden
              className={cn(
                s.pixel,
                orientation === "vertical" ? "text-[0.55rem]" : "hidden",
                active ? "text-[#0c1512]/60" : "text-white/35"
              )}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className={cn(s.root)}>
      <CvBackdrop levelIndex={levelIndex} />
      {!started && (
        <CvStart t={t} lang={lang} leaving={leaving} onStart={start} onLanguage={chooseLanguage} />
      )}

      {/* HUD superior. */}
      <header className="relative z-20 mx-auto flex max-w-[1440px] items-center gap-3 px-3 pt-3 sm:px-5 sm:pt-4">
        <Link href="/" aria-label="BryanF Design" className="shrink-0">
          <Image
            src="/img/brand/logo-light.png"
            alt="BryanF Design"
            width={720}
            height={253}
            sizes="120px"
            className="h-auto w-[96px] sm:w-[118px]"
          />
        </Link>
        <span className={cn(s.pixel, "hidden rounded-full bg-white/[0.06] px-3 py-1.5 text-[0.65rem] uppercase text-white/70 ring-1 ring-inset ring-white/10 md:inline-block")}>
          CV · {t.start.edition}
        </span>
        <span className={cn(s.pixel, "hidden text-[0.6rem] text-white/40 xl:inline")}>{t.ui.keysHint}</span>
        <div className="ml-auto flex items-center gap-2">
          <span className={cn(s.pixel, "hidden text-[0.7rem] text-white/60 sm:inline")}>
            {t.ui.level.toUpperCase()} <span className="text-[var(--cv-lime)]">{String(levelIndex + 1).padStart(2, "0")}</span>/
            {String(LEVELS.length).padStart(2, "0")}
          </span>
          <CvLanguageSelect lang={lang} onChange={chooseLanguage} label={t.ui.language} />
          <button
            type="button"
            onClick={() => window.print()}
            aria-label={t.ui.print}
            title={t.ui.print}
            className="grid size-10 place-items-center rounded-full bg-white/[0.07] text-white ring-1 ring-inset ring-white/10 transition-colors hover:bg-white/[0.12] print:hidden"
          >
            <Printer aria-hidden className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Selector de niveles en teléfono y tableta: fila pegada arriba. */}
      <nav className="sticky top-0 z-30 mt-3 bg-gradient-to-b from-[#050a08] via-[#050a08]/90 to-transparent px-3 pb-3 pt-2 print:hidden sm:px-5 lg:hidden">
        {levelTabs("horizontal")}
      </nav>

      <div className="relative z-10 mx-auto grid max-w-[1440px] gap-4 px-3 pb-56 pt-1 sm:px-5 lg:grid-cols-[92px_minmax(0,1fr)_300px] lg:gap-5 lg:pt-6 xl:grid-cols-[100px_minmax(0,1fr)_330px]">
        {/* Riel vertical de niveles (escritorio). */}
        <nav className="hidden print:hidden lg:block">
          <div className="sticky top-6">{levelTabs("vertical")}</div>
        </nav>

        {/* Escenario: todos los niveles están en el HTML; solo uno se ve. */}
        <main ref={stageRef} id="main-content" tabIndex={-1} className="min-w-0 scroll-mt-20 outline-none">
          {LEVELS.map((id, i) => {
            const Level = LEVEL_COMPONENTS[id];
            const active = id === level;
            return (
              <section
                key={id}
                id={`cv-panel-${id}`}
                role="tabpanel"
                aria-labelledby={`cv-tab-vertical-${id}`}
                hidden={!active}
                className={cn(s.panel, "relative")}
              >
                {/* El fondo lleva la "mordida"; el número de nivel vive en ella. */}
                <div aria-hidden className={cn(s.glass, s.bite, "absolute inset-0 rounded-[2rem] md:rounded-[2.4rem]")} />
                <span
                  aria-hidden
                  className={cn(
                    s.pixel,
                    s.pulse,
                    "absolute left-[3px] top-[3px] z-10 grid size-[2.9rem] place-items-center rounded-full bg-[var(--cv-lime)] text-base font-bold text-[#0c1512] md:left-1 md:top-1 md:size-[3.6rem] md:text-xl"
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="relative p-4 pt-5 sm:p-6 md:p-8">
                  {/* Re-montar al activar reinicia la animación de entrada. */}
                  {active ? <Level key={`${id}-${lang}`} t={t} index={i} /> : <Level t={t} index={i} />}
                </div>
              </section>
            );
          })}
        </main>

        {/* Columna lateral: la ficha del jugador. */}
        <aside className="hidden lg:block">
          <div className="sticky top-6">
            <PlayerCard t={t} />
          </div>
        </aside>
      </div>

      {started && (
        <LuminaGuide
          t={t}
          level={level}
          levelIndex={levelIndex}
          total={LEVELS.length}
          open={guideOpen}
          detectedNote={detectedNote}
          onClose={() => setGuideOpen(false)}
          onOpen={() => setGuideOpen(true)}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
        />
      )}
    </div>
  );
}
