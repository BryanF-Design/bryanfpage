"use client";

import * as React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { useReducedMotionPreference } from "@/lib/motion-preference";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/context";

const CivicScene = dynamic(
  () => import("@/components/three/civic-scene").then((module) => module.CivicScene),
  { ssr: false }
);

interface HeroAction {
  label: string;
  href: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
}

interface HeroProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  eyebrow?: React.ReactNode;
  actions?: HeroAction[];
  scrollHint?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  actionsClassName?: string;
}

type IdleWindow = Window & {
  requestIdleCallback?: (
    callback: () => void,
    options?: { timeout: number }
  ) => number;
  cancelIdleCallback?: (handle: number) => void;
};

type NetworkNavigator = Navigator & {
  deviceMemory?: number;
  connection?: {
    saveData?: boolean;
    effectiveType?: string;
  };
};

/**
 * Hero — 走り.
 *
 * La versión anterior cruzaba el bloque con dos curvas verdes que no
 * enmarcaban, no separaban y no dirigían la mirada: pasaban por detrás del
 * auto y salían por la esquina. Aquí las sustituye el recurso que repiten los
 * pósters de la carpeta —el disco (日の丸) como ancla y una sola horizontal
 * como horizonte— y el auto pasa a apoyarse en una composición en vez de
 * flotar sobre líneas sueltas.
 *
 * El Civic tampoco lleva ficha. Antes venía con un panel explicando que era
 * «una obsesión personal, llevada a 3D» y un chip «TYPE R»: la imagen ya lo
 * dice. Lo que queda es la tira de datos del canto inferior, que declara
 * coordenadas y lectura sin justificar nada, como los pies de los pósters.
 *
 * El modelo pesado arranca en idle; el H1, el copy, los CTA y el fallback se
 * pintan antes.
 */
const Hero = React.forwardRef<HTMLElement, HeroProps>(
  (
    {
      className,
      title,
      subtitle,
      eyebrow,
      actions,
      scrollHint,
      titleClassName,
      subtitleClassName,
      actionsClassName,
      ...props
    },
    ref
  ) => {
    const { t, locale } = useLanguage();
    const wrapperRef = React.useRef<HTMLDivElement>(null);
    const progressRef = React.useRef(0);
    const speedRef = React.useRef<HTMLSpanElement>(null);
    const reducedMotion = useReducedMotionPreference();
    const [start3d, setStart3d] = React.useState(false);
    const [deferred3d, setDeferred3d] = React.useState(false);
    const [modelReady, setModelReady] = React.useState(false);
    const [modelFailed, setModelFailed] = React.useState(false);

    React.useEffect(() => {
      const connection = (navigator as NetworkNavigator).connection;
      const shouldDefer =
        connection?.saveData === true ||
        connection?.effectiveType === "slow-2g" ||
        connection?.effectiveType === "2g" ||
        connection?.effectiveType === "3g" ||
        (typeof (navigator as NetworkNavigator).deviceMemory === "number" &&
          (navigator as NetworkNavigator).deviceMemory! <= 2) ||
        navigator.hardwareConcurrency <= 2;

      if (shouldDefer) {
        setDeferred3d(true);
        return;
      }

      const idleWindow = window as IdleWindow;
      if (idleWindow.requestIdleCallback) {
        const handle = idleWindow.requestIdleCallback(
          () => setStart3d(true),
          { timeout: 1300 }
        );
        return () => idleWindow.cancelIdleCallback?.(handle);
      }

      const timer = window.setTimeout(() => setStart3d(true), 450);
      return () => window.clearTimeout(timer);
    }, []);

    // La aguja de la tira de datos. La escena escribe aquí ~10 veces por
    // segundo: si esto fuera estado de React, el hero se re-renderizaría a esa
    // misma frecuencia para pintar tres dígitos.
    const handleSpeed = React.useCallback((kmh: number) => {
      const node = speedRef.current;
      if (node) node.textContent = String(Math.max(0, kmh)).padStart(3, "0");
    }, []);

    React.useEffect(() => {
      if (reducedMotion) {
        progressRef.current = 0.52;
        return;
      }

      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      let frame = 0;
      const update = () => {
        frame = 0;
        const range = wrapper.offsetHeight - window.innerHeight;
        if (range <= 0) {
          progressRef.current = 0.52;
          return;
        }
        const distance = -wrapper.getBoundingClientRect().top;
        progressRef.current = Math.min(1, Math.max(0, distance / range));
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
    }, [reducedMotion]);

    return (
      <section
        ref={ref}
        className={cn("relative z-0 w-full", className)}
        {...props}
      >
        <div
          ref={wrapperRef}
          className={cn(
            "relative",
            reducedMotion ? "min-h-[100svh]" : "h-[168svh] md:h-[218svh]"
          )}
        >
          <div
            className={cn(
              "flex min-h-[100svh] flex-col overflow-hidden bg-background",
              reducedMotion ? "relative" : "sticky top-0 h-[100svh]"
            )}
          >
            <div aria-hidden className="japan-halftone absolute inset-0 opacity-[0.13]" />
            <div aria-hidden className="mesh-glow-a absolute inset-0 opacity-40" />

            {/* 縦組み a escala de página. Antes esto era una etiqueta de 11 px
                al 60% de opacidad: decoración. Ahora marca el borde derecho de
                la composición, que es un trabajo de arquitectura. */}
            <div
              aria-hidden
              className="pointer-events-none absolute right-14 top-1/2 z-20 hidden -translate-y-1/2 select-none flex-col items-center gap-4 xl:flex"
            >
              <span className="h-16 w-px bg-gradient-to-b from-transparent to-primary/30" />
              <span
                lang="ja"
                className="tategaki-display text-[clamp(2.25rem,3.6vw,3.25rem)] text-primary/25"
              >
                走り
              </span>
              <span className="vertical-jp font-mono text-[9px] uppercase tracking-[0.34em] text-foreground/25">
                {locale === "ja" ? "hashiri" : `hashiri · ${t.experience.driving}`}
              </span>
              <span className="h-16 w-px bg-gradient-to-t from-transparent to-primary/30" />
            </div>

            <div className="container relative z-10 flex flex-1 flex-col pb-8 pt-24 sm:pt-28 lg:grid lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:items-center lg:gap-0 lg:pb-10">
              <div className="relative z-20 flex min-w-0 flex-col items-start gap-5 lg:py-14">
                {eyebrow && (
                  <motion.span
                    initial={reducedMotion ? false : { y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      ease: [0.2, 0, 0, 1],
                      delay: reducedMotion ? 0 : 0.08,
                      duration: reducedMotion ? 0 : 0.48,
                    }}
                    className="tech-label signal-kicker inline-flex items-center gap-3 text-muted-foreground"
                  >
                    <span className="h-1.5 w-1.5 bg-primary" />
                    {eyebrow}
                  </motion.span>
                )}

                {/* Bajó de 17vw / 8rem. Antes el titular competía con el auto
                    por el mismo espacio; ahora conviven y el disco es lo que
                    sostiene el peso del lado derecho. */}
                <h1
                  className={cn(
                    "hero-title max-w-[10ch] font-display text-[13vw] font-bold uppercase leading-[0.82] tracking-[-0.055em] text-foreground sm:text-[4.15rem] md:text-[4.85rem] lg:text-[5.15rem] xl:text-[6.15rem]",
                    titleClassName
                  )}
                >
                  {title}
                </h1>

                {subtitle && (
                  <motion.p
                    initial={reducedMotion ? false : { y: 16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      ease: [0.2, 0, 0, 1],
                      delay: reducedMotion ? 0 : 0.14,
                      duration: reducedMotion ? 0 : 0.55,
                    }}
                    className={cn(
                      "max-w-[34rem] text-pretty text-base leading-relaxed text-muted-foreground md:text-lg",
                      subtitleClassName
                    )}
                  >
                    {subtitle}
                  </motion.p>
                )}

                {actions && actions.length > 0 && (
                  <motion.div
                    initial={reducedMotion ? false : { y: 16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      ease: [0.2, 0, 0, 1],
                      delay: reducedMotion ? 0 : 0.2,
                      duration: reducedMotion ? 0 : 0.55,
                    }}
                    className={cn(
                      "mt-1 flex w-full flex-col gap-3 sm:w-auto sm:flex-row",
                      actionsClassName
                    )}
                  >
                    {actions.map((action) => (
                      <Button
                        key={`${action.href}-${action.label}`}
                        size="lg"
                        variant={action.variant || "default"}
                        asChild
                        className="w-full sm:w-auto"
                      >
                        <Link href={action.href}>{action.label}</Link>
                      </Button>
                    ))}
                  </motion.div>
                )}

                <div className="mt-3 hidden w-full max-w-[35rem] grid-cols-3 border-y border-border/80 sm:grid">
                  <HeroPhase
                    jp="設計"
                    label={locale === "ja" ? "SEKKEI" : t.experience.phaseDesign}
                  />
                  <HeroPhase
                    jp="実装"
                    label={
                      locale === "ja"
                        ? "JISSŌ"
                        : t.experience.phaseDevelopment
                    }
                  />
                  <HeroPhase
                    jp="始動"
                    label={locale === "ja" ? "SHIDŌ" : t.experience.phaseLaunch}
                    signal
                  />
                </div>
              </div>

              <motion.div
                initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: reducedMotion ? 0 : 0.2,
                  duration: reducedMotion ? 0 : 0.7,
                  ease: [0.2, 0, 0, 1],
                }}
                className="relative -mx-6 mt-1 min-h-[42svh] min-w-0 flex-1 sm:mx-0 sm:min-h-[50svh] lg:-ml-[15%] lg:mt-0 lg:h-[72svh] lg:min-h-[560px]"
              >
                <div className="absolute inset-x-4 inset-y-0 sm:inset-x-0">
                  {/* 日の丸. El ancla de la composición: el auto se apoya en un
                      disco, no en una curva que pasaba de largo. Es tinta
                      elevada con un arco bermellón de 1 px — la silueta del
                      hinomaru sin gastar el presupuesto de rojo. */}
                  <div
                    aria-hidden
                    className="hinomaru left-1/2 top-[46%] aspect-square w-[min(78%,30rem)] -translate-x-1/2 -translate-y-1/2"
                  />

                  {/* El horizonte. Una línea, y carga peso: marca el suelo
                      donde el Civic apoya y alinea el bloque 3D con el
                      titular de la izquierda. */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-[70%] flex items-center gap-3"
                  >
                    <span className="h-px flex-1 bg-gradient-to-r from-transparent via-foreground/20 to-foreground/10" />
                    <span className="size-1 rotate-45 bg-primary/70" />
                    <span className="h-px w-16 bg-foreground/10" />
                  </div>

                  <CivicFallback
                    ready={modelReady}
                    reducedMotion={reducedMotion}
                  />

                  {start3d && !modelFailed && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: modelReady ? 1 : 0 }}
                      transition={{ duration: reducedMotion ? 0 : 0.6 }}
                      className="absolute inset-0"
                      // El canvas dejaba un borde recto visible donde terminaba
                      // el viewport WebGL. La máscara lo funde con la tinta del
                      // fondo para que el auto no viva dentro de una caja.
                      style={{
                        maskImage:
                          "radial-gradient(ellipse 78% 82% at 50% 52%, black 58%, transparent 100%)",
                        WebkitMaskImage:
                          "radial-gradient(ellipse 78% 82% at 50% 52%, black 58%, transparent 100%)",
                      }}
                    >
                      <CivicScene
                        progressRef={progressRef}
                        className="absolute inset-0"
                        ariaLabel={t.experience.civicAria}
                        onReady={() => setModelReady(true)}
                        onError={() => setModelFailed(true)}
                        onSpeed={handleSpeed}
                      />
                    </motion.div>
                  )}

                  {/* Aquí vivían el panel «Una obsesión personal, llevada a 3D»
                      y el chip «TYPE R». Los dos explicaban lo que la imagen ya
                      dice. Los pósters de la carpeta nunca justifican un
                      elemento: solo declaran el dato, y eso pasó a la tira del
                      canto inferior. */}

                  {!modelReady && start3d && !modelFailed && (
                    <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/55">
                      {t.experience.modelLoading}
                      <span aria-hidden className="ml-2 inline-flex gap-1">
                        <span className="h-1 w-1 animate-pulse rounded-full bg-primary motion-reduce:animate-none" />
                        <span className="h-1 w-1 animate-pulse rounded-full bg-primary [animation-delay:160ms] motion-reduce:animate-none" />
                        <span className="h-1 w-1 animate-pulse rounded-full bg-primary [animation-delay:320ms] motion-reduce:animate-none" />
                      </span>
                    </div>
                  )}

                  {deferred3d && !start3d && (
                    <button
                      type="button"
                      onClick={() => {
                        setDeferred3d(false);
                        setStart3d(true);
                      }}
                      className="absolute bottom-8 left-1/2 min-h-11 -translate-x-1/2 whitespace-nowrap border border-primary/50 bg-background/85 px-4 font-mono text-[10px] uppercase tracking-[0.2em] text-primary backdrop-blur-sm transition-colors hover:bg-primary hover:text-primary-foreground"
                    >
                      {t.experience.activateModel}
                    </button>
                  )}

                  {modelFailed && (
                    <p className="absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/55">
                      {t.experience.lightweightView}
                    </p>
                  )}
                </div>

                {/* En teléfono esta fila caía justo sobre los botones
                    flotantes de accesibilidad y chat, que son fijos al borde
                    inferior. Sube por encima de ellos y vuelve al canto en
                    cuanto hay ancho para las dos pistas. */}
                <div className="pointer-events-none absolute inset-x-0 bottom-10 flex items-center justify-between px-5 sm:bottom-1 sm:px-8">
                  {/* En 390 px las dos pistas no caben en la misma línea y se
                      encimaban entre ellas y con los botones flotantes. En
                      teléfono el scroll vertical no necesita anuncio: se queda
                      solo el gesto que no es obvio, el arrastre. */}
                  <span className="hidden font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/45 sm:inline sm:text-[10px]">
                    {scrollHint}
                  </span>
                  {/* Dos gestos, dos renglones. El giro ya estaba; el acelerón
                      es nuevo y no se adivina, así que se declara igual que el
                      resto de las instrucciones del hero. */}
                  <span className="flex flex-col items-end gap-1 text-right">
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-primary sm:text-[10px]">
                      {locale === "ja" ? (
                        t.experience.dragRotate
                      ) : (
                        <>
                          {t.experience.dragRotate} ↔ <span lang="ja">回転</span>
                        </>
                      )}
                    </span>
                    {!reducedMotion && (
                      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/45 sm:text-[10px]">
                        {locale === "ja" ? (
                          t.experience.tapBoost
                        ) : (
                          <>
                            {t.experience.tapBoost} ↑ <span lang="ja">加速</span>
                          </>
                        )}
                      </span>
                    )}
                  </span>
                </div>
              </motion.div>
            </div>

            {/* データ帯. El pie de los pósters de la carpeta declara
                coordenadas, lugar y temperatura sin explicar por qué. Esta tira
                hace lo mismo y es la que reemplaza a la ficha que llevaba el
                auto encima. */}
            <div className="relative z-20 border-t border-border/80 bg-background/60">
              <div className="container data-strip py-3">
                <span>19.4326° N · 99.1332° W</span>
                <span aria-hidden className="sep" />
                <span className="hidden sm:inline">
                  <span lang="ja" className="font-jp tracking-[0.2em]">
                    走り
                  </span>
                  <span className="mx-2 opacity-40">/</span>
                  {locale === "ja" ? "HASHIRI" : `HASHIRI / ${t.experience.driving}`}
                </span>
                <span aria-hidden className="sep hidden sm:block" />
                {/* 速度計. La tira ya declaraba coordenadas y lectura; ahora
                    declara también a qué velocidad va el Civic. Es telemetría
                    de la escena, no contenido: por eso queda fuera del árbol
                    de accesibilidad en vez de anunciar un número que cambia
                    diez veces por segundo. */}
                {modelReady && !modelFailed && !reducedMotion && (
                  <>
                    <span
                      aria-hidden
                      className="inline-flex items-baseline gap-1.5 tabular-nums"
                    >
                      <span ref={speedRef} className="text-primary/85">
                        000
                      </span>
                      <span className="opacity-55">km/h</span>
                    </span>
                    <span aria-hidden className="sep hidden sm:block" />
                  </>
                )}
                <span className="inline-flex items-center gap-2">
                  <span aria-hidden className="size-1 bg-signal" />
                  <span lang="ja" className="font-jp tracking-[0.2em]">
                    始動
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
);
Hero.displayName = "Hero";

function HeroPhase({
  jp,
  label,
  signal = false,
}: {
  jp: string;
  label: string;
  signal?: boolean;
}) {
  return (
    <div className="border-r border-border/80 px-3 py-3 last:border-r-0">
      <span
        lang="ja"
        className={cn(
          "font-jp text-lg",
          signal ? "text-signal" : "text-primary"
        )}
      >
        {jp}
      </span>
      <span className="ml-2 font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/50">
        {label}
      </span>
    </div>
  );
}

function CivicFallback({
  ready,
  reducedMotion,
}: {
  ready: boolean;
  reducedMotion: boolean;
}) {
  return (
    <motion.div
      aria-hidden
      animate={{ opacity: ready ? 0 : 1 }}
      transition={{ duration: reducedMotion ? 0 : 0.5 }}
      className="absolute inset-0 grid place-items-center"
    >
      <div className="absolute inset-[12%] bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.11),transparent_64%)]" />
      <svg
        viewBox="0 0 760 390"
        className="relative w-[112%] max-w-[820px] overflow-visible text-primary/45"
      >
        <defs>
          <linearGradient id="civic-fallback-line" x1="0" x2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity="0" />
            <stop offset=".2" stopColor="currentColor" stopOpacity=".75" />
            <stop offset=".82" stopColor="currentColor" stopOpacity=".75" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M44 291C127 283 169 270 212 235L288 166C306 150 326 141 351 138L477 126C507 123 533 133 554 154L602 202C639 213 667 227 688 252L716 291"
          fill="none"
          stroke="url(#civic-fallback-line)"
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

export { Hero };
