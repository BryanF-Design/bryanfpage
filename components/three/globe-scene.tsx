"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import { latLngToVec3, requestStageFrame, useThreeStage } from "@/lib/three/stage";
import { LAND_DOTS } from "@/lib/three/land-dots";

export interface GlobeLocation {
  lat: number;
  lng: number;
  label: string;
}

interface GlobeSceneProps {
  locations: GlobeLocation[];
  /** Pares de índices en `locations` unidos por un arco. */
  arcs: [number, number][];
  className?: string;
}

const R = 1;
const LIME = 0xb4e332;

/**
 * Globo de puntos: los continentes son ~3,600 puntos precalculados
 * (lib/three/land-dots.ts), los proyectos son marcadores lima con arcos
 * animados entre países. Se arrastra con click/touch (horizontal), rota solo
 * cuando nadie lo toca y las etiquetas HTML siguen a sus marcadores.
 */
export function GlobeScene({ locations, arcs, className }: GlobeSceneProps) {
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [ready, setReady] = useState(false);
  const rotation = useRef({ yaw: 0, pitch: 0.32, velYaw: 0 });
  const dragging = useRef(false);

  const { containerRef } = useThreeStage({
    fov: 34,
    cameraZ: 4.1,
    build: ({ scene, camera, container }) => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const globe = new THREE.Group();
      scene.add(globe);

      // Esfera base, apenas más clara que el fondo.
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(R * 0.995, 48, 48),
        new THREE.MeshBasicMaterial({ color: 0x0a1710 })
      );
      globe.add(sphere);

      // Halo fresnel en lima — el borde iluminado del planeta.
      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(R * 1.04, 48, 48),
        new THREE.ShaderMaterial({
          transparent: true,
          side: THREE.BackSide,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          uniforms: {},
          vertexShader: `
            varying float vIntensity;
            void main() {
              vec3 vNormal = normalize(normalMatrix * normal);
              vIntensity = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.6);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }`,
          fragmentShader: `
            varying float vIntensity;
            void main() {
              gl_FragColor = vec4(0.706, 0.89, 0.196, 1.0) * vIntensity;
            }`,
        })
      );
      scene.add(halo);

      // Continentes: puntos precalculados [lat*10, lng*10].
      const count = LAND_DOTS.length / 2;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const v = latLngToVec3(LAND_DOTS[i * 2] / 10, LAND_DOTS[i * 2 + 1] / 10, R);
        positions[i * 3] = v.x;
        positions[i * 3 + 1] = v.y;
        positions[i * 3 + 2] = v.z;
      }
      const dotsGeo = new THREE.BufferGeometry();
      dotsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const dots = new THREE.Points(
        dotsGeo,
        new THREE.PointsMaterial({
          color: 0xdfe5d2,
          size: 0.0135,
          transparent: true,
          opacity: 0.62,
          depthWrite: false,
        })
      );
      globe.add(dots);

      // Marcadores + anillos de pulso.
      const markerVecs = locations.map((l) => latLngToVec3(l.lat, l.lng, R * 1.005));
      const pulses: THREE.Mesh[] = [];
      markerVecs.forEach((v) => {
        const marker = new THREE.Mesh(
          new THREE.SphereGeometry(0.022, 12, 12),
          new THREE.MeshBasicMaterial({ color: LIME })
        );
        marker.position.copy(v);
        globe.add(marker);

        const pulse = new THREE.Mesh(
          new THREE.RingGeometry(0.03, 0.05, 24),
          new THREE.MeshBasicMaterial({
            color: LIME,
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide,
            depthWrite: false,
          })
        );
        pulse.position.copy(v);
        pulse.lookAt(v.clone().multiplyScalar(2));
        globe.add(pulse);
        pulses.push(pulse);
      });

      // Arcos entre países + pulso viajero.
      const travelers: { mesh: THREE.Mesh; curve: THREE.QuadraticBezierCurve3; offset: number }[] = [];
      arcs.forEach(([a, b], i) => {
        const start = markerVecs[a];
        const end = markerVecs[b];
        const mid = start
          .clone()
          .add(end)
          .multiplyScalar(0.5)
          .normalize()
          .multiplyScalar(R * (1 + start.distanceTo(end) * 0.35));
        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        const arc = new THREE.Mesh(
          new THREE.TubeGeometry(curve, 40, 0.0035, 6, false),
          new THREE.MeshBasicMaterial({ color: LIME, transparent: true, opacity: 0.38 })
        );
        globe.add(arc);

        const traveler = new THREE.Mesh(
          new THREE.SphereGeometry(0.014, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0xf1f2e9 })
        );
        globe.add(traveler);
        travelers.push({ mesh: traveler, curve, offset: i * 0.33 });
      });

      // Arranca mirando el Atlántico: México y Europa a la vista.
      // (con esta proyección, lng -90° queda de frente cuando yaw = 0)
      rotation.current.yaw = -0.75;

      // Arrastre con inercia; pan-y conserva el scroll vertical en móvil.
      const el = container;
      el.style.touchAction = "pan-y";
      el.style.cursor = "grab";
      let lastX = 0;
      let lastY = 0;
      const onDown = (e: PointerEvent) => {
        dragging.current = true;
        lastX = e.clientX;
        lastY = e.clientY;
        el.style.cursor = "grabbing";
        el.setPointerCapture(e.pointerId);
      };
      const onMove = (e: PointerEvent) => {
        if (!dragging.current) return;
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        rotation.current.yaw += dx * 0.005;
        rotation.current.velYaw = dx * 0.005;
        rotation.current.pitch = THREE.MathUtils.clamp(
          rotation.current.pitch + dy * 0.003,
          -0.7,
          0.9
        );
        lastX = e.clientX;
        lastY = e.clientY;
        requestStageFrame(el);
      };
      const onUp = (e: PointerEvent) => {
        dragging.current = false;
        el.style.cursor = "grab";
        try {
          el.releasePointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
      };
      el.addEventListener("pointerdown", onDown);
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerup", onUp);
      el.addEventListener("pointercancel", onUp);

      const projected = new THREE.Vector3();
      const camDir = new THREE.Vector3(0, 0, 1);

      return (dt, elapsed) => {
        const rot = rotation.current;
        if (!dragging.current) {
          // Inercia + rotación de reposo.
          rot.velYaw *= 1 - Math.min(1, dt * 2.2);
          rot.yaw += rot.velYaw + (reduced ? 0 : dt * 0.07);
          rot.pitch += (0.32 - rot.pitch) * Math.min(1, dt * 0.5);
        }
        globe.rotation.set(rot.pitch, rot.yaw, 0);

        pulses.forEach((pulse, i) => {
          const s = 1 + ((elapsed * 0.9 + i * 0.4) % 1) * 1.6;
          pulse.scale.setScalar(s);
          (pulse.material as THREE.MeshBasicMaterial).opacity = 0.55 * (1 - ((elapsed * 0.9 + i * 0.4) % 1));
        });

        travelers.forEach(({ mesh, curve, offset }) => {
          mesh.position.copy(curve.getPoint((elapsed * 0.14 + offset) % 1));
        });

        // Etiquetas HTML pegadas a sus marcadores; se ocultan al pasar atrás.
        const rect = container.getBoundingClientRect();
        markerVecs.forEach((v, i) => {
          const label = labelRefs.current[i];
          if (!label) return;
          projected.copy(v).applyEuler(globe.rotation);
          const facing = projected.clone().normalize().dot(camDir);
          projected.project(camera);
          const x = (projected.x * 0.5 + 0.5) * rect.width;
          const y = (-projected.y * 0.5 + 0.5) * rect.height;
          label.style.transform = `translate(-50%, -140%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
          label.style.opacity = facing > 0.18 ? "1" : "0";
        });
      };
    },
  });

  useEffect(() => setReady(true), []);

  return (
    <div className={className}>
      <div ref={containerRef} className="absolute inset-0" role="img" aria-label={locations.map((l) => l.label).join(" · ")} />
      {ready &&
        locations.map((l, i) => (
          <span
            key={l.label}
            ref={(node) => {
              labelRefs.current[i] = node;
            }}
            className="pointer-events-none absolute left-0 top-0 rounded-sm border border-primary/40 bg-background/85 px-2 py-0.5 font-mono text-[11px] text-foreground transition-opacity duration-200"
          >
            {l.label}
          </span>
        ))}
    </div>
  );
}
