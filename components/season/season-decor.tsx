"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { usePathname } from "next/navigation";

import { useReducedMotionPreference } from "@/lib/motion-preference";
import type { SeasonId } from "@/lib/seasons";

import { Marigold, MUERTOS, Petal, PicadoFlag } from "./art/muertos";
import { FallingStar, HangingOrnament, NAVIDAD } from "./art/navidad";
import { VENTAS } from "./art/ventas";
import { Tape } from "./season-poster";
import { useSiteSettings } from "./site-settings-provider";

/** Cuánto dura la lluvia de pétalos / estrellas al llegar (luego se va sola). */
const FALL_MS = 22_000;

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

const PETALS = [MUERTOS.marigold, MUERTOS.orange, MUERTOS.magenta, MUERTOS.yellow];
const CONFETTI = [VENTAS.red, "#ffffff", VENTAS.red, "#ff8a94"];

function Drop({ season, i }: { season: SeasonId; i: number }) {
  if (season === "muertos")
    return i % 4 === 0 ? <Marigold className="h-5 w-5" /> : <Petal className="h-4 w-4" color={PETALS[i % PETALS.length]} />;
  if (season === "navidad") return <FallingStar className="h-3.5 w-3.5" color={i % 3 ? NAVIDAD.frost : "#ffffff"} />;
  return <span className="block h-3 w-1.5 rounded-[2px]" style={{ background: CONFETTI[i % CONFETTI.length] }} />;
}

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
            } as CSSProperties
          }
        >
          <Drop season={season} i={i} />
        </span>
      ))}
    </div>
  );
}

/** Etiqueta colgante de Buen Fin (roja / blanca, con la carita o el %). */
function HangingTag({ index }: { index: number }) {
  const len = [10, 24, 16, 30, 12, 20][index % 6];
  const red = index % 2 === 0;
  return (
    <svg viewBox="0 0 36 96" className="season-flag season-tag" style={{ ["--i" as string]: index } as CSSProperties} aria-hidden focusable="false">
      <path d={`M18 0V${len + 4}`} stroke="#0b0b0b" strokeOpacity=".5" strokeWidth="1.2" />
      <g transform={`translate(0 ${len})`}>
        <path d="M8 6h20v44a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4Z" fill={red ? VENTAS.red : "#ffffff"} stroke="#0b0b0b" strokeWidth="1.6" />
        <path d="M18 0L28 6H8Z" fill={red ? VENTAS.red : "#ffffff"} stroke="#0b0b0b" strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="18" cy="6" r="2.2" fill="#0b0b0b" />
        <text x="18" y="38" textAnchor="middle" transform="rotate(90 18 32)" fontFamily="var(--font-display), sans-serif" fontWeight="900" fontSize="14" fill={red ? "#ffffff" : VENTAS.red}>
          {index % 3 === 1 ? "%" : ":)"}
        </text>
      </g>
    </svg>
  );
}

/**
 * Decoración de temporada sobre la parte de arriba de la página (se va con
 * el scroll y no recibe clics): papel picado calado, esferas geométricas,
 * etiquetas de Buen Fin o la cinta de Black Friday; y al llegar, unos
 * segundos de pétalos / estrellas / confeti. Con "reducir movimiento" queda
 * todo quieto y sin lluvia.
 */
export function SeasonDecor() {
  const { season, settings, discountsOn } = useSiteSettings();
  const pathname = usePathname() || "/";
  const reduced = useReducedMotionPreference();
  // La lluvia solo en la primera página de la visita (no en cada clic).
  const [falling, setFalling] = useState(false);

  useEffect(() => {
    if (!season || season === "black-friday") return;
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

  const discount = discountsOn && settings.discounts.global > 0 ? settings.discounts.global : 0;

  return (
    <div className="season-decor" data-season-decor={season} aria-hidden>
      {season === "muertos" && (
        <div className="season-garland">
          <span className="season-rope" />
          <div className="season-garland-row">
            {Array.from({ length: 20 }, (_, i) => (
              <PicadoFlag key={i} index={i} className="season-flag" style={{ ["--i" as string]: i } as CSSProperties} />
            ))}
          </div>
        </div>
      )}
      {season === "navidad" && (
        <div className="season-garland">
          <span className="season-rope season-rope-pine" />
          <div className="season-garland-row season-ornaments">
            {Array.from({ length: 22 }, (_, i) => (
              <HangingOrnament key={i} index={i} className="season-flag" style={{ ["--i" as string]: i } as CSSProperties} />
            ))}
          </div>
        </div>
      )}
      {season === "buen-fin" && (
        <div className="season-garland">
          <span className="season-rope" />
          <div className="season-garland-row season-tags">
            {Array.from({ length: 22 }, (_, i) => (
              <HangingTag key={i} index={i} />
            ))}
          </div>
        </div>
      )}
      {season === "black-friday" && (
        <Tape
          tone="yellow"
          className="season-tape"
          words={["BLACK FRIDAY", "SALE", discount ? `HASTA -${discount}%` : "PRECIOS ESPECIALES", "CYBER MONDAY"]}
        />
      )}
      {!reduced && falling && <Fall season={season} />}
    </div>
  );
}
