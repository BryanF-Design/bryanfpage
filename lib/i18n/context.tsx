"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { DEFAULT_LOCALE, isLocale, type Locale } from "./locales";
import { DICTIONARIES, type Dictionary } from "./dictionaries";

const COOKIE_NAME = "bryanf_lang";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function readCookieLocale(): Locale | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )bryanf_lang=([^;]+)/);
  const value = match ? decodeURIComponent(match[1]) : null;
  return isLocale(value) ? value : null;
}

function writeCookieLocale(locale: Locale) {
  document.cookie = `${COOKIE_NAME}=${locale}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
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
    const fromCookie = readCookieLocale();
    if (fromCookie && fromCookie !== DEFAULT_LOCALE) {
      setLocaleState(fromCookie);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  function setLocale(next: Locale) {
    setLocaleState(next);
    writeCookieLocale(next);
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
