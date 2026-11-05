"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";
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
import {
  BadgeCheck,
  BellRing,
  Bot,
  ChartNoAxesCombined,
  Search,
  Target,
  Braces,
  MessageSquareCode,
  Clapperboard,
  ClipboardList,
  FileText,
  Globe,
  Handshake,
  Headset,
  LayoutGrid,
  Mail,
  Plug,
  Server,
  ShieldCheck,
  Siren,
  Users,
  Webhook,
  type LucideIcon,
} from "lucide-react";

import type { CvLogo, InventoryItem } from "@/lib/cv/data";
import { cn } from "@/lib/utils";

import s from "./cv.module.css";

const SI: Record<string, IconType> = {
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
};

const LUCIDE: Record<string, LucideIcon> = {
  BadgeCheck,
  BellRing,
  Bot,
  ChartNoAxesCombined,
  Search,
  Target,
  Braces,
  MessageSquareCode,
  Clapperboard,
  ClipboardList,
  FileText,
  Globe,
  Handshake,
  Headset,
  LayoutGrid,
  Mail,
  Plug,
  Server,
  ShieldCheck,
  Siren,
  Users,
  Webhook,
};

/** Icono de un objeto del inventario: logo oficial o icono de concepto. */
export function ItemIcon({ item, className }: { item: InventoryItem; className?: string }) {
  const src = item.source;
  if (src.kind === "si") {
    const Icon = SI[src.icon];
    return Icon ? <Icon aria-hidden className={className} style={{ color: src.color }} /> : null;
  }
  if (src.kind === "lucide") {
    const Icon = LUCIDE[src.icon];
    return Icon ? <Icon aria-hidden className={cn("text-[var(--cv-lime)]", className)} strokeWidth={1.75} /> : null;
  }
  // SVG oficial a color: <img> simple, sin optimizar (ya es vector).
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src.src} alt="" aria-hidden className={cn("object-contain", className)} loading="lazy" />;
}

/** Logotipo oficial dentro de una ficha del tono que le corresponde. */
export function LogoTile({
  logo,
  alt,
  className,
  imgClassName,
  sizes = "160px",
}: {
  logo: CvLogo;
  alt: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
}) {
  const isSvg = logo.src.endsWith(".svg");
  // La imagen se centra en una caja fija (con object-contain): cualquier
  // proporción, de insignia cuadrada a logotipo ancho, cabe sin recortarse.
  const imgClass = cn("absolute inset-0 m-auto h-[60%] w-[76%] object-contain", imgClassName);
  return (
    <span
      className={cn(
        "relative block overflow-hidden",
        logo.tone === "light" ? "bg-white" : "bg-[#0a1210] ring-1 ring-inset ring-white/10",
        className
      )}
    >
      {isSvg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo.src} alt={alt} width={logo.w} height={logo.h} loading="lazy" className={imgClass} />
      ) : (
        <Image src={logo.src} alt={alt} width={logo.w} height={logo.h} sizes={sizes} className={imgClass} />
      )}
    </span>
  );
}

/** Inclinación 3D que sigue al puntero (solo con mouse; en touch no hace nada). */
export function useTilt(max = 8) {
  const ref = useRef<HTMLDivElement>(null);
  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (e.pointerType !== "mouse") return;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      el.style.setProperty("--ry", `${(x - 0.5) * max * 2}deg`);
      el.style.setProperty("--rx", `${(0.5 - y) * max * 2}deg`);
      el.style.setProperty("--mx", `${x * 100}%`);
      el.style.setProperty("--my", `${y * 100}%`);
      el.style.setProperty("--shine", "1");
    },
    [max]
  );
  const onPointerLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--shine", "0");
  }, []);
  return { ref, onPointerMove, onPointerLeave };
}

export function Tilt({
  children,
  className,
  max,
  style,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  style?: CSSProperties;
}) {
  const tilt = useTilt(max);
  return (
    <div
      ref={tilt.ref}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
      className={cn(s.tilt, "relative", className)}
      style={style}
    >
      {children}
      <span aria-hidden className={s.tiltShine} />
    </div>
  );
}

/** Cabecera de nivel: número en la "mordida", etiqueta pixel y titular. */
export function LevelHeader({
  index,
  eyebrow,
  title,
  levelLabel,
}: {
  index: number;
  eyebrow: string;
  title: string;
  levelLabel: string;
}) {
  return (
    // El número de nivel lo pinta CvGame dentro de la mordida del panel.
    <header className="pl-[3.6rem] pt-0.5 md:pl-[3.75rem]">
      <p className={cn(s.pixel, "text-[0.7rem] uppercase text-[var(--cv-lime)] md:text-xs")}>
        {levelLabel} {String(index + 1).padStart(2, "0")} · {eyebrow}
      </p>
      <h2 className="mt-1.5 text-balance font-display text-[1.65rem] font-extrabold leading-[1.02] tracking-[-0.02em] [font-stretch:112%] sm:text-3xl md:text-[2.4rem]">
        {title}
      </h2>
    </header>
  );
}

export function Chip({
  children,
  tone = "dark",
  className,
}: {
  children: ReactNode;
  tone?: "dark" | "lime" | "light" | "outline";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold leading-tight",
        tone === "dark" && "bg-white/[0.07] text-white/85 ring-1 ring-inset ring-white/10",
        tone === "lime" && "bg-[var(--cv-lime)] text-[#0c1512]",
        tone === "light" && "bg-white text-[#0c1512]",
        tone === "outline" && "text-[var(--cv-lime)] ring-1 ring-inset ring-[#b4e332]/60",
        className
      )}
    >
      {children}
    </span>
  );
}

/**
 * Filas horizontales que se arrastran: con el dedo es scroll nativo y con
 * mouse se agarra y se lanza (con inercia). Si hubo arrastre, el clic que
 * termina el gesto se cancela para no activar la pill que quedó debajo.
 * La rueda vertical del mouse también desplaza la fila.
 */
export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let down = false;
    let moved = false;
    let startX = 0;
    let startLeft = 0;
    let lastX = 0;
    let lastT = 0;
    let velocity = 0;
    let raf = 0;

    const onDown = (e: globalThis.PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      cancelAnimationFrame(raf);
      down = true;
      moved = false;
      startX = lastX = e.clientX;
      startLeft = el.scrollLeft;
      lastT = performance.now();
      velocity = 0;
    };
    const onMove = (e: globalThis.PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 5) {
        moved = true;
        el.setPointerCapture(e.pointerId);
        el.dataset.dragging = "true";
      }
      if (!moved) return;
      const now = performance.now();
      velocity = (e.clientX - lastX) / Math.max(1, now - lastT);
      lastX = e.clientX;
      lastT = now;
      el.scrollLeft = startLeft - dx;
    };
    const onUp = (e: globalThis.PointerEvent) => {
      if (!down) return;
      down = false;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
      delete el.dataset.dragging;
      // Inercia: la fila sigue deslizándose y frena sola.
      let v = velocity * 16;
      const glide = () => {
        if (Math.abs(v) < 0.4) return;
        el.scrollLeft -= v;
        v *= 0.92;
        raf = requestAnimationFrame(glide);
      };
      if (moved) raf = requestAnimationFrame(glide);
    };
    const onClick = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      if (el.scrollWidth <= el.clientWidth) return;
      const atStart = el.scrollLeft <= 0 && e.deltaY < 0;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1 && e.deltaY > 0;
      if (atStart || atEnd) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("click", onClick, true);
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("click", onClick, true);
      el.removeEventListener("wheel", onWheel);
    };
  }, []);

  return ref;
}

/** Clases de una fila arrastrable (sin barra, con desvanecido en los bordes). */
export const dragRowClass = cn(
  s.dragRow,
  "flex snap-x snap-proximity overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
);

export { s as cvStyles };
