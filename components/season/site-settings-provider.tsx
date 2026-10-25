"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import {
  DEFAULT_SETTINGS,
  activeSeason,
  discountFor,
  discountsActive,
  isSeasonId,
  type SeasonId,
  type SiteSettings,
} from "@/lib/seasons";

/** `?temporada=muertos` (o `ninguna`) — vista previa desde el panel. */
const PREVIEW_KEY = "bfd-season-preview";

interface SiteSettingsValue {
  settings: SiteSettings;
  season: SeasonId | null;
  /** Vista previa forzada desde el panel (solo esta pestaña). */
  preview: boolean;
  /** % de descuento vigente de una partida (ver lib/seasons DISCOUNTABLE). */
  pct: (key: string) => number;
  discountsOn: boolean;
}

const Ctx = createContext<SiteSettingsValue | null>(null);

function readPreview(): SeasonId | "none" | null {
  try {
    const param = new URLSearchParams(window.location.search).get("temporada");
    if (param === "ninguna" || param === "fin") {
      window.sessionStorage.removeItem(PREVIEW_KEY);
      return param === "ninguna" ? "none" : null;
    }
    if (isSeasonId(param)) {
      window.sessionStorage.setItem(PREVIEW_KEY, param);
      return param;
    }
    const saved = window.sessionStorage.getItem(PREVIEW_KEY);
    return isSeasonId(saved) ? saved : null;
  } catch {
    return null;
  }
}

/**
 * Ajustes del Panel BryanF en el navegador. El layout los manda ya leídos;
 * aquí solo se recalcula la temporada con la hora del visitante (por si la
 * página en caché es de antes de que empezara o terminara) y se marca
 * `<html data-season>` para que el CSS cambie la paleta.
 */
export function SiteSettingsProvider({
  settings,
  serverSeason,
  children,
}: {
  settings: SiteSettings;
  serverSeason: SeasonId | null;
  children: React.ReactNode;
}) {
  const [season, setSeason] = useState<SeasonId | null>(serverSeason);
  const [preview, setPreview] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const forced = readPreview();
    setPreview(forced !== null);
    setNow(Date.now());
    setSeason(forced === "none" ? null : forced ?? activeSeason(settings, Date.now()));
  }, [settings]);

  useEffect(() => {
    const root = document.documentElement;
    const palette = season ? settings.season.ranges[season].palette : false;
    if (season) root.dataset.season = season;
    else delete root.dataset.season;
    if (season && palette) root.dataset.seasonPalette = season;
    else delete root.dataset.seasonPalette;
  }, [season, settings]);

  const value = useMemo<SiteSettingsValue>(
    () => ({
      settings,
      season,
      preview,
      pct: (key) => discountFor(settings, key, now),
      discountsOn: discountsActive(settings, now),
    }),
    [settings, season, preview, now]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

const FALLBACK: SiteSettingsValue = {
  settings: DEFAULT_SETTINGS,
  season: null,
  preview: false,
  pct: () => 0,
  discountsOn: false,
};

export function useSiteSettings(): SiteSettingsValue {
  return useContext(Ctx) ?? FALLBACK;
}
