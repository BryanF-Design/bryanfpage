"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { Pause, Play } from "lucide-react";

import { useLanguage } from "@/lib/i18n/context";
import { isReducedMotionRequested } from "@/lib/motion-preference";
import { mobileShot, projects } from "@/lib/projects";
import { cn } from "@/lib/utils";

/**
 * P2 · Showreel de /casos: cada proyecto con un video corto, silenciado y en
 * bucle que recorre su página real (generado de la captura completa del
 * sitio en el celular, public/video/showreel/<slug>.mp4). Un solo botón
 * global Pausa / Reproducir detiene o reanuda todos a la vez (también el
 * del modal). Ligeros y perezosos: preload="none" y solo se reproducen
 * mientras están en pantalla. Con movimiento reducido, quietos (póster).
 * Nada de esto está en la home: allí no hay video.
 */

// ——— Estado global de pausa (compartido por todos los videos) ———
const KEY = "bfd-showreel-paused";
const listeners = new Set<() => void>();
let paused: boolean | null = null;

function read() {
  if (paused === null) {
    try {
      paused = window.sessionStorage.getItem(KEY) === "1" || isReducedMotionRequested();
    } catch {
      paused = isReducedMotionRequested();
    }
  }
  return paused;
}
export function setShowreelPaused(value: boolean) {
  paused = value;
  try {
    window.sessionStorage.setItem(KEY, value ? "1" : "0");
  } catch {
    /* sin almacenamiento: solo en memoria */
  }
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}
export function useShowreelPaused() {
  return useSyncExternalStore(subscribe, read, () => true);
}

/** Proyectos con recorrido en video (todos los que tienen captura móvil). */
export const SHOWREEL_SLUGS = new Set(projects.filter((p) => p.shots !== false).map((p) => p.slug));
export const showreelSrc = (slug: string) => `/video/showreel/${slug}.mp4`;

/** Un video del showreel: se reproduce solo en pantalla y sin pausa global. */
export function ShowreelVideo({ slug, className, eager = false }: { slug: string; className?: string; eager?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const isPaused = useShowreelPaused();
  const visible = useRef(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const sync = () => {
      if (visible.current && !isPaused) v.play().catch(() => {});
      else v.pause();
    };
    const io = new IntersectionObserver(
      ([e]) => {
        visible.current = e.isIntersecting;
        sync();
      },
      { threshold: 0.35 }
    );
    io.observe(v);
    sync();
    return () => io.disconnect();
  }, [isPaused]);

  return (
    <video
      ref={ref}
      src={showreelSrc(slug)}
      poster={mobileShot(slug)}
      muted
      loop
      playsInline
      preload={eager ? "metadata" : "none"}
      aria-hidden
      tabIndex={-1}
      className={cn("h-full w-full object-cover object-top", className)}
    />
  );
}

/** Botón global Pausa / Reproducir (aria-pressed = en pausa). */
export function ShowreelToggle({ className }: { className?: string }) {
  const { t } = useLanguage();
  const s = t.v2.showreel;
  const isPaused = useShowreelPaused();
  const Icon = isPaused ? Play : Pause;
  return (
    <button
      type="button"
      aria-pressed={isPaused}
      aria-label={isPaused ? s.play : s.pause}
      onClick={() => setShowreelPaused(!isPaused)}
      className={cn(
        "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.97]",
        className
      )}
    >
      <Icon aria-hidden className="h-4 w-4 fill-current text-lime" />
      {isPaused ? s.playShort : s.pauseShort}
    </button>
  );
}

/** La tira del showreel: teléfonos en fila con su recorrido en bucle. */
export function Showreel() {
  const { t } = useLanguage();
  const s = t.v2.showreel;
  const list = projects.filter((p) => SHOWREEL_SLUGS.has(p.slug));

  return (
    <section id="showreel" aria-labelledby="showreel-title" className="panel overflow-hidden py-6 shadow-soft sm:py-8">
      <div className="flex flex-col gap-3 px-5 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div>
          <h2 id="showreel-title" className="display-xl text-[clamp(2rem,4vw,3.25rem)] leading-none text-ink">
            {s.title}
          </h2>
          <p className="mt-2 text-[0.975rem] text-ink/65">{s.subtitle}</p>
        </div>
        <ShowreelToggle className="self-start sm:self-auto" />
      </div>
      <ul className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 [scrollbar-width:thin] sm:scroll-px-8 sm:px-8">
        {list.map((p) => (
          <li key={p.slug} className="w-[10.5rem] shrink-0 snap-start sm:w-[12rem]">
            <div className="rounded-[1.9rem] bg-ink p-[0.4rem] shadow-float">
              <div className="relative aspect-[270/585] overflow-hidden rounded-[1.55rem] bg-white">
                <ShowreelVideo slug={p.slug} />
              </div>
            </div>
            <p className="mt-2.5 truncate px-1 text-sm font-semibold text-ink">{p.name}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
