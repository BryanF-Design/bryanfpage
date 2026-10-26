/**
 * Día de Muertos — arte de folclor mexicano en SVG: flores bordadas, paisleys,
 * ramas de hojas azules, papel picado calado de verdad (con máscara, se ve lo
 * de atrás) y una calavera de azúcar con flores en los ojos. Todo decorativo:
 * `aria-hidden` y sin foco.
 */
import type { CSSProperties } from "react";

export const MUERTOS = {
  night: "#2a0b3d",
  purple: "#3d1158",
  plum: "#5a1a7e",
  magenta: "#ff2e8b",
  pink: "#ff7ab8",
  orange: "#ff7a12",
  marigold: "#ffae00",
  yellow: "#ffd60a",
  blue: "#1c64d8",
  sky: "#38b6f7",
  teal: "#0fb59b",
  red: "#ee2a3a",
  violet: "#9a43e0",
  bone: "#fff8ec",
} as const;

const M = MUERTOS;

// ——— Primitivas (en coordenadas locales; se colocan con translate) ———————

function Bloom({
  x,
  y,
  r,
  n = 8,
  outer,
  inner,
  center,
  dots,
}: {
  x: number;
  y: number;
  r: number;
  n?: number;
  outer: string;
  inner: string;
  center: string;
  dots?: string;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {Array.from({ length: n }, (_, i) => (
        <ellipse key={`o${i}`} cy={-r * 0.56} rx={r * 0.34} ry={r * 0.5} fill={outer} transform={`rotate(${(i * 360) / n})`} />
      ))}
      {Array.from({ length: n }, (_, i) => (
        <ellipse key={`i${i}`} cy={-r * 0.34} rx={r * 0.19} ry={r * 0.32} fill={inner} transform={`rotate(${(i * 360) / n + 180 / n})`} />
      ))}
      <circle r={r * 0.3} fill={center} />
      {dots &&
        Array.from({ length: 7 }, (_, i) => (
          <circle key={`d${i}`} cx={Math.cos((i * 2 * Math.PI) / 7) * r * 0.17} cy={Math.sin((i * 2 * Math.PI) / 7) * r * 0.17} r={r * 0.045} fill={dots} />
        ))}
    </g>
  );
}

/** Margarita de pétalos finos con estambres (como el ramo del cartel). */
function Daisy({ x, y, r, petal, center, ring }: { x: number; y: number; r: number; petal: string; center: string; ring: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {Array.from({ length: 12 }, (_, i) => (
        <ellipse key={i} cy={-r * 0.58} rx={r * 0.14} ry={r * 0.44} fill={petal} transform={`rotate(${i * 30})`} />
      ))}
      {[-38, 0, 38].map((a) => (
        <g key={a} transform={`rotate(${a - 90})`}>
          <path d={`M${r * 0.3} 0H${r * 1.08}`} stroke={M.yellow} strokeWidth={r * 0.05} strokeLinecap="round" />
          <circle cx={r * 1.1} r={r * 0.08} fill={M.yellow} />
        </g>
      ))}
      <circle r={r * 0.3} fill={center} stroke={ring} strokeWidth={r * 0.09} />
    </g>
  );
}

/** Tulipán de frente, de capas (la flor naranja grande de las esquinas). */
function Tulip({ x, y, s = 1, rot = 0 }: { x: number; y: number; s?: number; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M0 6C-26 0-34-30-22-54c8 10 14 15 22 17 8-2 14-7 22-17C34-30 26 0 0 6Z" fill={M.orange} />
      <path d="M0 2C-14-8-17-36 0-62 17-36 14-8 0 2Z" fill={M.red} />
      <path d="M0-6C-7-14-8-32 0-48 8-32 7-14 0-6Z" fill={M.yellow} />
      <path d="M-17-34c4 9 9 15 17 19 8-4 13-10 17-19" stroke={M.yellow} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M-20 4C-10 14 10 14 20 4 12 18-12 18-20 4Z" fill={M.teal} />
      {[-10, -4, 2, 8, -7, 5].map((dx, i) => (
        <circle key={i} cx={dx} cy={-66 - (i % 3) * 5} r="2.4" fill={M.yellow} />
      ))}
    </g>
  );
}

/** Paisley con rayas de colores. */
function Paisley({ x, y, s = 1, rot = 0, colors }: { x: number; y: number; s?: number; rot?: number; colors: readonly string[] }) {
  const d = "M0 40C-26 40-34 10-22-12-12-30 6-38 14-56c6 18 16 36 14 58C26 26 16 40 0 40Z";
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {colors.map((c, i) => {
        const k = 1 - i * (0.78 / colors.length);
        return <path key={i} d={d} fill={c} transform={`translate(0 ${12 * (1 - k)}) scale(${k})`} />;
      })}
      {Array.from({ length: 6 }, (_, i) => (
        <circle key={i} cx={-30 + i * 2} cy={30 - i * 11} r="2" fill={M.yellow} />
      ))}
    </g>
  );
}

function Leaf({ x, y, len, rot, color }: { x: number; y: number; len: number; rot: number; color: string }) {
  return (
    <path
      d={`M0 0Q${len / 2} ${-len * 0.3} ${len} 0Q${len / 2} ${len * 0.3} 0 0Z`}
      fill={color}
      transform={`translate(${x} ${y}) rotate(${rot})`}
    />
  );
}

/** Rama: tallo y hojitas alternadas. */
function Sprig({ x, y, len, rot, color, leaf }: { x: number; y: number; len: number; rot: number; color: string; leaf: string }) {
  const n = Math.max(3, Math.round(len / 22));
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={`M0 0Q${len / 2} ${-len * 0.12} ${len} 0`} stroke={color} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      {Array.from({ length: n }, (_, i) => {
        const t = (i + 0.6) / (n + 0.4);
        const side = i % 2 ? 1 : -1;
        return <Leaf key={i} x={t * len} y={-len * 0.12 * 2 * t * (1 - t)} len={16 - t * 4} rot={side * 48 - 10} color={leaf} />;
      })}
    </g>
  );
}

function Berries({ x, y, color }: { x: number; y: number; color: string }) {
  const pts = [
    [0, 0],
    [9, -6],
    [-8, -7],
    [3, -15],
    [14, 5],
    [-12, 4],
  ];
  return (
    <g transform={`translate(${x} ${y})`}>
      {pts.map(([px, py], i) => (
        <g key={i}>
          <path d={`M0 12L${px} ${py}`} stroke={M.teal} strokeWidth="1.4" />
          <circle cx={px} cy={py} r="4.4" fill={color} />
        </g>
      ))}
    </g>
  );
}

// ——— Composiciones ————————————————————————————————————————————————————————

/**
 * Lo que va sobre la orilla de arriba de la esquina; se refleja en la
 * diagonal para la orilla izquierda, así la esquina queda simétrica.
 */
function CornerHalf() {
  return (
    <>
      <Sprig x={96} y={10} len={210} rot={-2} color={M.teal} leaf={M.sky} />
      <Leaf x={40} y={6} len={120} rot={12} color={M.blue} />
      <Leaf x={30} y={18} len={96} rot={30} color={M.sky} />
      <Paisley x={210} y={88} s={0.95} rot={58} colors={[M.red, M.yellow, M.blue, M.magenta]} />
      <Bloom x={170} y={36} r={30} outer={M.yellow} inner={M.marigold} center={M.orange} dots={M.yellow} />
      <Daisy x={262} y={34} r={26} petal={M.magenta} center={M.yellow} ring={M.blue} />
      <Berries x={142} y={84} color={M.violet} />
      <Bloom x={300} y={86} r={16} outer={M.pink} inner={M.magenta} center={M.yellow} />
      <Leaf x={226} y={8} len={44} rot={-18} color={M.teal} />
    </>
  );
}

/** Esquina floral (arriba a la izquierda; voltéala con CSS para las demás). */
export function FloralCorner({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 330 330" className={className} style={style} aria-hidden focusable="false">
      <g>
        <CornerHalf />
      </g>
      <g transform="matrix(0 1 1 0 0 0)">
        <CornerHalf />
      </g>
      <Leaf x={8} y={8} len={150} rot={45} color={M.blue} />
      <Leaf x={20} y={20} len={104} rot={22} color={M.teal} />
      <Leaf x={20} y={20} len={104} rot={68} color={M.teal} />
      <Tulip x={92} y={92} s={1.25} rot={135} />
      <Bloom x={140} y={140} r={22} outer={M.blue} inner={M.sky} center={M.orange} dots={M.yellow} />
      <Bloom x={52} y={52} r={20} outer={M.magenta} inner={M.pink} center={M.yellow} />
    </svg>
  );
}

/** Cempasúchil de frente, con dos coronas de pétalos. */
export function Marigold({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 40 40" className={className} style={style} aria-hidden focusable="false">
      {Array.from({ length: 14 }, (_, i) => (
        <ellipse key={`o${i}`} cx="20" cy="8" rx="4" ry="7.5" fill={M.orange} transform={`rotate(${i * (360 / 14)} 20 20)`} />
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <ellipse key={`m${i}`} cx="20" cy="11" rx="3.4" ry="5.8" fill={M.marigold} transform={`rotate(${i * 30 + 12} 20 20)`} />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <ellipse key={`i${i}`} cx="20" cy="14.5" rx="2.4" ry="3.6" fill={M.yellow} transform={`rotate(${i * 40} 20 20)`} />
      ))}
      <circle cx="20" cy="20" r="3" fill="#e25b00" />
    </svg>
  );
}

/** Pétalo suelto que cae. */
export function Petal({ className, color = M.marigold }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden focusable="false">
      <path d="M10 1c4.4 3.6 6.4 7.4 6 11.3-.3 3.4-2.9 6-6 6s-5.7-2.6-6-6C3.6 8.4 5.6 4.6 10 1Z" fill={color} />
    </svg>
  );
}

/**
 * Calavera de azúcar ornamentada (estilo cartel): flores en los ojos, corazón
 * de nariz, frente con cempasúchil y hojas, volutas en los pómulos.
 */
export function SugarSkull({
  className,
  bone = M.bone,
  ink = M.purple,
  style,
}: {
  className?: string;
  bone?: string;
  ink?: string;
  style?: CSSProperties;
}) {
  return (
    <svg viewBox="0 0 200 210" className={className} style={style} aria-hidden focusable="false">
      <path
        d="M100 8C50 8 16 44 16 92c0 28 12 47 30 59l2 26c.6 9 8 16 17 16h70c9 0 16.4-7 17-16l2-26c18-12 30-31 30-59 0-48-34-84-84-84Z"
        fill={bone}
      />
      {/* Frente: cempasúchil con hojas y volutas. */}
      <g transform="translate(100 44)">
        <Leaf x={-6} y={4} len={34} rot={200} color={M.teal} />
        <Leaf x={6} y={4} len={34} rot={-20} color={M.teal} />
        <path d="M-44 18c8-14 22-16 30-8M44 18c-8-14-22-16-30-8" stroke={ink} strokeWidth="3.4" fill="none" strokeLinecap="round" />
        <circle cx="-46" cy="20" r="3.2" fill={ink} />
        <circle cx="46" cy="20" r="3.2" fill={ink} />
      </g>
      <Bloom x={100} y={44} r={18} n={10} outer={M.orange} inner={M.marigold} center={M.magenta} dots={M.yellow} />
      {/* Cejas festoneadas. */}
      {[64, 136].map((cx) => (
        <g key={cx}>
          <path d={`M${cx - 30} 82c10-16 50-16 60 0`} stroke={ink} strokeWidth="3.6" fill="none" strokeLinecap="round" />
          {[-24, -12, 0, 12, 24].map((dx) => (
            <circle key={dx} cx={cx + dx} cy={dx === 0 ? 66 : Math.abs(dx) === 12 ? 68.5 : 74} r="2.6" fill={M.magenta} />
          ))}
        </g>
      ))}
      {/* Ojos: cuenca y flor. */}
      {[64, 136].map((cx) => (
        <g key={`e${cx}`}>
          <circle cx={cx} cy="104" r="25" fill={ink} />
          {Array.from({ length: 8 }, (_, i) => (
            <ellipse key={i} cx={cx} cy="93" rx="5.4" ry="9" fill={i % 2 ? M.pink : M.magenta} transform={`rotate(${i * 45} ${cx} 104)`} />
          ))}
          <circle cx={cx} cy="104" r="6.4" fill={M.yellow} />
          <circle cx={cx} cy="104" r="2.6" fill={M.orange} />
        </g>
      ))}
      {/* Nariz de corazón al revés. */}
      <path d="M100 150c-8-6-13-10.5-13-16 0-4 3-7 6.6-7 2.8 0 5 1.6 6.4 3.8 1.4-2.2 3.6-3.8 6.4-3.8 3.6 0 6.6 3 6.6 7 0 5.5-5 10-13 16Z" fill={ink} />
      {/* Pómulos: volutas de puntitos. */}
      {[1, -1].map((side) => (
        <g key={side} transform={`translate(${100 + side * 60} 140) scale(${side} 1)`}>
          <path d="M-6 0c6-10 18-8 18 2 0 6-8 8-10 2" stroke={M.teal} strokeWidth="3" fill="none" strokeLinecap="round" />
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} cx={-10 - i * 2} cy={8 + i * 6} r="2.4" fill={M.orange} />
          ))}
        </g>
      ))}
      {/* Boca y dientes. */}
      <rect x="58" y="162" width="84" height="24" rx="10" fill={ink} />
      {Array.from({ length: 7 }, (_, i) => (
        <rect key={i} x={62 + i * 11.2} y="165" width="9" height="18" rx="3" fill={bone} />
      ))}
      <path d="M58 174h84" stroke={ink} strokeWidth="2.6" />
      <circle cx="100" cy="200" r="3" fill={M.magenta} />
    </svg>
  );
}

/** Calaverita chica para el logo y el aviso (la misma, simplificada). */
export function MiniSkull({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 66" className={className} aria-hidden focusable="false">
      <path
        d="M32 3C16 3 6 14.5 6 29.5c0 9 3.8 15 9.5 18.8l.6 8c.2 2.8 2.5 5 5.3 5h21.2c2.8 0 5.1-2.2 5.3-5l.6-8C54.2 44.5 58 38.5 58 29.5 58 14.5 48 3 32 3Z"
        fill={M.bone}
        stroke={M.purple}
        strokeWidth="2.4"
      />
      <g transform="translate(32 13)">
        {Array.from({ length: 8 }, (_, i) => (
          <ellipse key={i} cy="-3.4" rx="1.9" ry="3" fill={M.orange} transform={`rotate(${i * 45})`} />
        ))}
        <circle r="1.8" fill={M.magenta} />
      </g>
      {[21, 43].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="31" r="8" fill={M.purple} />
          {Array.from({ length: 6 }, (_, i) => (
            <ellipse key={i} cx={cx} cy="27" rx="1.9" ry="3.2" fill={M.magenta} transform={`rotate(${i * 60} ${cx} 31)`} />
          ))}
          <circle cx={cx} cy="31" r="2" fill={M.yellow} />
        </g>
      ))}
      <path d="M32 46c-2.6-1.9-4.2-3.3-4.2-5 0-1.3 1-2.2 2.1-2.2.9 0 1.6.5 2.1 1.2.5-.7 1.2-1.2 2.1-1.2 1.1 0 2.1.9 2.1 2.2 0 1.7-1.6 3.1-4.2 5Z" fill={M.purple} />
      <rect x="20" y="50" width="24" height="7" rx="3" fill={M.purple} />
      {[23, 27, 31, 35, 39].map((x) => (
        <rect key={x} x={x} y="51" width="2.6" height="5" rx="1" fill={M.bone} />
      ))}
    </svg>
  );
}

// ——— Papel picado ————————————————————————————————————————————————————————

export const PICADO_COLORS = [M.magenta, M.orange, M.violet, M.teal, M.yellow, M.blue, M.red, M.pink] as const;

/** Calados: lo negro de la máscara es lo que se recorta del papel. */
function Cutouts({ variant }: { variant: number }) {
  const frame = <rect x="6" y="6" width="48" height="52" rx="1.5" fill="none" stroke="#000" strokeWidth="1.6" />;
  const corners = (
    <path d="M12 12l3 3-3 3-3-3ZM48 12l3 3-3 3-3-3ZM12 50l3 3-3 3-3-3ZM48 50l3 3-3 3-3-3Z" fill="#000" />
  );
  if (variant === 0)
    // Calavera: el hueso es papel (blanco), alrededor se recorta.
    return (
      <>
        {frame}
        {corners}
        <circle cx="30" cy="30" r="15" fill="#000" />
        <path d="M30 18c-6.6 0-11 4.6-11 10.6 0 3.6 1.6 6 4 7.5l.3 3.6c.1 1 1 1.8 2 1.8h9.4c1 0 1.9-.8 2-1.8l.3-3.6c2.4-1.5 4-3.9 4-7.5C41 22.6 36.6 18 30 18Z" fill="#fff" />
        <circle cx="25.6" cy="29" r="3" fill="#000" />
        <circle cx="34.4" cy="29" r="3" fill="#000" />
        <path d="M30 32.6l-1.6 2.6h3.2Z" fill="#000" />
        <path d="M26.5 38.2v2M29 38.2v2M31.5 38.2v2M34 38.2v2" stroke="#000" strokeWidth="1" />
        {[16, 22, 30, 38, 44].map((x) => (
          <circle key={x} cx={x} cy="52" r="1.3" fill="#000" />
        ))}
      </>
    );
  if (variant === 1)
    // Flor de ocho pétalos con centro de papel.
    return (
      <>
        {frame}
        {corners}
        {Array.from({ length: 8 }, (_, k) => (
          <ellipse key={k} cx="30" cy="20" rx="3.4" ry="6.4" fill="#000" transform={`rotate(${k * 45} 30 30)`} />
        ))}
        <circle cx="30" cy="30" r="3.4" fill="#000" />
        {Array.from({ length: 12 }, (_, k) => (
          <circle key={`r${k}`} cx={30 + Math.cos((k * Math.PI) / 6) * 17} cy={30 + Math.sin((k * Math.PI) / 6) * 17} r="1.2" fill="#000" />
        ))}
      </>
    );
  // Corazón y rayos.
  return (
    <>
      {frame}
      {corners}
      <path d="M30 40c-7-5-11-8.6-11-13 0-3.2 2.4-5.6 5.4-5.6 2.4 0 4.3 1.3 5.6 3.2 1.3-1.9 3.2-3.2 5.6-3.2 3 0 5.4 2.4 5.4 5.6 0 4.4-4 8-11 13Z" fill="#000" />
      {Array.from({ length: 10 }, (_, k) => (
        <path key={k} d="M30 11l1.6 4h-3.2Z" fill="#000" transform={`rotate(${k * 36 - 90 + 18} 30 30) translate(0 -1)`} />
      ))}
      <path d="M14 46h32" stroke="#000" strokeWidth="1.2" strokeDasharray="2 2" />
    </>
  );
}

/** Una banderita de papel picado. */
export function PicadoFlag({ index, className, style }: { index: number; className?: string; style?: CSSProperties }) {
  const variant = index % 3;
  const id = `picado-cut-${variant}`;
  return (
    <svg viewBox="0 0 60 74" className={className} style={style} focusable="false" aria-hidden>
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="60" height="74">
          <rect width="60" height="74" fill="#fff" />
          <Cutouts variant={variant} />
        </mask>
      </defs>
      <path
        d="M1 1h58v62l-3.6 6-3.6-6-3.6 6-3.6-6-3.6 6-3.6-6-3.6 6-3.6-6-3.6 6-3.6-6-3.6 6-3.6-6-3.6 6-3.6-6-3.6 6L1 63Z"
        fill={PICADO_COLORS[index % PICADO_COLORS.length]}
        mask={`url(#${id})`}
      />
      <path d="M1 1h58" stroke="rgba(0,0,0,.25)" strokeWidth="2" />
    </svg>
  );
}
