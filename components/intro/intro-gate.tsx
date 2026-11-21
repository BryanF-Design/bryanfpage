"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { useLanguage } from "@/lib/i18n/context";

// three.js y la escena solo se descargan si el arranque decidió que la intro
// corre (escritorio, puntero fino, sin movimiento reducido, primera vez en la
// sesión). En móvil este import nunca se pide.
const DeviceIntro = dynamic(
  () => import("@/components/intro/device-intro").then((m) => m.DeviceIntro),
  { ssr: false }
);

/** Consulta de escritorio: la misma que usa `INTRO_BOOTSTRAP`. */
export const INTRO_DESKTOP_QUERY = "(min-width: 1024px) and (pointer: fine) and (min-aspect-ratio: 3/4)";

/** Si el modelo no está listo en este tiempo (ms desde que arranca la página), no hay intro. */
const INTRO_DEADLINE_MS = 1200;

/**
 * Corre en el cuerpo, antes de pintar el hero. Decide si hay intro y deja el
 * telón listo: "Saltar" funciona desde el primer instante (clic delegado, sin
 * esperar a React) y un corte por tiempo garantiza que nunca se quede puesto.
 */
export const INTRO_BOOTSTRAP = `(function(){try{var d=document.documentElement,w=window;var r=w.matchMedia("(prefers-reduced-motion: reduce)").matches||d.classList.contains("a11y-reduce-motion");var k=w.matchMedia(${JSON.stringify(
  INTRO_DESKTOP_QUERY
)}).matches;var s=false;try{s=sessionStorage.getItem("bf-intro")==="1"}catch(e){}var on=!r&&k&&!s;d.dataset.intro=on?"pending":"off";if(!on)return;var l=document.createElement("link");l.rel="preload";l.as="fetch";l.href="/models/intro/laptop.glb";l.crossOrigin="anonymous";document.head.appendChild(l);var end=function(){if(d.dataset.intro==="pending")d.dataset.intro="entered"};document.addEventListener("click",function(e){if(e.target&&e.target.closest&&e.target.closest(".intro-skip"))end()});document.addEventListener("keydown",function(e){if(e.key==="Escape")end()});setTimeout(function(){if(!d.dataset.introLoaded)end()},${INTRO_DEADLINE_MS})}catch(e){}})();`;

/**
 * Telón de la intro (en el HTML del servidor) + la escena 3D cuando toca.
 * El telón solo se ve con `html[data-intro="pending"]` (ver globals.css).
 */
export function IntroGate() {
  const { t } = useLanguage();
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (document.documentElement.dataset.intro === "pending") setRun(true);
  }, []);

  return (
    <>
      <div className="intro-veil" role="presentation">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/img/brand/logo-light.png"
          alt=""
          width={200}
          height={60}
          className="intro-veil__logo"
          decoding="async"
        />
        <span aria-hidden className="intro-veil__bar" />
        <button
          type="button"
          className="intro-skip intro-veil__skip min-h-11 rounded-full border border-white/15 bg-white/5 px-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/75 transition-colors hover:border-lime hover:bg-lime hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
        >
          {t.experience.skip}
        </button>
      </div>
      {run && <DeviceIntro />}
    </>
  );
}
