"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

/**
 * Shared collision signal for the purchase configurator (#precios). Floating
 * helpers (Lumina, the contact dock, the accessibility tab, the language
 * notice and the configurator's own total bar) read the same value, so none
 * of them drift into the buying controls — and they always agree.
 *
 * Why not one IntersectionObserver per consumer: each one looked up #precios
 * once, on mount. The configurator is code-split, so consumers that mounted
 * before it (reliably with "reduce motion" on) got `null`, never retried and
 * stayed "not in view" for the whole visit. Here a single shared tracker
 * measures the *current* #precios on scroll/resize (one rect per frame), so a
 * late or re-mounted configurator is always picked up.
 *
 * Same thresholds as before: the viewport shrunk 12% at top and bottom, "in"
 * once ≥5% of the section is inside, "out" once nothing is (the hysteresis
 * an IntersectionObserver with `threshold: 0.05` has).
 */

const ROOT_INSET = 0.12;
const ENTER_RATIO = 0.05;

let inView = false;
let frame = 0;
const listeners = new Set<() => void>();
let teardown: (() => void) | null = null;

function measure() {
  frame = 0;
  const el = document.getElementById("precios");
  let next = false;
  if (el) {
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const visible = Math.min(rect.bottom, vh * (1 - ROOT_INSET)) - Math.max(rect.top, vh * ROOT_INSET);
    const ratio = rect.height > 0 ? visible / rect.height : 0;
    next = inView ? visible > 0 : ratio >= ENTER_RATIO;
  }
  if (next !== inView) {
    inView = next;
    listeners.forEach((listener) => listener());
  }
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(measure);
}

function start() {
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  // The configurator mounts late (code-split) and grows while it hydrates:
  // re-measure a few times after load in case nobody scrolls.
  const timers = [0, 300, 1200, 3000].map((ms) => window.setTimeout(schedule, ms));
  schedule();
  return () => {
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    timers.forEach((id) => window.clearTimeout(id));
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  };
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!teardown) teardown = start();
  return () => {
    listeners.delete(listener);
    if (!listeners.size && teardown) {
      teardown();
      teardown = null;
      inView = false;
    }
  };
}

export function useConfiguratorInView() {
  const pathname = usePathname();
  const value = useSyncExternalStore(
    subscribe,
    () => inView,
    () => false
  );

  // Client navigation swaps the page (and maybe #precios): measure again.
  useEffect(() => {
    schedule();
    const id = window.setTimeout(schedule, 400);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return value;
}
