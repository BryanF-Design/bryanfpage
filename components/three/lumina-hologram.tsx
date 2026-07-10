"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

import { requestStageFrame, useThreeStage } from "@/lib/three/stage";

export type LuminaMood = "Normal" | "Enfocada" | "Duda" | "Sorprendida";

const MOOD_SRC: Record<LuminaMood, string> = {
  Normal: "/img/lumina/Normal.png",
  Enfocada: "/img/lumina/Enfocada.png",
  Duda: "/img/lumina/Duda.png",
  Sorprendida: "/img/lumina/Sorprendida.png",
};

interface LuminaHologramProps {
  mood: LuminaMood;
  /** Se dispara con un tap/click sobre el holograma (sin arrastre). */
  onPoke?: () => void;
  className?: string;
}

/**
 * Lumina como holograma: su retrato vive en un disco flotante dentro de un
 * giroscopio de anillos y polvo lima. Sigue al puntero, se deja girar como
 * moneda (con regreso elástico) y un tap la "despierta" — el padre cambia el
 * mood y la textura cruza en caliente sin recargar la escena.
 */
export function LuminaHologram({ mood, onPoke, className }: LuminaHologramProps) {
  const moodRef = useRef<LuminaMood>(mood);
  const applyMoodRef = useRef<(m: LuminaMood) => void>(() => {});
  const pokeRef = useRef(onPoke);
  pokeRef.current = onPoke;

  useEffect(() => {
    moodRef.current = mood;
    applyMoodRef.current(mood);
  }, [mood]);

  const { containerRef } = useThreeStage({
    fov: 38,
    cameraZ: 5.6,
    maxDpr: 1.75,
    build: ({ scene, container }) => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const rig = new THREE.Group(); // sigue al puntero
      const spin = new THREE.Group(); // gira con el arrastre
      rig.add(spin);
      scene.add(rig);

      // --- Disco con el retrato -------------------------------------------
      const loader = new THREE.TextureLoader();
      const cache = new Map<LuminaMood, THREE.Texture>();
      const loadMood = (m: LuminaMood, onReady?: (t: THREE.Texture) => void) => {
        const hit = cache.get(m);
        if (hit) {
          onReady?.(hit);
          return hit;
        }
        const t = loader.load(MOOD_SRC[m], (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = 4;
          onReady?.(tex);
          requestStageFrame(container);
        });
        cache.set(m, t);
        return t;
      };

      const discMaterial = new THREE.MeshBasicMaterial({
        map: loadMood(moodRef.current),
        side: THREE.DoubleSide,
        transparent: true,
      });
      const disc = new THREE.Mesh(new THREE.CircleGeometry(1.62, 72), discMaterial);
      spin.add(disc);

      // Canto del disco: un aro lima que remata la "moneda".
      const edge = new THREE.Mesh(
        new THREE.TorusGeometry(1.63, 0.015, 12, 96),
        new THREE.MeshBasicMaterial({ color: 0xb4e332, transparent: true, opacity: 0.9 })
      );
      spin.add(edge);

      // Pop al cambiar de mood: el disco late una vez.
      let pop = 0;
      applyMoodRef.current = (m) => {
        loadMood(m, (tex) => {
          discMaterial.map = tex;
          discMaterial.needsUpdate = true;
        });
        pop = 1;
        requestStageFrame(container);
      };

      // --- Giroscopio ------------------------------------------------------
      const ringA = new THREE.Mesh(
        new THREE.TorusGeometry(2.05, 0.006, 8, 128),
        new THREE.MeshBasicMaterial({ color: 0xb4e332, transparent: true, opacity: 0.55 })
      );
      ringA.rotation.x = Math.PI / 2.15;
      rig.add(ringA);

      const ringB = new THREE.Mesh(
        new THREE.TorusGeometry(2.3, 0.004, 8, 128),
        new THREE.MeshBasicMaterial({ color: 0xf1f2e9, transparent: true, opacity: 0.22 })
      );
      ringB.rotation.x = Math.PI / 1.75;
      ringB.rotation.y = 0.6;
      rig.add(ringB);

      // --- Polvo orbital (un draw call) ------------------------------------
      const DUST = 220;
      const dustPos = new Float32Array(DUST * 3);
      const dustSeed = new Float32Array(DUST);
      for (let i = 0; i < DUST; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = 1.9 + Math.random() * 1.1;
        dustPos[i * 3] = Math.cos(a) * r;
        dustPos[i * 3 + 1] = (Math.random() - 0.5) * 1.4;
        dustPos[i * 3 + 2] = Math.sin(a) * r;
        dustSeed[i] = Math.random();
      }
      const dustGeo = new THREE.BufferGeometry();
      dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
      dustGeo.setAttribute("aSeed", new THREE.BufferAttribute(dustSeed, 1));
      const dustMat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 1.75) },
        },
        vertexShader: /* glsl */ `
          uniform float uTime;
          uniform float uPixelRatio;
          attribute float aSeed;
          varying float vSeed;
          void main() {
            vSeed = aSeed;
            vec3 p = position;
            float a = uTime * (0.12 + aSeed * 0.25);
            float c = cos(a); float s = sin(a);
            p = vec3(p.x * c - p.z * s, p.y + sin(uTime * 0.8 + aSeed * 6.28) * 0.08, p.x * s + p.z * c);
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = (1.2 + aSeed * 2.4) * uPixelRatio * (18.0 / -mv.z);
          }
        `,
        fragmentShader: /* glsl */ `
          varying float vSeed;
          void main() {
            float a = smoothstep(0.5, 0.1, length(gl_PointCoord - 0.5));
            vec3 lime = vec3(0.706, 0.890, 0.196);
            vec3 bone = vec3(0.945, 0.949, 0.914);
            gl_FragColor = vec4(mix(lime, bone, step(0.92, vSeed)), a * (0.35 + vSeed * 0.5));
          }
        `,
      });
      const dust = new THREE.Points(dustGeo, dustMat);
      rig.add(dust);

      // --- Aura ------------------------------------------------------------
      const glowCanvas = document.createElement("canvas");
      glowCanvas.width = glowCanvas.height = 256;
      const gctx = glowCanvas.getContext("2d")!;
      const grad = gctx.createRadialGradient(128, 128, 20, 128, 128, 128);
      grad.addColorStop(0, "rgba(180,227,50,0.32)");
      grad.addColorStop(0.55, "rgba(180,227,50,0.10)");
      grad.addColorStop(1, "rgba(180,227,50,0)");
      gctx.fillStyle = grad;
      gctx.fillRect(0, 0, 256, 256);
      const glow = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: new THREE.CanvasTexture(glowCanvas),
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
      );
      glow.scale.setScalar(6.4);
      glow.position.z = -0.6;
      rig.add(glow);

      // --- Interacción ------------------------------------------------------
      const el = container;
      el.style.touchAction = "pan-y";
      el.style.cursor = "grab";
      let targetX = 0;
      let targetY = 0;
      let dragging = false;
      let moved = 0;
      let lastX = 0;
      let dragYaw = 0;

      const onMove = (e: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.5;
        targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.4;
        if (dragging) {
          const delta = e.clientX - lastX;
          moved += Math.abs(delta);
          dragYaw += delta * 0.011;
          lastX = e.clientX;
          requestStageFrame(el);
        }
      };
      const onDown = (e: PointerEvent) => {
        dragging = true;
        moved = 0;
        lastX = e.clientX;
        el.style.cursor = "grabbing";
        el.setPointerCapture(e.pointerId);
      };
      const onUp = (e: PointerEvent) => {
        if (dragging && moved < 6) pokeRef.current?.();
        dragging = false;
        el.style.cursor = "grab";
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
        const idle = reduced ? 0 : elapsed;

        // Regreso elástico del giro de moneda.
        if (!dragging) dragYaw *= 1 - Math.min(1, dt * 2.2);
        spin.rotation.y = dragYaw + (reduced ? 0 : Math.sin(elapsed * 0.4) * 0.06);

        // Latido del cambio de mood.
        pop = Math.max(0, pop - dt * 2.4);
        const s = 1 + Math.sin(pop * Math.PI) * 0.06;
        disc.scale.setScalar(s);
        edge.scale.setScalar(s);

        // El rig completo persigue el puntero con suavidad.
        rig.rotation.y += (targetX - rig.rotation.y) * Math.min(1, dt * 3.2);
        rig.rotation.x += (targetY - rig.rotation.x) * Math.min(1, dt * 3.2);
        rig.position.y = reduced ? 0 : Math.sin(elapsed * 0.85) * 0.1;

        ringA.rotation.z = idle * 0.25;
        ringB.rotation.z = -idle * 0.18;
        (dustMat.uniforms.uTime as { value: number }).value = idle;

        const pulse = reduced ? 1 : 1 + Math.sin(elapsed * 1.6) * 0.05;
        glow.scale.setScalar(6.4 * pulse);
      };
    },
  });

  return <div ref={containerRef} className={className} role="presentation" />;
}
