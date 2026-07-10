"use client";

import dynamic from "next/dynamic";
import { SectionHeading } from "@/components/sections/section-heading";
import { LazyMount } from "@/components/three/lazy-mount";
import { useLanguage } from "@/lib/i18n/context";

// El globo (three.js) viaja en su propio chunk y solo se descarga/monta
// cuando la sección se acerca al viewport (LazyMount) — el bundle inicial
// no lo paga nunca.
const GlobeScene = dynamic(
  () => import("@/components/three/globe-scene").then((m) => m.GlobeScene),
  { ssr: false }
);

const LOCATIONS = [
  { lat: 19.4326, lng: -99.1332, label: "México", coords: "19.43° N — 99.13° O" },
  { lat: 40.4168, lng: -3.7038, label: "España", coords: "40.42° N — 3.70° O" },
  { lat: 48.8566, lng: 2.3522, label: "Francia", coords: "48.86° N — 2.35° E" },
];

const ARCS: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 2],
];

export function WorldPresence() {
  const { t } = useLanguage();

  return (
    <section
      id="presencia"
      aria-label="Países en los que hemos trabajado"
      className="relative overflow-hidden py-20 md:py-28"
    >
      <div aria-hidden className="mesh-glow-c opacity-50" />
      <div className="container relative">
        <SectionHeading
          eyebrow={t.world.eyebrow}
          title={t.world.title}
          subtitle={t.world.subtitle}
        />

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Bitácora de ubicaciones */}
          <ol className="order-2 flex flex-col divide-y divide-border border-y border-border lg:order-1">
            {LOCATIONS.map((l) => (
              <li key={l.label} className="flex items-baseline justify-between gap-4 py-5">
                <span className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                  <span className="font-display text-xl font-bold text-foreground md:text-2xl">
                    {l.label}
                  </span>
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {l.coords}
                </span>
              </li>
            ))}
          </ol>

          {/* Globo interactivo */}
          <div className="order-1 lg:order-2">
            <LazyMount
              className="corner-ticks relative mx-auto aspect-square w-full max-w-[560px]"
              fallback={<div className="absolute inset-6 animate-pulse rounded-full bg-secondary/40" />}
            >
              <GlobeScene
                locations={LOCATIONS}
                arcs={ARCS}
                className="absolute inset-0"
              />
            </LazyMount>
            <p className="tech-label mt-3 text-center text-muted-foreground">
              {t.world.dragHint}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
