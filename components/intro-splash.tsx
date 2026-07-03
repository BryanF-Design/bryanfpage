"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SEEN_KEY = "bfd-intro-seen";

export function IntroSplash() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const alreadySeen = sessionStorage.getItem(SEEN_KEY);

    if (reduced || alreadySeen) return;

    setVisible(true);
    document.body.style.overflow = "hidden";

    // Safety net in case the video stalls or fails to load.
    const fallback = window.setTimeout(close, 6000);

    function close() {
      window.clearTimeout(fallback);
      sessionStorage.setItem(SEEN_KEY, "1");
      setClosing(true);
      document.body.style.overflow = "";
    }

    const video = videoRef.current;
    video?.addEventListener("ended", close);

    return () => {
      window.clearTimeout(fallback);
      video?.removeEventListener("ended", close);
      document.body.style.overflow = "";
    };
  }, []);

  function handleSkip() {
    sessionStorage.setItem(SEEN_KEY, "1");
    setClosing(true);
    document.body.style.overflow = "";
  }

  return (
    <AnimatePresence
      onExitComplete={() => setVisible(false)}
    >
      {visible && !closing && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background"
        >
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            src="/videos/intro-splash.mp4"
            autoPlay
            muted
            playsInline
            preload="auto"
          />
          <button
            type="button"
            onClick={handleSkip}
            className="absolute bottom-6 right-6 rounded-full border border-foreground/20 bg-background/40 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-foreground/80 backdrop-blur transition-colors hover:border-primary hover:text-primary"
          >
            Saltar
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
