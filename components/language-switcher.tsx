"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import { useLanguage } from "@/lib/i18n/context";
import { LOCALES, LOCALE_META } from "@/lib/i18n/locales";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t.languageSwitcher.label}
        className="flex h-9 items-center gap-1 rounded-full px-2 text-base leading-none transition-colors hover:bg-white/5"
      >
        <span aria-hidden>{LOCALE_META[locale].flag}</span>
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={t.languageSwitcher.label}
          className="glass absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl p-1"
        >
          {LOCALES.map((code) => (
            <button
              key={code}
              type="button"
              role="option"
              aria-selected={code === locale}
              onClick={() => {
                setLocale(code);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-white/5",
                code === locale ? "text-primary" : "text-foreground"
              )}
            >
              <span aria-hidden>{LOCALE_META[code].flag}</span>
              {LOCALE_META[code].name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
