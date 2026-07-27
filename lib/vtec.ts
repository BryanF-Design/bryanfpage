"use client";

import { useEffect } from "react";

/**
 * El easter egg de VTEC.
 *
 * Teclea "vtec" en cualquier parte del sitio y el nivel sube a 1 y vuelve a 0:
 * el tacómetro entra en zona roja y al Type R se le encienden los faros. Vive
 * en un módulo suelto y no en un contexto de React a propósito — quien lo lee
 * es un bucle de rAF y una escena de three.js, y ninguno de los dos quiere
 * provocar re-renders sesenta veces por segundo.
 */

const CODE = "vtec";
const RISE = 260;
const HOLD = 900;
const FALL = 700;

/** 0 = ralentí, 1 = zona roja. Se lee directo desde ticks y bucles de rAF. */
export const vtecLevel = { current: 0 };

type Listener = (level: number) => void;
const listeners = new Set<Listener>();

/** Avisa a quien sí necesita re-renderizar (el tacómetro pinta un badge). */
export function subscribeVtec(fn: Listener) {
  listeners.add(fn);
  // Devuelve void, no el boolean de Set.delete: así sirve tal cual como
  // función de limpieza de useEffect.
  return () => {
    listeners.delete(fn);
  };
}

let raf = 0;

export function triggerVtec() {
  if (raf) return; // ya está acelerando: no se reinicia a media subida
  const start = performance.now();
  const total = RISE + HOLD + FALL;

  const step = (now: number) => {
    const t = now - start;
    let level: number;
    if (t < RISE) level = t / RISE;
    else if (t < RISE + HOLD) level = 1;
    else level = Math.max(0, 1 - (t - RISE - HOLD) / FALL);

    vtecLevel.current = level;
    listeners.forEach((fn) => fn(level));

    if (t < total) {
      raf = requestAnimationFrame(step);
    } else {
      vtecLevel.current = 0;
      listeners.forEach((fn) => fn(0));
      raf = 0;
    }
  };
  raf = requestAnimationFrame(step);
}

/**
 * Escucha el código. Se monta una sola vez, en el layout.
 * Ignora las teclas mientras escribes en un campo — nadie quiere que su
 * mensaje a Lumina dispare el tacómetro.
 */
export function useVtecKeys() {
  useEffect(() => {
    let buffer = "";

    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      if (
        el &&
        (el.isContentEditable ||
          el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.tagName === "SELECT")
      ) {
        return;
      }
      if (e.key.length !== 1) return;

      buffer = (buffer + e.key.toLowerCase()).slice(-CODE.length);
      if (buffer === CODE) {
        buffer = "";
        triggerVtec();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}
