"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { Check, ChevronDown } from "lucide-react";

import { useLanguage } from "@/lib/i18n/context";
import { LOCALES, LOCALE_META } from "@/lib/i18n/locales";
import { cn } from "@/lib/utils";

/**
 * Selector de idioma como disclosure: el botón abre una lista de botones
 * (Tab o flechas para recorrerla, Inicio/Fin para saltar). Escape o elegir
 * un idioma cierran y devuelven el foco al botón.
 */
export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      const hadFocus = ref.current?.contains(document.activeElement);
      setOpen(false);
      if (hadFocus) buttonRef.current?.focus();
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function onListKeyDown(e: ReactKeyboardEvent<HTMLUListElement>) {
    const items = Array.from(listRef.current?.querySelectorAll<HTMLButtonElement>("button") ?? []);
    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    let next = -1;
    if (e.key === "ArrowDown") next = (index + 1) % items.length;
    else if (e.key === "ArrowUp") next = (index - 1 + items.length) % items.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = items.length - 1;
    if (next < 0) return;
    e.preventDefault();
    items[next]?.focus();
  }

  return (
    <div ref={ref} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && !open) {
            e.preventDefault();
            setOpen(true);
            window.setTimeout(() => listRef.current?.querySelector<HTMLButtonElement>("button")?.focus());
          }
        }}
        aria-expanded={open}
        aria-controls={listId}
        aria-label={t.languageSwitcher.label}
        className="flex h-11 min-w-11 items-center justify-center gap-1 rounded-full px-3 text-base leading-none transition-colors hover:bg-ink/[0.05]"
      >
        <span aria-hidden>{LOCALE_META[locale].flag}</span>
        <ChevronDown
          aria-hidden
          className={cn("h-3 w-3 text-muted-foreground transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          aria-label={t.languageSwitcher.label}
          onKeyDown={onListKeyDown}
          className="absolute right-0 top-full z-50 mt-3 w-52 overflow-hidden rounded-card bg-white p-1.5 shadow-float ring-1 ring-ink/[0.06]"
        >
          {LOCALES.map((code) => {
            const current = code === locale;
            return (
              <li key={code}>
                <button
                  type="button"
                  lang={code}
                  aria-current={current ? "true" : undefined}
                  onClick={() => {
                    setLocale(code);
                    setOpen(false);
                    buttonRef.current?.focus();
                  }}
                  className={cn(
                    "flex min-h-11 w-full items-center gap-2.5 rounded-2xl px-3 py-2 text-left text-sm font-semibold transition-colors hover:bg-ink/[0.05]",
                    current ? "bg-lime/30 text-ink" : "text-ink/80"
                  )}
                >
                  <span aria-hidden>{LOCALE_META[code].flag}</span>
                  {LOCALE_META[code].name}
                  {current && <Check aria-hidden className="ml-auto h-4 w-4" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
