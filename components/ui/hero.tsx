"use client";

import * as React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { useReducedMotionPreference } from "@/lib/motion-preference";
import { Button } from "@/components/ui/button";
import { VerticalLabel } from "@/components/ui/vertical-label";
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
 * Hero "Ruta de arranque".
 *
 * El Civic proporcionado es la demostración principal de 3D del sitio. El
 * scroll cambia su ángulo y el arrastre permite inspeccionarlo sin bloquear
 * el gesto vertical en touch. El modelo pesado arranca en idle; el H1, el
 * copy, los CTA y el fallback se pintan antes.
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
            <div aria-hidden className="route-grid absolute inset-0 opacity-60" />
            <div aria-hidden className="japan-halftone absolute inset-0 opacity-20" />
            <div aria-hidden className="mesh-glow-a absolute inset-0 opacity-70" />
            <HeroRoute reducedMotion={reducedMotion} />

            <VerticalLabel
              jp="走り"
              romaji={
                locale === "ja"
                  ? "hashiri"
                  : `hashiri · ${t.experience.driving}`
              }
              tone="primary"
              className="right-4 top-1/2 z-20 hidden -translate-y-1/2 xl:flex"
            />

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

                <h1
                  className={cn(
                    "hero-title max-w-[10ch] font-display text-[17vw] font-bold uppercase leading-[0.78] tracking-[-0.065em] text-foreground sm:text-[5.35rem] md:text-[6.3rem] lg:text-[6.7rem] xl:text-[8rem]",
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
                <div className="absolute inset-x-4 inset-y-0 overflow-hidden sm:inset-x-0">
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
                    >
                      <CivicScene
                        progressRef={progressRef}
                        className="absolute inset-0"
                        ariaLabel={t.experience.civicAria}
                        onReady={() => setModelReady(true)}
                        onError={() => setModelFailed(true)}
                      />
                    </motion.div>
                  )}

                  <div className="pointer-events-none absolute inset-x-4 top-4 flex items-start justify-between gap-4 sm:inset-x-6">
                    <div className="glass-dark border-l-2 border-primary px-3 py-2">
                      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/45 sm:text-[10px]">
                        {t.experience.modelStudy}
                      </p>
                      <p className="mt-1 font-display text-sm font-semibold uppercase tracking-[0.08em] text-foreground sm:text-base">
                        Civic Type R · 2023
                      </p>
                    </div>
                    <span className="hidden rounded-full border border-signal/50 bg-background/80 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-signal sm:inline-flex">
                      Type R
                    </span>
                  </div>

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

                <div className="pointer-events-none absolute inset-x-0 bottom-1 flex items-center justify-between px-5 sm:px-8">
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/45 sm:text-[10px]">
                    {scrollHint}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-primary sm:text-[10px]">
                    {locale === "ja" ? (
                      t.experience.dragRotate
                    ) : (
                      <>
                        {t.experience.dragRotate} ↔ <span lang="ja">回転</span>
                      </>
                    )}
                  </span>
                </div>
              </motion.div>
            </div>

            <div className="relative z-20 border-t border-border/80 bg-background/60">
              <div className="container grid grid-cols-[1fr_auto] items-center gap-4 py-3 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground sm:text-[10px] md:grid-cols-3">
                <span>19.4326° N · CDMX / MX</span>
                <span className="hidden text-center md:block">
                  <span lang="ja">精度</span> / SEIDO
                  {locale === "ja" ? null : ` / ${t.experience.precision}`}
                </span>
                <span className="inline-flex items-center justify-end gap-2 text-primary">
                  <span className="size-1.5 rounded-full bg-signal shadow-[0_0_12px_hsl(var(--signal)/0.75)]" />
                  {t.experience.systemOnline}
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

function HeroRoute({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1600 900"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <motion.path
        d="M-120 760C160 715 273 530 504 542C704 554 697 777 925 684C1112 608 1166 286 1710 300"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        pathLength="1"
        initial={reducedMotion ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.52 }}
        transition={{ duration: reducedMotion ? 0 : 1.35, delay: 0.25, ease: [0.2, 0, 0, 1] }}
        className="text-primary"
      />
      <path
        d="M-130 786C176 741 280 560 505 568C729 576 711 804 938 708C1147 620 1195 315 1710 327"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="7 13"
        className="text-foreground/15"
      />
      <circle cx="924" cy="684" r="5" fill="currentColor" className="text-signal" />
      <circle cx="924" cy="684" r="18" fill="none" stroke="currentColor" className="text-signal/40" />
    </svg>
  );
}

export { Hero };
