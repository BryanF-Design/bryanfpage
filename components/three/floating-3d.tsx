"use client";

import dynamic from "next/dynamic";

import { LazyMount } from "@/components/three/lazy-mount";
import type { FloatingShapeVariant } from "@/components/three/floating-shape";

const FloatingShape = dynamic(
  () => import("@/components/three/floating-shape").then((m) => m.FloatingShape),
  { ssr: false }
);

interface Floating3dProps {
  variant?: FloatingShapeVariant;
  opacity?: number;
  className?: string;
}

/**
 * Envoltorio listo para usar desde cualquier página (incluidas las de
 * servidor, como las landings SEO): difiere el chunk de three.js hasta que
 * la forma se acerca al viewport y reserva su espacio con el className.
 */
export function Floating3d({ variant, opacity, className }: Floating3dProps) {
  return (
    <LazyMount className={className}>
      <FloatingShape variant={variant} opacity={opacity} className="absolute inset-0" />
    </LazyMount>
  );
}
