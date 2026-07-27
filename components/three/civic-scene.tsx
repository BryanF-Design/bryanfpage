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
}

const MODEL_URL = "/models/civic/honda-civic-type-r-2023.gltf";

export function CivicScene({
  progressRef,
  className,
  ariaLabel,
  onLoadProgress,
  onReady,
  onError,
}: CivicSceneProps) {
  const dragYaw = useRef(0);
  const dragging = useRef(false);
  const progressCallback = useRef(onLoadProgress);
  const readyCallback = useRef(onReady);
  const errorCallback = useRef(onError);
  progressCallback.current = onLoadProgress;
  readyCallback.current = onReady;
  errorCallback.current = onError;

  const { containerRef } = useThreeStage({
    fov: 30,
    cameraZ: 5.8,
    maxDpr: 1.5,
    build: ({ scene, camera, renderer, container }) => {
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.94;

      camera.position.set(3.6, 1.9, 5.8);
      camera.lookAt(0, 0.52, 0);

      const stage = new THREE.Group();
      stage.rotation.y = -0.6;
      scene.add(stage);

      scene.add(new THREE.HemisphereLight(0xf2f3ec, 0x06100c, 1.15));

      const key = new THREE.DirectionalLight(0xffffff, 2.15);
      key.position.set(4.5, 6, 5);
      scene.add(key);

      const limeRim = new THREE.PointLight(0xb4e332, 22, 13, 1.6);
      limeRim.position.set(-3.2, 1.5, -2.8);
      scene.add(limeRim);

      const signalRim = new THREE.PointLight(0xe8342a, 14, 10, 1.8);
      signalRim.position.set(2.8, 0.9, -3.4);
      scene.add(signalRim);

      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(18, 18),
        new THREE.MeshStandardMaterial({
          color: 0x07110d,
          metalness: 0.18,
          roughness: 0.76,
          transparent: true,
          opacity: 0.84,
        })
      );
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -0.055;
      stage.add(floor);

      const grid = new THREE.GridHelper(16, 28, 0xb4e332, 0x273128);
      grid.position.y = -0.048;
      const gridMaterial = grid.material as THREE.LineBasicMaterial;
      gridMaterial.transparent = true;
      gridMaterial.opacity = 0.34;
      stage.add(grid);

      const routeCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-6, 0.01, 2.6),
        new THREE.Vector3(-3.4, 0.01, 0.4),
        new THREE.Vector3(-0.8, 0.01, -2.3),
        new THREE.Vector3(2.2, 0.01, -1.2),
        new THREE.Vector3(5.8, 0.01, 1.8),
      ]);
      const route = new THREE.Mesh(
        new THREE.TubeGeometry(routeCurve, 96, 0.018, 5, false),
        new THREE.MeshBasicMaterial({
          color: 0xb4e332,
          transparent: true,
          opacity: 0.82,
          toneMapped: false,
        })
      );
      stage.add(route);

      const apex = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 12, 8),
        new THREE.MeshBasicMaterial({ color: 0xe8342a, toneMapped: false })
      );
      apex.position.copy(routeCurve.getPointAt(0.57));
      apex.position.y = 0.045;
      stage.add(apex);

      const modelRoot = new THREE.Group();
      modelRoot.position.y = 0.04;
      stage.add(modelRoot);

      let car: THREE.Object3D | null = null;
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

          car = new THREE.Group();
          model.position.set(-center.x, -box.min.y, -center.z);
          car.add(model);
          car.scale.setScalar(scale);
          car.rotation.y = Math.PI * 0.5;

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

          modelRoot.add(car);
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

      container.style.touchAction = "pan-y";
      container.style.cursor = "grab";
      let lastX = 0;

      const onPointerDown = (event: PointerEvent) => {
        dragging.current = true;
        lastX = event.clientX;
        container.style.cursor = "grabbing";
        container.setPointerCapture(event.pointerId);
      };
      const onPointerMove = (event: PointerEvent) => {
        if (!dragging.current) return;
        dragYaw.current += (event.clientX - lastX) * 0.006;
        dragYaw.current = THREE.MathUtils.clamp(dragYaw.current, -1.05, 1.05);
        lastX = event.clientX;
        requestStageFrame(container);
      };
      const onPointerUp = (event: PointerEvent) => {
        dragging.current = false;
        container.style.cursor = "grab";
        try {
          container.releasePointerCapture(event.pointerId);
        } catch {
          // Pointer capture may already have been released by the browser.
        }
      };

      container.addEventListener("pointerdown", onPointerDown);
      container.addEventListener("pointermove", onPointerMove);
      container.addEventListener("pointerup", onPointerUp);
      container.addEventListener("pointercancel", onPointerUp);

      const tick = (dt: number, elapsed: number) => {
        if (!loaded) return false;

        const reduced = isReducedMotionRequested();
        const progress = reduced
          ? 0.52
          : THREE.MathUtils.clamp(progressRef.current, 0, 1);

        if (!dragging.current) {
          dragYaw.current *= 1 - Math.min(1, dt * 1.25);
        }

        const scrollYaw = THREE.MathUtils.lerp(-0.4, 0.72, progress);
        const ambientYaw = reduced || dragging.current ? 0 : Math.sin(elapsed * 0.28) * 0.055;
        stage.rotation.y +=
          (scrollYaw + dragYaw.current + ambientYaw - stage.rotation.y) *
          Math.min(1, dt * 4.4);

        stage.position.y = reduced ? 0 : Math.sin(elapsed * 0.7) * 0.018;
        route.material &&
          ((route.material as THREE.MeshBasicMaterial).opacity =
            0.58 + progress * 0.3);
        apex.scale.setScalar(0.8 + Math.sin(elapsed * 2.1) * 0.15);

        return true;
      };

      return {
        tick,
        dispose: () => {
          disposed = true;
          container.removeEventListener("pointerdown", onPointerDown);
          container.removeEventListener("pointermove", onPointerMove);
          container.removeEventListener("pointerup", onPointerUp);
          container.removeEventListener("pointercancel", onPointerUp);
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
    />
  );
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
