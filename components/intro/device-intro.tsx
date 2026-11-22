"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import dynamic from "next/dynamic";

import { useLanguage } from "@/lib/i18n/context";
import {
  isReducedMotionRequested,
  subscribeReducedMotionPreference,
} from "@/lib/motion-preference";
import type { ScreenStrings } from "./screen-canvas";
import type { Phase, Variant } from "./device-intro-canvas";

// three.js y la escena se descargan solo cuando la intro va a correr.
const IntroCanvas = dynamic(() => import("./device-intro-canvas").then((m) => m.IntroCanvas), {
  ssr: false,
});


/** Teléfono en pantallas angostas o verticales; laptop en el resto. */
const PHONE_QUERY = "(max-width: 767px), (max-aspect-ratio: 3/4)";
/** Desde aquí el hero arranca su entrada (la pantalla ya casi llena la vista). */
const ENTER_AT = 0.7;
/** Desde aquí la escena ya es transparente (y la capa se retira al final). */
const DONE_AT = 0.95;


const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Revisión 2 · la intro pasa UNA sola vez por sesión. La marca se guarda al
 * primer scroll hacia abajo o al tocar "Saltar" (sessionStorage; si no hay,
 * en memoria para esta carga). Con la marca, la intro ya no existe: al subir
 * se ve el hero normal, también al volver a la home en la misma pestaña.
 */
export const INTRO_SEEN_KEY = "bfd-intro-seen";
let seenInMemory = false;
function introSeen() {
  if (seenInMemory) return true;
  // Llegar con un ancla (/#precios, /#configurador…) es ir directo a algo.
  if (window.location.hash.length > 1) return true;
  try {
    return window.sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}
function markIntroSeen() {
  seenInMemory = true;
  try {
    window.sessionStorage.setItem(INTRO_SEEN_KEY, "1");
  } catch {
    /* sin almacenamiento: queda la marca en memoria */
  }
}

/**
 * 起動 — la entrada de la home.
 *
 * Una laptop (o un teléfono, en móvil) se enciende y en su pantalla corre el
 * preloader. Al deslizar, la cámara entra a la pantalla; cuando la llena, la
 * escena se desvanece y debajo queda el hero, que en ese momento arma sus
 * paneles. La sección mide 230svh y se monta 100svh sobre el hero (margen
 * negativo), así que al terminar el recorrido el hero ya está en su lugar.
 *
 * Sin JS, con movimiento reducido o sin WebGL, la sección no existe y la
 * página empieza en el hero como siempre.
 */
export function DeviceIntro() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const stringsRef = useRef<ScreenStrings>({
    sequence: "",
    aligning: "",
    ready: "",
    enter: "",
  });
  stringsRef.current = {
    sequence: t.experience.startupSequence,
    aligning: t.experience.aligning,
    ready: t.experience.systemOnline,
    enter: t.experience.enterHint,
  };

  const [variant, setVariant] = useState<Variant | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [failed, setFailed] = useState(false);
  const [phase, setPhase] = useState<Phase>("loading");
  // La intro ya se vio (o terminó en esta carga): la sección desaparece.
  const [gone, setGone] = useState(false);
  const [loadPct, setLoadPct] = useState(0);

  // Preferencias: movimiento reducido apaga la intro. En teléfono (o pantalla
  // vertical) la intro y su preloader NO existen: el hero con el precio y el
  // WhatsApp va primero y three.js ni se descarga. En escritorio se queda.
  useIsoLayoutEffect(() => {
    const root = document.documentElement;
    const mq = window.matchMedia(PHONE_QUERY);
    const syncMotion = () => {
      const reduced = isReducedMotionRequested();
      const phone = mq.matches;
      const seen = introSeen();
      if (seen) setGone(true);
      const webgl = hasWebGL();
      setEnabled(!reduced && !phone && !seen && webgl);
      // Solo se escribe en <html> si cambia algo: el aviso de movimiento
      // reducido observa sus atributos y una escritura igual lo redispara.
      if (reduced || phone || seen || !webgl) {
        if (root.dataset.intro !== "off" && root.dataset.intro !== "entered") root.dataset.intro = "off";
        if (root.classList.contains("intro-lock")) root.classList.remove("intro-lock");
        if (!webgl || seen) setGone(true);
      }
    };
    syncMotion();

    const pick = () => {
      setVariant(mq.matches ? "phone" : "laptop");
      syncMotion();
    };
    pick();
    mq.addEventListener("change", pick);
    const unsubscribe = subscribeReducedMotionPreference(syncMotion);

    return () => {
      mq.removeEventListener("change", pick);
      unsubscribe();
      delete root.dataset.intro;
      root.classList.remove("intro-lock", "intro-live");
    };
  }, []);

  // Revisión 2 · la intro es una capa fija, fuera del flujo: el hero vive
  // arriba de la página desde el inicio. Mientras la intro corre, la página
  // no se desplaza: la rueda, el teclado y el gesto táctil mueven la cámara
  // (el mismo recorrido de 130 % de pantalla que antes). Al llegar al final
  // la capa se quita sin mover nada del documento (sin salto ni CLS), el
  // header queda a la vista y no hay intro a la cual volver al subir.
  const skipRef = useRef<() => void>(() => {});
  useIsoLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || !enabled || failed || gone) return;
    const root = document.documentElement;
    root.classList.add("intro-live", "intro-lock");
    let target = 0;
    let shown = 0;
    let raf = 0;
    let finished = false;
    let touchY: number | null = null;
    const distance = () => window.innerHeight * 1.3;

    const apply = () => {
      progressRef.current = shown;
      section.style.setProperty("--intro-p", shown.toFixed(4));
      section.dataset.state = shown >= DONE_AT ? "done" : "active";
      if (shown >= ENTER_AT) root.dataset.intro = "entered";
      else if (root.dataset.intro !== "entered") root.dataset.intro = "pending";
    };
    const finish = () => {
      if (finished) return;
      finished = true;
      markIntroSeen();
      section.style.display = "none";
      root.classList.remove("intro-lock");
      root.dataset.intro = "entered";
      setGone(true);
      setEnabled(false);
    };
    const tick = () => {
      raf = 0;
      const d = target - shown;
      shown = Math.abs(d) < 0.002 ? target : shown + d * 0.16;
      apply();
      if (target >= 1 && shown >= 0.998) {
        finish();
        return;
      }
      if (shown !== target) raf = requestAnimationFrame(tick);
    };
    const push = (delta: number) => {
      if (finished || !delta) return;
      // Primer gesto hacia abajo: la marca de "ya vista" se guarda ahora.
      if (delta > 0) markIntroSeen();
      target = Math.min(1, Math.max(0, target + delta / distance()));
      if (!raf) raf = requestAnimationFrame(tick);
    };
    skipRef.current = () => {
      markIntroSeen();
      target = 1;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      push(e.deltaMode === 1 ? e.deltaY * 40 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY);
    };
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
      const vh = window.innerHeight;
      const map: Record<string, number> = {
        ArrowDown: 80,
        ArrowUp: -80,
        PageDown: vh * 0.9,
        PageUp: -vh * 0.9,
        End: distance(),
        Home: -distance(),
      };
      let delta = map[e.key];
      if (e.key === " " && !(el && /^(BUTTON|A)$/.test(el.tagName))) delta = (e.shiftKey ? -1 : 1) * vh * 0.9;
      if (delta === undefined) return;
      e.preventDefault();
      push(delta);
    };
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY;
      if (touchY === null || y === undefined) return;
      e.preventDefault();
      push((touchY - y) * 1.4);
      touchY = y;
    };
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointerRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };

    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    apply();
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("intro-lock");
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [enabled, failed, gone]);

  useEffect(() => {
    if (!failed) return;
    const root = document.documentElement;
    root.dataset.intro = "entered";
    root.classList.remove("intro-lock");
  }, [failed]);

  function skip() {
    skipRef.current();
  }

  const statusText =
    phase === "loading"
      ? `${t.experience.modelLoading} · ${loadPct}%`
      : phase === "ready"
        ? t.experience.readyAria
        : t.experience.preparingAria;

  return (
    <section
      ref={sectionRef}
      aria-label={t.experience.introAria}
      className={failed || gone ? "device-intro hidden" : "device-intro"}
      data-variant={variant ?? undefined}
    >
      <div className="device-intro__stage">
        <div aria-hidden className="device-intro__glow" />
        {enabled && variant && !failed && (
          <IntroCanvas
            key={variant}
            variant={variant}
            progressRef={progressRef}
            pointerRef={pointerRef}
            stringsRef={stringsRef}
            onLoadProgress={setLoadPct}
            onPhase={setPhase}
            onError={() => setFailed(true)}
          />
        )}

        <p role="status" aria-live="polite" className="sr-only">
          {statusText}
        </p>
        <p
          aria-hidden
          data-show={phase === "loading" && loadPct < 100}
          className="device-intro__loading text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60"
        >
          {t.experience.modelLoading} · {String(loadPct).padStart(2, "0")}%
        </p>

        <p
          data-show={phase === "ready"}
          className="device-intro__hint text-[11px] font-semibold uppercase tracking-[0.24em] text-white/75"
        >
          {t.experience.enterHint}
          <span aria-hidden className="device-intro__chev" />
        </p>
        <button
          type="button"
          onClick={skip}
          className="device-intro__skip min-h-11 rounded-full border border-white/15 bg-white/5 px-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/75 backdrop-blur transition-colors hover:border-lime hover:bg-lime hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
        >
          {t.experience.skip}
        </button>
      </div>
    </section>
  );
}

/** ¿Hay WebGL? Se prueba UNA vez por carga (cada prueba crea un contexto). */
let webglCache: boolean | null = null;
function hasWebGL() {
  if (webglCache !== null) return webglCache;
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") || canvas.getContext("webgl")) as WebGLRenderingContext | null;
    webglCache = !!gl;
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webglCache = false;
  }
  return webglCache;
}
