"use client";

import { useRef, type ReactNode } from "react";

import { useMagnetic } from "@/lib/motion-fx";
import { cn } from "@/lib/utils";

/** Envoltorio magnético (escritorio): el botón sigue levemente al cursor
 *  (máx. 6 px) y vuelve con resorte de 300 ms. En tacto no hace nada. */
export function Magnetic({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useMagnetic(ref);
  return (
    <span ref={ref} className={cn("magnetic inline-flex", className)}>
      {children}
    </span>
  );
}
