"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useReducedMotionPreference } from "@/lib/motion-preference";
import type { SeasonId } from "@/lib/seasons";

import { Banderines, Copo, EtiquetaPrecio, LucesNavidad, PapelPicado, Petal } from "./season-art";
import { useSiteSettings } from "./site-settings-provider";

/** Cuánto dura la lluvia de pétalos / nieve al llegar (luego se va sola). */
const FALL_MS = 22_000;

const PETAL_COLORS = ["#f39012", "#fbb423", "#e2307a", "#f6a21a"];

// Posiciones fijas (no aleatorias): se ven variadas y no cambian entre visitas.
const DROPS = [
  { x: 4, d: 0, s: 1, t: 11 },
  { x: 13, d: 3.2, s: 0.7, t: 13 },
  { x: 22, d: 1.4, s: 0.9, t: 10 },
  { x: 31, d: 5.1, s: 0.6, t: 14 },
  { x: 42, d: 0.6, s: 1.1, t: 12 },
  { x: 53, d: 4.2, s: 0.8, t: 11.5 },
  { x: 61, d: 2.1, s: 0.65, t: 13.5 },
  { x: 70, d: 6, s: 1, t: 10.5 },
  { x: 79, d: 1, s: 0.75, t: 12.5 },
  { x: 88, d: 3.8, s: 0.9, t: 11 },
  { x: 95, d: 2.6, s: 0.6, t: 14 },
];

function Fall({ season }: { season: SeasonId }) {
  return (
    <div className="season-fall" aria-hidden>
      {DROPS.map((p, i) => (
        <span
          key={i}
          className="season-drop"
          style={
            {
              left: `${p.x}%`,
              animationDelay: `${p.d}s`,
              animationDuration: `${p.t}s`,
              ["--s" as string]: p.s,
            } as React.CSSProperties
          }
        >
          {season === "muertos" ? (
            <Petal className="h-4 w-4" color={PETAL_COLORS[i % PETAL_COLORS.length]} />
          ) : season === "navidad" ? (
            <Copo className="h-4 w-4 text-sky-200 drop-shadow-[0_1px_1px_rgba(16,26,22,0.35)]" />
          ) : (
            <EtiquetaPrecio className="h-5 w-7" fill={i % 2 ? "#e5484d" : "#101a16"} />
          )}
        </span>
      ))}
    </div>
  );
}

/**
 * Decoración de temporada: la guirnalda de arriba (papel picado, luces o
 * banderines) y, al llegar, unos segundos de pétalos / nieve / etiquetas.
 * Todo es CSS (transform + opacity) y nada recibe clics. Con "reducir
 * movimiento" queda solo la guirnalda quieta.
 */
export function SeasonDecor() {
  const { season, settings } = useSiteSettings();
  const pathname = usePathname() || "/";
  const reduced = useReducedMotionPreference();
  // La lluvia solo en la primera página de la visita (no en cada clic).
  const [falling, setFalling] = useState(false);

  useEffect(() => {
    if (!season) return;
    try {
      const key = `bfd-season-fall-${season}`;
      if (window.sessionStorage.getItem(key) === "1") return;
      window.sessionStorage.setItem(key, "1");
    } catch {
      /* sin storage: una vez por carga */
    }
    setFalling(true);
    const timer = window.setTimeout(() => setFalling(false), FALL_MS);
    return () => window.clearTimeout(timer);
  }, [season]);

  if (!season || !settings.season.ranges[season].decorations) return null;
  if (pathname.startsWith("/admin")) return null;

  return (
    <div className="season-decor" data-season-decor={season}>
      {season === "muertos" && <PapelPicado />}
      {season === "navidad" && <LucesNavidad />}
      {season === "buen-fin" && <Banderines />}
      {season === "black-friday" && <Banderines dark />}
      {!reduced && falling && <Fall season={season} />}
    </div>
  );
}
