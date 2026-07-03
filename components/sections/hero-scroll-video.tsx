"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

/**
 * Video currentTime is driven directly by scroll progress through a tall
 * pinned wrapper, scrubbing forward/backward exactly like a native <input
 * type="range"> bound to scroll — not autoplay. The section unpins once the
 * clip finishes so normal scrolling continues underneath.
 */
export function HeroScrollVideo() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    video.currentTime = progress * duration;
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const setMeta = () => setDuration(video.duration || 0);
    video.addEventListener("loadedmetadata", setMeta);
    if (video.readyState >= 1) setMeta();
    return () => video.removeEventListener("loadedmetadata", setMeta);
  }, []);

  const textOpacity = useTransform(scrollYProgress, [0.72, 0.88], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.72, 0.88], [24, 0]);

  return (
    <section
      ref={wrapperRef}
      aria-label="Historia de marca en video"
      className="relative h-[300vh]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-background">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src="/videos/hero-scroll.mp4"
          muted
          playsInline
          preload="auto"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />

        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center px-6 pb-16 md:pb-24"
        >
          <p className="max-w-2xl text-balance text-center font-display text-2xl font-medium tracking-tight text-foreground md:text-4xl">
            Así se ve el trabajo: una laptop abierta, código y una idea que no
            suelto hasta que funciona.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
