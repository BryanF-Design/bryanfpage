"use client";

import { useEffect } from "react";
import { readStoredLocale } from "@/lib/i18n/context";

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
      root.lang = readStoredLocale() || "es";
    };
  }, []);

  return null;
}
