"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import type { IconType } from "react-icons";
import {
  SiCss,
  SiFigma,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiNextdotjs,
  SiNodedotjs,
  SiPhp,
  SiReact,
  SiStripe,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
  SiVercel,
  SiWordpress,
} from "react-icons/si";
import { Sparkle } from "lucide-react";

import { SectionHeading } from "@/components/sections/section-heading";
import { Button, ButtonArrow } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";

type Category = "front" | "back" | "tools";

const stack: { Icon: IconType; label: string; category: Category }[] = [
  { Icon: SiNextdotjs, label: "Next.js", category: "front" },
  { Icon: SiReact, label: "React", category: "front" },
  { Icon: SiTypescript, label: "TypeScript", category: "front" },
  { Icon: SiJavascript, label: "JavaScript", category: "front" },
  { Icon: SiTailwindcss, label: "Tailwind CSS", category: "front" },
  { Icon: SiHtml5, label: "HTML5", category: "front" },
  { Icon: SiCss, label: "CSS3", category: "front" },
  { Icon: SiThreedotjs, label: "Three.js", category: "front" },
  { Icon: SiNodedotjs, label: "Node.js", category: "back" },
  { Icon: SiPhp, label: "PHP", category: "back" },
  { Icon: SiWordpress, label: "WordPress", category: "back" },
  { Icon: SiStripe, label: "Stripe", category: "back" },
  { Icon: SiFigma, label: "Figma", category: "tools" },
  { Icon: SiVercel, label: "Vercel", category: "tools" },
  { Icon: SiGit, label: "Git", category: "tools" },
  { Icon: SiGithub, label: "GitHub", category: "tools" },
];

const FILTERS = ["all", "front", "back", "tools"] as const;
type Filter = (typeof FILTERS)[number];

const GROUPS: Category[] = ["front", "back", "tools"];
const GROUP_TONES: Record<Category, string> = {
  front: "bg-ink",
  back: "bg-lime",
  tools: "bg-forest",
};

/**
 * Stack — las herramientas como iconos de app.
 *
 * Panel crema (editorial, como REF/4) con el titular, la cifra y las
 * acciones; la lima queda como acento en la barra. Al lado, una retícula
 * de fichas con icono redondo y nombre que se lee de un vistazo en teléfono.
 * Las píldoras de filtro (como las de la referencia de AirPods) resaltan una
 * familia sin mover la retícula: las demás fichas solo se atenúan.
 */
export function StackOrbit() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<Filter>("all");

  const countFor = (f: Filter) =>
    f === "all" ? stack.length : stack.filter((item) => item.category === f).length;

  return (
    <section
      id="stack"
      aria-label={t.stack.title}
      className="relative grid gap-gutter lg:grid-cols-12"
    >
      <div data-fx="up" className="min-w-0 lg:col-span-5">
        <div className="panel relative flex h-full flex-col justify-between gap-10 overflow-hidden bg-cream p-5 shadow-soft sm:p-8 lg:p-10">
          <Sparkle
            aria-hidden
            className="float-y absolute right-6 top-6 h-8 w-8 fill-lime text-lime-deep sm:right-8 sm:top-8"
          />

          <SectionHeading
            eyebrow={t.stack.eyebrow}
            title={t.stack.title}
            subtitle={t.stack.subtitle}
            chapter={{ index: 5 }}
            className="relative"
          />

          <div className="relative flex flex-col gap-6">
            <div className="flex items-end gap-3">
              <span className="display-xl text-[clamp(4.5rem,8vw,6.75rem)] leading-[0.8]">
                {stack.length}
              </span>
              <span className="max-w-[14ch] pb-1 text-sm font-semibold leading-snug">
                {t.stack.countLabel}
              </span>
            </div>

            {/* Composición del stack: barra segmentada, como el progreso de Paytin. */}
            <div className="flex flex-col gap-3">
              <span aria-hidden className="flex h-3.5 gap-1.5">
                {GROUPS.map((group) => (
                  <span
                    key={group}
                    style={{ flexGrow: countFor(group) }}
                    className={cn("basis-0 rounded-full", GROUP_TONES[group])}
                  />
                ))}
              </span>
              <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm font-semibold">
                {GROUPS.map((group) => (
                  <li key={group} className="flex items-center gap-2">
                    <span aria-hidden className={cn("size-2.5 rounded-full", GROUP_TONES[group])} />
                    {t.stack.filters[group]}
                    <span className="text-muted-foreground">{countFor(group)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-2.5 sm:flex-row lg:flex-col xl:flex-row">
              <Button asChild size="lg" variant="ink" className="pr-2.5">
                <Link href="#projects">
                  {t.stack.ctaPrimary}
                  <ButtonArrow tone="lime" className="ml-auto -mr-0.5 sm:ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-ink/30 hover:border-ink">
                <Link href="https://wa.me/525663012505" target="_blank" rel="noopener noreferrer">
                  {t.stack.ctaSecondary}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div data-fx="up" className="min-w-0 lg:col-span-7" style={{ "--fx-delay": "90ms" } as CSSProperties}>
        <div className="panel flex h-full flex-col gap-6 p-5 shadow-soft sm:p-8 lg:p-10">
          <div
            role="group"
            aria-label={t.stack.filtersLabel}
            className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {FILTERS.map((f) => {
              const active = filter === f;
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "inline-flex h-11 shrink-0 items-center gap-2 rounded-full pl-4 pr-1.5 text-sm font-semibold transition-colors duration-200",
                    active
                      ? "bg-ink text-white"
                      : "border border-ink/15 text-ink hover:border-ink/40"
                  )}
                >
                  {t.stack.filters[f]}
                  <span
                    className={cn(
                      "grid h-8 min-w-8 place-items-center rounded-full px-2 text-xs font-bold",
                      active ? "bg-lime text-ink" : "bg-ink/[0.06] text-ink/70"
                    )}
                  >
                    {countFor(f)}
                  </span>
                </button>
              );
            })}
          </div>

          <ul className="grid flex-1 grid-cols-4 gap-x-2 gap-y-5 sm:gap-3">
            {stack.map(({ Icon, label, category }) => {
              const on = filter === "all" || filter === category;
              const picked = on && filter !== "all";
              return (
                <li
                  key={label}
                  className={cn(
                    "min-w-0 transition-[opacity,transform] duration-300 [transition-timing-function:var(--ease-out)]",
                    !on && "scale-[0.94] opacity-30"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-full flex-col items-center gap-2 text-center sm:items-start sm:justify-between sm:gap-5 sm:rounded-card sm:p-4 sm:text-left sm:transition-[transform,background-color] sm:duration-300 sm:hover:-translate-y-1",
                      picked ? "sm:bg-lime-soft" : "sm:bg-canvas/70"
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-14 place-items-center rounded-full transition-colors duration-300 sm:size-12",
                        picked ? "bg-lime text-ink" : "bg-ink text-lime"
                      )}
                    >
                      <Icon aria-hidden="true" className="h-6 w-6" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[0.8125rem] font-semibold leading-tight text-ink sm:text-[0.975rem] sm:font-bold">
                        {label}
                      </span>
                      <span className="mt-0.5 hidden text-xs font-medium text-muted-foreground sm:block">
                        {t.stack.filters[category]}
                      </span>
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
