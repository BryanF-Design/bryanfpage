/**
 * Navidad — mosaico geométrico en verdes y blanco (como un cartel suizo de
 * fiestas): cada mosaico es un cuadro con una figura simple — estrellas,
 * esferas, árbol, regalo, gorro, copo, muñeco de nieve. Decorativo.
 */
import type { CSSProperties } from "react";

export const NAVIDAD = {
  deep: "#0d3a2b",
  pine: "#145239",
  mid: "#1f7a52",
  mint: "#34b27b",
  frost: "#bff0d6",
  white: "#ffffff",
  gold: "#f5c84c",
  red: "#e5484d",
} as const;

const N = NAVIDAD;

export type TileKind =
  | "star4"
  | "star8"
  | "quarter"
  | "half"
  | "ornament"
  | "tree"
  | "gift"
  | "hat"
  | "diamond"
  | "petals"
  | "dots"
  | "arches"
  | "snowman"
  | "hourglass"
  | "sparkle"
  | "flake"
  | "blank";

/** Un mosaico de 100×100: `bg` de fondo y `fg` para la figura. */
function Motif({ kind, fg, bg }: { kind: TileKind; fg: string; bg: string }) {
  switch (kind) {
    case "star4":
      return <path d="M50 6C54 38 62 46 94 50 62 54 54 62 50 94 46 62 38 54 6 50 38 46 46 38 50 6Z" fill={fg} />;
    case "star8":
      return (
        <g fill={fg}>
          <path d="M50 8L58 42 92 50 58 58 50 92 42 58 8 50 42 42Z" />
          <path d="M50 8L58 42 92 50 58 58 50 92 42 58 8 50 42 42Z" transform="rotate(45 50 50)" opacity=".7" />
        </g>
      );
    case "quarter":
      return <path d="M0 100V0a100 100 0 0 1 100 100Z" fill={fg} />;
    case "half":
      return (
        <g fill={fg}>
          <path d="M0 50a50 50 0 0 1 100 0Z" />
          <path d="M0 100a50 50 0 0 1 100 0Z" opacity=".6" />
        </g>
      );
    case "ornament":
      return (
        <g>
          <circle cx="50" cy="54" r="38" fill={fg} />
          {[-24, -8, 8, 24].map((dx) => (
            <path key={dx} d={`M${50 + dx} 20Q${50 + dx * 1.6} 54 ${50 + dx} 88`} stroke={bg} strokeWidth="4" fill="none" />
          ))}
          <rect x="43" y="8" width="14" height="10" rx="2" fill={fg} />
        </g>
      );
    case "tree":
      return (
        <g fill={fg}>
          <path d="M50 6L74 36H26Z" />
          <path d="M50 24L82 60H18Z" />
          <path d="M50 44L90 86H10Z" />
          <rect x="44" y="86" width="12" height="10" />
        </g>
      );
    case "gift":
      return (
        <g fill={fg}>
          <rect x="18" y="40" width="64" height="50" />
          <rect x="12" y="30" width="76" height="14" />
          <path d="M50 30C40 10 22 14 28 26 32 32 44 30 50 30ZM50 30C60 10 78 14 72 26 68 32 56 30 50 30Z" />
          <rect x="45" y="30" width="10" height="60" fill={bg} />
        </g>
      );
    case "hat":
      return (
        <g>
          <path d="M18 70C26 30 50 14 72 22c10 4 14 14 14 28l-10 2c-2-8-6-12-12-12-14 0-24 14-28 30Z" fill={fg} />
          <rect x="12" y="66" width="62" height="18" rx="9" fill={N.white} />
          <circle cx="82" cy="54" r="10" fill={N.white} />
        </g>
      );
    case "diamond":
      return (
        <g fill={fg}>
          <path d="M50 4L96 50 50 96 4 50Z" />
          <path d="M50 30L70 50 50 70 30 50Z" fill={bg} />
        </g>
      );
    case "petals":
      return (
        <g fill={fg}>
          {[0, 90, 180, 270].map((r) => (
            <path key={r} d="M50 50C34 34 34 10 50 2 66 10 66 34 50 50Z" transform={`rotate(${r + 45} 50 50)`} />
          ))}
        </g>
      );
    case "dots":
      return (
        <g fill={fg}>
          <circle cx="27" cy="27" r="21" />
          <circle cx="73" cy="27" r="21" />
          <circle cx="27" cy="73" r="21" />
          <circle cx="73" cy="73" r="21" opacity=".55" />
        </g>
      );
    case "arches":
      return (
        <g fill="none" stroke={fg} strokeWidth="9">
          <path d="M-2 100a52 52 0 0 1 104 0" />
          <path d="M18 100a32 32 0 0 1 64 0" />
          <path d="M-2 48a52 52 0 0 1 104 0" opacity=".55" />
        </g>
      );
    case "snowman":
      return (
        <g>
          <circle cx="50" cy="66" r="26" fill={N.white} />
          <circle cx="50" cy="32" r="18" fill={N.white} />
          <rect x="30" y="8" width="40" height="10" rx="3" fill={fg} />
          <rect x="38" y="-4" width="24" height="16" fill={fg} />
          <circle cx="44" cy="30" r="2.6" fill={bg} />
          <circle cx="56" cy="30" r="2.6" fill={bg} />
          {[58, 68, 78].map((y) => (
            <circle key={y} cx="50" cy={y} r="3" fill={bg} />
          ))}
          <path d="M34 46h32l-4 6H38Z" fill={fg} />
        </g>
      );
    case "hourglass":
      return (
        <g fill={fg}>
          <path d="M0 0h100L50 50Z" />
          <path d="M0 100h100L50 50Z" opacity=".6" />
        </g>
      );
    case "sparkle":
      return (
        <g fill={fg}>
          {Array.from({ length: 8 }, (_, i) => (
            <path key={i} d="M50 50L46 10 50 2 54 10Z" transform={`rotate(${i * 45} 50 50)`} />
          ))}
          <circle cx="50" cy="50" r="7" />
        </g>
      );
    case "flake":
      return (
        <g stroke={fg} strokeWidth="6" strokeLinecap="round" fill="none">
          {[0, 60, 120].map((r) => (
            <g key={r} transform={`rotate(${r} 50 50)`}>
              <path d="M50 10V90" />
              <path d="M40 20L50 30 60 20M40 80L50 70 60 80" />
            </g>
          ))}
        </g>
      );
    default:
      return null;
  }
}

export interface TileSpec {
  kind: TileKind;
  bg: string;
  fg: string;
  rot?: number;
}

export function Tile({ spec, className, style }: { spec: TileSpec; className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden focusable="false" preserveAspectRatio="xMidYMid slice">
      <rect width="100" height="100" fill={spec.bg} />
      <g transform={spec.rot ? `rotate(${spec.rot} 50 50)` : undefined}>
        <Motif kind={spec.kind} fg={spec.fg} bg={spec.bg} />
      </g>
    </svg>
  );
}

const D = N.deep;
const P = N.pine;
const G = N.mid;
const T = N.mint;
const W = N.white;

/**
 * Secuencia fija (no aleatoria): se ve variada, combina tonos vecinos con
 * contraste y siempre sale igual. Se repite si hace falta más.
 */
export const TILE_SEQUENCE: TileSpec[] = [
  { kind: "dots", bg: D, fg: P },
  { kind: "star4", bg: P, fg: T },
  { kind: "flake", bg: D, fg: T },
  { kind: "hat", bg: D, fg: T },
  { kind: "petals", bg: G, fg: T },
  { kind: "quarter", bg: D, fg: G, rot: 90 },
  { kind: "gift", bg: G, fg: W },
  { kind: "hourglass", bg: D, fg: P },
  { kind: "star8", bg: P, fg: T },
  { kind: "diamond", bg: T, fg: D },
  { kind: "arches", bg: D, fg: G },
  { kind: "ornament", bg: P, fg: T },
  { kind: "sparkle", bg: D, fg: W },
  { kind: "tree", bg: G, fg: D },
  { kind: "half", bg: D, fg: T },
  { kind: "dots", bg: P, fg: W },
  { kind: "quarter", bg: T, fg: D },
  { kind: "snowman", bg: P, fg: T },
  { kind: "petals", bg: D, fg: G },
  { kind: "ornament", bg: G, fg: D },
  { kind: "star4", bg: D, fg: W },
  { kind: "half", bg: P, fg: G, rot: 180 },
  { kind: "flake", bg: G, fg: W },
  { kind: "diamond", bg: D, fg: T },
];

/** Esfera colgante (para la guirnalda de arriba). */
export function HangingOrnament({ index, className, style }: { index: number; className?: string; style?: CSSProperties }) {
  const len = [18, 34, 24, 42, 14, 30][index % 6];
  const kind = index % 4;
  const fill = [N.mint, N.white, N.mid, N.frost][index % 4];
  const line = index % 4 === 1 ? N.mid : N.white;
  return (
    <svg viewBox="0 0 40 100" className={className} style={style} aria-hidden focusable="false">
      <path d={`M20 0V${len}`} stroke={N.pine} strokeWidth="1.2" />
      <g transform={`translate(0 ${len})`}>
        {kind === 0 && (
          <>
            <rect x="16" y="0" width="8" height="5" rx="1" fill={N.gold} />
            <circle cx="20" cy="18" r="14" fill={fill} />
            <path d="M7 15h26M7 21h26" stroke={line} strokeWidth="2.2" opacity=".8" />
          </>
        )}
        {kind === 1 && <path d="M20 0C22 12 26 16 38 18 26 20 22 24 20 36 18 24 14 20 2 18 14 16 18 12 20 0Z" fill={fill} />}
        {kind === 2 && (
          <>
            <rect x="16" y="0" width="8" height="5" rx="1" fill={N.gold} />
            <path d="M20 4L34 22 20 40 6 22Z" fill={fill} />
            <path d="M20 4V40M6 22h28" stroke={N.white} strokeWidth="1.6" opacity=".7" />
          </>
        )}
        {kind === 3 && (
          <>
            <rect x="16" y="0" width="8" height="5" rx="1" fill={N.gold} />
            <circle cx="20" cy="18" r="13" fill={fill} />
            {[-6, 0, 6].map((dx) => (
              <path key={dx} d={`M${20 + dx} 6Q${20 + dx * 1.7} 18 ${20 + dx} 30`} stroke={N.mid} strokeWidth="1.8" fill="none" />
            ))}
          </>
        )}
      </g>
    </svg>
  );
}

/** Estrellita que cae (en vez de copos de caricatura). */
export function FallingStar({ className, color = N.frost }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden focusable="false">
      <path d="M10 0C11 7 13 9 20 10 13 11 11 13 10 20 9 13 7 11 0 10 7 9 9 7 10 0Z" fill={color} />
    </svg>
  );
}
