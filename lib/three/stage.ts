"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export interface ThreeStage {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  container: HTMLDivElement;
}

/** Per-frame tick. Return false to skip rendering that frame (nothing changed). */
export type StageTick = (dt: number, elapsed: number) => void | boolean;

interface StageOptions {
  /** Build the scene once; return the per-frame tick. */
  build: (stage: ThreeStage) => StageTick;
  fov?: number;
  cameraZ?: number;
  /** Cap for devicePixelRatio. 3D here is ambience, not the LCP. */
  maxDpr?: number;
}

/**
 * Shared lifecycle for every 3D moment on the site. The rules that keep
 * Core Web Vitals intact live here, not in each scene:
 *  - the render loop only runs while the canvas is actually on screen
 *    (IntersectionObserver) and the tab is visible (visibilitychange)
 *  - devicePixelRatio is capped
 *  - everything is disposed on unmount (geometries, materials, textures, GL)
 *  - prefers-reduced-motion renders stills: one frame on mount/resize and
 *    whatever frames user interaction requests, no idle animation
 */
export function useThreeStage({ build, fov = 40, cameraZ = 5, maxDpr = 1.75 }: StageOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buildRef = useRef(build);
  buildRef.current = build;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      fov,
      container.clientWidth / Math.max(1, container.clientHeight),
      0.1,
      100
    );
    camera.position.z = cameraZ;

    const tick = buildRef.current({ scene, camera, renderer, container });

    let raf = 0;
    let running = false;
    let onScreen = false;
    let last = performance.now();
    const start = last;

    function renderFrame(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const skip = tick(dt, (now - start) / 1000) === false;
      if (!skip) renderer.render(scene, camera);
    }

    function loop(now: number) {
      if (!running) return;
      renderFrame(now);
      raf = requestAnimationFrame(loop);
    }

    function setRunning(next: boolean) {
      if (next === running) return;
      running = next;
      if (running) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      } else {
        cancelAnimationFrame(raf);
      }
    }

    function update() {
      setRunning(onScreen && !document.hidden && !reduced);
    }

    // Reduced motion: draw stills on demand instead of a loop.
    function still() {
      renderFrame(performance.now());
    }
    if (reduced) still();
    // Scenes can request extra frames (e.g. while dragging under reduced
    // motion) through this hook-provided event.
    const requestStill = () => {
      if (!running) still();
    };
    container.addEventListener("three-frame", requestStill);

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        update();
      },
      { rootMargin: "80px" }
    );
    io.observe(container);

    const onVisibility = () => update();
    document.addEventListener("visibilitychange", onVisibility);

    const ro = new ResizeObserver(() => {
      const w = container.clientWidth;
      const h = Math.max(1, container.clientHeight);
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (reduced) still();
    });
    ro.observe(container);

    return () => {
      setRunning(false);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      container.removeEventListener("three-frame", requestStill);
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(material)) material.forEach(disposeMaterial);
        else if (material) disposeMaterial(material);
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { containerRef };
}

function disposeMaterial(material: THREE.Material) {
  const withMaps = material as THREE.Material & { map?: THREE.Texture | null };
  if (withMaps.map) withMaps.map.dispose();
  material.dispose();
}

/** Ask the stage for one extra frame (used while dragging under reduced motion). */
export function requestStageFrame(container: HTMLElement | null) {
  container?.dispatchEvent(new CustomEvent("three-frame"));
}

/** Latitude/longitude to a position on a sphere of radius r. */
export function latLngToVec3(lat: number, lng: number, r: number): THREE.Vector3 {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}
