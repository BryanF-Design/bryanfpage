"use client";

import { ChevronDown, Globe } from "lucide-react";

import { LOCALES, LOCALE_META, type Locale } from "@/lib/i18n/locales";
import { cn } from "@/lib/utils";

/**
 * Selector de idioma nativo (accesible en teclado, lector y móvil sin
 * código extra) vestido como píldora.
 */
export function CvLanguageSelect({
  lang,
  onChange,
  label,
  tone = "dark",
}: {
  lang: Locale;
  onChange: (l: Locale) => void;
  label: string;
  tone?: "dark" | "light";
}) {
  return (
    <label
      className={cn(
        "relative inline-flex h-10 items-center gap-1.5 rounded-full pl-3 pr-8 text-sm font-semibold transition-colors",
        tone === "dark"
          ? "bg-white/[0.07] text-white ring-1 ring-inset ring-white/10 hover:bg-white/[0.12]"
          : "bg-[#0c1512] text-white hover:bg-[#15241f]"
      )}
    >
      <Globe aria-hidden className="h-4 w-4 text-[var(--cv-lime)]" />
      <span className="sr-only">{label}</span>
      <span aria-hidden>{LOCALE_META[lang].flag}</span>
      <span aria-hidden className="hidden sm:inline">{LOCALE_META[lang].name}</span>
      <span aria-hidden className="uppercase sm:hidden">{lang}</span>
      <ChevronDown aria-hidden className="pointer-events-none absolute right-2.5 h-4 w-4 opacity-60" />
      <select
        value={lang}
        onChange={(e) => onChange(e.target.value as Locale)}
        className="absolute inset-0 cursor-pointer appearance-none rounded-full opacity-0"
      >
        {LOCALES.map((l) => (
          <option key={l} value={l}>
            {LOCALE_META[l].flag} {LOCALE_META[l].name}
          </option>
        ))}
      </select>
    </label>
  );
}
