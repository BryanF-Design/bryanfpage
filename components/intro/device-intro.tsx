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
/** Desde aquí la escena ya es transparente y deja pasar los clics al hero. */
const DONE_AT = 0.95;


const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

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
      setEnabled(!reduced && !phone && hasWebGL());
      if (reduced || phone) root.dataset.intro = "off";
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
    };
  }, []);

  // Progreso de scroll → CSS (fundido, pista) y atributos del documento.
  useIsoLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || !enabled || failed) return;
    const root = document.documentElement;
    let raf = 0;

    const measure = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      // Sin altura (estilos aún sin aplicar) no hay recorrido: se queda al inicio.
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      progressRef.current = p;
      section.style.setProperty("--intro-p", p.toFixed(4));
      section.dataset.state = p >= DONE_AT ? "done" : "active";
      if (p >= ENTER_AT) root.dataset.intro = "entered";
      else if (root.dataset.intro !== "entered") root.dataset.intro = "pending";
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointerRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [enabled, failed]);

  useEffect(() => {
    if (!failed) return;
    document.documentElement.dataset.intro = "entered";
  }, [failed]);

  function skip() {
    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    window.scrollTo({
      top: window.scrollY + rect.bottom - window.innerHeight,
      behavior: isReducedMotionRequested() ? "auto" : "smooth",
    });
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
      className={failed ? "device-intro hidden" : "device-intro"}
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

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}
