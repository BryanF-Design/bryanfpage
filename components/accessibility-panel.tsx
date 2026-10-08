"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Accessibility,
  X,
  Minus,
  Plus,
  RotateCcw,
  Contrast,
  Pause,
  Link2,
  BookOpen,
  Focus,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useConfiguratorInView } from "@/lib/use-configurator-in-view";
import { useFooterInView } from "@/lib/use-footer-in-view";

const STORAGE_KEY = "bfd-a11y";
const FONT_STEPS = [87.5, 100, 112.5, 125, 137.5];

interface A11ySettings {
  fontStep: number;
  contrast: boolean;
  reduceMotion: boolean;
  underlineLinks: boolean;
  readableSpacing: boolean;
  visibleFocus: boolean;
}

const DEFAULT_SETTINGS: A11ySettings = {
  fontStep: 1,
  contrast: false,
  reduceMotion: false,
  underlineLinks: false,
  readableSpacing: false,
  visibleFocus: false,
};

function applySettings(s: A11ySettings) {
  const root = document.documentElement;
  root.style.fontSize = `${FONT_STEPS[s.fontStep]}%`;
  root.classList.toggle("a11y-contrast", s.contrast);
  root.classList.toggle("a11y-reduce-motion", s.reduceMotion);
  root.classList.toggle("a11y-underline-links", s.underlineLinks);
  root.classList.toggle("a11y-readable", s.readableSpacing);
  root.classList.toggle("a11y-visible-focus", s.visibleFocus);
}

export function AccessibilityPanel() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<A11ySettings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const configuratorInView = useConfiguratorInView();
  const closeRef = useRef<HTMLButtonElement>(null);
  const footerInView = useFooterInView();

  useEffect(() => {
    if (footerInView) setOpen(false);
  }, [footerInView]);

  useEffect(() => {
    if (!open) return;
    const focusTimer = window.setTimeout(() => closeRef.current?.focus());
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      window.setTimeout(() => triggerRef.current?.focus());
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (configuratorInView) setOpen(false);
  }, [configuratorInView]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
      setSettings(parsed);
      applySettings(parsed);
    } catch {
      applySettings(DEFAULT_SETTINGS);
    }
    setHydrated(true);
  }, []);

  function update(patch: Partial<A11ySettings>) {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      applySettings(next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // localStorage unavailable (private mode) — setting still applies for this session
      }
      return next;
    });
  }

  function reset() {
    update(DEFAULT_SETTINGS);
  }

  if (!hydrated) return null;

  const toggles: Array<{
    key: keyof A11ySettings;
    label: string;
    icon: typeof Contrast;
  }> = [
    { key: "contrast", label: "Alto contraste", icon: Contrast },
    { key: "reduceMotion", label: "Reducir movimiento", icon: Pause },
    { key: "underlineLinks", label: "Subrayar enlaces", icon: Link2 },
    { key: "readableSpacing", label: "Espaciado de lectura fácil", icon: BookOpen },
    { key: "visibleFocus", label: "Foco de teclado visible", icon: Focus },
  ];

  return (
    <>
      <AnimatePresence>
        {open && !footerInView && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            style={{ transformOrigin: "0% 100%" }}
            role="dialog"
            aria-labelledby="accessibility-panel-title"
            id="accessibility-panel"
            className="fixed bottom-[calc(var(--fab-edge)+var(--fab-size)+var(--fab-gap))] left-3 z-[121] max-h-[calc(100dvh-7rem-env(safe-area-inset-bottom))] w-[min(calc(100vw-1.5rem),22rem)] overflow-y-auto overscroll-contain rounded-card bg-white p-2 text-ink shadow-[0_2px_0_hsl(var(--ink)/0.03),0_34px_70px_-26px_hsl(var(--ink)/0.55)] ring-1 ring-ink/[0.06] [scrollbar-width:thin] sm:left-6"
          >
            {/* Cabecera tipo hoja de app: icono redondo, título y cerrar. */}
            <div className="flex items-center justify-between gap-3 py-1.5 pl-2 pr-1">
              <p
                id="accessibility-panel-title"
                className="flex items-center gap-3 font-display text-lg font-bold tracking-[-0.02em] text-ink"
              >
                <span className="grid size-10 place-items-center rounded-full bg-ink text-lime">
                  <Accessibility className="h-5 w-5" aria-hidden />
                </span>
                Accesibilidad
              </p>
              <button
                ref={closeRef}
                type="button"
                onClick={() => {
                  setOpen(false);
                  window.setTimeout(() => triggerRef.current?.focus());
                }}
                aria-label="Cerrar panel de accesibilidad"
                className="grid size-11 place-items-center rounded-full bg-ink/[0.05] text-ink/70 transition-colors hover:bg-ink/10 hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-1.5 flex flex-col gap-1.5">
              {/* Tamaño de texto: un paso a paso en píldora. */}
              <div className="flex items-center justify-between gap-3 rounded-inner bg-mint p-2 pl-3.5">
                <span className="text-sm font-semibold text-ink">Tamaño de texto</span>
                <div className="flex items-center gap-1 rounded-full bg-white p-1 shadow-[0_4px_14px_-8px_hsl(var(--ink)/0.35)]">
                  <button
                    type="button"
                    onClick={() => update({ fontStep: Math.max(0, settings.fontStep - 1) })}
                    disabled={settings.fontStep === 0}
                    aria-label="Disminuir tamaño de texto"
                    className="grid size-11 place-items-center rounded-full text-ink transition-colors hover:bg-ink/[0.06] disabled:opacity-35"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span
                    className="min-w-[3.25rem] text-center text-sm font-bold tabular-nums text-ink"
                    aria-live="polite"
                  >
                    {Math.round(FONT_STEPS[settings.fontStep])}%
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      update({ fontStep: Math.min(FONT_STEPS.length - 1, settings.fontStep + 1) })
                    }
                    disabled={settings.fontStep === FONT_STEPS.length - 1}
                    aria-label="Aumentar tamaño de texto"
                    className="grid size-11 place-items-center rounded-full bg-ink text-white transition-colors hover:bg-ink-soft disabled:opacity-35"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Interruptores tipo iOS: pista tinta + perilla lima al activarse. */}
              <div className="flex flex-col overflow-hidden rounded-inner bg-mint">
                {toggles.map(({ key, label, icon: Icon }, index) => {
                  const active = settings[key] as boolean;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => update({ [key]: !active } as Partial<A11ySettings>)}
                      aria-pressed={active}
                      className={cn(
                        "flex min-h-[3.5rem] items-center justify-between gap-3 px-3.5 py-2 text-left text-sm font-semibold transition-colors hover:bg-ink/[0.03]",
                        index > 0 && "border-t border-ink/[0.07]",
                        active ? "text-ink" : "text-ink/80"
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={cn(
                            "grid size-9 shrink-0 place-items-center rounded-full transition-colors",
                            active ? "bg-lime text-ink" : "bg-white text-ink/70"
                          )}
                        >
                          <Icon className="h-4 w-4" aria-hidden />
                        </span>
                        {label}
                      </span>
                      <span
                        aria-hidden
                        className={cn(
                          "relative flex h-[1.875rem] w-[3.125rem] shrink-0 items-center rounded-full p-[3px] transition-colors duration-200",
                          active ? "bg-ink" : "bg-ink/[0.16]"
                        )}
                      >
                        <span
                          className={cn(
                            "size-6 rounded-full shadow-[0_2px_6px_hsl(var(--ink)/0.3)] transition-transform duration-200 [transition-timing-function:var(--ease-out)]",
                            active ? "translate-x-5 bg-lime" : "bg-white"
                          )}
                        />
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={reset}
                className="flex min-h-11 items-center justify-center gap-2 rounded-full border-[1.5px] border-ink/15 px-4 py-2 text-sm font-semibold text-ink/75 transition-colors hover:border-ink/50 hover:text-ink"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                Restablecer
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="fab-slot fixed bottom-[var(--fab-edge)] left-3 z-[120] sm:left-6"
        data-hidden={footerInView}
      >
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={
            open
              ? "Cerrar opciones de accesibilidad"
              : "Abrir opciones de accesibilidad"
          }
          aria-controls="accessibility-panel"
          aria-expanded={open}
          aria-hidden={footerInView}
          tabIndex={footerInView ? -1 : 0}
          className={cn("fab", open && "fab-ink")}
        >
          {open ? <X aria-hidden className="h-5 w-5" /> : <Accessibility aria-hidden className="h-5 w-5" />}
        </button>
      </div>
    </>
  );
}
