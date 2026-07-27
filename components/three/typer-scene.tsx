"use client";

import { type MutableRefObject } from "react";
import * as THREE from "three";

import { useThreeStage } from "@/lib/three/stage";

const LIME = 0xb4e332;
const BONE = 0xf1f2e9;
const VERMILION = 0xe8442f;

/** Medidas del coche, en unidades de escena (largo total ≈ 4.3). */
const BODY_DEPTH = 1.86;
const HALF = BODY_DEPTH / 2;
const WHEEL_Y = 0.34;
const AXLE_X = 1.32;
const TYRE_R = 0.4;
const ARCH_R = 0.47;
/** Las ruedas viven casi a ras del flanco, como en cualquier coche real. */
const WHEEL_Z = HALF - 0.04;

/**
 * Perfil lateral: hatchback de tres puertas con caída rápida de techo.
 *
 * Los pasos de rueda NO se recortan aquí. Extruir una silueta con dos muescas
 * semicirculares genera dos medios cilindros que atraviesan la carrocería, y
 * en alambre el coche se lee como dos barriles unidos — se probó. El arco de
 * la salpicadera se dibuja aparte, encima de la chapa.
 */
const PROFILE: [number, number][] = [
  [-2.1, 0.32],
  [-1.78, 0.12],
  [1.78, 0.12],
  [2.04, 0.32],
  [2.18, 0.5],
  [2.18, 0.7],
  [2.02, 0.8],
  [1.5, 0.86],
  [1.0, 0.9],
  [0.34, 1.34],
  [-0.52, 1.41],
  [-1.06, 1.32],
  [-1.6, 1.04],
  [-1.86, 0.92],
  [-2.02, 0.82],
  [-2.14, 0.56],
];

function bodyProfile(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(...PROFILE[0]);
  for (const p of PROFILE.slice(1)) s.lineTo(...p);
  s.closePath();
  return s;
}

/** Arco de salpicadera sobre el flanco: de 194° a -14°. */
function archPoints(cx: number): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i <= 12; i++) {
    const a = THREE.MathUtils.degToRad(194 + (i / 12) * -208);
    pts.push([cx + ARCH_R * Math.cos(a), WHEEL_Y + ARCH_R * Math.sin(a)]);
  }
  return pts;
}

/** Invernadero: cristal lateral. */
const GLASS: [number, number][] = [
  [0.98, 0.84],
  [0.42, 1.24],
  [-0.5, 1.31],
  [-1.0, 1.23],
  [-1.42, 0.98],
  [-1.34, 0.9],
  [0.92, 0.79],
];

/** Cortes de chapa: pilar B, línea de puerta y el pliegue del costado. */
const CUTS: [number, number][][] = [
  [
    [-0.16, 1.29],
    [-0.1, 0.82],
  ],
  [
    [-0.1, 0.82],
    [-0.06, 0.2],
  ],
  [
    [1.02, 0.6],
    [-1.5, 0.52],
  ],
];

interface TypeRSceneProps {
  /** Progreso de la sección en viewport (0 = entrando, 1 = saliendo). */
  progressRef: MutableRefObject<number>;
  /** Sube a 1 cuando el easter egg de VTEC está activo. */
  revRef?: MutableRefObject<number>;
  className?: string;
}

/**
 * El Civic Type R, en alambre.
 *
 * Nada de esto es un modelo descargado: la carrocería es una silueta 2D
 * extruida y pasada por EdgesGeometry, así que el coche entero pesa lo que
 * pesa el código que lo describe — cero KB de GLTF, cero texturas. Se
 * construye una vez y gira con el scroll; el puntero solo lo ladea.
 *
 * Los detalles que un dueño reconocería están ahí a propósito: el alerón de
 * dos soportes, la triple salida de escape al centro y la barra de calaveras.
 * Son las señas del coche, no una silueta genérica de hatchback.
 */
export function TypeRScene({ progressRef, revRef, className }: TypeRSceneProps) {
  const { containerRef } = useThreeStage({
    fov: 34,
    cameraZ: 7.4,
    maxDpr: 1.5,
    build: ({ scene, camera, container }) => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // A la altura del coche, no en picado: un contrapicado suave lo hace
      // parecer un coche y no una maqueta vista desde un dron.
      camera.position.set(0.4, 1.05, 7.4);
      camera.lookAt(0, 0.62, 0);

      const car = new THREE.Group();
      scene.add(car);

      // Un material por tinta, compartido: cuatro draw calls, no cuarenta.
      const wire = new THREE.LineBasicMaterial({
        color: LIME,
        transparent: true,
        opacity: 0.9,
      });
      const wireSoft = new THREE.LineBasicMaterial({
        color: LIME,
        transparent: true,
        opacity: 0.42,
      });
      const boneWire = new THREE.LineBasicMaterial({
        color: BONE,
        transparent: true,
        opacity: 0.55,
      });
      const hot = new THREE.LineBasicMaterial({
        color: VERMILION,
        transparent: true,
        opacity: 0.95,
      });
      const lamp = new THREE.LineBasicMaterial({
        color: BONE,
        transparent: true,
        opacity: 0.9,
      });
      const materials = [wire, wireSoft, boneWire, hot, lamp];

      /** Malla → aristas → líneas; la geometría intermedia se tira. */
      const addEdges = (
        geo: THREE.BufferGeometry,
        material: THREE.LineBasicMaterial,
        position: [number, number, number],
        threshold = 12,
        rotation?: [number, number, number]
      ) => {
        const e = new THREE.EdgesGeometry(geo, threshold);
        geo.dispose();
        const mesh = new THREE.LineSegments(e, material);
        mesh.position.set(...position);
        if (rotation) mesh.rotation.set(...rotation);
        car.add(mesh);
      };

      /** Polilínea plana, duplicada en los dos costados. */
      const bothFlanks = (
        pts: [number, number][],
        material: THREE.LineBasicMaterial
      ) => {
        const vecs = pts.map(([x, y]) => new THREE.Vector3(x, y, 0));
        for (const z of [HALF + 0.004, -HALF - 0.004]) {
          const line = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(vecs),
            material
          );
          line.position.z = z;
          car.add(line);
        }
      };

      /** Círculo suelto en el plano XY, a una z dada. */
      const circle = (
        cx: number,
        cy: number,
        cz: number,
        r: number,
        segments: number,
        material: THREE.LineBasicMaterial
      ) => {
        const pts: THREE.Vector3[] = [];
        for (let i = 0; i <= segments; i++) {
          const a = (i / segments) * Math.PI * 2;
          pts.push(new THREE.Vector3(cx + r * Math.cos(a), cy + r * Math.sin(a), cz));
        }
        car.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), material));
      };

      // — Carrocería —
      const body = new THREE.ExtrudeGeometry(bodyProfile(), {
        depth: BODY_DEPTH,
        bevelEnabled: false,
        curveSegments: 8,
      });
      body.translate(0, 0, -HALF);
      addEdges(body, wire, [0, 0, 0]);

      // — Cristales, cortes de chapa y salpicaderas —
      bothFlanks([...GLASS, GLASS[0]], boneWire);
      for (const cut of CUTS) bothFlanks(cut, wireSoft);
      bothFlanks(archPoints(AXLE_X), wire);
      bothFlanks(archPoints(-AXLE_X), wire);

      // — Ruedas: un disco visto de fuera. Un cilindro completo se leía como
      //   barril y se comía el coche. —
      for (const x of [AXLE_X, -AXLE_X]) {
        for (const z of [WHEEL_Z, -WHEEL_Z]) {
          circle(x, WHEEL_Y, z, TYRE_R, 14, wire);
          circle(x, WHEEL_Y, z, TYRE_R * 0.62, 12, wireSoft);
          const spokes: THREE.Vector3[] = [];
          for (let i = 0; i < 5; i++) {
            const a = (i / 5) * Math.PI * 2 + 0.3;
            spokes.push(
              new THREE.Vector3(
                x + TYRE_R * 0.16 * Math.cos(a),
                WHEEL_Y + TYRE_R * 0.16 * Math.sin(a),
                z
              ),
              new THREE.Vector3(
                x + TYRE_R * 0.6 * Math.cos(a),
                WHEEL_Y + TYRE_R * 0.6 * Math.sin(a),
                z
              )
            );
          }
          car.add(
            new THREE.LineSegments(
              new THREE.BufferGeometry().setFromPoints(spokes),
              wireSoft
            )
          );
        }
      }

      // — Alerón trasero: la firma del coche. Pala sobre dos soportes. —
      addEdges(
        new THREE.BoxGeometry(0.38, 0.05, 1.42),
        wire,
        [-1.9, 1.38, 0],
        1,
        [0, 0, 0.05]
      );
      for (const z of [0.58, -0.58]) {
        addEdges(new THREE.BoxGeometry(0.22, 0.3, 0.05), wireSoft, [-1.86, 1.21, z], 1);
      }

      // — Triple salida de escape al centro —
      for (const z of [-0.23, 0, 0.23]) {
        addEdges(
          new THREE.CircleGeometry(z === 0 ? 0.085 : 0.07, 12),
          z === 0 ? hot : boneWire,
          [-2.14, 0.28, z],
          1,
          [0, -Math.PI / 2, 0]
        );
      }

      // — Luces. Los faros son hueso; el bermellón se guarda para la barra de
      //   calaveras y la insignia del morro, que es donde de verdad va. —
      const lampPts: THREE.Vector3[] = [];
      for (const z of [0.68, -0.68]) {
        lampPts.push(
          new THREE.Vector3(2.08, 0.72, z - 0.16),
          new THREE.Vector3(2.15, 0.7, z + 0.16)
        );
      }
      car.add(
        new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(lampPts), lamp)
      );

      car.add(
        new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-2.05, 0.84, -0.82),
            new THREE.Vector3(-2.05, 0.84, 0.82),
          ]),
          hot
        )
      );

      // Insignia en la parrilla: el rectángulo rojo del morro.
      addEdges(new THREE.BoxGeometry(0.02, 0.07, 0.16), hot, [2.18, 0.58, 0], 1);

      // — Suelo de pit lane: dos hairlines cortas bajo el coche. Antes iban de
      //   -4.2 a 4.2 y con la perspectiva salían disparadas hasta los bordes
      //   de la sección, leyéndose como líneas sueltas en vez de suelo. —
      const floor = new THREE.LineBasicMaterial({
        color: LIME,
        transparent: true,
        opacity: 0.14,
      });
      materials.push(floor);
      for (const z of [1.5, -1.5]) {
        car.add(
          new THREE.Line(
            new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(-2.4, -0.02, z),
              new THREE.Vector3(2.4, -0.02, z),
            ]),
            floor
          )
        );
      }

      // Reposo en tres cuartos: se ve el costado, el morro y algo de techo.
      const BASE_Y = -0.62;
      car.rotation.y = BASE_Y;
      car.position.y = -0.32;

      let targetX = 0;
      let targetY = 0;
      const onMove = (e: PointerEvent) => {
        const rect = container.getBoundingClientRect();
        targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.5;
        targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.22;
      };
      const onLeave = () => {
        targetX = 0;
        targetY = 0;
      };
      container.addEventListener("pointermove", onMove);
      container.addEventListener("pointerleave", onLeave);

      let tilt = 0;
      let lift = 0;
      const hotColor = new THREE.Color(VERMILION);

      return {
        tick: (dt, elapsed) => {
          const progress = THREE.MathUtils.clamp(progressRef.current, 0, 1);
          const rev = THREE.MathUtils.clamp(revRef?.current ?? 0, 0, 1);

          // El scroll da media vuelta: entras viéndole el morro y sales
          // viéndole la cola con el alerón.
          const spin = BASE_Y + (progress - 0.5) * 1.5;
          tilt += (targetX - tilt) * Math.min(1, dt * 3);
          lift += (targetY - lift) * Math.min(1, dt * 3);
          car.rotation.y = spin + tilt;
          car.rotation.x = lift * 0.5;
          if (!reduced) {
            // Ralentí: el coche respira sobre su suspensión.
            car.position.y = -0.32 + Math.sin(elapsed * 0.9) * 0.012;
            car.rotation.z = Math.sin(elapsed * 0.6) * 0.006;
          }

          // Faros: parpadeo de arranque en reposo, a tope con VTEC.
          const pulse = reduced ? 0.9 : 0.55 + Math.sin(elapsed * 1.7) * 0.2;
          lamp.opacity = THREE.MathUtils.lerp(pulse, 1, rev);
          hot.opacity = THREE.MathUtils.lerp(0.95, 1, rev);
          wire.color.setHex(LIME).lerp(hotColor, rev * 0.35);
        },
        dispose: () => {
          container.removeEventListener("pointermove", onMove);
          container.removeEventListener("pointerleave", onLeave);
          materials.forEach((m) => m.dispose());
        },
      };
    },
  });

  return <div ref={containerRef} className={className} aria-hidden />;
}
