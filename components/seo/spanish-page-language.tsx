"use client";

import { useEffect } from "react";

function preferredLocale() {
  const match = document.cookie.match(/(?:^|; )bryanf_lang=([^;]+)/);
  if (match?.[1]) return decodeURIComponent(match[1]);

  try {
    return window.localStorage.getItem("bryanf_lang");
  } catch {
    return null;
  }
}

/**
 * Estas landings editoriales todavía existen solo en español. Mantiene
 * `lang` coherente sin borrar la preferencia elegida para el home.
 */
export function SpanishPageLanguage() {
  useEffect(() => {
    const root = document.documentElement;
    const keepSpanish = () => {
      if (root.lang !== "es") root.lang = "es";
    };

    keepSpanish();
    const observer = new MutationObserver(keepSpanish);
    observer.observe(root, { attributes: true, attributeFilter: ["lang"] });

    return () => {
      observer.disconnect();
      root.lang = preferredLocale() || "es";
    };
  }, []);

  return null;
}
