"use client";

import { useEffect, useState } from "react";
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
  const footerInView = useFooterInView();

  useEffect(() => {
    if (footerInView) setOpen(false);
  }, [footerInView]);

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
            role="dialog"
            aria-label="Opciones de accesibilidad"
            className="fixed bottom-24 left-4 z-[120] w-[min(90vw,20rem)] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:left-6"
          >
            <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-4 py-3">
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Accessibility className="h-4 w-4 text-primary" />
                Accesibilidad
              </p>
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar panel de accesibilidad"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-4 p-4">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                  Tamaño de texto
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => update({ fontStep: Math.max(0, settings.fontStep - 1) })}
                    disabled={settings.fontStep === 0}
                    aria-label="Disminuir tamaño de texto"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-40"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-[3rem] text-center text-sm text-muted-foreground">
                    {Math.round(FONT_STEPS[settings.fontStep])}%
                  </span>
                  <button
                    onClick={() =>
                      update({ fontStep: Math.min(FONT_STEPS.length - 1, settings.fontStep + 1) })
                    }
                    disabled={settings.fontStep === FONT_STEPS.length - 1}
                    aria-label="Aumentar tamaño de texto"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-40"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                {toggles.map(({ key, label, icon: Icon }) => {
                  const active = settings[key] as boolean;
                  return (
                    <button
                      key={key}
                      onClick={() => update({ [key]: !active } as Partial<A11ySettings>)}
                      aria-pressed={active}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-2.5 py-2 text-sm transition-colors",
                        active
                          ? "bg-primary/15 text-primary"
                          : "text-foreground/80 hover:bg-secondary"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {label}
                      </span>
                      <span
                        className={cn(
                          "flex h-5 w-9 items-center rounded-full border border-border p-0.5 transition-colors",
                          active ? "bg-primary" : "bg-secondary"
                        )}
                      >
                        <span
                          className={cn(
                            "h-3.5 w-3.5 rounded-full bg-background transition-transform",
                            active && "translate-x-4"
                          )}
                        />
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={reset}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Restablecer
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Abrir opciones de accesibilidad"
        aria-expanded={open}
        aria-hidden={footerInView}
        tabIndex={footerInView ? -1 : 0}
        className={cn(
          "fixed bottom-5 left-4 z-[120] flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-lg transition-all duration-300 hover:scale-105 hover:text-primary sm:left-6",
          footerInView
            ? "pointer-events-none translate-y-3 opacity-0"
            : "pointer-events-auto translate-y-0 opacity-100"
        )}
      >
        <Accessibility className="h-5 w-5" />
      </button>
    </>
  );
}
