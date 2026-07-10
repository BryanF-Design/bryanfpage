"use client";

import { useRef, type MutableRefObject } from "react";
import * as THREE from "three";

import { requestStageFrame, useThreeStage, type StageTick } from "@/lib/three/stage";

interface ParticleFieldProps {
  /** Progreso de scroll de la sección (0..1). Inclina y hunde el terreno. */
  progressRef?: MutableRefObject<number>;
  className?: string;
}

/**
 * Terreno de partículas: una malla de puntos que ondula como topografía
 * viva detrás del hero. Un solo draw call (shader propio) — la ola corre en
 * el vértice, el puntero levanta una cresta donde tocas y el scroll hunde
 * el terreno hacia el horizonte. En móvil baja la densidad sola.
 */
export function ParticleField({ progressRef, className }: ParticleFieldProps) {
  const pointer = useRef({ x: 0, y: 0, strength: 0 });

  const { containerRef } = useThreeStage({
    fov: 55,
    cameraZ: 7,
    maxDpr: 1.6,
    build: ({ scene, camera, container }) => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const coarse = window.matchMedia("(pointer: coarse)").matches;

      camera.position.set(0, 2.6, 7);
      camera.lookAt(0, -0.4, 0);

      // Densidad según viewport: el móvil no paga la malla completa.
      const small = container.clientWidth < 768;
      const COLS = small ? 90 : 150;
      const ROWS = small ? 52 : 80;
      const W = 22;
      const D = 12;

      const count = COLS * ROWS;
      const positions = new Float32Array(count * 3);
      const seeds = new Float32Array(count);
      let i = 0;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          positions[i * 3] = (c / (COLS - 1) - 0.5) * W;
          positions[i * 3 + 1] = 0;
          positions[i * 3 + 2] = (r / (ROWS - 1) - 0.5) * D;
          seeds[i] = Math.random();
          i++;
        }
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

      const uniforms = {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uPointer: { value: new THREE.Vector2(999, 999) },
        uPointerStrength: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 1.6) },
        uColorDeep: { value: new THREE.Color(0x11402e) },
        uColorLime: { value: new THREE.Color(0xb4e332) },
        uColorBone: { value: new THREE.Color(0xf1f2e9) },
      };

      const material = new THREE.ShaderMaterial({
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: /* glsl */ `
          uniform float uTime;
          uniform float uScroll;
          uniform vec2 uPointer;
          uniform float uPointerStrength;
          uniform float uPixelRatio;
          attribute float aSeed;
          varying float vElevation;
          varying float vFade;
          varying float vSeed;

          void main() {
            vec3 p = position;

            // Oleaje: dos senos cruzados + deriva lenta.
            float t = uTime * 0.55;
            float wave =
              sin(p.x * 0.55 + t) * 0.45 +
              sin(p.z * 0.95 - t * 1.3) * 0.35 +
              sin((p.x + p.z) * 0.32 + t * 0.7) * 0.3;

            // Cresta bajo el puntero: levanta el terreno donde tocas.
            float d = distance(p.xz, uPointer);
            float ripple = smoothstep(3.2, 0.0, d) * uPointerStrength;
            wave += ripple * 1.6 - sin(d * 2.2 - uTime * 3.0) * ripple * 0.35;

            // El scroll hunde el campo y lo empuja al horizonte.
            p.y = wave - uScroll * 2.2;
            p.z += uScroll * 3.0;

            vElevation = wave;
            vSeed = aSeed;

            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;

            // Se desvanece hacia los bordes para no chocar con el texto.
            float edge = 1.0 - smoothstep(6.0, 11.0, abs(p.x));
            float depth = 1.0 - smoothstep(2.0, 7.0, p.z);
            vFade = edge * max(depth, 0.15);

            float size = (1.1 + aSeed * 1.5 + ripple * 2.6) * uPixelRatio;
            gl_PointSize = size * (26.0 / -mv.z);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uColorDeep;
          uniform vec3 uColorLime;
          uniform vec3 uColorBone;
          varying float vElevation;
          varying float vFade;
          varying float vSeed;

          void main() {
            // Sprite circular suave.
            vec2 uv = gl_PointCoord - 0.5;
            float a = smoothstep(0.5, 0.12, length(uv));

            // Del verde profundo al lima según la altura de la ola;
            // algunas motas hueso para dar aire de polvo de taller.
            float h = smoothstep(-1.0, 1.2, vElevation);
            vec3 color = mix(uColorDeep, uColorLime, h);
            color = mix(color, uColorBone, step(0.965, vSeed) * 0.8);

            gl_FragColor = vec4(color, a * vFade * (0.3 + h * 0.42));
          }
        `,
      });

      const points = new THREE.Points(geometry, material);
      points.rotation.x = -0.08;
      scene.add(points);

      // Puntero → coordenadas del plano. Se escucha en window (el campo vive
      // detrás del texto y los CTAs, que se quedarían con los eventos): la
      // cresta responde aunque el cursor viaje sobre el titular.
      const el = container;
      const onMove = (e: PointerEvent) => {
        if (coarse && e.pointerType === "touch") return; // el touch scrollea, no dibuja
        const rect = el.getBoundingClientRect();
        if (
          e.clientY < rect.top - 40 ||
          e.clientY > rect.bottom + 40 ||
          e.clientX < rect.left ||
          e.clientX > rect.right
        ) {
          pointer.current.strength = 0;
          return;
        }
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const nz = (e.clientY - rect.top) / rect.height - 0.35;
        pointer.current.x = nx * W * 0.72;
        pointer.current.y = nz * D * 1.1;
        pointer.current.strength = 1;
        if (reduced) requestStageFrame(el);
      };
      const onLeave = () => {
        pointer.current.strength = 0;
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerout", onLeave, { passive: true });

      const tick: StageTick = (dt, elapsed) => {
        uniforms.uTime.value = reduced ? 12 : elapsed;
        uniforms.uScroll.value = progressRef
          ? THREE.MathUtils.clamp(progressRef.current, 0, 1)
          : 0;

        // La cresta sube rápido y baja con calma cuando sueltas.
        const target = pointer.current.strength;
        const cur = uniforms.uPointerStrength.value;
        uniforms.uPointerStrength.value += (target - cur) * Math.min(1, dt * (target > cur ? 9 : 2));
        uniforms.uPointer.value.set(pointer.current.x, pointer.current.y);
      };

      return {
        tick,
        dispose: () => {
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("pointerout", onLeave);
        },
      };
    },
  });

  return <div ref={containerRef} className={className} aria-hidden />;
}
