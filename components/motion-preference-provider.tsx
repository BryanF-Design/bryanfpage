"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";

import { useReducedMotionPreference } from "@/lib/motion-preference";

/**
 * Keeps every Framer Motion consumer aligned with both the OS preference and
 * the site's accessibility-panel override.
 */
export function MotionPreferenceProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotionPreference();

  return (
    <MotionConfig reducedMotion={reducedMotion ? "always" : "never"}>
      {children}
    </MotionConfig>
  );
}
