"use client";

import Image from "next/image";
import { useCallback, useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import type { IconType } from "react-icons";
import {
  SiAffinitydesigner,
  SiAffinityphoto,
  SiAffinitypublisher,
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
  SiAffinitydesigner,
  SiAffinityphoto,
  SiAffinitypublisher,
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
        tone === "outline" && "text-[var(--cv-lime)] ring-1 ring-inset ring-[var(--cv-lime)]/60",
        className
      )}
    >
      {children}
    </span>
  );
}

export { s as cvStyles };
