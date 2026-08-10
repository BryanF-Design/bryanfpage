"use client";

import dynamic from "next/dynamic";

import { LazyMount } from "@/components/three/lazy-mount";
import { ChapterMark } from "@/components/japan/chapter-mark";
import { CHAPTER_TOTAL } from "@/components/sections/section-heading";
import { useLanguage } from "@/lib/i18n/context";
import { useDecorative3dEnabled } from "@/lib/motion-preference";

const GlobeScene = dynamic(
  () => import("@/components/three/globe-scene").then((m) => m.GlobeScene),
  { ssr: false }
);

const ARCS: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
];

const LOGOS = [
  { src: "/img/clients/Cartoon_Network_2010_logo.svg", alt: "Cartoon Network" },
  { src: "/img/clients/Citibanamex_logo.svg", alt: "Citibanamex" },
  { src: "/img/clients/Warner_Bros_logo.svg", alt: "Warner Bros" },
  { src: "/img/clients/MillerKnoll_Logo_2021.svg", alt: "MillerKnoll" },
  { src: "/img/clients/herman-miller-1.svg", alt: "Herman Miller" },
  { src: "/img/clients/brand-ufc-svgrepo-com.svg", alt: "UFC" },
  { src: "/img/clients/hyundai-svgrepo-com.svg", alt: "Hyundai" },
  { src: "/img/clients/mercado-libre-svgrepo-com.svg", alt: "Mercado Libre" },
  { src: "/img/clients/logo-indusecc.png", alt: "Indusecc" },
  { src: "/img/clients/partum-design.png", alt: "Partum Design" },
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
        <span className="absolute bottom-[30%] right-[18%] size-1.5 rounded-full bg-primary" />
        <span className="absolute right-[12%] top-[43%] size-2 rounded-full bg-signal shadow-[0_0_16px_hsl(var(--signal)/0.7)]" />
        <span className="absolute left-[23%] top-[39%] h-px w-[54%] origin-left -rotate-[9deg] bg-gradient-to-r from-primary/70 to-primary/10" />
        <span className="absolute left-[23%] top-[39%] h-px w-[66%] origin-left rotate-[3deg] bg-gradient-to-r from-primary/70 via-primary/35 to-signal/70" />
      </div>
    </div>
  );
}

/**
 * 世界 — alcance y confianza, en una sola banda.
 *
 * Presencia y marcas eran dos secciones consecutivas, cada una con su cabecera
 * y su respiro de 7rem arriba y abajo: dos pantallas para decir «he trabajado
 * en cuatro países y estas marcas me han contratado».
 *
 * Un capítulo, dos evidencias: la bitácora junto al globo, y las marcas en una
 * rejilla apretada debajo. Es el mismo dato con la mitad del scroll.
 */
export function TrustBand() {
  const { t } = useLanguage();
  const decorative3dEnabled = useDecorative3dEnabled();
  const globeClassName = "corner-ticks relative mx-auto aspect-square w-full max-w-[420px]";

  const locations = [
    { lat: 19.4326, lng: -99.1332, label: t.world.locations.mexico, coords: "19.43° N · 99.13° W" },
    { lat: 40.4168, lng: -3.7038, label: t.world.locations.spain, coords: "40.42° N · 3.70° W" },
    { lat: 48.8566, lng: 2.3522, label: t.world.locations.france, coords: "48.86° N · 2.35° E" },
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
      className="relative isolate overflow-hidden border-b border-border py-16 md:py-24"
    >
      <div aria-hidden className="mesh-glow-c absolute inset-0 opacity-45" />

      <div className="container relative">
        <div className="grid gap-6 border-b border-border pb-7 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <ChapterMark
              kanji="世界"
              romaji="sekai"
              label={t.world.eyebrow}
              index={6}
              total={CHAPTER_TOTAL}
              className="mb-6"
            />
            <h2 className="max-w-2xl font-display text-[clamp(1.75rem,3.4vw,2.9rem)] font-bold uppercase leading-[0.95] tracking-[-0.035em] text-foreground">
              {t.world.title}
            </h2>
          </div>
          <p className="max-w-md text-pretty text-sm leading-relaxed text-muted-foreground lg:col-span-5 lg:text-right md:text-base">
            {t.world.subtitle}
          </p>
        </div>

        <div className="mt-8 grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] md:mt-10">
          <ol className="order-2 flex flex-col divide-y divide-border border-y border-border lg:order-1">
            {locations.map((l) => (
              <li key={l.label} className="flex items-baseline justify-between gap-4 py-4">
                <span className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className={
                      l.accent === "signal"
                        ? "size-1.5 shrink-0 rounded-full bg-signal shadow-[0_0_12px_hsl(var(--signal)/0.7)]"
                        : "size-1.5 shrink-0 rounded-full bg-primary"
                    }
                  />
                  <span className="font-display text-lg font-bold text-foreground md:text-xl">
                    {l.label}
                  </span>
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  {l.coords}
                </span>
              </li>
            ))}
          </ol>

          <div className="relative order-1 lg:order-2">
            <div
              aria-hidden
              className="hinomaru left-1/2 top-1/2 aspect-square w-[min(92%,28rem)] -translate-x-1/2 -translate-y-1/2"
            />
            {decorative3dEnabled ? (
              <LazyMount className={globeClassName} fallback={<StaticGlobe />}>
                <GlobeScene locations={locations} arcs={ARCS} className="absolute inset-0" />
              </LazyMount>
            ) : (
              <div className={globeClassName}>
                <StaticGlobe />
              </div>
            )}
            {decorative3dEnabled && (
              <p className="tech-label mt-2 text-center text-muted-foreground">
                {t.world.dragHint}
              </p>
            )}
          </div>
        </div>

        {/* ——— Las marcas ——————————————————————————————————— */}
        <div className="mt-10 border-t border-border pt-8 md:mt-14">
          <p className="tech-label mb-6 text-muted-foreground">{t.clients.label}</p>
          <ul className="grid grid-cols-3 gap-px overflow-hidden border border-border bg-border sm:grid-cols-5">
            {LOGOS.map((logo) => (
              <li
                key={logo.alt}
                className="flex aspect-[3/2] items-center justify-center bg-background/95 p-3 md:p-4"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="size-full max-h-10 object-contain opacity-55 transition-opacity duration-300 hover:opacity-100 [filter:brightness(0)_invert(1)] md:max-h-12"
                  loading="lazy"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
