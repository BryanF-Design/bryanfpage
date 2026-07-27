"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

import { SectionHeading } from "@/components/sections/section-heading";
import { LazyMount } from "@/components/three/lazy-mount";
import { useLanguage } from "@/lib/i18n/context";
import { useDecorative3dEnabled } from "@/lib/motion-preference";

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

function StaticGlobe() {
  return (
    <div aria-hidden className="absolute inset-6 grid place-items-center">
      <div className="relative size-[82%] rounded-full border border-primary/35 bg-secondary/30 shadow-[0_0_70px_hsl(var(--primary)/0.08)]">
        <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_34%_28%,hsl(var(--primary)/0.16),transparent_30%)]" />
        <span className="absolute inset-[12%] rounded-full border border-primary/20" />
        <span className="absolute left-1/2 top-[8%] h-[84%] w-[34%] -translate-x-1/2 rounded-[50%] border border-primary/20" />
        <span className="absolute left-[8%] top-1/2 h-[32%] w-[84%] -translate-y-1/2 rounded-[50%] border border-primary/20" />
        <span className="absolute left-[20%] top-[38%] size-2 rounded-full bg-primary shadow-[0_0_18px_hsl(var(--primary)/0.65)]" />
        <span className="absolute right-[24%] top-[30%] size-1.5 rounded-full bg-foreground/80" />
        <span className="absolute right-[18%] bottom-[30%] size-1.5 rounded-full bg-primary" />
        <span className="absolute right-[12%] top-[43%] size-2 rounded-full bg-signal shadow-[0_0_16px_hsl(var(--signal)/0.7)]" />
        <span className="absolute left-[23%] top-[39%] h-px w-[54%] origin-left -rotate-[9deg] bg-gradient-to-r from-primary/70 to-primary/10" />
        <span className="absolute left-[23%] top-[39%] h-px w-[66%] origin-left rotate-[3deg] bg-gradient-to-r from-primary/70 via-primary/35 to-signal/70" />
      </div>
    </div>
  );
}

export function WorldPresence() {
  const { t } = useLanguage();
  const decorative3dEnabled = useDecorative3dEnabled();
  const globeClassName = "corner-ticks relative mx-auto aspect-square w-full max-w-[560px]";
  const locations = [
    {
      lat: 19.4326,
      lng: -99.1332,
      label: t.world.locations.mexico,
      coords: "19.43° N · 99.13° W",
    },
    {
      lat: 40.4168,
      lng: -3.7038,
      label: t.world.locations.spain,
      coords: "40.42° N · 3.70° W",
    },
    {
      lat: 48.8566,
      lng: 2.3522,
      label: t.world.locations.france,
      coords: "48.86° N · 2.35° E",
    },
    {
      lat: 35.6762,
      lng: 139.6503,
      label: t.world.locations.japan,
      coords: "35.68° N · 139.65° E",
      accent: "signal" as const,
    },
  ];

  return (
    <section
      id="presencia"
      aria-label={t.world.title}
      className="relative overflow-hidden py-20 md:py-28"
    >
      <div aria-hidden className="mesh-glow-c opacity-50" />
      <div className="container relative">
        <SectionHeading
          eyebrow={t.world.eyebrow}
          title={t.world.title}
          subtitle={t.world.subtitle}
          chapter={{ kanji: "世界", romaji: "sekai", index: 9 }}
        />

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Bitácora de ubicaciones */}
          <ol className="order-2 flex flex-col divide-y divide-border border-y border-border lg:order-1">
            {locations.map((l, i) => (
              <motion.li
                key={l.label}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.2, 0, 0, 1] }}
                className="flex items-baseline justify-between gap-4 py-5"
              >
                <span className="flex items-center gap-3">
                  <span
                    className={
                      l.accent === "signal"
                        ? "h-1.5 w-1.5 shrink-0 rounded-full bg-signal shadow-[0_0_12px_hsl(var(--signal)/0.7)]"
                        : "h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                    }
                    aria-hidden
                  />
                  <span className="font-display text-xl font-bold text-foreground md:text-2xl">
                    {l.label}
                  </span>
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {l.coords}
                </span>
              </motion.li>
            ))}
          </ol>

          {/* Globo interactivo, ahora dentro del disco.
              El globo flotaba solo en medio de la columna y las esquinas del
              marco HUD quedaban colgando en el vacío. El hinomaru le da el
              mismo ancla circular que sostiene al Civic en el hero, así que
              las dos escenas 3D del sitio comparten encuadre. */}
          <div className="relative order-1 lg:order-2">
            <div
              aria-hidden
              className="hinomaru left-1/2 top-1/2 aspect-square w-[min(92%,34rem)] -translate-x-1/2 -translate-y-1/2"
            />
            {decorative3dEnabled ? (
              <LazyMount className={globeClassName} fallback={<StaticGlobe />}>
                <GlobeScene
                  locations={locations}
                  arcs={ARCS}
                  className="absolute inset-0"
                />
              </LazyMount>
            ) : (
              <div className={globeClassName}>
                <StaticGlobe />
              </div>
            )}
            {decorative3dEnabled && (
              <p className="tech-label mt-3 text-center text-muted-foreground">
                {t.world.dragHint}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
