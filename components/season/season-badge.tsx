"use client";

import { Calaverita, EtiquetaPrecio, GorroNavidad } from "./season-art";
import { useSiteSettings } from "./site-settings-provider";

/** Detalle de temporada sobre el logo del header (calaverita, gorro, etiqueta). */
export function SeasonBadge() {
  const { season, settings } = useSiteSettings();
  if (!season || !settings.season.ranges[season].decorations) return null;
  return (
    <span aria-hidden className="season-badge pointer-events-none absolute -right-6 -top-1.5 md:-right-7 md:-top-2">
      {season === "muertos" ? (
        <Calaverita className="h-7 w-7 rotate-12 drop-shadow-[0_3px_4px_rgba(16,26,22,0.25)] md:h-8 md:w-8" />
      ) : season === "navidad" ? (
        <GorroNavidad className="h-6 w-7 rotate-[18deg] md:h-7 md:w-8" />
      ) : (
        <EtiquetaPrecio className="h-5 w-7 rotate-12" fill={season === "black-friday" ? "#101a16" : "#e5484d"} />
      )}
    </span>
  );
}
