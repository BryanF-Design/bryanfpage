"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { animate } from "framer-motion";

import { isReducedMotionRequested } from "@/lib/motion-preference";
import { cn } from "@/lib/utils";

/**
 * Iconos con gesto semántico (patrón itshover.com/icons): al pasar el mouse
 * (o enfocar) el enlace o botón que contiene al icono, el icono hace UN gesto
 * corto que dice lo que hace el servicio y vuelve al reposo. Todo con Motion,
 * misma duración y easing en todo el sitio, solo transform y opacity, y con
 * movimiento reducido no se mueve.
 */
export type Gesture =
  | "design" // se levanta 4 px y su subrayado lima crece
  | "code" // parpadeo de cursor, como si escribiera
  | "morph" // círculo a cuadrado redondeado (UX/UI)
  | "gear" // engrane que gira 45° y vuelve (software)
  | "heart" // latido suave 1.06× (WhatsApp, mantenimiento)
  | "lumina" // giro leve de 8° con brillo lima
  | "lift" // elevación de 2 px (redes, contacto)
  | "rocket" // despega ~6 px en diagonal
  | "toggle"; // círculo que se vuelve toggle en lima (Barber OS)

export const GESTURE_DURATION = 0.36;
export const GESTURE_EASE = [0.22, 1, 0.36, 1] as const;

type Frames = Record<string, number[] | string[]>;

const FRAMES: Record<Gesture, { icon?: Frames; accent?: Frames }> = {
  design: { icon: { y: [0, -4, 0] }, accent: { scaleX: [0, 1, 0] } },
  code: { icon: { opacity: [1, 0.15, 1, 0.15, 1] } },
  morph: { icon: { scale: [1, 0.9, 1] }, accent: { opacity: [0, 1, 0] } },
  gear: { icon: { rotate: [0, 45, 0] } },
  heart: { icon: { scale: [1, 1.06, 1] } },
  lumina: { icon: { rotate: [0, 8, 0] }, accent: { opacity: [0, 1, 0] } },
  lift: { icon: { y: [0, -2, 0] } },
  rocket: { icon: { x: [0, 4, 0], y: [0, -4, 0] } },
  toggle: { icon: { x: [0, 3, 0] }, accent: { opacity: [0, 1, 0] } },
};

export function GestureIcon({
  gesture,
  children,
  className,
}: {
  gesture: Gesture;
  children: ReactNode;
  className?: string;
}) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);
  const accentRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    // El gesto lo dispara todo el enlace o botón, no solo el icono.
    const host = (root.closest("a, button, [data-gesture-host]") as HTMLElement | null) ?? root;
    let busy = false;
    const run = () => {
      if (busy || isReducedMotionRequested()) return;
      busy = true;
      const { icon, accent } = FRAMES[gesture];
      const options = { duration: GESTURE_DURATION, ease: GESTURE_EASE };
      const jobs = [];
      if (icon && iconRef.current) jobs.push(animate(iconRef.current, icon, options));
      if (accent && accentRef.current) jobs.push(animate(accentRef.current, accent, options));
      Promise.all(jobs.map((j) => j.then(() => undefined))).finally(() => {
        busy = false;
      });
    };
    host.addEventListener("pointerenter", run);
    host.addEventListener("focusin", run);
    return () => {
      host.removeEventListener("pointerenter", run);
      host.removeEventListener("focusin", run);
    };
  }, [gesture]);

  const hasAccent = !!FRAMES[gesture].accent;

  return (
    <span ref={rootRef} className={cn("relative inline-grid place-items-center", className)}>
      <span ref={iconRef} className="inline-grid place-items-center will-change-transform">
        {children}
      </span>
      {hasAccent && gesture === "design" && (
        <span
          ref={accentRef}
          aria-hidden
          className="absolute -bottom-1 left-[15%] right-[15%] h-[2px] origin-left scale-x-0 rounded-full bg-lime"
        />
      )}
      {hasAccent && gesture !== "design" && (
        <span
          ref={accentRef}
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-[-35%] rounded-full opacity-0",
            gesture === "morph"
              ? "rounded-[30%] ring-2 ring-lime"
              : gesture === "toggle"
                ? "inset-[-20%] rounded-full bg-lime/40"
                : "bg-[radial-gradient(closest-side,hsl(var(--lime)/0.55),transparent)]"
          )}
        />
      )}
    </span>
  );
}
