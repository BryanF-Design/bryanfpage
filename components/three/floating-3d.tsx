"use client";

import dynamic from "next/dynamic";

import { LazyMount } from "@/components/three/lazy-mount";
import type { FloatingShapeVariant } from "@/components/three/floating-shape";
import { useDecorative3dEnabled } from "@/lib/motion-preference";

const FloatingShape = dynamic(
  () => import("@/components/three/floating-shape").then((m) => m.FloatingShape),
  { ssr: false }
);

interface Floating3dProps {
  variant?: FloatingShapeVariant;
  opacity?: number;
  className?: string;
}

function StaticFloatingShape({ variant = "icosahedron" }: { variant?: FloatingShapeVariant }) {
  const shapeClass =
    variant === "torusKnot"
      ? "rounded-full"
      : variant === "octahedron"
        ? "rotate-45 rounded-sm"
        : "[clip-path:polygon(50%_0%,95%_28%,80%_88%,20%_88%,5%_28%)]";

  return (
    <div aria-hidden className="absolute inset-0 grid place-items-center">
      <div
        className={`relative h-24 w-24 border border-primary/55 bg-primary/[0.035] shadow-[0_0_42px_hsl(var(--primary)/0.12)] ${shapeClass}`}
      >
        <span className="absolute inset-[18%] rounded-[inherit] border border-primary/25" />
        <span className="absolute left-1/2 top-1/2 h-px w-[145%] -translate-x-1/2 -translate-y-1/2 -rotate-12 bg-primary/30" />
        <span className="absolute -right-5 top-1/4 size-1.5 rounded-full bg-primary" />
        <span className="absolute -left-7 bottom-1/4 size-1 rounded-full bg-foreground/70" />
      </div>
    </div>
  );
}

/**
 * Envoltorio listo para usar desde cualquier página (incluidas las de
 * servidor, como las landings SEO): difiere el chunk de three.js hasta que
 * la forma se acerca al viewport y reserva su espacio con el className.
 */
export function Floating3d({ variant, opacity, className }: Floating3dProps) {
  const enabled = useDecorative3dEnabled();
  const fallback = <StaticFloatingShape variant={variant} />;

  if (!enabled) {
    return <div className={className}>{fallback}</div>;
  }

  return (
    <LazyMount className={className} fallback={fallback}>
      <FloatingShape variant={variant} opacity={opacity} className="absolute inset-0" />
    </LazyMount>
  );
}
