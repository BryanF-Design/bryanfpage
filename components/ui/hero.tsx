"use client";

import * as React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

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
 * Bento de tres piezas recortado en la hoja: el panel musgo sostiene el
 * titular, el panel de tinta es el escenario del Civic y una píldora larga
 * lleva la tira de datos. El auto no se queda dentro de su tarjeta: el lienzo
 * rebasa el panel y cruza la costura, que es el gesto de los personajes que
 * desbordan su marco en las referencias. Un sello giratorio muerde la costura
 * entre los dos paneles y lleva al cotizador.
 *
 * Toda la entrada es CSS (`.hero-in-*`): corre en cuanto se pinta, sin
 * esperar a la hidratación, y en la primera visita espera al telón del
 * preloader. El modelo pesado sigue arrancando en idle.
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

    const badgeText = `${t.hero.titlePrefix} ${t.hero.titleHighlight} · ${t.nav.armaTuWeb} · `;

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
            reducedMotion
              ? "min-h-[calc(100svh-var(--gutter)*2)]"
              : "h-[168svh] md:h-[218svh]"
          )}
        >
          <div
            className={cn(
              "relative grid min-h-[calc(100svh-var(--gutter)*2)] grid-cols-1 grid-rows-[auto_minmax(0,1fr)_auto] gap-gutter",
              "lg:grid-cols-[calc(47%-var(--gutter)/2)_calc(53%-var(--gutter)/2)] lg:grid-rows-[minmax(0,1fr)_auto]",
              reducedMotion
                ? ""
                : "sticky top-[var(--gutter)] h-[calc(100svh-var(--gutter)*2)]"
            )}
          >
            {/* A · Panel musgo: el titular. La pestaña de la marca queda
                recortada en su esquina superior izquierda. */}
            <div
              className="hero-in hero-in-left panel panel-moss relative z-10 flex min-w-0 flex-col justify-end overflow-hidden px-5 pb-6 pt-[calc(var(--header-h)+1.25rem)] sm:px-8 sm:pb-8 lg:px-12 lg:pb-12 xl:px-14"
              style={{ "--hd": "60ms" } as React.CSSProperties}
            >
              <div aria-hidden className="dot-grid absolute inset-0 rounded-[inherit] opacity-50 [mask-image:radial-gradient(ellipse_at_85%_15%,black,transparent_60%)]" />
              <span
                aria-hidden
                className="ghost-word drift-x pointer-events-none absolute -bottom-[0.12em] left-0 text-[38vw] lg:text-[21vw]"
              >
                {t.hero.titleHighlight}
              </span>

              <div className="relative z-10 flex flex-col items-start gap-5 lg:gap-6">
                {eyebrow && (
                  <span
                    className="hero-in hero-in-fade tag-pill"
                    style={{ "--hd": "380ms" } as React.CSSProperties}
                  >
                    <span aria-hidden lang="ja" className="seal">
                      走
                    </span>
                    <span className="whitespace-normal leading-snug">{eyebrow}</span>
                  </span>
                )}

                <h1
                  className={cn(
                    "hero-title display-xl max-w-full text-[clamp(4rem,20.5vw,8rem)] text-foreground sm:text-[clamp(5rem,14vw,8.5rem)] lg:text-[min(11vw,20svh)]",
                    titleClassName
                  )}
                >
                  {title}
                </h1>

                {subtitle && (
                  <p
                    className={cn(
                      "hero-in hero-in-fade max-w-[33rem] text-pretty text-[0.95rem] leading-relaxed text-foreground/75 sm:text-base md:text-lg",
                      subtitleClassName
                    )}
                    style={{ "--hd": "520ms" } as React.CSSProperties}
                  >
                    {subtitle}
                  </p>
                )}

                {actions && actions.length > 0 && (
                  <div
                    className={cn(
                      "hero-in hero-in-up mt-1 grid w-full grid-cols-2 gap-2.5 sm:flex sm:w-auto sm:gap-3",
                      actionsClassName
                    )}
                    style={{ "--hd": "600ms" } as React.CSSProperties}
                  >
                    {actions.map((action) => (
                      <Button
                        key={`${action.href}-${action.label}`}
                        size="lg"
                        variant={action.variant || "default"}
                        asChild
                        className="w-full px-3 sm:w-auto sm:px-7"
                      >
                        <Link href={action.href}>
                          {action.label}
                          {(action.variant ?? "default") === "default" && (
                            <ArrowUpRight className="h-4 w-4" />
                          )}
                        </Link>
                      </Button>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* B · Panel de tinta: el escenario del Civic. */}
            <div
              className="hero-in hero-in-right panel relative z-20 min-h-[30svh] min-w-0 overflow-visible lg:row-span-2 lg:min-h-0"
              style={{ "--hd": "160ms" } as React.CSSProperties}
            >
              <div aria-hidden className="absolute inset-0 overflow-hidden rounded-[inherit]">
                <div className="japan-halftone absolute inset-0 opacity-20" />
                <div className="mesh-glow-a opacity-60" />
                {/* 日の丸 en trama: el disco de la referencia, impreso. */}
                <div className="hinomaru-dots left-1/2 top-[47%] aspect-square w-[min(88%,34rem)] -translate-x-1/2 -translate-y-1/2 opacity-80" />
                <div className="hinomaru-ring left-1/2 top-[47%] aspect-square w-[min(96%,37rem)] -translate-x-1/2 -translate-y-1/2 [mask-image:conic-gradient(from_200deg,black_0deg,black_200deg,transparent_260deg)]" />
                {/* 縦組み a escala de panel. */}
                <div className="pointer-events-none absolute right-5 top-[calc(var(--header-h)+1rem)] hidden select-none flex-col items-center gap-3 md:flex lg:right-7">
                  <span
                    lang="ja"
                    className="tategaki-display text-[clamp(2rem,3.2vw,3rem)] text-foreground/[0.14]"
                  >
                    走り
                  </span>
                  <span className="vertical-jp font-mono text-[9px] uppercase tracking-[0.34em] text-foreground/35">
                    {locale === "ja" ? "hashiri" : `hashiri · ${t.experience.driving}`}
                  </span>
                </div>
                {/* El horizonte: una sola línea donde apoya el auto. */}
                <div className="absolute inset-x-6 top-[72%] flex items-center gap-3">
                  <span className="h-px flex-1 bg-gradient-to-r from-transparent via-foreground/20 to-foreground/5" />
                  <span className="size-1.5 rotate-45 bg-primary/80" />
                </div>
              </div>

              {/* Sello giratorio en teléfono: vive en el recorte superior
                  izquierdo del escenario. En escritorio sube a la costura. */}
              <div className="notch notch-tl lg:hidden">
                <HeroBadge text={badgeText} label={t.nav.armaTuWeb} size="sm" />
              </div>

              <CivicFallback ready={modelReady} reducedMotion={reducedMotion} />

              {start3d && !modelFailed && (
                // El lienzo rebasa el panel por la izquierda: el Civic se sale
                // de su marco y cruza la costura, como los personajes de las
                // referencias que desbordan su tarjeta.
                <div
                  className={cn(
                    "absolute inset-0 transition-opacity duration-700 lg:-left-[16%]",
                    modelReady ? "opacity-100" : "opacity-0",
                    modelReady && !reducedMotion && "civic-drive-in"
                  )}
                  style={{
                    maskImage:
                      "radial-gradient(ellipse 96% 92% at 55% 52%, black 70%, transparent 100%)",
                    WebkitMaskImage:
                      "radial-gradient(ellipse 96% 92% at 55% 52%, black 70%, transparent 100%)",
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
                </div>
              )}

              {!modelReady && start3d && !modelFailed && (
                <div className="pointer-events-none absolute bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-background/80 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/65">
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
                  className="absolute bottom-16 left-1/2 min-h-11 -translate-x-1/2 whitespace-nowrap rounded-full border border-primary/50 bg-background/85 px-5 font-mono text-[10px] uppercase tracking-[0.2em] text-primary backdrop-blur-sm transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  {t.experience.activateModel}
                </button>
              )}

              {modelFailed && (
                <p className="absolute bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/55">
                  {t.experience.lightweightView}
                </p>
              )}

              {/* Gestos. */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 p-4 sm:p-5">
                <span className="hidden rounded-full bg-background/70 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/55 backdrop-blur-sm sm:inline sm:text-[10px]">
                  {scrollHint}
                </span>
                <span className="ml-auto flex flex-col items-end gap-1.5 text-right">
                  <span className="rounded-full bg-primary px-3 py-1.5 font-mono text-[9px] font-medium uppercase tracking-[0.2em] text-primary-foreground sm:text-[10px]">
                    {locale === "ja" ? (
                      t.experience.dragRotate
                    ) : (
                      <>
                        {t.experience.dragRotate} ↔ <span lang="ja">回転</span>
                      </>
                    )}
                  </span>
                  {!reducedMotion && (
                    <span className="rounded-full bg-background/70 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/60 backdrop-blur-sm sm:text-[10px]">
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
            </div>

            {/* C · Tira de datos + fases: una píldora larga bajo el titular. */}
            <div
              className="hero-in hero-in-up panel relative z-10 flex min-w-0 items-center gap-3 overflow-hidden rounded-full px-4 py-2.5 sm:px-6"
              style={{ "--hd": "300ms" } as React.CSSProperties}
            >
              <div className="data-strip min-w-0 flex-1">
                <span className="hidden xl:inline">19.4326° N · 99.1332° W</span>
                <span aria-hidden className="sep hidden xl:block" />
                <span className="flex items-center gap-2">
                  <HeroPhase jp="設計" label={locale === "ja" ? "SEKKEI" : t.experience.phaseDesign} />
                  <HeroPhase jp="実装" label={locale === "ja" ? "JISSŌ" : t.experience.phaseDevelopment} />
                  <HeroPhase jp="始動" label={locale === "ja" ? "SHIDŌ" : t.experience.phaseLaunch} signal />
                </span>
                <span aria-hidden className="sep" />
                {/* 速度計: telemetría de la escena, fuera del árbol accesible. */}
                {modelReady && !modelFailed && !reducedMotion ? (
                  <span aria-hidden className="inline-flex items-baseline gap-1.5 tabular-nums">
                    <span
                      ref={speedRef}
                      className="font-display text-lg font-black tracking-normal text-primary"
                    >
                      000
                    </span>
                    <span className="opacity-55">km/h</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <span aria-hidden className="size-1.5 rounded-full bg-signal" />
                    <span lang="ja" className="font-jp tracking-[0.2em]">
                      始動
                    </span>
                  </span>
                )}
              </div>
            </div>

            {/* Sello giratorio de escritorio, montado sobre la costura entre el
                titular y el Civic: muerde los dos paneles, como el círculo de
                la referencia entre imagen y contenido. */}
            <div
              className="hero-in hero-in-pop pointer-events-none absolute bottom-[calc(3.5rem+var(--gutter)*2)] left-[47%] z-30 hidden lg:block"
              style={{ "--hd": "760ms", marginLeft: "calc(var(--gutter) / 2)" } as React.CSSProperties}
            >
              <div className="pointer-events-auto -translate-x-1/2 rounded-full bg-sheet p-[var(--gutter)]">
                <HeroBadge text={badgeText} label={t.nav.armaTuWeb} size="lg" />
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
    <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 px-2.5 py-1">
      <span
        lang="ja"
        className={cn(
          "font-jp text-xs tracking-normal",
          signal ? "text-signal" : "text-primary"
        )}
      >
        {jp}
      </span>
      <span className="hidden text-foreground/55 md:inline">{label}</span>
    </span>
  );
}

/**
 * El sello giratorio de la referencia: un anillo de texto que rueda alrededor
 * de un botón lima. Es un enlace real al cotizador; el texto del anillo es
 * ornamento y queda fuera del árbol accesible.
 */
function HeroBadge({
  text,
  label,
  size,
}: {
  text: string;
  label: string;
  size: "sm" | "lg";
}) {
  const id = React.useId().replace(/:/g, "");
  return (
    <Link
      href="#precios"
      aria-label={label}
      className={cn(
        "group relative grid place-items-center rounded-full bg-background text-foreground transition-transform duration-500 [transition-timing-function:var(--ease-pop)] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--sheet))]",
        size === "lg" ? "size-36 xl:size-40" : "size-24"
      )}
    >
      <svg
        aria-hidden
        viewBox="0 0 200 200"
        className="spin-slow absolute inset-0 h-full w-full"
      >
        <defs>
          <path
            id={`badge-circle-${id}`}
            d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0"
          />
        </defs>
        <text
          fill="currentColor"
          className="font-display font-extrabold uppercase opacity-85"
          style={{ fontSize: 20, letterSpacing: "0.12em" }}
        >
          <textPath
            href={`#badge-circle-${id}`}
            textLength="470"
            lengthAdjust="spacingAndGlyphs"
          >
            {text}
            {text}
          </textPath>
        </text>
      </svg>
      <span
        aria-hidden
        className={cn(
          "relative grid place-items-center rounded-full bg-primary text-primary-foreground transition-transform duration-500 group-hover:rotate-45",
          size === "lg" ? "size-14 xl:size-16" : "size-10"
        )}
      >
        <ArrowUpRight className={size === "lg" ? "h-6 w-6" : "h-4 w-4"} />
      </span>
    </Link>
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
