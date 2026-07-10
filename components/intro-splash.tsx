"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SEEN_KEY = "bfd-intro-seen";
const MIN_VISIBLE_MS = 1000;
const MAX_VISIBLE_MS = 2400;

/**
 * Preloader "boot de taller": contador mono + barra de progreso lima y una
 * cortina que sube para revelar el sitio. Solo la primera vista de la sesión,
 * nunca con reduced-motion, y con tope duro de 2.4s — el preloader es un
 * saludo, no una sala de espera.
 */
export function IntroSplash() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadySeen = sessionStorage.getItem(SEEN_KEY);

    if (reduced || alreadySeen) return;

    setVisible(true);
    document.body.style.overflow = "hidden";

    const shownAt = Date.now();

    // El porcentaje es teatro honesto: avanza rápido hasta 90 y solo llega a
    // 100 cuando la página realmente terminó de cargar (o al tope de tiempo).
    const ticker = window.setInterval(() => {
      setPct((p) => (p < 90 ? p + Math.max(1, Math.round((90 - p) / 8)) : p));
    }, 80);

    function close() {
      const elapsed = Date.now() - shownAt;
      const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
      window.setTimeout(() => {
        window.clearInterval(ticker);
        setPct(100);
        sessionStorage.setItem(SEEN_KEY, "1");
        window.setTimeout(() => {
          setClosing(true);
          document.body.style.overflow = "";
        }, 220);
      }, wait);
    }

    const maxTimer = window.setTimeout(close, MAX_VISIBLE_MS);

    if (document.readyState === "complete") {
      close();
    } else {
      window.addEventListener("load", close, { once: true });
    }

    return () => {
      window.clearTimeout(maxTimer);
      window.clearInterval(ticker);
      window.removeEventListener("load", close);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence onExitComplete={() => setVisible(false)}>
      {visible && !closing && (
        <motion.div
          exit={{ y: "-100%" }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[200] flex flex-col justify-between bg-background px-6 py-8 sm:px-10"
          aria-hidden
        >
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            <span>BryanF Design</span>
            <span>CDMX · MX</span>
          </div>

          <div className="flex flex-col items-start gap-6">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="font-display text-4xl font-bold uppercase tracking-tight text-foreground sm:text-6xl"
            >
              Haz que <span className="text-primary">pase.</span>
            </motion.span>
            <div className="flex w-full max-w-md items-center gap-4">
              <div className="h-px flex-1 overflow-hidden bg-border">
                <motion.div
                  className="h-full bg-primary"
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.15, ease: "linear" }}
                />
              </div>
              <span className="w-12 text-right font-mono text-sm text-primary">
                {pct}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            <span>Diseño + código</span>
            <span>{new Date().getFullYear()}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
