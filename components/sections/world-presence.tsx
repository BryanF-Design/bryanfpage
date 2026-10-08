"use client";

import type { CSSProperties } from "react";
import dynamic from "next/dynamic";

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
      <div className="relative size-[82%] rounded-[50%] border-2 border-dashed border-primary/45 bg-secondary/30 shadow-[0_0_70px_hsl(var(--primary)/0.08)]">
        <span className="absolute inset-0 rounded-[50%] bg-[radial-gradient(circle_at_34%_28%,hsl(var(--primary)/0.16),transparent_30%)]" />
        <span className="absolute inset-[12%] rounded-[50%] border border-primary/20" />
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
  const globeClassName = "relative mx-auto aspect-square w-full max-w-[560px]";
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
      className="relative grid gap-gutter lg:grid-cols-12"
    >
      <div data-fx="left" className="min-w-0 lg:col-span-5">
        <div className="panel panel-moss flex h-full flex-col gap-8 overflow-hidden p-6 md:p-10">
          <SectionHeading
            eyebrow={t.world.eyebrow}
            title={t.world.title}
            subtitle={t.world.subtitle}
            chapter={{ kanji: "世界", romaji: "sekai", index: 9 }}
          />

          {/* Bitácora de ubicaciones */}
          <ol className="mt-auto flex flex-col gap-2">
            {locations.map((l, i) => (
              <li
                key={l.label}
                data-fx="left"
                style={{ "--fx-delay": `${140 + i * 90}ms` } as CSSProperties}
                className="min-w-0"
              >
                <div className="group flex items-center justify-between gap-4 rounded-full bg-background/60 py-2 pl-2 pr-5 ring-1 ring-foreground/10 transition-colors hover:bg-background">
                  <span className="flex items-center gap-3">
                    <span
                      className={
                        l.accent === "signal"
                          ? "grid size-9 shrink-0 place-items-center rounded-full bg-signal/15 text-signal"
                          : "grid size-9 shrink-0 place-items-center rounded-full bg-primary/15 text-primary"
                      }
                      aria-hidden
                    >
                      <span className="size-2 rounded-full bg-current shadow-[0_0_12px_currentColor]" />
                    </span>
                    <span className="display-xl text-[1.7rem] leading-none text-foreground md:text-[2rem]">
                      {l.label}
                    </span>
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {l.coords}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Globo interactivo dentro del disco de trama. */}
      <div data-fx="right" className="min-w-0 lg:col-span-7" style={{ "--fx-delay": "100ms" } as CSSProperties}>
        <div className="panel relative flex h-full min-h-[26rem] flex-col items-center justify-center overflow-hidden p-4 md:p-8">
          <div aria-hidden className="dot-grid absolute inset-0 rounded-[inherit] opacity-25" />
          <div
            aria-hidden
            className="hinomaru-dots left-1/2 top-1/2 aspect-square w-[min(92%,36rem)] -translate-x-1/2 -translate-y-1/2 opacity-40"
          />
          <div
            aria-hidden
            className="hinomaru-ring left-1/2 top-1/2 aspect-square w-[min(98%,39rem)] -translate-x-1/2 -translate-y-1/2 [mask-image:conic-gradient(from_20deg,black_0deg,black_220deg,transparent_280deg)]"
          />
          <div className="notch notch-tl">
            <span className="tag-pill">
              <span aria-hidden lang="ja" className="seal">
                世
              </span>
              {t.world.eyebrow} · {String(locations.length).padStart(2, "0")}
            </span>
          </div>
          <div data-fx="pop" className="relative w-full" style={{ "--fx-delay": "220ms" } as CSSProperties}>
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
          </div>
          {decorative3dEnabled && (
            <p className="tech-label relative mt-3 rounded-full bg-secondary/80 px-4 py-2 text-center text-muted-foreground">
              {t.world.dragHint}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
