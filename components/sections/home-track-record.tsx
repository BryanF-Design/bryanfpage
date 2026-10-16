"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { Check, MapPin } from "lucide-react";

import { ButtonArrow } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/context";
import { STACK } from "@/lib/stack";

/** Países donde hay clientes (misma lista que el globo de /conoce-a-bryan). */
const COUNTRIES = [
  { code: "MX", key: "mexico" },
  { code: "ES", key: "spain" },
  { code: "FR", key: "france" },
] as const;

/**
 * Trayectoria, arriba en la home: cuántos proyectos, en qué países, con qué
 * software y qué estructuras construimos. Lo que un cliente pregunta antes de
 * confiar, a la vista desde el inicio. El detalle (globo, stack completo)
 * vive en /conoce-a-bryan.
 */
export function HomeTrackRecord() {
  const { t } = useLanguage();
  const copy = t.track;

  return (
    <section aria-labelledby="track-title" className="grid gap-gutter lg:grid-cols-12">
      {/* Cifra y países. */}
      <div data-fx="up" className="min-w-0 lg:col-span-5">
        <div className="panel panel-ink relative flex h-full flex-col gap-6 overflow-hidden p-5 sm:p-8 lg:p-10">
          <div aria-hidden className="mesh-glow-a opacity-60" />
          <span className="eyebrow relative w-fit bg-white/10 pl-3 text-white">
            <span aria-hidden className="size-2 rounded-full bg-lime" />
            {copy.eyebrow}
          </span>
          <h2
            id="track-title"
            className="display-title relative text-balance text-[clamp(2rem,4.2vw,3.4rem)] leading-[0.98] text-white"
          >
            {copy.title}
          </h2>
          <p className="relative max-w-xl text-pretty text-[0.975rem] leading-relaxed text-white/70">{copy.subtitle}</p>

          <p className="relative flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="display-xl text-[clamp(3.5rem,8vw,5.5rem)] leading-[0.85] tabular-nums text-lime">+150</span>
            <span className="text-sm font-semibold text-white/80">
              {copy.projectsLabel} · {copy.since}
            </span>
          </p>

          <div className="relative mt-auto flex flex-col gap-3">
            <p className="text-sm font-bold text-white">{copy.countriesTitle}</p>
            <ul className="grid grid-cols-3 gap-2">
              {COUNTRIES.map(({ code, key }) => (
                <li
                  key={code}
                  className="flex flex-col items-start gap-2 rounded-card bg-white/[0.06] p-3 ring-1 ring-inset ring-white/10"
                >
                  <span className="grid size-10 place-items-center rounded-full bg-lime text-xs font-bold text-ink">
                    {code}
                  </span>
                  <span className="text-[0.9375rem] font-semibold leading-tight text-white">
                    {t.world.locations[key]}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-sm leading-snug text-white/65">{copy.countriesBody}</p>
            <Link
              href="/conoce-a-bryan#presencia"
              className="inline-flex min-h-11 w-fit items-center gap-2 text-sm font-bold text-lime underline-offset-4 hover:underline"
            >
              <MapPin aria-hidden className="h-4 w-4" />
              {copy.countriesCta}
            </Link>
          </div>
        </div>
      </div>

      {/* Software y estructuras. */}
      <div data-fx="up" className="min-w-0 lg:col-span-7" style={{ "--fx-delay": "90ms" } as CSSProperties}>
        <div className="panel flex h-full flex-col gap-7 p-5 shadow-soft sm:p-8 lg:p-10">
          <div className="flex flex-col gap-3">
            <h3 className="display-title text-[clamp(1.5rem,2.6vw,2.1rem)] leading-tight text-ink">{copy.softwareTitle}</h3>
            <p className="max-w-2xl text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">{copy.softwareBody}</p>
            <ul className="mt-2 grid grid-cols-4 gap-x-2 gap-y-4 sm:grid-cols-8">
              {STACK.map(({ Icon, label }) => (
                <li key={label} className="flex min-w-0 flex-col items-center gap-1.5 text-center">
                  <span className="grid size-12 place-items-center rounded-full bg-ink text-lime">
                    <Icon aria-hidden className="h-5 w-5" />
                  </span>
                  <span className="w-full text-[0.75rem] font-semibold leading-tight text-ink">{label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="display-title text-[clamp(1.5rem,2.6vw,2.1rem)] leading-tight text-ink">{copy.structuresTitle}</h3>
            <ul className="flex flex-wrap gap-2">
              {copy.structures.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 rounded-full bg-mint py-1.5 pl-1.5 pr-4 text-sm font-semibold text-ink ring-1 ring-inset ring-ink/[0.06]"
                >
                  <span aria-hidden className="grid size-7 shrink-0 place-items-center rounded-full bg-lime text-ink">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <Link
            href="/conoce-a-bryan"
            className="mt-auto inline-flex w-fit items-center gap-2 text-sm font-bold text-ink"
          >
            {copy.cta}
            <ButtonArrow tone="ink" className="-mr-0 size-8" />
          </Link>
        </div>
      </div>
    </section>
  );
}
