/**
 * Ilustraciones de temporada en SVG (sin imágenes que descargar). Todas son
 * decorativas: `aria-hidden` y sin foco.
 */

const INK = "#101a16";

/** Calaverita de azúcar: ojos de cempasúchil, nariz de corazón. */
export function Calaverita({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden focusable="false">
      <path
        d="M32 5C17.6 5 8 15 8 28.5c0 8 3.7 13.4 9 16.3v6.7a4.5 4.5 0 0 0 4.5 4.5h21a4.5 4.5 0 0 0 4.5-4.5v-6.7c5.3-2.9 9-8.3 9-16.3C56 15 46.4 5 32 5Z"
        fill="#fffaf2"
        stroke={INK}
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      {/* Frente: florecita */}
      <g fill="#e2307a">
        <circle cx="32" cy="12.5" r="2.1" />
        <circle cx="28.4" cy="15" r="1.7" />
        <circle cx="35.6" cy="15" r="1.7" />
      </g>
      <circle cx="32" cy="15.2" r="1.3" fill="#f6a21a" />
      {[22, 42].map((cx) => (
        <g key={cx}>
          {Array.from({ length: 8 }, (_, i) => (
            <ellipse
              key={i}
              cx={cx}
              cy={23.2}
              rx="2.4"
              ry="4"
              fill="#f6a21a"
              transform={`rotate(${i * 45} ${cx} 28)`}
            />
          ))}
          <circle cx={cx} cy="28" r="4.6" fill={INK} />
          <circle cx={cx + 1.4} cy="26.6" r="1.2" fill="#fffaf2" />
        </g>
      ))}
      <path d="M32 41.5c-2.6-1.9-4.3-3.4-4.3-5.2 0-1.3 1-2.3 2.2-2.3.9 0 1.6.5 2.1 1.2.5-.7 1.2-1.2 2.1-1.2 1.2 0 2.2 1 2.2 2.3 0 1.8-1.7 3.3-4.3 5.2Z" fill="#7b3fb8" />
      <path d="M21 48.5h22" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
      {[24.5, 28.2, 32, 35.8, 39.5].map((x) => (
        <path key={x} d={`M${x} 45.6v5.8`} stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
      ))}
      <path d="M13 31.5c1.5 1.2 3 1.2 4.5 0M46.5 31.5c1.5 1.2 3 1.2 4.5 0" stroke="#2fa8a0" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/** Flor de cempasúchil (vista de frente). */
export function Cempasuchil({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden focusable="false">
      {Array.from({ length: 12 }, (_, i) => (
        <ellipse key={`o${i}`} cx="20" cy="8.5" rx="4.2" ry="7.5" fill="#f39012" transform={`rotate(${i * 30} 20 20)`} />
      ))}
      {Array.from({ length: 10 }, (_, i) => (
        <ellipse key={`i${i}`} cx="20" cy="12" rx="3.2" ry="5.4" fill="#fbb423" transform={`rotate(${i * 36 + 18} 20 20)`} />
      ))}
      <circle cx="20" cy="20" r="4.2" fill="#d96a06" />
    </svg>
  );
}

/** Pétalo suelto (lo que cae). */
export function Petal({ className, color = "#f6a21a" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden focusable="false">
      <path d="M10 1c4.4 3.6 6.4 7.4 6 11.3-.3 3.4-2.9 6-6 6s-5.7-2.6-6-6C3.6 8.4 5.6 4.6 10 1Z" fill={color} />
    </svg>
  );
}

const PICADO = ["#e2307a", "#f39012", "#7b3fb8", "#2fa8a0", "#b4e332", "#f6c21a"];

/**
 * Tira de papel picado: banderitas con calados que se mecen. `count` se
 * ajusta al ancho con CSS (las que no caben quedan fuera del recorte).
 */
export function PapelPicado({ count = 18 }: { count?: number }) {
  return (
    <div className="season-picado" aria-hidden>
      <svg className="season-picado-rope" viewBox="0 0 100 8" preserveAspectRatio="none" focusable="false">
        <path d="M0 2 Q50 4 100 2" stroke="#101a16" strokeOpacity=".35" strokeWidth=".5" fill="none" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="season-picado-row">
        {Array.from({ length: count }, (_, i) => (
          <svg
            key={i}
            viewBox="0 0 60 72"
            className="season-flag"
            style={{ ["--i" as string]: i } as React.CSSProperties}
            focusable="false"
          >
            <path
              d="M2 2h56v58l-4.7 8-4.6-8-4.7 8-4.6-8-4.7 8-4.6-8-4.7 8-4.6-8-4.7 8-4.6-8-4.7 8L2 60Z"
              fill={PICADO[i % PICADO.length]}
            />
            {/* Calados: flor al centro, rombos y puntos alrededor. */}
            <g fill="hsl(var(--canvas))">
              <circle cx="30" cy="30" r="5" />
              {Array.from({ length: 6 }, (_, k) => (
                <ellipse key={k} cx="30" cy="19.5" rx="3" ry="5" transform={`rotate(${k * 60} 30 30)`} />
              ))}
              <path d="M10 10l4 4-4 4-4-4ZM50 10l4 4-4 4-4-4ZM10 44l4 4-4 4-4-4ZM50 44l4 4-4 4-4-4Z" />
              <circle cx="30" cy="52" r="2.2" />
              <circle cx="20" cy="52" r="1.6" />
              <circle cx="40" cy="52" r="1.6" />
              <circle cx="30" cy="8" r="1.6" />
            </g>
          </svg>
        ))}
      </div>
    </div>
  );
}

const BULBS = ["#e5484d", "#f6c21a", "#2fa86b", "#3b82f6", "#f39012"];

/** Serie de luces navideñas que titilan. */
export function LucesNavidad({ count = 22 }: { count?: number }) {
  return (
    <div className="season-lights" aria-hidden>
      <svg className="season-picado-rope" viewBox="0 0 100 8" preserveAspectRatio="none" focusable="false">
        <path d="M0 2 Q50 4 100 2" stroke="#1f3b2c" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="season-lights-row">
        {Array.from({ length: count }, (_, i) => (
          <span
            key={i}
            className="season-bulb"
            style={{ ["--i" as string]: i, ["--c" as string]: BULBS[i % BULBS.length] } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}

/** Copo de nieve. */
export function Copo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden focusable="false">
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none">
        <path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7" />
        <path d="M9.5 3.8 12 6l2.5-2.2M9.5 20.2 12 18l2.5 2.2M4 10.2l3.2-.4-1-3M20 13.8l-3.2.4 1 3M4 13.8l3.2.4-1 3M20 10.2l-3.2-.4 1-3" />
      </g>
    </svg>
  );
}

/** Gorro de Santa (para el logo). */
export function GorroNavidad({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 40" className={className} aria-hidden focusable="false">
      <path d="M6 30C10 12 22 3 34 6c5 1.3 8 6 8.5 12.5L37 20c-1-4-3-6-6-6.2C22 13.5 16 22 15 30Z" fill="#e5484d" stroke="#101a16" strokeWidth="2" strokeLinejoin="round" />
      <rect x="3" y="28" width="30" height="9" rx="4.5" fill="#fff" stroke="#101a16" strokeWidth="2" />
      <circle cx="41" cy="20.5" r="5" fill="#fff" stroke="#101a16" strokeWidth="2" />
    </svg>
  );
}

/** Etiqueta de precio (Buen Fin / Black Friday). */
export function EtiquetaPrecio({ className, fill = "#e5484d", text = "%" }: { className?: string; fill?: string; text?: string }) {
  return (
    <svg viewBox="0 0 48 32" className={className} aria-hidden focusable="false">
      <path d="M12 2h31a3 3 0 0 1 3 3v22a3 3 0 0 1-3 3H12L2 16Z" fill={fill} stroke="#101a16" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="11" cy="16" r="2.6" fill="#fff" stroke="#101a16" strokeWidth="1.6" />
      <text x="29" y="21.5" textAnchor="middle" fontSize="15" fontWeight="900" fontFamily="system-ui, sans-serif" fill="#fff">
        {text}
      </text>
    </svg>
  );
}

const PENNANTS = ["#e5484d", "#f6c21a", "#3b82f6", "#b4e332", "#e2307a", "#f39012"];

/** Banderines triangulares (Buen Fin). */
export function Banderines({ count = 22, dark = false }: { count?: number; dark?: boolean }) {
  return (
    <div className="season-picado" aria-hidden>
      <svg className="season-picado-rope" viewBox="0 0 100 8" preserveAspectRatio="none" focusable="false">
        <path d="M0 2 Q50 4 100 2" stroke={dark ? "#f6c21a" : "#101a16"} strokeOpacity=".45" strokeWidth=".5" fill="none" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="season-picado-row season-pennants">
        {Array.from({ length: count }, (_, i) => (
          <svg key={i} viewBox="0 0 40 48" className="season-flag" style={{ ["--i" as string]: i } as React.CSSProperties} focusable="false">
            <path d="M2 2h36L20 46Z" fill={dark ? (i % 2 ? "#101a16" : "#f6c21a") : PENNANTS[i % PENNANTS.length]} stroke="#101a16" strokeOpacity=".2" strokeWidth="1" />
          </svg>
        ))}
      </div>
    </div>
  );
}
