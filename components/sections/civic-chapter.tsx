"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

import { Disclosure } from "@/components/ui/disclosure";
import { ChapterMark } from "@/components/japan/chapter-mark";
import { CHAPTER_TOTAL } from "@/components/sections/section-heading";
import { useLanguage } from "@/lib/i18n/context";
import { useReducedMotionPreference } from "@/lib/motion-preference";

const CivicScene = dynamic(
  () => import("@/components/three/civic-scene").then((m) => m.CivicScene),
  { ssr: false }
);

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
};

type NetworkNavigator = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
};

/**
 * 走り — el capítulo del Civic.
 *
 * El auto vivía en el hero, dentro de un contenedor de 218svh que obligaba a
 * scrollear dos pantallas y media antes de leer nada. Y ahí no podía explicar
 * qué hacía en un sitio de diseño web: era un objeto bonito sin contexto.
 *
 * Aquí tiene capítulo propio, y el capítulo es sobre Bryan. El Type R, la
 * cultura de taller japonesa y la lógica de una red bien hecha son las tres
 * cosas de las que sale su manera de trabajar — precisión, ritmo y conexión —
 * así que el modelo es la ilustración de ese texto, no un adorno.
 *
 * El detalle de los tres criterios queda plegado: quien sólo pasa de largo se
 * lleva el titular y la imagen; quien quiere el argumento lo abre.
 */
export function CivicChapter() {
  const { t, locale } = useLanguage();
  const reduced = useReducedMotionPreference();
  const sectionRef = React.useRef<HTMLElement>(null);
  const progressRef = React.useRef(0.5);
  const speedRef = React.useRef<HTMLSpanElement>(null);

  const [start3d, setStart3d] = React.useState(false);
  const [deferred3d, setDeferred3d] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  // El modelo pesa: sólo arranca cuando el hilo principal está libre, y ni eso
  // en conexiones lentas o equipos de gama baja — ahí se ofrece un botón.
  React.useEffect(() => {
    const connection = (navigator as NetworkNavigator).connection;
    const memory = (navigator as NetworkNavigator).deviceMemory;
    const shouldDefer =
      connection?.saveData === true ||
      ["slow-2g", "2g", "3g"].includes(connection?.effectiveType ?? "") ||
      (typeof memory === "number" && memory <= 2) ||
      navigator.hardwareConcurrency <= 2;

    if (shouldDefer) {
      setDeferred3d(true);
      return;
    }

    const idle = window as IdleWindow;
    if (idle.requestIdleCallback) {
      const handle = idle.requestIdleCallback(() => setStart3d(true), {
        timeout: 1800,
      });
      return () => idle.cancelIdleCallback?.(handle);
    }
    const timer = window.setTimeout(() => setStart3d(true), 700);
    return () => window.clearTimeout(timer);
  }, []);

  // Progreso de la sección (0→1) mientras cruza el viewport. La escena lo lee
  // por ref, así que el scroll no re-renderiza nada de React.
  React.useEffect(() => {
    if (reduced) {
      progressRef.current = 0.52;
      return;
    }
    const node = sectionRef.current;
    if (!node) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const span = rect.height + window.innerHeight;
      progressRef.current = Math.min(
        1,
        Math.max(0, (window.innerHeight - rect.top) / span)
      );
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);

  // La aguja escribe ~10 veces por segundo: va al DOM directo, nunca a estado.
  const handleSpeed = React.useCallback((kmh: number) => {
    const node = speedRef.current;
    if (node) node.textContent = String(Math.max(0, kmh)).padStart(3, "0");
  }, []);

  const specs = [
    { label: t.garage.spec.modelLabel, value: t.garage.spec.model },
    { label: t.garage.spec.codeLabel, value: t.garage.spec.code },
    { label: t.garage.spec.colorLabel, value: t.garage.spec.color },
    { label: t.garage.spec.engineLabel, value: t.garage.spec.engine },
  ];

  return (
    <section
      ref={sectionRef}
      id="garage"
      aria-labelledby="garage-title"
      className="relative isolate overflow-hidden border-b border-border py-16 md:py-24"
    >
      <div aria-hidden className="mesh-glow-b absolute inset-0 opacity-50" />
      <div aria-hidden className="route-grid absolute inset-0 opacity-25" />

      {/* 走り a escala de fondo: el mismo recurso que la referencia usa con
          la palabra gigante detrás de la imagen. */}
      <span
        aria-hidden
        lang="ja"
        className="pointer-events-none absolute -right-4 top-6 select-none font-jp text-[26vw] leading-none text-foreground/[0.035] md:text-[16vw]"
      >
        走り
      </span>

      <div className="container relative">
        <ChapterMark
          kanji="走り"
          romaji="hashiri"
          label={t.garage.eyebrow}
          index={1}
          total={CHAPTER_TOTAL}
          className="mb-10 md:mb-14"
        />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.74fr)_minmax(0,1.26fr)] lg:items-center lg:gap-12">
          {/* ——— El argumento ——————————————————————————————— */}
          <div className="flex min-w-0 flex-col items-start gap-6">
            <h2
              id="garage-title"
              className="max-w-[13ch] font-display text-[clamp(2.4rem,7vw,4.6rem)] font-bold uppercase leading-[0.86] tracking-[-0.05em] text-foreground"
            >
              {t.garage.title}
            </h2>

            <p className="max-w-xl border-l border-signal/60 pl-5 text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
              {t.about.inspiration}
            </p>

            <dl className="grid w-full max-w-lg grid-cols-2 border-y border-border">
              {specs.map((spec, i) => (
                <div
                  key={spec.label}
                  className={
                    "flex flex-col gap-1 border-border py-4 " +
                    (i % 2 === 0 ? "border-r pr-4" : "pl-4") +
                    (i < 2 ? " border-b" : "")
                  }
                >
                  <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                    {spec.label}
                  </dt>
                  <dd className="font-display text-base font-semibold text-foreground">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* ——— El Civic ————————————————————————————————————— */}
          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: reduced ? 0 : 0.7, ease: [0.2, 0, 0, 1] }}
            className="relative min-w-0"
          >
            <div className="relative h-[38svh] min-h-[16rem] w-full sm:h-[42svh] lg:h-[44svh] lg:min-h-[20rem]">
              <div
                aria-hidden
                className="hinomaru left-1/2 top-[48%] aspect-square w-[min(96%,34rem)] -translate-x-1/2 -translate-y-1/2"
              />

              {/* El horizonte: una línea que da suelo al auto. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-[72%] flex items-center gap-3"
              >
                <span className="h-px flex-1 bg-gradient-to-r from-transparent via-foreground/20 to-foreground/10" />
                <span className="size-1 rotate-45 bg-primary/70" />
                <span className="h-px w-14 bg-foreground/10" />
              </div>

              <CivicFallback ready={ready} reduced={reduced} />

              {start3d && !failed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: ready ? 1 : 0 }}
                  transition={{ duration: reduced ? 0 : 0.6 }}
                  className="absolute inset-0"
                  style={{
                    maskImage:
                      "radial-gradient(ellipse 94% 90% at 50% 52%, black 68%, transparent 100%)",
                    WebkitMaskImage:
                      "radial-gradient(ellipse 94% 90% at 50% 52%, black 68%, transparent 100%)",
                  }}
                >
                  <CivicScene
                    progressRef={progressRef}
                    className="absolute inset-0"
                    ariaLabel={t.experience.civicAria}
                    onReady={() => setReady(true)}
                    onError={() => setFailed(true)}
                    onSpeed={handleSpeed}
                  />
                </motion.div>
              )}

              {!ready && start3d && !failed && (
                <p className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/55">
                  {t.experience.modelLoading}
                </p>
              )}

              {deferred3d && !start3d && (
                <button
                  type="button"
                  onClick={() => {
                    setDeferred3d(false);
                    setStart3d(true);
                  }}
                  className="absolute bottom-2 left-1/2 min-h-11 -translate-x-1/2 whitespace-nowrap border border-primary/50 bg-background/85 px-4 font-mono text-[10px] uppercase tracking-[0.2em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  {t.experience.activateModel}
                </button>
              )}

              {failed && (
                <p className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/55">
                  {t.experience.lightweightView}
                </p>
              )}
            </div>

            {/* データ帯: coordenadas del modelo, gestos y telemetría. */}
            <div className="data-strip mt-2 border-t border-border pt-3">
              <span className="inline-flex items-center gap-2 text-primary">
                {t.experience.dragRotate}
                {locale !== "ja" && (
                  <span lang="ja" className="font-jp tracking-[0.2em]">
                    回転
                  </span>
                )}
              </span>
              <span aria-hidden className="sep" />
              {ready && !failed && !reduced ? (
                <span aria-hidden className="inline-flex items-baseline gap-1.5 tabular-nums">
                  <span ref={speedRef} className="text-primary/85">
                    000
                  </span>
                  <span className="opacity-55">km/h</span>
                </span>
              ) : (
                <span className="hidden sm:inline">{t.garage.hint}</span>
              )}
            </div>
          </motion.div>
        </div>

        {/* ——— El detalle, plegado ————————————————————————————— */}
        <Disclosure
          label={t.ui.expand}
          labelOpen={t.ui.collapse}
          className="mt-10 md:mt-14"
          triggerClassName="w-full justify-between border-t border-border pt-5"
        >
          <div className="grid divide-y divide-border border-y border-border md:grid-cols-3 md:divide-x md:divide-y-0">
            {t.garage.cards.map((card, i) => (
              <article key={card.index} className="flex flex-col gap-4 px-0 py-6 md:px-6 md:first:pl-0 md:last:pr-0">
                <div className="flex items-start justify-between gap-4">
                  <span className="font-display text-4xl font-semibold leading-none text-foreground/15">
                    {card.index}
                  </span>
                  <span
                    className="text-right font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground"
                    aria-label={card.romaji}
                  >
                    <span lang="ja" className="block font-jp text-base text-primary">
                      {card.jp}
                    </span>
                    {card.romaji}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold leading-tight tracking-tight text-foreground">
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{card.body}</p>
                <p className="mt-auto border-t border-border pt-3 font-mono text-[9px] uppercase tracking-[0.14em] text-foreground/45">
                  {card.spec}
                  {i === 2 && <span aria-hidden className="ml-2 text-signal">●</span>}
                </p>
              </article>
            ))}
          </div>
        </Disclosure>
      </div>
    </section>
  );
}

/** Silueta de línea mientras el modelo carga (o si nunca llega). */
function CivicFallback({ ready, reduced }: { ready: boolean; reduced: boolean }) {
  return (
    <motion.div
      aria-hidden
      animate={{ opacity: ready ? 0 : 1 }}
      transition={{ duration: reduced ? 0 : 0.5 }}
      className="absolute inset-0 grid place-items-center"
    >
      <div className="absolute inset-[14%] bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.1),transparent_64%)]" />
      <svg
        viewBox="0 0 760 390"
        className="relative w-[108%] max-w-[760px] overflow-visible text-primary/45"
      >
        <defs>
          <linearGradient id="civic-chapter-line" x1="0" x2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity="0" />
            <stop offset=".2" stopColor="currentColor" stopOpacity=".75" />
            <stop offset=".82" stopColor="currentColor" stopOpacity=".75" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M44 291C127 283 169 270 212 235L288 166C306 150 326 141 351 138L477 126C507 123 533 133 554 154L602 202C639 213 667 227 688 252L716 291"
          fill="none"
          stroke="url(#civic-chapter-line)"
          strokeWidth="2"
        />
        <path
          d="M203 238H579M256 205H557M310 165L341 223M473 134L520 209"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="5 10"
          opacity=".42"
        />
        <ellipse cx="226" cy="289" rx="54" ry="54" fill="none" stroke="currentColor" />
        <ellipse cx="587" cy="289" rx="54" ry="54" fill="none" stroke="currentColor" />
        <ellipse cx="226" cy="289" rx="31" ry="31" fill="none" stroke="currentColor" opacity=".5" />
        <ellipse cx="587" cy="289" rx="31" ry="31" fill="none" stroke="currentColor" opacity=".5" />
        <path d="M60 318H710" stroke="currentColor" strokeWidth="1" opacity=".28" />
      </svg>
    </motion.div>
  );
}
