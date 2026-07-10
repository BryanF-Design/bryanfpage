"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface LazyMountProps {
  children: ReactNode;
  /** Placeholder shown until the children mount (keeps layout stable). */
  fallback?: ReactNode;
  /** How early to mount, as an IntersectionObserver rootMargin. */
  rootMargin?: string;
  className?: string;
}

/**
 * Mounts children only when the wrapper approaches the viewport. Paired with
 * next/dynamic(ssr:false) this defers both the download AND the execution of
 * heavy chunks (three.js) until the user is about to see them — the initial
 * bundle and TBT stay untouched.
 */
export function LazyMount({ children, fallback, rootMargin = "400px", className }: LazyMountProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || show) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [show, rootMargin]);

  return (
    <div ref={ref} className={className}>
      {show ? children : fallback ?? null}
    </div>
  );
}
