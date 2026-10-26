/**
 * El Buen Fin y Black Friday — las dos temporadas de ventas.
 *
 * El Buen Fin tiene logotipo propio (la hoja de calendario con "BUEN FIN :)"
 * y la franja roja); aquí está redibujado en SVG para que se vea nítido a
 * cualquier tamaño. Black Friday no tiene logo: se reconoce por la
 * tipografía enorme en negro, la cinta de "SALE", la etiqueta de precio y el
 * código de barras. Decorativo: `aria-hidden` y sin foco.
 */
import type { CSSProperties } from "react";

export const VENTAS = {
  red: "#e30613",
  redHot: "#ff2b3a",
  black: "#0b0b0b",
  coal: "#161616",
  yellow: "#ffd400",
  white: "#ffffff",
} as const;

const V = VENTAS;
const DISPLAY = "var(--font-display), system-ui, sans-serif";

/** Logotipo de El Buen Fin: hoja de calendario con argollas y esquina doblada. */
export function BuenFinLogo({ className, style, tagline = true }: { className?: string; style?: CSSProperties; tagline?: boolean }) {
  return (
    <svg viewBox="0 0 220 206" className={className} style={style} aria-hidden focusable="false">
      {/* Grosor de la hoja (canto negro). */}
      <path d="M8 14h200a4 4 0 0 1 4 4v178a4 4 0 0 1-4 4H22L8 186Z" fill={V.black} transform="translate(4 4)" />
      <path d="M8 10h200a4 4 0 0 1 4 4v158l-26 24H12a4 4 0 0 1-4-4Z" fill={V.white} stroke={V.black} strokeWidth="3" />
      <path d="M8 152h204v20l-26 24H12a4 4 0 0 1-4-4Z" fill={V.red} stroke={V.black} strokeWidth="3" strokeLinejoin="round" />
      {/* Esquina doblada. */}
      <path d="M186 196v-18a6 6 0 0 1 6-6h20Z" fill="#e9e9e9" stroke={V.black} strokeWidth="2.4" strokeLinejoin="round" />
      {/* Argollas. */}
      {[68, 152].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="24" r="5.4" fill={V.black} />
          <circle cx={cx - 1.4} cy="22.6" r="1.4" fill="#555" />
        </g>
      ))}
      <text x="24" y="86" fontFamily={DISPLAY} fontWeight="900" fontSize="58" textLength="168" lengthAdjust="spacingAndGlyphs" fill={V.black}>
        BUEN
      </text>
      <text x="24" y="134" fontFamily={DISPLAY} fontWeight="900" fontSize="58" textLength="104" lengthAdjust="spacingAndGlyphs" fill={V.black}>
        FIN
      </text>
      {/* La carita: dos puntos y paréntesis rojos. */}
      <circle cx="140" cy="100" r="6.4" fill={V.red} />
      <circle cx="140" cy="126" r="6.4" fill={V.red} />
      <path d="M158 84c16 10 16 40 0 50" stroke={V.red} strokeWidth="11" fill="none" strokeLinecap="round" />
      {tagline && (
        <>
          <text x="110" y="146" textAnchor="middle" fontFamily={DISPLAY} fontWeight="700" fontSize="10" textLength="176" lengthAdjust="spacingAndGlyphs" fill={V.black}>
            EL FIN DE SEMANA MÁS BARATO DEL AÑO
          </text>
        </>
      )}
    </svg>
  );
}

/** El logo chiquito (sin lema) para junto al logotipo del sitio. */
export function BuenFinMini({ className }: { className?: string }) {
  return <BuenFinLogo className={className} tagline={false} />;
}

/** Hoja de papel negro que se enrolla (para el fondo del cartel de Buen Fin). */
export function PaperCurl({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 200 200" className={className} style={style} aria-hidden focusable="false">
      <defs>
        <linearGradient id="bf-curl-face" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3a3a3a" />
          <stop offset=".55" stopColor="#1b1b1b" />
          <stop offset="1" stopColor="#060606" />
        </linearGradient>
        <linearGradient id="bf-curl-lip" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#0a0a0a" />
          <stop offset=".55" stopColor="#6b6b6b" />
          <stop offset=".8" stopColor="#3a3a3a" />
          <stop offset="1" stopColor="#151515" />
        </linearGradient>
      </defs>
      <path d="M0 0h200v40C150 60 120 90 110 140 100 170 60 190 0 200Z" fill="url(#bf-curl-face)" />
      <path d="M110 140C120 90 150 60 200 40c-30 30-50 70-56 112-14 4-26 0-34-12Z" fill="url(#bf-curl-lip)" />
    </svg>
  );
}

/** Etiqueta de precio con hilo. */
export function PriceTag({
  className,
  style,
  text = "%",
  fill = V.red,
  color = V.white,
}: {
  className?: string;
  style?: CSSProperties;
  text?: string;
  fill?: string;
  color?: string;
}) {
  return (
    <svg viewBox="0 0 120 64" className={className} style={style} aria-hidden focusable="false">
      <path d="M2 32C14 26 18 14 30 12" stroke={V.white} strokeOpacity=".6" strokeWidth="1.6" fill="none" />
      <path d="M38 4h74a6 6 0 0 1 6 6v44a6 6 0 0 1-6 6H38L20 32Z" fill={fill} />
      <circle cx="34" cy="32" r="4.4" fill={V.black} />
      <text
        x="76"
        y="43"
        textAnchor="middle"
        fontFamily={DISPLAY}
        fontWeight="900"
        fontSize={text.length > 3 ? 24 : 30}
        fill={color}
      >
        {text}
      </text>
    </svg>
  );
}

/** Código de barras (figura, no un código real). */
export function Barcode({ className, color = V.white }: { className?: string; color?: string }) {
  const bars = [3, 1, 2, 1, 4, 1, 1, 3, 2, 1, 1, 2, 3, 1, 2, 4, 1, 1, 2, 1, 3, 2, 1, 1, 4, 1, 2, 3, 1, 2];
  let x = 0;
  return (
    <svg viewBox="0 0 120 40" className={className} aria-hidden focusable="false" preserveAspectRatio="none">
      {bars.map((w, i) => {
        const r = i % 2 === 0 ? <rect key={i} x={x} y="0" width={w * 1.3} height="40" fill={color} /> : null;
        x += w * 1.3 + 0.6;
        return r;
      })}
    </svg>
  );
}

/** Etiqueta negra "BF" para junto al logo del sitio. */
export function BlackTag({ className }: { className?: string }) {
  return <PriceTag className={className} text="BF" fill={V.black} color={V.yellow} />;
}
