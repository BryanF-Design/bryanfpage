"use client";

import { useSyncExternalStore } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const REDUCED_MOTION_CLASS = "a11y-reduce-motion";
const DECORATIVE_3D_QUERY = "(min-width: 768px)";

let mediaQuery: MediaQueryList | null = null;
let decorative3dQuery: MediaQueryList | null = null;

function getMediaQuery() {
  if (typeof window === "undefined") return null;
  mediaQuery ??= window.matchMedia(REDUCED_MOTION_QUERY);
  return mediaQuery;
}

function getDecorative3dQuery() {
  if (typeof window === "undefined") return null;
  decorative3dQuery ??= window.matchMedia(DECORATIVE_3D_QUERY);
  return decorative3dQuery;
}

/**
 * Returns the effective preference for the current browser session.
 *
 * The operating-system preference and the site's accessibility override are
 * intentionally additive: either one is enough to request reduced motion.
 */
export function isReducedMotionRequested() {
  if (typeof document === "undefined") return false;

  return (
    getMediaQuery()?.matches === true ||
    document.documentElement.classList.contains(REDUCED_MOTION_CLASS)
  );
}

/**
 * Subscribes to both sources of motion preference. The class observer makes
 * the accessibility-panel toggle effective immediately without a reload.
 */
export function subscribeReducedMotionPreference(listener: () => void) {
  if (typeof document === "undefined") return () => undefined;

  const query = getMediaQuery();
  query?.addEventListener("change", listener);

  const observer = new MutationObserver(listener);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  return () => {
    query?.removeEventListener("change", listener);
    observer.disconnect();
  };
}

/** Reactive effective preference for React and Framer Motion components. */
export function useReducedMotionPreference() {
  return useSyncExternalStore(
    subscribeReducedMotionPreference,
    isReducedMotionRequested,
    () => false
  );
}

function subscribeDecorative3dViewport(listener: () => void) {
  const query = getDecorative3dQuery();
  query?.addEventListener("change", listener);
  return () => query?.removeEventListener("change", listener);
}

function isDecorative3dViewport() {
  return getDecorative3dQuery()?.matches === true;
}

/**
 * Non-essential WebGL is reserved for desktop sessions that permit motion.
 * Mobile and reduced-motion users receive the same composition as static CSS.
 */
export function useDecorative3dEnabled() {
  const reducedMotion = useReducedMotionPreference();
  const desktopViewport = useSyncExternalStore(
    subscribeDecorative3dViewport,
    isDecorative3dViewport,
    () => false
  );

  return desktopViewport && !reducedMotion;
}

let webglSupport: boolean | null = null;

function detectWebgl() {
  if (typeof document === "undefined") return false;
  if (webglSupport !== null) return webglSupport;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    webglSupport = !!gl;
    // Libera el contexto de prueba: los navegadores móviles limitan cuántos
    // contextos WebGL viven a la vez.
    (gl as WebGLRenderingContext | null)?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

const noopSubscribe = () => () => undefined;

/**
 * 3D interactivo (el globo de presencia): se monta en cualquier pantalla,
 * teléfono incluido, siempre que el navegador tenga WebGL. Con movimiento
 * reducido la escena no gira sola (useThreeStage pinta cuadros fijos) pero
 * sigue respondiendo al arrastre, que es un gesto de la persona.
 */
export function useInteractive3dEnabled() {
  return useSyncExternalStore(noopSubscribe, detectWebgl, () => false);
}
