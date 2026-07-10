"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { DEFAULT_LOCALE, isLocale, type Locale } from "./locales";
import { DICTIONARIES, type Dictionary } from "./dictionaries";

const COOKIE_NAME = "bryanf_lang";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year
const STORAGE_KEY = "bryanf_lang";

// La elección de idioma vive en dos lugares: cookie (la lee el middleware y
// sobrevive entre páginas/sesiones) y localStorage (respaldo cuando el
// navegador bloquea cookies). Con cualquiera de los dos, el idioma se
// mantiene sin importar a qué página navegue el visitante.
function readStoredLocale(): Locale | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )bryanf_lang=([^;]+)/);
  const fromCookie = match ? decodeURIComponent(match[1]) : null;
  if (isLocale(fromCookie)) return fromCookie;
  try {
    const fromStorage = window.localStorage.getItem(STORAGE_KEY);
    if (isLocale(fromStorage)) return fromStorage;
  } catch {
    /* storage bloqueado */
  }
  return null;
}

function writeStoredLocale(locale: Locale) {
  document.cookie = `${COOKIE_NAME}=${locale}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    /* storage bloqueado */
  }
}

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Server-rendered HTML is always Spanish (the site's source language) — a
  // cookie/geo-detected locale only exists client-side, so we start there to
  // match the SSR markup exactly and avoid a hydration mismatch, then swap
  // to the real locale right after mount (see effect below).
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const stored = readStoredLocale();
    if (stored && stored !== DEFAULT_LOCALE) {
      setLocaleState(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  function setLocale(next: Locale) {
    setLocaleState(next);
    writeStoredLocale(next);
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t: DICTIONARIES[locale] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
