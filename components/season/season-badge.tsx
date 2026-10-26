"use client";

import { MiniSkull } from "./art/muertos";
import { HangingOrnament } from "./art/navidad";
import { BlackTag, BuenFinMini } from "./art/ventas";
import { useSiteSettings } from "./site-settings-provider";

/** Detalle de temporada sobre el logo del header. */
export function SeasonBadge() {
  const { season, settings } = useSiteSettings();
  if (!season || !settings.season.ranges[season].decorations) return null;
  return (
    <span aria-hidden className="season-badge pointer-events-none absolute -right-6 -top-1.5 md:-right-7 md:-top-2">
      {season === "muertos" ? (
        <MiniSkull className="h-7 w-7 rotate-12 drop-shadow-[0_3px_4px_rgba(42,11,61,0.35)] md:h-8 md:w-8" />
      ) : season === "navidad" ? (
        <HangingOrnament index={0} className="-mt-1 h-9 w-4 md:h-10" />
      ) : season === "buen-fin" ? (
        <BuenFinMini className="h-7 w-7 rotate-[10deg] drop-shadow-[0_3px_4px_rgba(0,0,0,0.3)] md:h-8 md:w-8" />
      ) : (
        <BlackTag className="h-5 w-9 rotate-12" />
      )}
    </span>
  );
}
