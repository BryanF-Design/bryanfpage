export const LOCALES = ["es", "en", "pt", "de", "fr", "ja", "zh"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "es";

export const LOCALE_META: Record<Locale, { name: string; flag: string }> = {
  es: { name: "Español", flag: "🇲🇽" },
  en: { name: "English", flag: "🇺🇸" },
  pt: { name: "Português", flag: "🇧🇷" },
  de: { name: "Deutsch", flag: "🇩🇪" },
  fr: { name: "Français", flag: "🇫🇷" },
  ja: { name: "日本語", flag: "🇯🇵" },
  zh: { name: "中文", flag: "🇨🇳" },
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

// Country -> locale, for the one-time auto-detect on a visitor's first
// request (middleware reads the Vercel geo header). Everything not listed
// here falls back to DEFAULT_LOCALE, which covers Mexico and the rest of
// Latin America/Spain by design.
export const COUNTRY_LOCALE: Record<string, Locale> = {
  // Portuguese
  BR: "pt",
  PT: "pt",
  // German
  DE: "de",
  AT: "de",
  CH: "de",
  LI: "de",
  // French
  FR: "fr",
  BE: "fr",
  LU: "fr",
  MC: "fr",
  // Japanese
  JP: "ja",
  // Chinese
  CN: "zh",
  TW: "zh",
  HK: "zh",
  MO: "zh",
  SG: "zh",
  // English
  US: "en",
  GB: "en",
  CA: "en",
  AU: "en",
  NZ: "en",
  IE: "en",
  ZA: "en",
  IN: "en",
};

export function localeFromCountry(country: string | undefined | null): Locale {
  if (!country) return DEFAULT_LOCALE;
  return COUNTRY_LOCALE[country.toUpperCase()] ?? DEFAULT_LOCALE;
}

// Fallback for local dev / non-Vercel hosting, where geo headers aren't
// available: parse the browser's Accept-Language header instead.
export function localeFromAcceptLanguage(header: string | undefined | null): Locale {
  if (!header) return DEFAULT_LOCALE;
  const tags = header
    .split(",")
    .map((part) => part.split(";")[0].trim().toLowerCase());
  for (const tag of tags) {
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
    if (base === "pt") return "pt";
  }
  return DEFAULT_LOCALE;
}
