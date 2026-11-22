"use client";

import { useEffect, type RefObject } from "react";

import { isReducedMotionRequested } from "@/lib/motion-preference";

/** Resorte del sitio (Motion): stiffness 200, damping 20, mass 1. */
export const SPRING = { type: "spring", stiffness: 200, damping: 20, mass: 1 } as const;

/** Solo en pantallas con mouse (los gestos de hover no aplican al tacto). */
function finePointer() {
  return typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/**
 * Preset 09 · Parallax de 8 px: el elemento se desplaza como máximo ±8 px
 * contra el scroll, con requestAnimationFrame y transform, solo mientras está
 * en pantalla. Apagado con movimiento reducido.
 */
export function useParallax8(ref: RefObject<HTMLElement>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || isReducedMotionRequested()) return;
    let ticking = false;
    const update = () => {
      ticking = false;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const center = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
      const y = Math.max(-8, Math.min(8, center * -16));
      el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref]);
}

/**
 * Botón magnético (escritorio): el botón sigue levemente al cursor (máx.
 * 6 px) y vuelve con resorte de 300 ms al salir. Solo transform.
 */
export function useMagnetic(ref: RefObject<HTMLElement>, strength = 0.18) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !finePointer() || isReducedMotionRequested()) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = Math.max(-6, Math.min(6, (e.clientX - (r.left + r.width / 2)) * strength));
      const y = Math.max(-6, Math.min(6, (e.clientY - (r.top + r.height / 2)) * strength));
      el.style.setProperty("--mx", `${x.toFixed(1)}px`);
      el.style.setProperty("--my", `${y.toFixed(1)}px`);
    };
    const onLeave = () => {
      el.style.setProperty("--mx", "0px");
      el.style.setProperty("--my", "0px");
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [ref, strength]);
}

/**
 * Tilt 3D sutil (casos): la tarjeta se inclina hacia el cursor, máximo 4° en
 * cada eje, con perspectiva, y vuelve al reposo al salir.
 */
export function useTilt(ref: RefObject<HTMLElement>, max = 4) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !finePointer() || isReducedMotionRequested()) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty("--ry-t", `${(px * 2 * max).toFixed(2)}deg`);
      el.style.setProperty("--rx-t", `${(-py * 2 * max).toFixed(2)}deg`);
    };
    const onLeave = () => {
      el.style.setProperty("--ry-t", "0deg");
      el.style.setProperty("--rx-t", "0deg");
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [ref, max]);
}
