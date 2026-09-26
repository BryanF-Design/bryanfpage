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

const SIGNATURE = "BRYANF DESIGN";
const SCRAMBLE = "▚▞#%&*+<>_?!0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * 準備 → 始動 — la secuencia de entrada.
 *
 * La hoja washi aparece vacía y el bento se arma a golpes: el panel de tinta
 * entra desde la izquierda, el lima cae desde arriba, el musgo llega desde la
 * derecha. En el de tinta crece el hinomaru de trama y el kanji pasa de
 * 準備 a 始動 mientras la firma se decodifica desde ruido. Al terminar, cada
 * panel sale por donde vino y, detrás, los paneles del hero entran a ocupar
 * su lugar: la página se construye con la misma pieza que la presenta.
 */
export function IgnitionPreloader() {
  const { t, locale } = useLanguage();
  const reducedMotion = useReducedMotionPreference();
  const [visible, setVisible] = useState(true);
  const [instantExit, setInstantExit] = useState(false);
  const [phase, setPhase] = useState<LoaderPhase>("準備");
  const previousOverflowRef = useRef("");
  const ownsScrollLockRef = useRef(false);

  const duration = reducedMotion ? 460 : 1900;
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
      reducedMotion ? 180 : 1060
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

  // La entrada del hero espera al telón con `--hero-offset` (globals.css),
  // que depende de este atributo. Se apaga cuando esa entrada ya terminó: si
  // cambiara a media animación, el retraso recalculado la haría saltar.
  const handleExitComplete = useCallback(() => {
    releaseScrollLock();
    window.setTimeout(() => {
      document.documentElement.dataset.ignitionSeen = "1";
    }, 2600);
  }, [releaseScrollLock]);

  function skip() {
    try {
      window.sessionStorage.setItem(IGNITION_STORAGE_KEY, "1");
    } catch {
      // Ignore storage failures.
    }
    setVisible(false);
  }

  const started = phase === "始動";
  const fly = !reducedMotion && !instantExit;
  const spring = { type: "spring" as const, stiffness: 190, damping: 22, mass: 0.9 };
  const out = { duration: 0.62, ease: [0.76, 0, 0.24, 1] as const };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {visible && (
        <motion.div
          key="ignition-preloader"
          role="status"
          aria-live="polite"
          aria-label={
            started ? t.experience.readyAria : t.experience.preparingAria
          }
          initial={false}
          exit={{ opacity: 0 }}
          transition={{
            duration: instantExit ? 0 : reducedMotion ? 0.12 : 0.34,
            delay: fly ? 0.3 : 0,
            ease: [0.76, 0, 0.24, 1],
          }}
          className="ignition-loader fixed inset-0 z-[300] isolate flex flex-col overflow-hidden bg-sheet p-[var(--gutter)] text-[hsl(160_36%_6%)]"
        >
          {/* Tira superior: firma y coordenadas, tinta sobre washi. */}
          <div className="flex items-center justify-between gap-6 px-2 pb-3 pt-1 font-mono text-[10px] uppercase tracking-[0.28em] opacity-70 sm:text-[11px]">
            <p>
              BryanF Design
              <span className="hidden sm:inline">
                <span className="mx-2 opacity-40">/</span>
                {t.experience.startupSequence}
              </span>
            </p>
            <p>
              <span className="sm:hidden">19.4326° N</span>
              <span className="hidden sm:inline">19.4326° N · 99.1332° W</span>
            </p>
          </div>

          {/* El bento se arma: tres paneles llegan desde fuera del lienzo. */}
          <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(0,1.5fr)_minmax(0,0.6fr)_minmax(0,0.6fr)] gap-[var(--gutter)] sm:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] sm:grid-rows-2">
            <motion.div
              initial={fly ? { x: "-110vw", rotate: -9 } : false}
              animate={{ x: 0, rotate: 0 }}
              exit={fly ? { x: "-110vw", rotate: -6, transition: out } : undefined}
              transition={spring}
              className="panel relative grid place-items-center overflow-hidden sm:row-span-2"
            >
              <div aria-hidden className="japan-halftone absolute inset-0 opacity-25" />
              <Hinomaru active={started} reducedMotion={reducedMotion} />
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={phase}
                  lang="ja"
                  initial={reducedMotion ? false : { opacity: 0, y: -24, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 1.05 }}
                  transition={{
                    duration: reducedMotion ? 0 : 0.42,
                    ease: [0.2, 0, 0, 1],
                  }}
                  className="tategaki-display relative z-10 text-[clamp(3.5rem,14vh,8rem)] font-medium text-foreground"
                >
                  {phase}
                </motion.span>
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={fly ? { y: "-110vh", rotate: 7 } : false}
              animate={{ y: 0, rotate: 0 }}
              exit={fly ? { y: "-110vh", rotate: 5, transition: out } : undefined}
              transition={{ ...spring, delay: fly ? 0.12 : 0 }}
              className="panel panel-lime flex flex-col justify-between overflow-hidden p-5 sm:p-7"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] sm:text-xs">
                {started
                  ? locale === "ja"
                    ? "shidō"
                    : `shidō / ${t.experience.start}`
                  : locale === "ja"
                    ? "junbi"
                    : `junbi / ${t.experience.prepare}`}
              </p>
              <p className="display-xl text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.82]">
                {started ? "02" : "01"}
                <span className="opacity-40"> / 02</span>
              </p>
            </motion.div>

            <motion.div
              initial={fly ? { x: "110vw", rotate: 9 } : false}
              animate={{ x: 0, rotate: 0 }}
              exit={fly ? { x: "110vw", rotate: 6, transition: out } : undefined}
              transition={{ ...spring, delay: fly ? 0.22 : 0 }}
              className="panel panel-moss flex flex-col justify-between gap-4 overflow-hidden p-5 sm:p-7"
            >
              <p className="max-w-[18rem] text-xs leading-relaxed text-foreground/70 sm:text-sm">
                {t.experience.loaderLine}
              </p>
              <div>
                <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/60">
                  <span>
                    {started ? t.experience.routeReady : t.experience.aligning}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-background/60">
                  <motion.div
                    className="h-full origin-left rounded-full bg-primary"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={transition}
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Firma decodificándose y salida. */}
          <motion.div
            initial={fly ? { y: 80, opacity: 0 } : false}
            animate={{ y: 0, opacity: 1 }}
            exit={fly ? { y: 80, opacity: 0, transition: out } : undefined}
            transition={{ ...spring, delay: fly ? 0.3 : 0 }}
            className="mt-[var(--gutter)] flex items-center gap-3"
          >
            <div className="panel flex min-h-12 min-w-0 flex-1 items-center rounded-full px-5">
              <Decoder
                target={SIGNATURE}
                active={started}
                reducedMotion={reducedMotion}
              />
            </div>
            <button
              type="button"
              onClick={skip}
              className="min-h-12 shrink-0 rounded-full bg-[hsl(160_36%_6%)] px-5 font-mono text-[10px] uppercase tracking-[0.24em] text-[hsl(72_24%_94%/0.7)] transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {t.experience.skip}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * 日の丸 — el disco, en trama.
 *
 * Crece desde el centro del panel de tinta y, al arrancar, se enciende. Es
 * medio tono bermellón: de lejos disco, de cerca impresión.
 */
function Hinomaru({
  active,
  reducedMotion,
}: {
  active: boolean;
  reducedMotion: boolean;
}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center"
    >
      <motion.span
        initial={reducedMotion ? false : { scale: 0.2, opacity: 0 }}
        animate={{
          scale: active ? 1 : 0.82,
          opacity: active ? 1 : 0.7,
        }}
        transition={{
          duration: reducedMotion ? 0 : 1.15,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="hinomaru-dots relative block aspect-square w-[min(62vw,24rem)]"
      />
      <motion.span
        initial={reducedMotion ? false : { scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.6, rotate: active ? 90 : 0 }}
        transition={{
          duration: reducedMotion ? 0 : 1.3,
          delay: reducedMotion ? 0 : 0.12,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="hinomaru-ring block aspect-square w-[min(72vw,28rem)] [mask-image:conic-gradient(from_200deg,black_0deg,black_220deg,transparent_280deg)]"
      />
    </div>
  );
}

/**
 * La firma resolviéndose desde ruido, de izquierda a derecha.
 */
function Decoder({
  target,
  active,
  reducedMotion,
}: {
  target: string;
  active: boolean;
  reducedMotion: boolean;
}) {
  // El primer render tiene que ser determinista: si el ruido inicial sale de
  // Math.random(), servidor y cliente producen cadenas distintas y React tira
  // toda la raíz a render de cliente por un mismatch de hidratación. El ruido
  // aleatorio empieza en el efecto, que solo corre en el navegador.
  const [text, setText] = useState(() =>
    reducedMotion ? target : staticNoise(target)
  );

  useEffect(() => {
    if (reducedMotion) {
      setText(target);
      return;
    }

    let frame = 0;
    let raf = 0;
    const total = 34;

    const step = () => {
      frame += 1;
      const resolved = Math.min(target.length, Math.round((frame / total) * target.length));
      setText(scramble(target, resolved));
      if (frame < total) raf = requestAnimationFrame(step);
      else setText(target);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, reducedMotion]);

  return (
    <div className="flex min-w-0 items-center gap-4">
      <span
        aria-hidden
        className={`truncate font-mono text-sm tracking-[0.42em] transition-colors duration-500 sm:text-base ${
          active ? "text-primary" : "text-foreground/50"
        }`}
      >
        {text}
      </span>
    </div>
  );
}

/** Ruido reproducible para el render inicial: mismo resultado en ambos lados. */
function staticNoise(target: string) {
  let out = "";
  for (let i = 0; i < target.length; i += 1) {
    out +=
      target[i] === " " ? " " : SCRAMBLE[(i * 7 + 3) % SCRAMBLE.length];
  }
  return out;
}

function scramble(target: string, resolved: number) {
  let out = "";
  for (let i = 0; i < target.length; i += 1) {
    const char = target[i];
    if (i < resolved || char === " ") {
      out += char;
      continue;
    }
    out += SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)];
  }
  return out;
}
