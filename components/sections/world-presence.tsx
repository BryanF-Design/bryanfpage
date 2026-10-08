"use client";

import { useEffect, useState, type CSSProperties } from "react";
import dynamic from "next/dynamic";
import { Globe2, Hand, Moon, Sparkle, Sun } from "lucide-react";

import { SectionHeading } from "@/components/sections/section-heading";
import { LazyMount } from "@/components/three/lazy-mount";
import { useLanguage } from "@/lib/i18n/context";
import { useDecorative3dEnabled } from "@/lib/motion-preference";
import { cn } from "@/lib/utils";

// El globo (three.js) viaja en su propio chunk y solo se descarga/monta
// cuando la sección se acerca al viewport (LazyMount) — el bundle inicial
// no lo paga nunca.
const GlobeScene = dynamic(
  () => import("@/components/three/globe-scene").then((m) => m.GlobeScene),
  { ssr: false }
);

const ARCS: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
];

/* ——— Globo estático ———————————————————————————————————————————————
   Proyección ortográfica centrada en el Atlántico, como arranca el globo 3D:
   México y Europa de frente. Caja de 400 × 400 con el planeta al 82 %, la
   misma proporción que ocupa la esfera en la escena de three.js. */
const BOX = 400;
const C = BOX / 2;
const R = 164;
const DEG = Math.PI / 180;
const VIEW = { lat: 26 * DEG, lng: -42 * DEG };

function project(lat: number, lng: number) {
  const phi = lat * DEG;
  const dl = lng * DEG - VIEW.lng;
  const x = Math.cos(phi) * Math.sin(dl);
  const y = Math.cos(VIEW.lat) * Math.sin(phi) - Math.sin(VIEW.lat) * Math.cos(phi) * Math.cos(dl);
  const depth =
    Math.sin(VIEW.lat) * Math.sin(phi) + Math.cos(VIEW.lat) * Math.cos(phi) * Math.cos(dl);
  // Redondeo a décimas: servidor y navegador deben pintar los mismos números.
  const round = (v: number) => Math.round(v * 10) / 10;
  return { x: round(C + x * R), y: round(C - y * R), depth };
}

/** Une los puntos visibles de una línea (paralelo o meridiano) en un trazo. */
function linePath(points: { x: number; y: number; depth: number }[]) {
  let d = "";
  let drawing = false;
  for (const p of points) {
    if (p.depth <= 0) {
      drawing = false;
      continue;
    }
    d += `${drawing ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    drawing = true;
  }
  return d;
}

// Retícula: paralelos cada 30° y meridianos cada 30°, calculados una vez.
const GRATICULE = [
  ...[-60, -30, 0, 30, 60].map((lat) =>
    linePath(Array.from({ length: 91 }, (_, i) => project(lat, -180 + i * 4)))
  ),
  ...Array.from({ length: 12 }, (_, m) =>
    linePath(Array.from({ length: 46 }, (_, i) => project(-90 + i * 4, -180 + m * 30)))
  ),
].join("");

/** Arco entre dos puntos, curvado hacia fuera del centro del planeta. */
function arcPath(a: { x: number; y: number }, b: { x: number; y: number }) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = mx - C;
  const dy = my - C;
  const len = Math.hypot(dx, dy) || 1;
  const lift = Math.hypot(b.x - a.x, b.y - a.y) * 0.42;
  const cx = mx + (dx / len) * lift;
  const cy = my + (dy / len) * lift;
  return `M${a.x.toFixed(1)} ${a.y.toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

/** Continentes en puntos: el mismo muestreo que usa el globo 3D, cargado
 *  aparte y solo cuando el globo se acerca a la pantalla. */
function LandDots() {
  const [paths, setPaths] = useState<[string, string] | null>(null);

  useEffect(() => {
    let alive = true;
    import("@/lib/three/land-dots").then(({ LAND_DOTS }) => {
      let near = "";
      let edge = "";
      for (let i = 0; i < LAND_DOTS.length; i += 2) {
        const p = project(LAND_DOTS[i] / 10, LAND_DOTS[i + 1] / 10);
        if (p.depth <= 0.04) continue;
        const dot = `M${p.x.toFixed(1)} ${p.y.toFixed(1)}h0`;
        if (p.depth > 0.32) near += dot;
        else edge += dot;
      }
      if (alive) setPaths([near, edge]);
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <svg
      viewBox={`0 0 ${BOX} ${BOX}`}
      className={cn(
        "absolute inset-0 size-full transition-opacity duration-700",
        paths ? "opacity-100" : "opacity-0"
      )}
    >
      {paths && (
        <g fill="none" strokeLinecap="round" stroke="hsl(80 40% 92%)">
          <path d={paths[1]} strokeWidth={2} strokeOpacity={0.26} />
          <path d={paths[0]} strokeWidth={2.3} strokeOpacity={0.66} />
        </g>
      )}
    </svg>
  );
}

interface StaticGlobeProps {
  locations: { lat: number; lng: number; label: string }[];
  /** Pinta los continentes (no hace falta cuando el 3D va a reemplazarlo). */
  land?: boolean;
}

/**
 * Versión sin WebGL del globo (teléfono y movimiento reducido): planeta de
 * tinta con halo lima, retícula fina, continentes en puntos y arcos desde
 * México. Los países que quedan detrás del planeta no se marcan.
 */
function StaticGlobe({ locations, land = false }: StaticGlobeProps) {
  const points = locations.map((l) => ({ ...l, ...project(l.lat, l.lng) }));
  const home = points[0];
  const visible = points
    .filter((p) => p.depth > 0.05)
    .sort((a, b) => a.y - b.y)
    // Si una etiqueta chocaría con la de arriba (Francia y España), baja.
    .map((p, i, list) => ({
      ...p,
      below: list.slice(0, i).some((q) => Math.abs(q.x - p.x) < 80 && Math.abs(q.y - p.y) < 36),
    }));

  return (
    <div aria-hidden className="absolute inset-0">
      <svg viewBox={`0 0 ${BOX} ${BOX}`} className="absolute inset-0 size-full">
        <defs>
          <radialGradient id="wp-glow">
            <stop
              offset={`${(R / (R + 34)) * 100}%`}
              stopColor="hsl(76 76% 54%)"
              stopOpacity="0.32"
            />
            <stop offset="100%" stopColor="hsl(76 76% 54%)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="wp-sphere" cx="38%" cy="32%" r="75%">
            <stop offset="0%" stopColor="hsl(162 30% 15%)" />
            <stop offset="100%" stopColor="hsl(160 40% 5%)" />
          </radialGradient>
        </defs>
        <circle cx={C} cy={C} r={R + 34} fill="url(#wp-glow)" />
        <circle cx={C} cy={C} r={R} fill="url(#wp-sphere)" />
        <path d={GRATICULE} fill="none" stroke="white" strokeOpacity={0.07} strokeWidth={1} />
        <circle
          cx={C}
          cy={C}
          r={R}
          fill="none"
          stroke="hsl(76 76% 54%)"
          strokeOpacity={0.55}
          strokeWidth={1.5}
        />
      </svg>

      {land && (
        <LazyMount className="absolute inset-0" rootMargin="300px">
          <LandDots />
        </LazyMount>
      )}

      <svg viewBox={`0 0 ${BOX} ${BOX}`} className="absolute inset-0 size-full">
        {home &&
          visible
            .filter((p) => p !== home)
            .map((p) => (
              <path
                key={p.label}
                d={arcPath(home, p)}
                fill="none"
                stroke="hsl(76 76% 54%)"
                strokeOpacity={0.85}
                strokeWidth={1.6}
                strokeDasharray="1 5"
                strokeLinecap="round"
              />
            ))}
        {visible.map((p) => (
          <g key={p.label}>
            <circle cx={p.x} cy={p.y} r={11} fill="hsl(76 76% 54%)" fillOpacity={0.22} />
            <circle cx={p.x} cy={p.y} r={4.5} fill="hsl(76 76% 54%)" />
          </g>
        ))}
      </svg>

      {visible.map((p) => (
        <span
          key={p.label}
          className="absolute rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-ink shadow-pop"
          style={{
            left: `${(p.x / BOX) * 100}%`,
            top: `${(p.y / BOX) * 100}%`,
            transform: p.below ? "translate(-50%, 55%)" : "translate(-50%, -150%)",
          }}
        >
          {p.label}
        </span>
      ))}
    </div>
  );
}

/** Órbita fina alrededor del planeta, como la del hero. */
function Orbit() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 400"
      className="pointer-events-none absolute inset-0 size-full text-white/25"
    >
      <ellipse
        cx="200"
        cy="200"
        rx="196"
        ry="52"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        transform="rotate(-14 200 200)"
      />
      <circle cx="18" cy="250" r="4" fill="hsl(76 76% 54%)" />
    </svg>
  );
}

const TIME_ZONES = ["America/Mexico_City", "Europe/Madrid", "Europe/Paris", "Asia/Tokyo"];

/** Hora local de cada sede. En el servidor (y antes de montar) va un guion:
 *  la hora real solo existe en el navegador. Se refresca cada 30 s. */
function useLocalTimes() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  return TIME_ZONES.map((timeZone) => {
    if (!now) return { text: "--:--", day: true };
    const text = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
      timeZone,
    }).format(now);
    const hour = Number(text.slice(0, 2));
    return { text, day: hour >= 7 && hour < 19 };
  });
}

export function WorldPresence() {
  const { t } = useLanguage();
  const decorative3dEnabled = useDecorative3dEnabled();
  const times = useLocalTimes();
  const globeClassName = "relative mx-auto aspect-square w-full max-w-[34rem]";
  const locations = [
    {
      lat: 19.4326,
      lng: -99.1332,
      label: t.world.locations.mexico,
      code: "MX",
      coords: "19.43° N · 99.13° W",
    },
    {
      lat: 40.4168,
      lng: -3.7038,
      label: t.world.locations.spain,
      code: "ES",
      coords: "40.42° N · 3.70° W",
    },
    {
      lat: 48.8566,
      lng: 2.3522,
      label: t.world.locations.france,
      code: "FR",
      coords: "48.86° N · 2.35° E",
    },
    {
      lat: 35.6762,
      lng: 139.6503,
      label: t.world.locations.japan,
      code: "JP",
      coords: "35.68° N · 139.65° E",
      accent: "signal" as const,
    },
  ];

  return (
    <section
      id="presencia"
      aria-label={t.world.title}
      className="relative grid gap-gutter lg:grid-cols-12"
    >
      {/* Texto + bitácora de ubicaciones (primero en el DOM; a la derecha en escritorio). */}
      <div data-fx="up" className="min-w-0 lg:order-2 lg:col-span-5">
        <div className="panel flex h-full flex-col gap-8 p-5 shadow-soft sm:p-7 lg:gap-10 lg:p-10">
          <SectionHeading
            eyebrow={t.world.eyebrow}
            title={t.world.title}
            subtitle={t.world.subtitle}
            chapter={{ index: 9 }}
          />

          <div className="mt-auto">
            <div className="mb-3 flex items-center justify-between gap-4 px-1">
              <h3 className="text-base font-bold text-foreground">{t.world.listTitle}</h3>
              <span className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <span aria-hidden className="relative flex size-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-forest/50 motion-reduce:animate-none" />
                  <span className="relative size-2 rounded-full bg-forest" />
                </span>
                {t.world.localTime}
              </span>
            </div>
            <ol className="flex flex-col gap-2">
              {locations.map((l, i) => {
                const culture = l.accent === "signal";
                const time = times[i];
                const TimeIcon = time?.day ? Sun : Moon;
                return (
                  <li
                    key={l.code}
                    data-fx="up"
                    style={{ "--fx-delay": `${120 + i * 80}ms` } as CSSProperties}
                    className="min-w-0"
                  >
                    <div className="flex items-center gap-3 rounded-[1.375rem] bg-canvas/70 p-2 pr-4 transition-colors duration-300 hover:bg-lime-soft">
                      <span
                        aria-hidden
                        className={cn(
                          "relative grid size-11 shrink-0 place-items-center rounded-full text-[0.8125rem] font-bold tracking-wide",
                          culture ? "bg-white text-ink ring-1 ring-ink/15" : "bg-ink text-lime"
                        )}
                      >
                        {l.code}
                        {culture && (
                          <span className="absolute right-0 top-0 size-2.5 rounded-full bg-signal ring-2 ring-white" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-base font-bold leading-tight text-foreground">
                          {l.label}
                        </span>
                        <span className="mt-0.5 block truncate text-xs tabular-nums text-muted-foreground">
                          {l.coords}
                        </span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="flex items-center justify-end gap-1.5 text-base font-bold tabular-nums leading-tight text-foreground">
                          <TimeIcon aria-hidden className="size-3.5 text-muted-foreground" />
                          {time?.text}
                        </span>
                        <span
                          className={cn(
                            "mt-0.5 block text-xs font-semibold",
                            culture ? "text-muted-foreground" : "text-forest"
                          )}
                        >
                          {culture ? t.world.kinds.culture : t.world.kinds.work}
                        </span>
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>

      {/* Panel bosque con el planeta. */}
      <div
        data-fx="panel"
        className="min-w-0 lg:order-1 lg:col-span-7"
        style={{ "--fx-delay": "90ms" } as CSSProperties}
      >
        <div className="panel panel-forest flex h-full min-h-[26rem] flex-col overflow-hidden p-4 pt-16 sm:p-7 sm:pt-20 lg:p-10 lg:pt-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(ellipse_60%_55%_at_50%_48%,hsl(var(--lime)/0.16),transparent_70%)]"
          />
          <div className="notch notch-tl">
            <span className="tag-pill">
              <span aria-hidden className="seal">
                <Globe2 className="size-4" />
              </span>
              {locations.map((l) => l.code).join(" · ")}
            </span>
          </div>
          <Sparkle
            aria-hidden
            className="float-y absolute right-6 top-6 size-7 fill-lime text-lime sm:right-8 sm:top-8 sm:size-9"
          />

          <div className="relative flex flex-1 items-center justify-center">
            <div
              data-fx="pop"
              className="relative w-full"
              style={{ "--fx-delay": "220ms" } as CSSProperties}
            >
              <div className={globeClassName}>
                {decorative3dEnabled ? (
                  <>
                    {/* Halo lima detrás del lienzo: el borde del planeta brilla
                      igual que en la versión estática. */}
                    <svg
                      aria-hidden
                      viewBox={`0 0 ${BOX} ${BOX}`}
                      className="absolute inset-0 size-full"
                    >
                      <defs>
                        <radialGradient id="wp-glow-3d">
                          <stop
                            offset={`${(R / (R + 34)) * 100}%`}
                            stopColor="hsl(76 76% 54%)"
                            stopOpacity="0.32"
                          />
                          <stop offset="100%" stopColor="hsl(76 76% 54%)" stopOpacity="0" />
                        </radialGradient>
                      </defs>
                      <circle cx={C} cy={C} r={R + 34} fill="url(#wp-glow-3d)" />
                    </svg>
                    <LazyMount
                      className="absolute inset-0"
                      fallback={<StaticGlobe locations={locations} />}
                    >
                      <GlobeScene
                        locations={locations}
                        arcs={ARCS}
                        className="absolute inset-0 [&>span]:rounded-full [&>span]:border-0 [&>span]:bg-white [&>span]:px-2.5 [&>span]:py-1 [&>span]:font-sans [&>span]:text-xs [&>span]:font-semibold [&>span]:text-ink [&>span]:shadow-pop"
                      />
                    </LazyMount>
                  </>
                ) : (
                  <StaticGlobe locations={locations} land />
                )}
                <Orbit />
              </div>
            </div>
          </div>

          {/* Pie: sube sobre las esquinas vacías de la caja del globo. */}
          <div className="relative -mt-12 flex items-end justify-between gap-4 lg:-mt-16">
            {decorative3dEnabled ? (
              <p className="inline-flex h-10 items-center gap-2 rounded-full bg-white/10 px-4 text-sm font-semibold text-white/90 ring-1 ring-white/15">
                <Hand aria-hidden className="size-4 text-lime" />
                {t.world.dragHint}
              </p>
            ) : (
              <span />
            )}
            <p className="text-right leading-none">
              <span className="block text-xs font-semibold text-white/75">{t.world.countries}</span>
              <span className="display-xl block text-[clamp(3.25rem,6vw,5rem)] text-lime">
                {String(locations.length).padStart(2, "0")}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
