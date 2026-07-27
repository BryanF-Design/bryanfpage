"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useReducedMotionPreference } from "@/lib/motion-preference";
import { useLanguage } from "@/lib/i18n/context";

export const IGNITION_STORAGE_KEY = "bryanf_ignition_seen_v3";
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

type LoaderPhase = "準備" | "始動";

export function IgnitionPreloader() {
  const { t, locale } = useLanguage();
  const reducedMotion = useReducedMotionPreference();
  const [visible, setVisible] = useState(true);
  const [instantExit, setInstantExit] = useState(false);
  const [phase, setPhase] = useState<LoaderPhase>("準備");
  const previousOverflowRef = useRef("");
  const ownsScrollLockRef = useRef(false);

  const duration = reducedMotion ? 420 : 1650;
  const transition = useMemo(
    () => ({
      duration: duration / 1000,
      ease: [0.2, 0, 0, 1] as const,
    }),
    [duration]
  );

  const releaseScrollLock = useCallback(() => {
    if (!ownsScrollLockRef.current) return;
    document.body.style.overflow = previousOverflowRef.current;
    document.documentElement.classList.remove("ignition-active");
    ownsScrollLockRef.current = false;
  }, []);

  useIsomorphicLayoutEffect(() => {
    let alreadySeen = false;
    try {
      alreadySeen =
        window.sessionStorage.getItem(IGNITION_STORAGE_KEY) === "1";
    } catch {
      // Storage can be blocked. The preloader still works for this visit.
    }

    if (alreadySeen) {
      setInstantExit(true);
      setVisible(false);
      return;
    }

    previousOverflowRef.current = document.body.style.overflow;
    ownsScrollLockRef.current = true;
    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("ignition-active");

    const phaseTimer = window.setTimeout(
      () => setPhase("始動"),
      reducedMotion ? 160 : 920
    );
    const exitTimer = window.setTimeout(() => {
      try {
        window.sessionStorage.setItem(IGNITION_STORAGE_KEY, "1");
      } catch {
        // The visual should never depend on storage availability.
      }
      setVisible(false);
    }, duration);

    return () => {
      window.clearTimeout(phaseTimer);
      window.clearTimeout(exitTimer);
      releaseScrollLock();
    };
  }, [duration, reducedMotion, releaseScrollLock]);

  function skip() {
    try {
      window.sessionStorage.setItem(IGNITION_STORAGE_KEY, "1");
    } catch {
      // Ignore storage failures.
    }
    setVisible(false);
  }

  return (
    <AnimatePresence
      onExitComplete={releaseScrollLock}
    >
      {visible && (
        <motion.div
          key="ignition-preloader"
          role="status"
          aria-live="polite"
          aria-label={
            phase === "準備"
              ? t.experience.preparingAria
              : t.experience.readyAria
          }
          initial={false}
          exit={
            instantExit
              ? { opacity: 0 }
              : reducedMotion
              ? { opacity: 0 }
              : { clipPath: "inset(0 0 100% 0)", opacity: 1 }
          }
          transition={{
            duration: instantExit ? 0 : reducedMotion ? 0.12 : 0.62,
            ease: [0.76, 0, 0.24, 1],
          }}
          className="ignition-loader fixed inset-0 z-[300] isolate overflow-hidden bg-background"
        >
          <div aria-hidden className="japan-halftone absolute inset-0 opacity-35" />
          <div aria-hidden className="route-grid absolute inset-0 opacity-45" />

          <div className="ignition-shell relative flex h-full flex-col justify-between px-5 py-5 sm:px-8 sm:py-7 lg:px-12">
            <div className="flex items-start justify-between gap-6 border-t border-foreground/20 pt-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/60 sm:text-xs">
                BryanF Design / {t.experience.startupSequence}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-signal sm:text-xs">
                CDMX · 19.4326° N
              </p>
            </div>

            <div className="ignition-stage mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="ignition-copy flex min-w-0 flex-col items-start gap-2 sm:flex-row sm:items-end sm:gap-8">
                <motion.span
                  key={phase}
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reducedMotion ? 0 : 0.35 }}
                  className="ignition-kanji font-jp text-[clamp(4.75rem,24vw,13rem)] font-medium leading-none tracking-[-0.08em] text-foreground"
                  lang="ja"
                >
                  {phase}
                </motion.span>
                <div className="border-l border-primary/50 pl-4 sm:mb-4">
                  <p className="font-mono text-xs uppercase tracking-[0.24em] text-primary">
                    {phase === "準備"
                      ? locale === "ja"
                        ? "junbi"
                        : `junbi / ${t.experience.prepare}`
                      : locale === "ja"
                        ? "shidō"
                        : `shidō / ${t.experience.start}`}
                  </p>
                  <p className="mt-2 max-w-[17rem] text-sm leading-relaxed text-foreground/55">
                    {t.experience.loaderLine}
                  </p>
                </div>
              </div>

              <IgnitionDial active={phase === "始動"} reducedMotion={reducedMotion} />
            </div>

            <div className="grid items-end gap-4 border-b border-foreground/20 pb-3 sm:grid-cols-[1fr_auto]">
              <div>
                <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/55">
                  <span>
                    {phase === "準備"
                      ? t.experience.aligning
                      : t.experience.routeReady}
                  </span>
                  <span>{phase === "準備" ? "01 / 02" : "02 / 02"}</span>
                </div>
                <div className="h-px overflow-hidden bg-foreground/15">
                  <motion.div
                    className="h-full origin-left bg-primary"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={transition}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={skip}
                className="min-h-11 justify-self-start font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/55 transition-colors hover:text-primary focus-visible:text-primary sm:justify-self-end"
              >
                {t.experience.skip}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function IgnitionDial({
  active,
  reducedMotion,
}: {
  active: boolean;
  reducedMotion: boolean;
}) {
  return (
    <div
      aria-hidden
      className="ignition-dial relative mx-auto aspect-[2/1] w-full max-w-[640px] overflow-hidden"
    >
      <svg viewBox="0 0 640 320" className="absolute inset-0 h-full w-full">
        <path
          d="M72 286A254 254 0 0 1 568 286"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-foreground/20"
        />
        <motion.path
          d="M72 286A254 254 0 0 1 568 286"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          pathLength="1"
          initial={reducedMotion ? { pathLength: 1 } : { pathLength: 0.08 }}
          animate={{ pathLength: active ? 1 : 0.62 }}
          transition={{ duration: reducedMotion ? 0 : 0.72, ease: [0.2, 0, 0, 1] }}
          className="text-primary"
        />
        {Array.from({ length: 17 }, (_, index) => {
          const angle = Math.PI + (Math.PI * index) / 16;
          const x1 = 320 + Math.cos(angle) * 222;
          const y1 = 286 + Math.sin(angle) * 222;
          const x2 = 320 + Math.cos(angle) * (index % 4 === 0 ? 245 : 236);
          const y2 = 286 + Math.sin(angle) * (index % 4 === 0 ? 245 : 236);
          return (
            <line
              key={index}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth={index % 4 === 0 ? 2 : 1}
              className={index > 13 ? "text-signal" : "text-foreground/35"}
            />
          );
        })}
        <motion.line
          x1="320"
          y1="286"
          x2="320"
          y2="86"
          stroke="currentColor"
          strokeWidth="3"
          initial={false}
          animate={{ rotate: active ? 68 : -38 }}
          transition={{ duration: reducedMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "320px 286px" }}
          className="text-signal"
        />
        <circle cx="320" cy="286" r="8" fill="currentColor" className="text-signal" />
      </svg>
      <span className="absolute bottom-7 left-1/2 -translate-x-1/2 font-display text-2xl font-bold uppercase tracking-[0.18em] text-foreground/85">
        {active ? "SHIDŌ" : "JUNBI"}
      </span>
    </div>
  );
}
