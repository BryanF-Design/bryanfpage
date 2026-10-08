"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
import { DICTIONARIES } from "@/lib/i18n/dictionaries";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n/locales";
import { useConfiguratorInView } from "@/lib/use-configurator-in-view";
import { useFooterInView } from "@/lib/use-footer-in-view";

const STORAGE_KEY = "bfd-a11y";
/** Cualquier botón del sitio (menú, footer…) puede abrir el panel con
 *  `window.dispatchEvent(new Event("a11y:open"))`. */
const OPEN_EVENT = "a11y:open";
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

/**
 * El panel se monta fuera de <LanguageProvider> (layout), así que sigue al
 * atributo `lang` de <html>, que el proveedor mantiene al día (y que las
 * landings solo-en-español fijan en "es").
 */
function useDocumentLocale(): Locale {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setLocale(isLocale(root.lang) ? root.lang : DEFAULT_LOCALE);
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["lang"] });
    return () => observer.disconnect();
  }, []);

  return locale;
}

export function AccessibilityPanel() {
  const t = DICTIONARIES[useDocumentLocale()].a11y;
  const [open, setOpen] = useState(false);
  // Abierto desde otro botón (evento): se muestra aunque el footer esté a la vista.
  const [pinned, setPinned] = useState(false);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const [settings, setSettings] = useState<A11ySettings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const configuratorInView = useConfiguratorInView();
  const closeRef = useRef<HTMLButtonElement>(null);
  const footerInView = useFooterInView();

  useEffect(() => {
    if (footerInView && !pinned) setOpen(false);
  }, [footerInView, pinned]);

  useEffect(() => {
    const onOpen = () => {
      returnFocusRef.current = document.activeElement as HTMLElement | null;
      setPinned(true);
      setOpen(true);
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  // Con el panel abierto, <html> lleva `a11y-open` (para que la hoja de
  // estilos pueda apartar los demás flotantes).
  const visible = open && (!footerInView || pinned);
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("a11y-open", visible);
    return () => root.classList.remove("a11y-open");
  }, [visible]);

  /** Cierra y devuelve el foco a quien abrió el panel (el disparador o el
   *  botón externo que lanzó el evento). */
  const close = useCallback(() => {
    const opener = returnFocusRef.current;
    const target = pinned && opener?.isConnected ? opener : triggerRef.current;
    setOpen(false);
    window.setTimeout(() => target?.focus());
  }, [pinned]);

  useEffect(() => {
    if (!open) return;
    const focusTimer = window.setTimeout(() => closeRef.current?.focus());
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  useEffect(() => {
    if (configuratorInView) setOpen(false);
  }, [configuratorInView]);

  useEffect(() => {
    if (!open) setPinned(false);
  }, [open]);

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
    { key: "contrast", label: t.contrast, icon: Contrast },
    { key: "reduceMotion", label: t.reduceMotion, icon: Pause },
    { key: "underlineLinks", label: t.underlineLinks, icon: Link2 },
    { key: "readableSpacing", label: t.readableSpacing, icon: BookOpen },
    { key: "visibleFocus", label: t.visibleFocus, icon: Focus },
  ];

  return (
    <>
      {/* Teléfono: velo que atenúa la página (y los demás flotantes) y cierra al tocar. */}
      <AnimatePresence>
        {visible && (
          <motion.div
            key="a11y-scrim"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className="fixed inset-0 z-[120] bg-ink/25 sm:hidden"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {visible && (
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
                {t.title}
              </p>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label={t.closePanel}
                className="grid size-11 place-items-center rounded-full bg-ink/[0.05] text-ink/70 transition-colors hover:bg-ink/10 hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-1.5 flex flex-col gap-1.5">
              {/* Tamaño de texto: un paso a paso en píldora. */}
              <div className="flex items-center justify-between gap-3 rounded-inner bg-mint p-2 pl-3.5">
                <span className="text-sm font-semibold text-ink">{t.textSize}</span>
                <div className="flex items-center gap-1 rounded-full bg-white p-1 shadow-[0_4px_14px_-8px_hsl(var(--ink)/0.35)]">
                  <button
                    type="button"
                    onClick={() => update({ fontStep: Math.max(0, settings.fontStep - 1) })}
                    disabled={settings.fontStep === 0}
                    aria-label={t.decrease}
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
                    aria-label={t.increase}
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
                {t.reset}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* En teléfono el disparador es una pestaña delgada pegada al canto
          izquierdo: queda sobre el margen del lienzo y no tapa el texto ni
          los botones de las secciones. Desde sm vuelve a ser un flotante. */}
      <div
        className="fab-slot fixed bottom-[var(--fab-edge)] left-0 z-[120] sm:left-6"
        data-hidden={footerInView}
      >
        <button
          ref={triggerRef}
          type="button"
          onClick={() => (open ? close() : setOpen(true))}
          aria-label={open ? t.close : t.open}
          aria-controls="accessibility-panel"
          aria-expanded={visible}
          aria-hidden={footerInView}
          tabIndex={footerInView ? -1 : 0}
          className={cn(
            "fab",
            "max-sm:h-12 max-sm:w-7 max-sm:min-w-0 max-sm:rounded-l-none max-sm:rounded-r-full max-sm:bg-ink max-sm:p-0 max-sm:pr-0.5 max-sm:text-lime",
            open && "fab-ink"
          )}
        >
          {open ? <X aria-hidden className="h-5 w-5" /> : <Accessibility aria-hidden className="h-5 w-5" />}
        </button>
      </div>
    </>
  );
}
