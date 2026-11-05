"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";

import { cn } from "@/lib/utils";

import { cvStyles as s } from "./cv-parts";

const SEEN_KEY = "cv-preloaded";

/**
 * Intro corta (~1.5 s): logo, Lumina y una barra de carga por segmentos.
 * Llega en el HTML y se desvanece sola con CSS, así que nunca bloquea aunque
 * el JavaScript tarde. En la misma sesión ya no vuelve a salir.
 */
export function CvPreloader({ label }: { label: string }) {
  const [done, setDone] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(SEEN_KEY) === "1") {
        setDone(true);
        return;
      }
      window.sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* storage bloqueado */
    }
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(100, Math.round(((now - t0) / 1400) * 100));
      setPct(p);
      if (p < 100) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const id = window.setTimeout(() => setDone(true), 2100);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(id);
    };
  }, []);

  return (
    <div aria-hidden className={cn(s.preloader, done && s.preloaderDone, "print:hidden")}>
      <div className="flex w-[min(22rem,80vw)] flex-col items-center">
        <Image
          src="/img/brand/lumina-normal.webp"
          alt=""
          width={864}
          height={1121}
          priority
          sizes="110px"
          className={cn(s.preloaderLumina, "h-auto w-[92px] drop-shadow-[0_12px_20px_rgb(0_0_0/0.6)]")}
        />
        <Image
          src="/img/brand/logo-light.png"
          alt=""
          width={720}
          height={253}
          priority
          sizes="150px"
          className="mt-4 h-auto w-[140px]"
        />
        <div className={cn(s.loadBar, "mt-6 w-full")}>
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} style={{ "--i": i } as CSSProperties} />
          ))}
        </div>
        <div className={cn(s.pixel, "mt-3 flex w-full justify-between text-[0.7rem] uppercase text-[var(--cv-lime)]")}>
          <span>
            {label}
            <span className={s.blink}>_</span>
          </span>
          <span className="tabular-nums">{String(pct).padStart(3, "0")}%</span>
        </div>
      </div>
    </div>
  );
}
