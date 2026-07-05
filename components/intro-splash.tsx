"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SEEN_KEY = "bfd-intro-seen";
const MIN_VISIBLE_MS = 900;
const MAX_VISIBLE_MS = 2500;

export function IntroSplash() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const alreadySeen = sessionStorage.getItem(SEEN_KEY);

    if (reduced || alreadySeen) return;

    setVisible(true);
    document.body.style.overflow = "hidden";

    const shownAt = Date.now();

    function close() {
      const elapsed = Date.now() - shownAt;
      const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
      window.setTimeout(() => {
        sessionStorage.setItem(SEEN_KEY, "1");
        setClosing(true);
        document.body.style.overflow = "";
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
      window.removeEventListener("load", close);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence onExitComplete={() => setVisible(false)}>
      {visible && !closing && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-6 bg-background"
        >
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          >
            BryanF <span className="text-primary">Design</span>
          </motion.span>
          <div className="h-0.5 w-40 overflow-hidden rounded-full bg-border sm:w-48">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 1.1, ease: "easeInOut", repeat: Infinity, repeatType: "loop" }}
              className="h-full w-full bg-primary"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
