"use client";

import { useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

interface TiltProps {
  children: ReactNode;
  className?: string;
  /** Grados máximos de inclinación. */
  max?: number;
}

/**
 * Inclinación 3D que sigue al puntero (CSS transform, sin three.js): las
 * tarjetas se sienten físicas al pasar el mouse. Solo actúa en dispositivos
 * con hover real y se desactiva con reduced-motion — en touch no hace nada.
 */
export function Tilt({ children, className, max = 4 }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);

  function reset() {
    const el = ref.current;
    if (el) el.style.transform = "";
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg)`;
  }

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      className={cn("transition-transform duration-200 will-change-transform [transform-style:preserve-3d]", className)}
    >
      {children}
    </div>
  );
}
