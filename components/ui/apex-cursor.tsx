"use client";

import { useEffect, useRef } from "react";

/** Elementos accionables: sobre ellos la retícula se abre y late. */
const INTERACTIVE =
  'a, button, [role="button"], summary, label, select, [data-cursor="target"]';
/** Campos de texto: ahí manda la barra nativa, no una retícula. */
const TEXT_FIELD =
  'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]), textarea, [contenteditable="true"]';

/**
 * Cursor HUD: la retícula de ápex del taller.
 *
 * Es la pieza que más se siente y la que más fácil se rompe, así que trae
 * frenos por todos lados:
 *  - solo con puntero fino y pantalla grande (en touch no existe el hover),
 *  - se apaga entero con `prefers-reduced-motion` o con el modo de movimiento
 *    reducido del panel de accesibilidad,
 *  - sobre campos de texto se retira y devuelve el cursor nativo, porque una
 *    retícula no te dice dónde vas a escribir,
 *  - la posición se escribe directo al DOM dentro de un rAF con interpolación;
 *    ni un solo re-render de React por movimiento del ratón.
 */
export function ApexCursor() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const fine = window.matchMedia("(pointer: fine)");
    const wide = window.matchMedia("(min-width: 1024px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const a11yReduced = document.documentElement.classList.contains(
      "a11y-reduce-motion"
    );
    if (!fine.matches || !wide.matches || reduced.matches || a11yReduced) return;

    document.documentElement.classList.add("apex-cursor-on");

    // La retícula persigue al puntero con retraso: da la sensación de masa,
    // de instrumento que sigue la trazada en lugar de estar pegado a ella.
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let renderX = x;
    let renderY = y;
    let raf = 0;
    let visible = false;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        visible = true;
        renderX = x;
        renderY = y;
        root.dataset.visible = "true";
      }
    };

    const onLeave = () => {
      visible = false;
      root.dataset.visible = "false";
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (!target?.closest) return;
      root.dataset.hidden = target.closest(TEXT_FIELD) ? "true" : "false";
      root.dataset.active = target.closest(INTERACTIVE) ? "true" : "false";
    };

    // Al soltar el clic se marca el punto: el "apex hit".
    const onDown = () => {
      root.dataset.press = "true";
    };
    const onUp = () => {
      root.dataset.press = "false";
    };

    const loop = () => {
      renderX += (x - renderX) * 0.22;
      renderY += (y - renderY) * 0.22;
      root.style.transform = `translate3d(${renderX.toFixed(2)}px, ${renderY.toFixed(
        2
      )}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      document.documentElement.classList.remove("apex-cursor-on");
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="apex-cursor"
      data-visible="false"
      data-active="false"
      data-hidden="false"
      data-press="false"
    >
      <svg viewBox="0 0 64 64" width="64" height="64">
        {/* Retícula: cuatro marcas de instrumento y el punto de ápex. */}
        <g
          className="apex-cursor__ticks"
          stroke="hsl(var(--primary))"
          strokeWidth="1.1"
          strokeLinecap="round"
        >
          <line x1="32" y1="19" x2="32" y2="25" />
          <line x1="32" y1="39" x2="32" y2="45" />
          <line x1="19" y1="32" x2="25" y2="32" />
          <line x1="39" y1="32" x2="45" y2="32" />
        </g>
        <circle
          className="apex-cursor__ring"
          cx="32"
          cy="32"
          r="13"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1"
          strokeDasharray="3 5"
        />
        <circle className="apex-cursor__dot" cx="32" cy="32" r="1.9" fill="hsl(var(--primary))" />

        {/* Spider-sense: tres arcos que salen al detectar algo accionable.
            Van arriba a la derecha, por delante de la trazada. */}
        <g
          className="apex-cursor__sense"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1.4"
          strokeLinecap="round"
        >
          <path d="M 40 26 A 11 11 0 0 1 45 32" />
          <path d="M 43.5 22.5 A 16 16 0 0 1 50 32" />
          <path d="M 47 19 A 21 21 0 0 1 55 32" />
        </g>
      </svg>
    </div>
  );
}
