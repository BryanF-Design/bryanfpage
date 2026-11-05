"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { useDecorative3dEnabled } from "@/lib/motion-preference";

import { cvStyles as s } from "./cv-parts";

// three.js viaja en su propio chunk y solo se pide cuando el navegador está
// libre: el primer pintado no espera por WebGL.
const CvScene = dynamic(() => import("./cv-scene"), { ssr: false });

/**
 * Fondo de la consola. El piso de cuadrícula y las estrellas son CSS puro
 * (llegan con el HTML, en cualquier teléfono); encima, en escritorio con
 * movimiento permitido, se monta la escena WebGL cuando hay tiempo libre.
 */
export function CvBackdrop({ levelIndex }: { levelIndex: number }) {
  const webgl = useDecorative3dEnabled();
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    if (!webgl) return;
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setIdle(true), { timeout: 2000 });
      return () => w.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(() => setIdle(true), 900);
    return () => window.clearTimeout(id);
  }, [webgl]);

  return (
    <div aria-hidden className={s.backdrop}>
      <div className={s.sky} />
      <div className={s.horizon} />
      <div className={s.floorWrap}>
        <div className={s.floor} />
      </div>
      {webgl && idle ? (
        <div className={s.webgl}>
          <CvScene levelIndex={levelIndex} />
        </div>
      ) : null}
      <div className={s.scanlines} />
    </div>
  );
}
