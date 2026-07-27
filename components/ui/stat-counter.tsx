"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

import { useReducedMotionPreference } from "@/lib/motion-preference";

interface StatCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function StatCounter({ value, prefix = "", suffix = "", className }: StatCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reducedMotion = useReducedMotionPreference();
  // Keep the verified value in the initial HTML. Starting at zero makes
  // crawlers and no-JavaScript users see false proof points.
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(value);
      return;
    }
    if (!inView) return;
    const duration = 1200;
    const start = performance.now();
    let frame = 0;

    setDisplay(0);

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reducedMotion, value]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
