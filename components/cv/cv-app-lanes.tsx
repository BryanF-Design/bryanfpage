"use client";

import { useRef, type CSSProperties, type PointerEvent } from "react";
import type { IconType } from "react-icons";
import {
  SiCss,
  SiGit,
  SiGithub,
  SiHtml5,
  SiIonos,
  SiJavascript,
  SiLinux,
  SiNextdotjs,
  SiNodedotjs,
  SiPhp,
  SiPlesk,
  SiReact,
  SiStripe,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
  SiVercel,
  SiWordpress,
} from "react-icons/si";

import { cn } from "@/lib/utils";

import { cvStyles as s } from "./cv-parts";

type App = { name: string } & ({ Icon: IconType; color: string } | { src: string });

// Solo herramientas que están en el CV. Los colores son los de cada marca
// (oscurecidos donde el original no se lee sobre blanco).
const APPS: App[] = [
  { name: "React", Icon: SiReact, color: "#149ECA" },
  { name: "Claude", src: "/img/cv/logos/claude.svg" },
  { name: "Next.js", Icon: SiNextdotjs, color: "#000000" },
  { name: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
  { name: "JavaScript", Icon: SiJavascript, color: "#E8C400" },
  { name: "Figma", src: "/img/cv/logos/figma.svg" },
  { name: "ChatGPT", src: "/img/cv/logos/openai-dark.svg" },
  { name: "Node.js", Icon: SiNodedotjs, color: "#5FA04E" },
  { name: "Tailwind CSS", Icon: SiTailwindcss, color: "#06B6D4" },
  { name: "Photoshop", src: "/img/cv/logos/photoshop.svg" },
  { name: "HTML5", Icon: SiHtml5, color: "#E34F26" },
  { name: "Meta Ads", src: "/img/cv/logos/meta.svg" },
  { name: "CSS3", Icon: SiCss, color: "#2965F1" },
  { name: "VS Code", src: "/img/cv/logos/vscode.svg" },
  { name: "Gemini", src: "/img/cv/logos/gemini.svg" },
  { name: "Google Analytics", src: "/img/cv/logos/google-analytics.svg" },
  { name: "Git", Icon: SiGit, color: "#F05032" },
  { name: "GitHub", Icon: SiGithub, color: "#181717" },
  { name: "Illustrator", src: "/img/cv/logos/illustrator.svg" },
  { name: "Vercel", Icon: SiVercel, color: "#000000" },
  { name: "Perplexity", src: "/img/cv/logos/perplexity.svg" },
  { name: "Three.js", Icon: SiThreedotjs, color: "#000000" },
  { name: "Google Ads", src: "/img/cv/logos/google-ads.svg" },
  { name: "n8n", src: "/img/cv/logos/n8n-icon.svg" },
  { name: "PHP", Icon: SiPhp, color: "#777BB4" },
  { name: "Google Tag Manager", src: "/img/cv/logos/google-tag-manager.svg" },
  { name: "After Effects", src: "/img/cv/logos/after-effects.svg" },
  { name: "WordPress", Icon: SiWordpress, color: "#21759B" },
  { name: "Grok", src: "/img/cv/logos/grok-dark.svg" },
  { name: "Stripe", Icon: SiStripe, color: "#635BFF" },
  { name: "Microsoft Clarity", src: "/img/cv/logos/microsoft-clarity.svg" },
  { name: "Premiere Pro", src: "/img/cv/logos/premiere.svg" },
  { name: "Linux", Icon: SiLinux, color: "#000000" },
  { name: "Search Console", src: "/img/cv/logos/google-search-console.svg" },
  { name: "Plesk", Icon: SiPlesk, color: "#3B9BD0" },
  { name: "IONOS", Icon: SiIonos, color: "#003D8F" },
  { name: "Affinity Designer", src: "/img/cv/logos/affinity-designer.svg" },
  { name: "Windows", src: "/img/cv/logos/windows.svg" },
];

// Cursores "multijugador" que van jalando algunas pegatinas.
const CURSORS = [
  { name: "Bryan", color: "#8fbd17" },
  { name: "Lumina", color: "#ff4f9a" },
  { name: "Dev", color: "#1fb6ff" },
  { name: "UX/UI", color: "#ff8a00" },
  { name: "Ops", color: "#8b5cf6" },
];

const LANES = [
  { top: "7%", dur: 80, reverse: false, from: 0 },
  { top: "41%", dur: 98, reverse: true, from: 13 },
  { top: "77%", dur: 88, reverse: false, from: 26 },
];

function Sticker({ app, index, cursor }: { app: App; index: number; cursor?: (typeof CURSORS)[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const offset = useRef({ x: 0, y: 0 });

  // Cualquiera puede agarrar una pegatina y soltarla en otro lado: se queda
  // con ese desplazamiento y sigue viajando con su carril.
  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    el.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, ox: offset.current.x, oy: offset.current.y };
    el.closest<HTMLElement>("[data-lane]")?.setAttribute("data-paused", "true");
    el.dataset.grabbed = "true";
  }
  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    const el = ref.current;
    if (!d || !el) return;
    offset.current = { x: d.ox + e.clientX - d.x, y: d.oy + e.clientY - d.y };
    el.style.setProperty("--dx", `${offset.current.x}px`);
    el.style.setProperty("--dy", `${offset.current.y}px`);
  }
  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    drag.current = null;
    if (!el) return;
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    el.closest<HTMLElement>("[data-lane]")?.removeAttribute("data-paused");
    delete el.dataset.grabbed;
  }

  const style = {
    "--rot": `${((index * 37) % 22) - 11}deg`,
    "--bob": `${3 + (index % 4)}s`,
    "--y": `${((index * 53) % 60) - 30}px`,
    marginRight: `${56 + ((index * 41) % 90)}px`,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      className={s.appSticker}
      style={style}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      title={app.name}
    >
      <span className={s.appTile}>
        {"Icon" in app ? (
          <app.Icon aria-hidden style={{ color: app.color }} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={app.src} alt="" draggable={false} />
        )}
      </span>
      {cursor ? (
        <span className={s.appCursor} style={{ "--c": cursor.color } as CSSProperties}>
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M3 2l7.5 19 2.6-7.9L21 10.5z" fill="var(--c)" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
          <span>{cursor.name}</span>
        </span>
      ) : null}
    </div>
  );
}

/**
 * Fondo del menú principal: tres carriles de pegatinas de apps que cruzan la
 * pantalla, algunas jaladas por cursores con nombre (como en un archivo de
 * Figma compartido). Se pueden agarrar con el mouse o el dedo.
 */
export function CvAppLanes({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {LANES.map((lane, li) => {
        const apps = Array.from({ length: 13 }, (_, i) => APPS[(lane.from + i) % APPS.length]);
        const row = [...apps, ...apps];
        return (
          <div
            key={li}
            data-lane
            className={s.lane}
            style={
              {
                top: lane.top,
                animationDuration: `${lane.dur}s`,
                animationDirection: lane.reverse ? "reverse" : "normal",
              } as CSSProperties
            }
          >
            {row.map((app, i) => (
              <Sticker
                key={`${app.name}-${i}`}
                app={app}
                index={i + li * 7}
                cursor={i % 3 === li % 3 ? CURSORS[(i + li) % CURSORS.length] : undefined}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
