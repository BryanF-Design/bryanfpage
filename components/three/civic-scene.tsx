"use client";

import { useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { isReducedMotionRequested } from "@/lib/motion-preference";
import { requestStageFrame, useThreeStage } from "@/lib/three/stage";

interface CivicSceneProps {
  progressRef: MutableRefObject<number>;
  className?: string;
  ariaLabel: string;
  onLoadProgress?: (progress: number) => void;
  onReady?: () => void;
  onError?: () => void;
  /** Telemetría para la tira de datos del hero. Solo emite cuando cambia. */
  onSpeed?: (kmh: number) => void;
}

const MODEL_URL = "/models/civic/honda-civic-type-r-2023.gltf";

/**
 * Velocidad de crucero. El auto nunca está detenido: aunque nadie toque nada,
 * las llantas giran y el piso corre. Con reduced motion esto pasa a 0.
 */
const CRUISE = 0.46;
/** Tope de la simulación: con acelerón y scroll a fondo se llega aquí. */
const MAX_SPEED = 1.35;
/** 1.0 de «speed» ≈ 186 km/h; el pico queda cerca del tope real del Type R. */
const KMH_PER_UNIT = 186;
/** rad/s. Techo para que los rayos de la llanta no estroboscopien a 60 fps. */
const MAX_SPIN = 15.5;
/** Líneas de velocidad (流線) y largo del circuito por el que se reciclan. */
const STREAK_COUNT = 72;
const STREAK_SPAN = 15;

const LIME = new THREE.Color(0xb4e332);
const SIGNAL = new THREE.Color(0xe8342a);
const BONE = new THREE.Color(0xf2f3ec);

interface Wheel {
  /** Giro de dirección (eje Y). Solo el tren delantero lo usa. */
  steer: THREE.Group;
  /** Giro de rodadura (eje X). */
  spin: THREE.Group;
  front: boolean;
  /** -1 izquierda, 1 derecha. Marca hacia dónde queda la cara exterior. */
  side: number;
  radius: number;
  width: number;
}

interface Streak {
  x: number;
  y: number;
  z: number;
  len: number;
  rate: number;
  color: THREE.Color;
}

export function CivicScene({
  progressRef,
  className,
  ariaLabel,
  onLoadProgress,
  onReady,
  onError,
  onSpeed,
}: CivicSceneProps) {
  const dragYaw = useRef(0);
  const dragging = useRef(false);
  const progressCallback = useRef(onLoadProgress);
  const readyCallback = useRef(onReady);
  const errorCallback = useRef(onError);
  const speedCallback = useRef(onSpeed);
  progressCallback.current = onLoadProgress;
  readyCallback.current = onReady;
  errorCallback.current = onError;
  speedCallback.current = onSpeed;

  const { containerRef } = useThreeStage({
    fov: 30,
    cameraZ: 5.8,
    maxDpr: 1.5,
    build: ({ scene, camera, renderer, container }) => {
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.94;

      // Cámara más baja y algo más lejos: encuadre de póster, no de inspector
      // de assets mirando desde arriba.
      const cameraHome = new THREE.Vector3(3.9, 1.42, 6.15);
      const cameraAim = new THREE.Vector3(0, 0.46, 0);
      camera.position.copy(cameraHome);
      camera.lookAt(cameraAim);

      const stage = new THREE.Group();
      stage.rotation.y = -0.6;
      scene.add(stage);

      // 走路. Todo lo que tiene dirección de marcha vive aquí: dentro de este
      // grupo el +Z es el morro del auto, así que las líneas de velocidad
      // corren hacia -Z sin importar cuánto haya girado el escenario.
      const road = new THREE.Group();
      road.rotation.y = Math.PI * 0.5;
      stage.add(road);

      scene.add(new THREE.HemisphereLight(0xf2f3ec, 0x06100c, 1.05));

      const key = new THREE.DirectionalLight(0xffffff, 2.4);
      key.position.set(4.5, 6, 5);
      scene.add(key);

      // El rim lima estaba en intensidad 22 y teñía de verde toda la
      // carrocería: el auto se leía como asset iluminado, no como fotografía.
      const limeRim = new THREE.PointLight(0xb4e332, 6, 12, 1.8);
      limeRim.position.set(-3.2, 1.5, -2.8);
      scene.add(limeRim);

      const signalRim = new THREE.PointLight(0xe8342a, 7, 9, 1.9);
      signalRim.position.set(2.8, 0.9, -3.4);
      scene.add(signalRim);

      // Sombra de contacto. Reemplaza al piso plano + GridHelper verde que
      // hacían de suelo: aquellos dibujaban una grilla de videojuego con un
      // borde recto muy visible donde terminaba el plano. Esto solo oscurece
      // debajo del auto y se desvanece, así que el Civic apoya en vez de
      // flotar y el horizonte lo pone el DOM.
      const contact = new THREE.Mesh(
        new THREE.PlaneGeometry(7.2, 4.4),
        new THREE.MeshBasicMaterial({
          transparent: true,
          depthWrite: false,
          opacity: 0.72,
          map: makeContactShadow(),
          toneMapped: false,
        })
      );
      contact.rotation.x = -Math.PI / 2;
      contact.position.y = -0.045;
      road.add(contact);

      // 流線. Rayas finas que cruzan el encuadre hacia atrás: son las que
      // convierten un auto quieto en un auto lanzado. No dibujan piso —son
      // aditivas y de 1 px— así que no reponen la grilla que se quitó.
      const streaks = createStreaks();
      road.add(streaks.lines);

      const modelRoot = new THREE.Group();
      modelRoot.position.y = 0.04;
      road.add(modelRoot);

      // Chasis: cabeceo, balanceo y rebote de suspensión. Va aparte de la
      // escala del modelo para que la carrocería se mueva sobre las llantas y
      // no las arrastre consigo.
      const chassis = new THREE.Group();
      modelRoot.add(chassis);

      let car: THREE.Object3D | null = null;
      let wheels: Wheel[] = [];
      let brakeBar: THREE.Mesh | null = null;
      let lamps: THREE.MeshStandardMaterial[] = [];
      let wheelBlur: THREE.Mesh[] = [];
      let disposed = false;
      let loaded = false;

      const loader = new GLTFLoader();
      loader.load(
        MODEL_URL,
        (gltf) => {
          if (disposed) {
            disposeObject(gltf.scene);
            return;
          }

          const model = gltf.scene;
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          const longest = Math.max(size.x, size.y, size.z);
          const compact = container.clientWidth < 700;
          const scale = (compact ? 2.55 : 3) / Math.max(longest, 0.001);

          // El rig se arma con el modelo todavía sin transformar: así el
          // espacio local del glTF y el mundo coinciden y los centros de rueda
          // salen directos del bounding box de cada malla.
          wheels = rigWheels(model);
          wheelBlur = wheels.map((wheel) => addWheelBlur(wheel));
          brakeBar = addBrakeBar(model);
          lamps = litLamps(model);

          car = new THREE.Group();
          model.position.set(-center.x, -box.min.y, -center.z);
          car.add(model);
          car.scale.setScalar(scale);

          model.traverse((object) => {
            const mesh = object as THREE.Mesh;
            if (!mesh.isMesh) return;
            mesh.castShadow = false;
            mesh.receiveShadow = false;

            const materials = Array.isArray(mesh.material)
              ? mesh.material
              : [mesh.material];
            materials.forEach((material) => {
              const standard = material as THREE.MeshStandardMaterial;
              if ("envMapIntensity" in standard) standard.envMapIntensity = 0.8;
              const maps = [
                standard.map,
                standard.normalMap,
                standard.roughnessMap,
                standard.metalnessMap,
                standard.emissiveMap,
              ];
              maps.forEach((texture) => {
                if (texture) {
                  texture.anisotropy = Math.min(
                    4,
                    renderer.capabilities.getMaxAnisotropy()
                  );
                }
              });
            });
          });

          chassis.add(car);
          loaded = true;
          progressCallback.current?.(1);
          readyCallback.current?.();
          requestStageFrame(container);
        },
        (event) => {
          if (!event.total) return;
          progressCallback.current?.(
            THREE.MathUtils.clamp(event.loaded / event.total, 0, 0.99)
          );
        },
        () => {
          if (!disposed) errorCallback.current?.();
        }
      );

      // ——— Entrada ————————————————————————————————————————————————
      // Arrastrar gira y mete contravolante; soltar deja inercia; un toque
      // seco —sin arrastre— es un acelerón; el teclado hace lo mismo para
      // quien no usa puntero.
      container.style.touchAction = "pan-y";
      container.style.cursor = "grab";

      let lastX = 0;
      let lastY = 0;
      let flick = 0;
      let dragImpulse = 0;
      let tilt = 0;
      let pointerX = 0;
      let pointerY = 0;
      let pressStamp = 0;
      let pressTravel = 0;
      let boost = 0;

      const kick = () => {
        if (isReducedMotionRequested()) return;
        boost = Math.min(1.2, boost + 0.9);
        requestStageFrame(container);
      };

      const onPointerDown = (event: PointerEvent) => {
        dragging.current = true;
        lastX = event.clientX;
        lastY = event.clientY;
        pressStamp = event.timeStamp;
        pressTravel = 0;
        flick = 0;
        container.style.cursor = "grabbing";
        container.setPointerCapture(event.pointerId);
      };

      const onPointerMove = (event: PointerEvent) => {
        const bounds = container.getBoundingClientRect();
        pointerX = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
        pointerY = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;

        // El paralaje solo se ve cuando el bucle corre. Pedir cuadros por cada
        // movimiento del puntero repintaría lo mismo bajo reduced motion.
        if (!dragging.current) return;

        const dx = event.clientX - lastX;
        const dy = event.clientY - lastY;
        pressTravel += Math.abs(dx) + Math.abs(dy);

        const yaw = dx * 0.006;
        dragYaw.current = THREE.MathUtils.clamp(
          dragYaw.current + yaw,
          -1.15,
          1.15
        );
        // El giro que queda al soltar y el envión que le da a las llantas.
        flick = THREE.MathUtils.clamp(flick * 0.7 + yaw * 22, -3.4, 3.4);
        dragImpulse = Math.min(0.55, dragImpulse + Math.abs(yaw) * 1.6);

        // Vertical solo con mouse o lápiz: en táctil ese gesto es el scroll de
        // la página y robárselo deja el hero sin salida.
        if (event.pointerType !== "touch") {
          tilt = THREE.MathUtils.clamp(tilt + dy * 0.004, -0.5, 0.75);
        }

        lastX = event.clientX;
        lastY = event.clientY;
        requestStageFrame(container);
      };

      const onPointerUp = (event: PointerEvent) => {
        if (dragging.current && pressTravel < 8 && event.timeStamp - pressStamp < 420) {
          kick();
        }
        dragging.current = false;
        container.style.cursor = "grab";
        try {
          container.releasePointerCapture(event.pointerId);
        } catch {
          // Pointer capture may already have been released by the browser.
        }
      };

      const onPointerLeave = () => {
        pointerX = 0;
        pointerY = 0;
      };

      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          const direction = event.key === "ArrowLeft" ? -1 : 1;
          dragYaw.current = THREE.MathUtils.clamp(
            dragYaw.current + direction * 0.16,
            -1.15,
            1.15
          );
          flick = direction * 1.1;
          dragImpulse = Math.min(0.55, dragImpulse + 0.16);
          event.preventDefault();
          requestStageFrame(container);
          return;
        }
        if (event.key === " " || event.key === "Enter") {
          kick();
          event.preventDefault();
        }
      };

      container.addEventListener("pointerdown", onPointerDown);
      container.addEventListener("pointermove", onPointerMove);
      container.addEventListener("pointerup", onPointerUp);
      container.addEventListener("pointercancel", onPointerUp);
      container.addEventListener("pointerleave", onPointerLeave);
      container.addEventListener("keydown", onKeyDown);

      // ——— Simulación —————————————————————————————————————————————
      let speed = 0;
      let accel = 0;
      let steer = 0;
      let spinAngle = 0;
      let brake = 0;
      let lastProgress = THREE.MathUtils.clamp(progressRef.current, 0, 1);
      let telemetryAt = 0;
      let lastKmh = -1;

      const cameraWanted = new THREE.Vector3();
      const aimWanted = new THREE.Vector3();

      const tick = (dt: number, elapsed: number) => {
        if (!loaded) return false;

        const reduced = isReducedMotionRequested();
        const progress = reduced
          ? 0.52
          : THREE.MathUtils.clamp(progressRef.current, 0, 1);

        if (reduced) {
          speed = 0;
          boost = 0;
          dragImpulse = 0;
        }

        // Velocidad: crucero + scroll + arrastre + acelerón, con inercia.
        const scrollRate = Math.abs(progress - lastProgress) / Math.max(dt, 0.004);
        lastProgress = progress;

        const target = reduced
          ? 0
          : Math.min(
              MAX_SPEED,
              CRUISE + Math.min(0.72, scrollRate * 0.85) + dragImpulse + boost
            );
        const previous = speed;
        speed += (target - speed) * Math.min(1, dt * 3.1);
        accel = (speed - previous) / Math.max(dt, 0.004);

        boost *= Math.exp(-dt * 1.7);
        dragImpulse *= Math.exp(-dt * 2.6);
        brake +=
          (THREE.MathUtils.clamp(-accel * 0.6, 0, 1) - brake) * Math.min(1, dt * 8);

        // Giro del escenario: scroll + arrastre + inercia del soltón.
        if (!dragging.current) {
          dragYaw.current += flick * dt;
          flick *= Math.exp(-dt * 3.6);
          dragYaw.current *= 1 - Math.min(1, dt * 1.15);
          dragYaw.current = THREE.MathUtils.clamp(dragYaw.current, -1.15, 1.15);
        }

        const scrollYaw = THREE.MathUtils.lerp(-0.4, 0.72, progress);
        const ambientYaw =
          reduced || dragging.current ? 0 : Math.sin(elapsed * 0.28) * 0.055;
        stage.rotation.y +=
          (scrollYaw + dragYaw.current + ambientYaw - stage.rotation.y) *
          Math.min(1, dt * 4.4);

        // Dirección: el volante sigue al arrastre, y el chasis se recuesta
        // hacia afuera como se recostaría de verdad.
        const steerWanted = reduced
          ? 0
          : THREE.MathUtils.clamp(dragYaw.current * 0.34 + flick * 0.05, -0.42, 0.42);
        steer += (steerWanted - steer) * Math.min(1, dt * 5.5);

        // Rodadura. El tope evita que los rayos estroboscopien.
        const spinRate = Math.min(MAX_SPIN, speed * 13.5);
        spinAngle = (spinAngle + spinRate * dt) % (Math.PI * 2);
        wheels.forEach((wheel) => {
          wheel.spin.rotation.x = spinAngle;
          if (wheel.front) wheel.steer.rotation.y = steer;
        });
        const blurAmount = THREE.MathUtils.clamp((speed - 0.55) * 1.15, 0, 0.62);
        wheelBlur.forEach((blur) => {
          const material = blur.material as THREE.MeshBasicMaterial;
          material.opacity = blurAmount;
          blur.visible = blurAmount > 0.01;
        });

        // Carrocería: rebote de suspensión, cabeceo al acelerar/frenar y
        // balanceo con la dirección.
        const bounce = reduced
          ? 0
          : Math.sin(elapsed * 9.4) * 0.006 * speed +
            Math.sin(elapsed * 3.1 + 1.2) * 0.004 * speed;
        chassis.position.y = bounce;
        chassis.rotation.x +=
          (THREE.MathUtils.clamp(-accel * 0.05, -0.05, 0.045) - chassis.rotation.x) *
          Math.min(1, dt * 4.5);
        chassis.rotation.z += (steer * 0.09 - chassis.rotation.z) * Math.min(1, dt * 4);

        // El escenario entero flota apenas, como en la versión anterior.
        stage.position.y = reduced ? 0 : Math.sin(elapsed * 0.7) * 0.018;

        // Piso y luces reaccionan a la velocidad.
        contact.scale.set(1, 1 + speed * 0.2, 1);
        (contact.material as THREE.MeshBasicMaterial).opacity = 0.72 - speed * 0.12;

        updateStreaks(streaks, speed, dt);

        lamps.forEach((lamp) => {
          lamp.emissiveIntensity = reduced ? 0.22 : 0.28 + speed * 0.14 + boost * 0.2;
        });
        if (brakeBar) {
          const material = brakeBar.material as THREE.MeshBasicMaterial;
          material.opacity = reduced ? 0.2 : 0.18 + brake * 0.72;
        }

        limeRim.intensity = 6 + boost * 5;
        signalRim.intensity = 7 + brake * 6;

        // Cámara: paralaje con el puntero, inclinación con el arrastre
        // vertical y un tirón hacia atrás en cada acelerón.
        if (!reduced) {
          tilt *= 1 - Math.min(1, dt * 0.6);
          cameraWanted.set(
            cameraHome.x + pointerX * 0.34,
            cameraHome.y - pointerY * 0.26 + tilt,
            cameraHome.z + boost * 0.55
          );
          camera.position.lerp(cameraWanted, Math.min(1, dt * 2.6));
          aimWanted.set(cameraAim.x, cameraAim.y + tilt * 0.35, cameraAim.z);
          camera.lookAt(aimWanted);
        }

        // Telemetría para la tira de datos. Se emite como mucho ~10 veces por
        // segundo: el hero escribe en el DOM, no re-renderiza React.
        if (speedCallback.current && elapsed - telemetryAt > 0.1) {
          telemetryAt = elapsed;
          const kmh = Math.round(speed * KMH_PER_UNIT);
          if (kmh !== lastKmh) {
            lastKmh = kmh;
            speedCallback.current(kmh);
          }
        }

        return true;
      };

      return {
        tick,
        dispose: () => {
          disposed = true;
          (contact.material as THREE.MeshBasicMaterial).map?.dispose();
          container.removeEventListener("pointerdown", onPointerDown);
          container.removeEventListener("pointermove", onPointerMove);
          container.removeEventListener("pointerup", onPointerUp);
          container.removeEventListener("pointercancel", onPointerUp);
          container.removeEventListener("pointerleave", onPointerLeave);
          container.removeEventListener("keydown", onKeyDown);
        },
      };
    },
  });

  return (
    <div
      ref={containerRef}
      className={className}
      aria-label={ariaLabel}
      role="img"
      tabIndex={0}
    />
  );
}

/**
 * Reparenta llantas y neumáticos bajo dos pivotes por rueda: uno de dirección
 * (Y) y otro de rodadura (X). El glTF trae las cuatro ruedas sueltas en la
 * raíz de la escena, así que se agrupan por el signo de su centro: izquierda
 * o derecha, delantera o trasera.
 */
function rigWheels(model: THREE.Object3D): Wheel[] {
  const parts: { mesh: THREE.Object3D; box: THREE.Box3 }[] = [];

  model.updateMatrixWorld(true);
  model.traverse((object) => {
    if (!(object as THREE.Mesh).isMesh) return;
    if (!/rim|tyre|tire|wheel/i.test(object.name)) return;
    parts.push({ mesh: object, box: new THREE.Box3().setFromObject(object) });
  });
  if (parts.length < 4) return [];

  const buckets = new Map<string, typeof parts>();
  const center = new THREE.Vector3();
  parts.forEach((part) => {
    part.box.getCenter(center);
    model.worldToLocal(center);
    const corner = `${center.x < 0 ? "l" : "r"}${center.z < 0 ? "b" : "f"}`;
    const bucket = buckets.get(corner);
    if (bucket) bucket.push(part);
    else buckets.set(corner, [part]);
  });

  const wheels: Wheel[] = [];
  buckets.forEach((bucket, corner) => {
    const union = bucket[0].box.clone();
    bucket.slice(1).forEach((part) => union.union(part.box));

    const hub = model.worldToLocal(union.getCenter(new THREE.Vector3()));
    const size = union.getSize(new THREE.Vector3());

    const steer = new THREE.Group();
    steer.position.copy(hub);
    const spin = new THREE.Group();
    steer.add(spin);
    model.add(steer);
    steer.updateMatrixWorld(true);

    // attach() conserva la transformación en mundo: la rueda no se mueve un
    // milímetro al cambiar de padre, solo gana un centro de giro.
    bucket.forEach((part) => spin.attach(part.mesh));

    wheels.push({
      steer,
      spin,
      front: corner.endsWith("f"),
      side: corner.startsWith("l") ? -1 : 1,
      // El eje es X, así que el diámetro está en el plano YZ y el ancho en X.
      radius: Math.max(size.y, size.z) / 2,
      width: size.x,
    });
  });

  return wheels;
}

/**
 * Disco de barrido en la cara exterior de cada rueda. Encima de cierta
 * velocidad el ojo espera ver la llanta desdibujada, no cinco rayos nítidos
 * girando despacio; esto compra ese desenfoque sin costar un post-proceso.
 */
function addWheelBlur(wheel: Wheel): THREE.Mesh {
  const blur = new THREE.Mesh(
    new THREE.PlaneGeometry(wheel.radius * 2.02, wheel.radius * 2.02),
    new THREE.MeshBasicMaterial({
      map: makeWheelBlur(),
      transparent: true,
      opacity: 0,
      depthWrite: false,
      side: THREE.DoubleSide,
      toneMapped: false,
    })
  );
  blur.rotation.y = Math.PI / 2;
  blur.position.x = wheel.side * (wheel.width / 2 + 0.004);
  blur.visible = false;
  wheel.steer.add(blur);
  return blur;
}

/**
 * Travesaño de freno: un plano aditivo pegado al grupo óptico trasero, que se
 * enciende cuando el auto desacelera (scroll hacia arriba, fin del acelerón).
 * La malla de luces del modelo comparte material con los intermitentes, así
 * que encenderlas por material teñiría también los espejos.
 */
function addBrakeBar(model: THREE.Object3D): THREE.Mesh | null {
  const candidates: THREE.Box3[] = [];
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();

  model.updateMatrixWorld(true);
  model.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (!mesh.isMesh) return;
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    if (!materials.some((material) => /light/i.test(material?.name ?? ""))) return;

    const box = new THREE.Box3().setFromObject(mesh);
    box.getSize(size);
    box.getCenter(center);
    // Ancho, plano y en la mitad trasera: eso es el travesaño, y no el faro
    // delantero ni el intermitente del espejo.
    if (center.z >= 0 || size.x < size.z * 2 || size.x < size.y * 3) return;
    candidates.push(box);
  });

  const box = candidates.sort((a, b) => a.max.z - b.max.z)[0];
  if (!box) return null;
  box.getSize(size);
  box.getCenter(center);

  const bar = new THREE.Mesh(
    new THREE.PlaneGeometry(size.x * 0.96, size.y * 0.8),
    new THREE.MeshBasicMaterial({
      color: 0xff2a1e,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    })
  );
  bar.position.set(center.x, center.y, box.min.z - 0.012);
  bar.rotation.y = Math.PI;
  model.add(bar);
  return bar;
}

/**
 * Enciende los ópticos. Un auto lanzado de noche lleva las luces puestas: sin
 * esto el modelo se lee apagado por muy rápido que corra. Se hace con emisivo
 * sobre la propia malla del faro —no con halos flotando delante del paragolpes—
 * para que la luz quede donde está el cristal y se oculte al girar el auto.
 */
function litLamps(model: THREE.Object3D): THREE.MeshStandardMaterial[] {
  const lamps: THREE.MeshStandardMaterial[] = [];

  model.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (!mesh.isMesh) return;
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

    const lit = materials.map((material) => {
      const standard = material as THREE.MeshStandardMaterial;
      if (!/light/i.test(standard?.name ?? "") || !standard.isMeshStandardMaterial) {
        return material;
      }
      const clone = standard.clone();
      clone.emissive = new THREE.Color(0xf4f8e4);
      clone.emissiveMap = clone.map;
      clone.emissiveIntensity = 0.3;
      lamps.push(clone);
      return clone;
    });

    mesh.material = Array.isArray(mesh.material) ? lit : lit[0];
  });

  return lamps;
}

/**
 * 流線. Un solo LineSegments con todas las rayas: dos tercios rasantes al
 * piso —la marca del asfalto pasando— y el resto a la altura de la carrocería,
 * como aire cortado. Se reciclan por un circuito de 15 unidades y se apagan en
 * los extremos, así que nunca se ve aparecer una.
 */
function createStreaks() {
  const lanes: Streak[] = Array.from({ length: STREAK_COUNT }, (_, index) => {
    // Casi todas rasantes al piso: ahí leen como asfalto pasando. Las pocas
    // altas se quedan por debajo de la cintura del auto, porque una raya
    // flotando a la altura del techo se lee como rayón en el lente, no como
    // velocidad. Y ninguna se aleja más de 2.2 del eje: fuera de esa banda
    // caían sobre el titular.
    const airborne = index % 6 === 0;
    const side = index % 2 === 0 ? 1 : -1;
    return {
      x: side * (0.5 + Math.random() * 1.7),
      y: airborne ? 0.16 + Math.random() * 0.42 : 0.004 + Math.random() * 0.026,
      z: -STREAK_SPAN / 2 + Math.random() * STREAK_SPAN,
      len: 0.4 + Math.random() * 1.15,
      rate: 0.7 + Math.random() * 0.95,
      color: index % 17 === 0 ? SIGNAL : index % 3 === 0 ? LIME : BONE,
    };
  });

  const positions = new Float32Array(STREAK_COUNT * 6);
  const colors = new Float32Array(STREAK_COUNT * 6);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const lines = new THREE.LineSegments(
    geometry,
    new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    })
  );
  lines.frustumCulled = false;

  return { lines, lanes, positions, colors };
}

type Streaks = ReturnType<typeof createStreaks>;

function updateStreaks(streaks: Streaks, speed: number, dt: number) {
  const { lanes, positions, colors, lines } = streaks;
  const material = lines.material as THREE.LineBasicMaterial;
  material.opacity = THREE.MathUtils.clamp(speed * 0.62, 0, 0.62);
  if (material.opacity <= 0.01) {
    lines.visible = false;
    return;
  }
  lines.visible = true;

  const travel = speed * 11 * dt;
  const half = STREAK_SPAN / 2;

  for (let index = 0; index < lanes.length; index += 1) {
    const lane = lanes[index];
    lane.z -= travel * lane.rate;
    if (lane.z < -half) lane.z += STREAK_SPAN;

    const length = lane.len * (0.3 + speed * 1.35);
    const edge = 1 - (lane.z / half) ** 2;
    const fade = Math.max(0, edge);

    const p = index * 6;
    positions[p] = lane.x;
    positions[p + 1] = lane.y;
    positions[p + 2] = lane.z;
    positions[p + 3] = lane.x;
    positions[p + 4] = lane.y;
    positions[p + 5] = lane.z + length;

    colors[p] = lane.color.r * fade;
    colors[p + 1] = lane.color.g * fade;
    colors[p + 2] = lane.color.b * fade;
    colors[p + 3] = lane.color.r * fade * 0.04;
    colors[p + 4] = lane.color.g * fade * 0.04;
    colors[p + 5] = lane.color.b * fade * 0.04;
  }

  lines.geometry.attributes.position.needsUpdate = true;
  lines.geometry.attributes.color.needsUpdate = true;
}

/**
 * Sombra de contacto pintada en canvas: una elipse difusa que se desvanece a
 * transparente. Es más barata que activar mapas de sombra en el renderer y no
 * deja el borde recto que delataba al plano anterior.
 */
function makeContactShadow() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );
    gradient.addColorStop(0, "rgba(0,0,0,0.92)");
    gradient.addColorStop(0.42, "rgba(0,0,0,0.55)");
    gradient.addColorStop(0.72, "rgba(0,0,0,0.16)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Disco gris con un aro claro al borde: una llanta girando, sin rayos. */
function makeWheelBlur() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );
    gradient.addColorStop(0, "rgba(10,12,10,0)");
    gradient.addColorStop(0.26, "rgba(14,16,14,0.35)");
    gradient.addColorStop(0.62, "rgba(24,27,23,0.72)");
    gradient.addColorStop(0.87, "rgba(58,64,52,0.8)");
    gradient.addColorStop(0.95, "rgba(120,132,104,0.45)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function disposeObject(root: THREE.Object3D) {
  root.traverse((object) => {
    const mesh = object as THREE.Mesh;
    mesh.geometry?.dispose();
    const materials = Array.isArray(mesh.material)
      ? mesh.material
      : mesh.material
        ? [mesh.material]
        : [];
    materials.forEach((material) => {
      Object.values(material).forEach((value) => {
        if (value instanceof THREE.Texture) value.dispose();
      });
      material.dispose();
    });
  });
}
