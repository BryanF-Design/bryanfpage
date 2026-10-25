"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";
import { THEME_KEY, applyTheme, currentTheme, type Theme } from "@/lib/theme";

/**
 * Botón de modo claro / oscuro. Mientras nadie elija, sigue al sistema (y
 * cambia en vivo si el sistema cambia); al tocarlo, la elección se guarda.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(currentTheme());
    const onTheme = (e: Event) => setTheme((e as CustomEvent<{ theme: Theme }>).detail.theme);
    window.addEventListener("bfd:theme", onTheme);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystem = () => {
      let saved: string | null = null;
      try {
        saved = localStorage.getItem(THEME_KEY);
      } catch {
        /* sin storage */
      }
      if (!saved) applyTheme(mq.matches ? "dark" : "light", false);
    };
    mq.addEventListener("change", onSystem);
    return () => {
      window.removeEventListener("bfd:theme", onTheme);
      mq.removeEventListener("change", onSystem);
    };
  }, []);

  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={() => applyTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      aria-pressed={dark}
      title={dark ? "Modo claro" : "Modo oscuro"}
      className={cn(
        "relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-ink/[0.05] text-ink transition-colors hover:bg-ink/[0.1]",
        className
      )}
    >
      <Sun
        aria-hidden
        className={cn(
          "absolute h-[1.15rem] w-[1.15rem] transition-all duration-500 [transition-timing-function:var(--ease-pop)]",
          dark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
        )}
      />
      <Moon
        aria-hidden
        className={cn(
          "absolute h-[1.1rem] w-[1.1rem] text-lime transition-all duration-500 [transition-timing-function:var(--ease-pop)]",
          dark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
        )}
      />
    </button>
  );
}
