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
 * La versión anterior dibujaba un tacómetro: aguja, marcas y arco. Era la
 * metáfora más literal disponible y no anticipaba nada de lo que venía
 * después. Esta no imita un tablero — **traza el marco dentro del cual vive
 * el sitio**. Los mismos hairlines, el mismo inset, las mismas marcas de
 * registro que acompañan los 18 000 px siguientes.
 *
 * Por eso no es una animación previa a la página: es la página construyéndose.
 * Cuando el campo se levanta, el marco se queda.
 *
 * Los tres gestos vienen de la carpeta de referencia: el disco (日の丸) que
 * ancla la composición, el kanji en vertical a escala de página (縦組み) y la
 * firma que se decodifica desde ruido — el recurso del preloader de
 * hirotos.com, donde no hay barra ni logo, solo tipografía resolviéndose.
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

  function skip() {
    try {
      window.sessionStorage.setItem(IGNITION_STORAGE_KEY, "1");
    } catch {
      // Ignore storage failures.
    }
    setVisible(false);
  }

  const started = phase === "始動";

  return (
    <AnimatePresence onExitComplete={releaseScrollLock}>
      {visible && (
        <motion.div
          key="ignition-preloader"
          role="status"
          aria-live="polite"
          aria-label={
            started ? t.experience.readyAria : t.experience.preparingAria
          }
          initial={false}
          exit={
            instantExit || reducedMotion
              ? { opacity: 0 }
              : { clipPath: "inset(0 0 100% 0)", opacity: 1 }
          }
          transition={{
            duration: instantExit ? 0 : reducedMotion ? 0.12 : 0.66,
            ease: [0.76, 0, 0.24, 1],
          }}
          className="ignition-loader fixed inset-0 z-[300] isolate overflow-hidden bg-background"
        >
          <div aria-hidden className="japan-halftone absolute inset-0 opacity-25" />

          {/* El marco. Es el mismo rectángulo de .page-frame — mismo inset,
              mismas marcas de registro — y se traza línea por línea. */}
          <IgnitionFrame reducedMotion={reducedMotion} />

          <div className="ignition-shell relative flex h-full flex-col justify-between px-7 py-6 sm:px-12 sm:py-9 lg:px-16">
            <div className="flex items-start justify-between gap-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/45 sm:text-[11px]">
                BryanF Design
                {/* La secuencia completa envolvía a tres renglones en 390 px. */}
                <span className="hidden sm:inline">
                  <span className="mx-2 opacity-40">/</span>
                  {t.experience.startupSequence}
                </span>
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/45 sm:text-[11px]">
                <span className="sm:hidden">19.4326° N</span>
                <span className="hidden sm:inline">19.4326° N · 99.1332° W</span>
              </p>
            </div>

            {/* 日の丸 + 縦組み. El disco ancla y el kanji baja por su borde. */}
            <div className="ignition-stage relative flex flex-1 items-center justify-center">
              {/* En teléfono la fila (copy | regla | disco) no cabe en 390 px y
                  el disco se salía del viewport. Ahí se apila: primero el
                  disco con el kanji, la lectura debajo y centrada. */}
              <div className="relative z-10 flex flex-col-reverse items-center gap-8 sm:flex-row sm:items-center sm:gap-12">
                <div className="flex flex-col items-center gap-2 text-center sm:items-end sm:text-right">
                  <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary sm:text-xs">
                    {started
                      ? locale === "ja"
                        ? "shidō"
                        : `shidō / ${t.experience.start}`
                      : locale === "ja"
                        ? "junbi"
                        : `junbi / ${t.experience.prepare}`}
                  </p>
                  <p className="max-w-[14rem] text-xs leading-relaxed text-foreground/45 sm:text-sm">
                    {t.experience.loaderLine}
                  </p>
                </div>

                <span
                  aria-hidden
                  className="hidden w-px bg-foreground/15 sm:block sm:h-32"
                />

                {/* El disco vive aquí, detrás del kanji, no detrás de todo el
                    bloque: centrado en el conjunto tapaba la lectura. Así
                    queda como en los pósters — el disco sostiene la columna
                    vertical y el texto respira a un lado. */}
                <div className="relative grid place-items-center">
                  <Hinomaru active={started} reducedMotion={reducedMotion} />

                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={phase}
                      lang="ja"
                      initial={reducedMotion ? false : { opacity: 0, y: -14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
                      transition={{
                        duration: reducedMotion ? 0 : 0.42,
                        ease: [0.2, 0, 0, 1],
                      }}
                      className="tategaki-display ignition-kanji relative z-10 text-[clamp(3.5rem,13vh,7rem)] font-medium text-foreground"
                    >
                      {phase}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {/* La firma se decodifica desde ruido. Sin barra, sin logo. */}
              <Decoder
                target={SIGNATURE}
                active={started}
                reducedMotion={reducedMotion}
              />

              <div className="grid items-end gap-4 sm:grid-cols-[1fr_auto]">
                <div>
                  <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/45">
                    <span>
                      {started
                        ? t.experience.routeReady
                        : t.experience.aligning}
                    </span>
                    <span>{started ? "02 / 02" : "01 / 02"}</span>
                  </div>
                  <div className="h-px overflow-hidden bg-foreground/12">
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
                  className="min-h-11 justify-self-start font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/45 transition-colors hover:text-primary focus-visible:text-primary sm:justify-self-end"
                >
                  {t.experience.skip}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * El marco trazándose. Cuatro hairlines que crecen desde las esquinas y las
 * mismas marcas de registro que lleva `.page-frame`. Al terminar la salida,
 * el rectángulo que queda en pantalla es exactamente este.
 */
function IgnitionFrame({ reducedMotion }: { reducedMotion: boolean }) {
  // Cada hairline crece solo por su propio eje: escalar los dos a la vez deja
  // las horizontales con altura cero y las verticales con ancho cero.
  const draw = (axis: "x" | "y", delay: number) => ({
    initial: reducedMotion
      ? false
      : axis === "x"
        ? ({ scaleX: 0 } as const)
        : ({ scaleY: 0 } as const),
    animate: axis === "x" ? { scaleX: 1 } : { scaleY: 1 },
    transition: {
      duration: reducedMotion ? 0 : 0.62,
      delay: reducedMotion ? 0 : delay,
      ease: [0.2, 0, 0, 1] as const,
    },
  });

  return (
    <div
      aria-hidden
      // `ignition-frame` comparte con `.page-frame` la regla que lo retira por
      // debajo de 480 px: en teléfono el borde de la pantalla ya es el marco, y
      // si el preloader dibujara uno que después desaparece se rompería
      // justamente la continuidad que da sentido a la secuencia.
      className="ignition-frame pointer-events-none absolute"
      style={{
        top: "calc(var(--header-h) + var(--frame-inset))",
        right: "var(--frame-inset)",
        bottom: "var(--frame-inset)",
        left: "var(--frame-inset)",
      }}
    >
      <motion.span
        {...draw("x", 0.04)}
        className="absolute left-0 top-0 h-px w-full origin-left bg-foreground/20"
      />
      <motion.span
        {...draw("x", 0.12)}
        className="absolute bottom-0 left-0 h-px w-full origin-right bg-foreground/20"
      />
      <motion.span
        {...draw("y", 0.08)}
        className="absolute left-0 top-0 h-full w-px origin-top bg-foreground/20"
      />
      <motion.span
        {...draw("y", 0.16)}
        className="absolute right-0 top-0 h-full w-px origin-bottom bg-foreground/20"
      />

      {/* Marcas de registro: las mismas esquinas lima del marco de página. */}
      <motion.span
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: reducedMotion ? 0 : 0.5 }}
        className="absolute -left-px -top-px border-l border-t border-primary/55"
        style={{ width: "var(--frame-tick)", height: "var(--frame-tick)" }}
      />
      <motion.span
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: reducedMotion ? 0 : 0.56 }}
        className="absolute -bottom-px -right-px border-b border-r border-primary/55"
        style={{ width: "var(--frame-tick)", height: "var(--frame-tick)" }}
      />
    </div>
  );
}

/**
 * 日の丸 — el disco.
 *
 * Es el único lugar del sitio donde el bermellón aparece sólido y a gran
 * escala. Dura menos de dos segundos y no compite con ninguna acción, así que
 * el rojo sigue por debajo del 5% en la interfaz que se opera.
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
        initial={reducedMotion ? false : { scale: 0.24, opacity: 0 }}
        animate={{
          scale: active ? 1 : 0.86,
          opacity: active ? 1 : 0.82,
        }}
        transition={{
          duration: reducedMotion ? 0 : 1.15,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="block aspect-square w-[min(52vw,21rem)] rounded-full bg-signal"
        style={{ filter: "saturate(0.94)" }}
      />
      {/* Halo exterior: el disco recortado de los pósters nunca cierra limpio. */}
      <motion.span
        initial={reducedMotion ? false : { scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.35 }}
        transition={{
          duration: reducedMotion ? 0 : 1.3,
          delay: reducedMotion ? 0 : 0.12,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="absolute block aspect-square w-[min(66vw,27rem)] rounded-full border border-signal/40"
      />
    </div>
  );
}

/**
 * La firma resolviéndose desde ruido, de izquierda a derecha.
 *
 * Es el recurso de hirotos.com: en vez de una barra de progreso o un logo que
 * hace fade, una sola línea monoespaciada que pasa de basura a significado.
 * Comunica lo mismo que una barra —algo está terminando de cargar— pero
 * pertenece al mundo tipográfico del sitio.
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
    // ~34 fotogramas resuelven la cadena completa: bastante para leer el
    // gesto, corto para no retrasar la salida.
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
    <div className="flex items-center gap-4">
      <span
        aria-hidden
        className={`font-mono text-sm tracking-[0.42em] transition-colors duration-500 sm:text-base ${
          active ? "text-foreground" : "text-foreground/50"
        }`}
      >
        {text}
      </span>
      <span aria-hidden className="h-px flex-1 bg-foreground/12" />
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
