"use client";

import { type MutableRefObject } from "react";
import * as THREE from "three";

import { useThreeStage } from "@/lib/three/stage";

interface ParallaxShardsProps {
  /** Progreso de la sección en viewport (0 = entrando, 1 = saliendo). */
  progressRef: MutableRefObject<number>;
  /** Cuántos fragmentos flotan (el móvil recibe menos automáticamente). */
  count?: number;
  opacity?: number;
  className?: string;
}

/**
 * Escombros de obra en 3D: fragmentos de alambre (icosaedros, octaedros,
 * tetraedros) repartidos en profundidad. Cada uno sube a su propia velocidad
 * mientras la sección cruza el viewport — parallax real por capa de z — y
 * el conjunto se ladea siguiendo el puntero. Un canvas para todos.
 */
export function ParallaxShards({
  progressRef,
  count = 10,
  opacity = 0.5,
  className,
}: ParallaxShardsProps) {
  const { containerRef } = useThreeStage({
    fov: 45,
    cameraZ: 9,
    maxDpr: 1.5,
    build: ({ scene, container }) => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const small = container.clientWidth < 768;
      const n = small ? Math.max(5, Math.round(count * 0.6)) : count;

      const geometries = [
        new THREE.IcosahedronGeometry(1, 0),
        new THREE.OctahedronGeometry(1, 0),
        new THREE.TetrahedronGeometry(1, 0),
      ];

      const group = new THREE.Group();
      scene.add(group);

      interface Shard {
        mesh: THREE.LineSegments;
        speed: number; // factor de parallax (más cerca = más rápido)
        spin: THREE.Vector3;
        baseY: number;
      }

      const shards: Shard[] = [];
      // Un tercio "cerca" (grandes, rápidos), el resto lejos (chicos, lentos).
      for (let i = 0; i < n; i++) {
        const depth = i / Math.max(1, n - 1); // 0 = cerca, 1 = lejos
        const z = -depth * 7;
        const scale = THREE.MathUtils.lerp(0.85, 0.3, depth) * (0.8 + Math.random() * 0.5);
        const geo = geometries[i % geometries.length];

        const wire = new THREE.LineSegments(
          new THREE.EdgesGeometry(geo, 1),
          new THREE.LineBasicMaterial({
            color: Math.random() > 0.82 ? 0xf1f2e9 : 0xb4e332,
            transparent: true,
            opacity: opacity * THREE.MathUtils.lerp(1, 0.35, depth),
          })
        );
        wire.position.set(
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 6,
          z
        );
        wire.scale.setScalar(scale);
        wire.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        group.add(wire);

        shards.push({
          mesh: wire,
          speed: THREE.MathUtils.lerp(3.6, 0.9, depth),
          spin: new THREE.Vector3(
            (Math.random() - 0.5) * 0.4,
            (Math.random() - 0.5) * 0.5,
            (Math.random() - 0.5) * 0.2
          ),
          baseY: wire.position.y,
        });
      }
      geometries.forEach((g) => g.dispose());

      // Parallax de puntero sobre el grupo entero.
      let targetX = 0;
      let targetY = 0;
      const onMove = (e: PointerEvent) => {
        const rect = container.getBoundingClientRect();
        targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.3;
        targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.2;
      };
      container.addEventListener("pointermove", onMove);

      return (dt, elapsed) => {
        const progress = THREE.MathUtils.clamp(progressRef.current, 0, 1);
        const drift = (progress - 0.5) * 2; // -1 .. 1

        for (const s of shards) {
          s.mesh.position.y = s.baseY + drift * s.speed;
          if (!reduced) {
            s.mesh.rotation.x += s.spin.x * dt;
            s.mesh.rotation.y += s.spin.y * dt;
            s.mesh.rotation.z += s.spin.z * dt;
          }
        }

        group.rotation.y += (targetX - group.rotation.y) * Math.min(1, dt * 2.4);
        group.rotation.x += (-targetY - group.rotation.x) * Math.min(1, dt * 2.4);
        if (!reduced) group.position.x = Math.sin(elapsed * 0.2) * 0.15;
      };
    },
  });

  return <div ref={containerRef} className={className} aria-hidden />;
}
