"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

import { useThreeStage } from "@/lib/three/stage";

const LIME = 0xb4e332;

/**
 * Fondo 3D del CV (solo escritorio con movimiento permitido; lo decide
 * CvBackdrop). Poliedros de alambre lima que flotan en los bordes, polvo de
 * estrellas que viaja hacia la cámara y un giro de cámara cada vez que se
 * cambia de nivel. Todo con materiales básicos: sin luces, sin texturas.
 */
export default function CvScene({ levelIndex }: { levelIndex: number }) {
  const levelRef = useRef(levelIndex);
  useEffect(() => {
    levelRef.current = levelIndex;
  }, [levelIndex]);

  const { containerRef } = useThreeStage({
    fov: 55,
    cameraZ: 9,
    maxDpr: 1.5,
    build: ({ scene, camera, container }) => {
      const world = new THREE.Group();
      scene.add(world);

      // Poliedros de alambre en los bordes del encuadre.
      const shapes: { mesh: THREE.LineSegments; spin: THREE.Vector3; base: THREE.Vector3 }[] = [];
      const geos: THREE.BufferGeometry[] = [
        new THREE.IcosahedronGeometry(1.1, 0),
        new THREE.OctahedronGeometry(0.9, 0),
        new THREE.TorusKnotGeometry(0.6, 0.18, 64, 8),
        new THREE.DodecahedronGeometry(0.8, 0),
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.TetrahedronGeometry(0.9, 0),
        new THREE.TorusGeometry(0.7, 0.22, 8, 24),
      ];
      const spots = [
        [-7.2, 3.2, -2],
        [7.4, 2.6, -3],
        [-6.4, -3.4, -1],
        [6.8, -3.2, -2],
        [-2.8, 4.6, -6],
        [3.6, -4.8, -5],
        [0.5, 5.6, -9],
      ];
      geos.forEach((geo, i) => {
        const edges = new THREE.EdgesGeometry(geo);
        geo.dispose();
        const mat = new THREE.LineBasicMaterial({
          color: i % 3 === 2 ? 0xffffff : LIME,
          transparent: true,
          opacity: i % 3 === 2 ? 0.28 : 0.6,
        });
        const mesh = new THREE.LineSegments(edges, mat);
        const [x, y, z] = spots[i];
        mesh.position.set(x, y, z);
        world.add(mesh);
        shapes.push({
          mesh,
          base: new THREE.Vector3(x, y, z),
          spin: new THREE.Vector3(0.12 + i * 0.03, 0.18 + i * 0.02, 0.05),
        });
      });

      // Polvo de estrellas.
      const COUNT = 700;
      const positions = new Float32Array(COUNT * 3);
      for (let i = 0; i < COUNT; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 30;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
        positions[i * 3 + 2] = -Math.random() * 30;
      }
      const starsGeo = new THREE.BufferGeometry();
      starsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const stars = new THREE.Points(
        starsGeo,
        new THREE.PointsMaterial({ color: LIME, size: 0.06, transparent: true, opacity: 0.75, sizeAttenuation: true })
      );
      scene.add(stars);

      // Puntero → parallax suave.
      const pointer = { x: 0, y: 0 };
      const onPointer = (e: PointerEvent) => {
        pointer.x = e.clientX / window.innerWidth - 0.5;
        pointer.y = e.clientY / window.innerHeight - 0.5;
      };
      window.addEventListener("pointermove", onPointer, { passive: true });

      let shownLevel = levelRef.current;
      let targetYaw = 0;
      let pulse = 0;

      const tick = (dt: number, elapsed: number) => {
        if (levelRef.current !== shownLevel) {
          targetYaw += (levelRef.current > shownLevel ? 1 : -1) * (Math.PI / 3);
          shownLevel = levelRef.current;
          pulse = 1;
        }
        pulse = Math.max(0, pulse - dt * 1.6);

        world.rotation.y += (targetYaw * 0.15 + pointer.x * 0.35 - world.rotation.y) * Math.min(1, dt * 2.5);
        world.rotation.x += (pointer.y * 0.2 - world.rotation.x) * Math.min(1, dt * 2.5);

        shapes.forEach(({ mesh, spin, base }, i) => {
          mesh.rotation.x += spin.x * dt * (1 + pulse * 6);
          mesh.rotation.y += spin.y * dt * (1 + pulse * 6);
          mesh.position.y = base.y + Math.sin(elapsed * 0.6 + i) * 0.35;
          const sc = 1 + pulse * 0.35;
          mesh.scale.setScalar(sc);
        });

        const arr = starsGeo.attributes.position.array as Float32Array;
        const speed = 2.2 + pulse * 18;
        for (let i = 0; i < COUNT; i++) {
          arr[i * 3 + 2] += speed * dt;
          if (arr[i * 3 + 2] > camera.position.z) arr[i * 3 + 2] = -30;
        }
        starsGeo.attributes.position.needsUpdate = true;

        camera.position.x += (pointer.x * 0.8 - camera.position.x) * Math.min(1, dt * 2);
        camera.position.y += (-pointer.y * 0.5 - camera.position.y) * Math.min(1, dt * 2);
        camera.lookAt(0, 0, -4);
      };

      void container;
      return {
        tick,
        dispose: () => window.removeEventListener("pointermove", onPointer),
      };
    },
  });

  return <div ref={containerRef} className="h-full w-full" />;
}
