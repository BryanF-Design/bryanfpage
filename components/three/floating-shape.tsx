"use client";

import * as THREE from "three";

import { requestStageFrame, useThreeStage } from "@/lib/three/stage";

export type FloatingShapeVariant = "icosahedron" | "torusKnot" | "octahedron";

interface FloatingShapeProps {
  variant?: FloatingShapeVariant;
  /** Opacidad del wireframe (bájala cuando la forma es fondo de un texto). */
  opacity?: number;
  className?: string;
}

/**
 * Forma flotante de alambre en lima: la pieza 3D "chica" del sitio, para dar
 * vida a secciones que no ameritan una escena completa (CTA de cierre,
 * landings de servicio). Rota sola, reacciona al puntero y se puede arrastrar.
 * Mismo contrato de rendimiento que las demás escenas (stage compartido).
 */
export function FloatingShape({ variant = "icosahedron", opacity = 0.55, className }: FloatingShapeProps) {
  const { containerRef } = useThreeStage({
    fov: 35,
    cameraZ: 4.4,
    maxDpr: 1.5,
    build: ({ scene, container }) => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const group = new THREE.Group();
      scene.add(group);

      const geometry =
        variant === "torusKnot"
          ? new THREE.TorusKnotGeometry(0.95, 0.28, 96, 12)
          : variant === "octahedron"
            ? new THREE.OctahedronGeometry(1.25, 0)
            : new THREE.IcosahedronGeometry(1.25, 0);

      // Alambre exterior en lima + núcleo sólido apenas visible.
      const wire = new THREE.LineSegments(
        new THREE.EdgesGeometry(geometry, 1),
        new THREE.LineBasicMaterial({ color: 0xb4e332, transparent: true, opacity })
      );
      group.add(wire);

      const core = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({ color: 0x0d1a12, transparent: true, opacity: 0.85 })
      );
      core.scale.setScalar(0.985);
      group.add(core);

      // Tres satélites en un anillo inclinado.
      const ringRadius = 1.9;
      const satellites: THREE.Mesh[] = [];
      for (let i = 0; i < 3; i++) {
        const dot = new THREE.Mesh(
          new THREE.SphereGeometry(0.045, 8, 8),
          new THREE.MeshBasicMaterial({ color: i === 0 ? 0xf1f2e9 : 0xb4e332 })
        );
        satellites.push(dot);
        scene.add(dot);
      }
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(ringRadius, 0.004, 8, 96),
        new THREE.MeshBasicMaterial({ color: 0xb4e332, transparent: true, opacity: opacity * 0.35 })
      );
      ring.rotation.x = Math.PI / 2.4;
      scene.add(ring);

      // Puntero: parallax suave + arrastre directo.
      const el = container;
      el.style.touchAction = "pan-y";
      let targetX = 0;
      let targetY = 0;
      let dragging = false;
      let lastX = 0;
      let lastY = 0;
      let dragYaw = 0;
      let dragPitch = 0;
      const onMove = (e: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.6;
        targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.6;
        if (dragging) {
          dragYaw += (e.clientX - lastX) * 0.008;
          dragPitch = THREE.MathUtils.clamp(dragPitch + (e.clientY - lastY) * 0.006, -1, 1);
          lastX = e.clientX;
          lastY = e.clientY;
          requestStageFrame(el);
        }
      };
      const onDown = (e: PointerEvent) => {
        dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        el.setPointerCapture(e.pointerId);
      };
      const onUp = (e: PointerEvent) => {
        dragging = false;
        try {
          el.releasePointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
      };
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerdown", onDown);
      el.addEventListener("pointerup", onUp);
      el.addEventListener("pointercancel", onUp);

      return (dt, elapsed) => {
        if (!dragging) {
          dragYaw *= 1 - Math.min(1, dt * 1.2);
          dragPitch *= 1 - Math.min(1, dt * 1.2);
        }
        const idle = reduced ? 0 : elapsed;
        group.rotation.y = idle * 0.25 + targetX + dragYaw;
        group.rotation.x = idle * 0.11 + targetY + dragPitch;
        group.position.y = reduced ? 0 : Math.sin(elapsed * 0.8) * 0.08;

        satellites.forEach((dot, i) => {
          const a = idle * (0.5 + i * 0.12) + (i * Math.PI * 2) / 3;
          dot.position.set(
            Math.cos(a) * ringRadius,
            Math.sin(a) * ringRadius * Math.cos(Math.PI / 2.4) * 0.5,
            Math.sin(a) * ringRadius * 0.8
          );
        });
      };
    },
  });

  return <div ref={containerRef} className={className} aria-hidden />;
}
