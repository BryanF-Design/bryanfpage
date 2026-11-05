"use client";

import Image from "next/image";
import { Crosshair, MapPin, Shield, Swords } from "lucide-react";

import { CAREER_START } from "@/lib/cv/data";
import type { CvDict } from "@/lib/cv/i18n";
import { cn } from "@/lib/utils";

import { Tilt, cvStyles as s } from "./cv-parts";

const NOW = 2026;

/**
 * Ficha del jugador: la tarjeta blanca de la referencia, con Bryan saliendo
 * por arriba del marco. Sin barras de "nivel" inventadas: solo datos reales
 * (clase, gremio, base, idiomas y años de trayectoria).
 */
export function PlayerCard({ t, compact = false }: { t: CvDict; compact?: boolean }) {
  const years = Array.from({ length: NOW - CAREER_START + 1 }, (_, i) => CAREER_START + i);
  const rows = [
    { Icon: Swords, label: t.ui.playerClass, value: t.ui.playerClassValue },
    { Icon: Shield, label: t.ui.guild, value: "BryanF Design" },
    { Icon: MapPin, label: t.ui.base, value: t.ui.baseValue },
  ];

  return (
    <Tilt max={5} className={cn("rounded-[2rem]", compact ? "mt-20" : "mt-16")}>
      <div className="relative rounded-[2rem] bg-white p-4 pt-0 text-[#0c1512] shadow-[0_30px_60px_-28px_rgb(180_227_50/0.55)] sm:p-5 sm:pt-0">
        <div className={cn("flex gap-4", compact ? "items-end" : "flex-col")}>
          {/* Retrato: el recorte sale del marco hacia arriba. */}
          <div
            className={cn(
              "relative shrink-0 overflow-visible",
              compact ? "-mt-12 h-40 w-32 sm:h-44 sm:w-36" : "-mt-16 h-60 w-full"
            )}
          >
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 top-[22%] rounded-[1.5rem] bg-[var(--cv-lime)] [background-image:linear-gradient(rgb(12_21_18/0.1)_1px,transparent_1px),linear-gradient(90deg,rgb(12_21_18/0.1)_1px,transparent_1px)] [background-size:16px_16px]"
            />
            <Image
              src="/img/cv/bryan-photo.webp"
              alt={t.ui.player}
              width={760}
              height={1013}
              priority={!compact}
              sizes={compact ? "160px" : "320px"}
              className="absolute inset-x-0 bottom-0 h-[112%] w-full rounded-b-[1.5rem] object-cover object-top drop-shadow-[0_10px_14px_rgb(12_21_18/0.3)] [transform:translateZ(40px)]"
            />
            <span className={cn(s.pixel, "absolute left-2 top-[26%] rounded-full bg-[#0c1512] px-2 py-0.5 text-[0.6rem] text-[var(--cv-lime)]")}>
              {t.ui.player}
            </span>
          </div>

          <div className="min-w-0 flex-1 pb-1">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-[#0c1512]/60">
              <span aria-hidden className={cn(s.pulse, "size-2 rounded-full bg-[#2fbf4a]")} />
              {t.ui.statusValue}
            </p>
            <p className="mt-1 font-display text-[1.9rem] font-black leading-none tracking-[-0.03em] [font-stretch:115%]">Bryan F.</p>
            <p className="mt-1 text-[0.78rem] font-medium leading-snug text-[#0c1512]/60">Bryan Fernando López López</p>
          </div>
        </div>

        <dl className={cn("mt-4 space-y-2", compact && "sm:grid sm:grid-cols-3 sm:gap-2 sm:space-y-0")}>
          {rows.map(({ Icon, label, value }) => (
            <div key={label} className="flex items-start gap-2.5 rounded-xl bg-[#0c1512]/[0.04] px-3 py-2">
              <Icon aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[#0c1512]/70" />
              <div className="min-w-0">
                <dt className={cn(s.pixel, "text-[0.58rem] uppercase text-[#0c1512]/50")}>{label}</dt>
                <dd className="text-[0.82rem] font-semibold leading-snug">{value}</dd>
              </div>
            </div>
          ))}
        </dl>

        {/* Trayectoria: una barra por año desde el primer trabajo. */}
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <span className={cn(s.pixel, "flex items-center gap-1.5 text-[0.62rem] uppercase text-[#0c1512]/60")}>
              <Crosshair aria-hidden className="h-3.5 w-3.5" />
              {t.ui.xp}
            </span>
            <span className={cn(s.pixel, "text-[0.62rem] text-[#0c1512]/60")}>
              {t.ui.xpValue.replace("{year}", String(CAREER_START))}
            </span>
          </div>
          <div className="mt-2 flex gap-1">
            {years.map((y, i) => (
              <span
                key={y}
                title={String(y)}
                className={cn(s.xpBar, "h-3 flex-1 rounded-[3px]")}
                style={{ animationDelay: `${300 + i * 90}ms` }}
              />
            ))}
          </div>
          <div className={cn(s.pixel, "mt-1 flex justify-between text-[0.55rem] text-[#0c1512]/45")}>
            <span>{CAREER_START}</span>
            <span>{NOW}</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          <span className={cn(s.pixel, "mr-1 text-[0.6rem] uppercase text-[#0c1512]/50")}>{t.ui.languages}</span>
          {t.academy.languages.map((l, i) => (
            <span key={l.name} className="rounded-full bg-[#0c1512] px-2.5 py-1 text-[0.7rem] font-semibold text-white">
              {i === 0 ? "ES" : "EN"} · {l.level}
            </span>
          ))}
        </div>
      </div>
    </Tilt>
  );
}
