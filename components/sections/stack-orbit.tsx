"use client";

import type { CSSProperties } from "react";
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
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiWordpress,
} from "react-icons/si";
import { ArrowUpRight } from "lucide-react";

import { SectionHeading } from "@/components/sections/section-heading";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";
import { useReducedMotionPreference } from "@/lib/motion-preference";

const stack: { Icon: IconType; label: string }[] = [
  { Icon: SiNextdotjs, label: "Next.js" },
  { Icon: SiReact, label: "React" },
  { Icon: SiTypescript, label: "TypeScript" },
  { Icon: SiJavascript, label: "JavaScript" },
  { Icon: SiTailwindcss, label: "Tailwind CSS" },
  { Icon: SiHtml5, label: "HTML5" },
  { Icon: SiCss, label: "CSS3" },
  { Icon: SiNodedotjs, label: "Node.js" },
  { Icon: SiWordpress, label: "WordPress" },
  { Icon: SiPhp, label: "PHP" },
  { Icon: SiFigma, label: "Figma" },
  { Icon: SiVercel, label: "Vercel" },
  { Icon: SiGit, label: "Git" },
  { Icon: SiGithub, label: "GitHub" },
];

/**
 * 道具 — las herramientas, girando.
 *
 * Las catorce fichas forman un carrusel 3D que rueda solo (CSS puro,
 * `preserve-3d`), como el coverflow de la referencia de viajes: la del frente
 * se lee grande y las del fondo se van. Pasar el puntero lo detiene. Con
 * movimiento reducido el anillo se desarma en una retícula quieta.
 */
export function StackOrbit() {
  const { t } = useLanguage();
  const reducedMotion = useReducedMotionPreference();

  return (
    <section
      id="stack"
      aria-label={t.stack.title}
      className="relative grid gap-gutter lg:grid-cols-12"
    >
      <div data-fx="left" className="min-w-0 lg:col-span-5">
        <div className="panel panel-moss flex h-full flex-col justify-between gap-10 overflow-hidden p-6 md:p-10">
          <SectionHeading
            eyebrow={t.stack.eyebrow}
            title={t.stack.title}
            subtitle={t.stack.subtitle}
            chapter={{ kanji: "道具", romaji: "dōgu", index: 5 }}
          />

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Button asChild>
              <Link href="#projects">
                {t.stack.ctaPrimary}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link
                href="https://wa.me/525663012505"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.stack.ctaSecondary}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div data-fx="right" className="min-w-0 lg:col-span-7" style={{ "--fx-delay": "100ms" } as CSSProperties}>
        <div className="panel relative h-full min-h-[27rem] overflow-hidden md:min-h-[34rem]">
          <div aria-hidden className="dot-grid absolute inset-0 rounded-[inherit] opacity-30" />
          <div
            aria-hidden
            className="hinomaru-dots bottom-0 left-1/2 aspect-square w-[78%] opacity-35"
            style={{ transform: "translate(-50%, 58%) perspective(900px) rotateX(70deg)" }}
          />

          <div className="notch notch-tl">
            <span className="tag-pill">
              <span aria-hidden lang="ja" className="seal">
                道
              </span>
              {t.stack.eyebrow} · {String(stack.length).padStart(2, "0")}
            </span>
          </div>

          {reducedMotion ? (
            <ul className="relative grid grid-cols-2 gap-2 p-5 pt-20 sm:grid-cols-3 md:grid-cols-4 md:p-8 md:pt-24">
              {stack.map(({ Icon, label }) => (
                <li key={label}>
                  <StackTile Icon={Icon} label={label} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="ring-stage absolute inset-0 grid place-items-center pt-10">
              <ul
                className="ring size-px [--rz:13.5rem] [--tile:6rem] sm:[--rz:17rem] sm:[--tile:7rem] md:[--rz:19rem] md:[--tile:7.75rem]"
                style={{ "--n": stack.length } as CSSProperties}
              >
                {stack.map(({ Icon, label }, index) => (
                  <li key={label} style={{ "--i": index } as CSSProperties}>
                    <StackTile Icon={Icon} label={label} ring index={index} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function StackTile({
  Icon,
  label,
  ring = false,
  index = 0,
}: {
  Icon: IconType;
  label: string;
  ring?: boolean;
  index?: number;
}) {
  return (
    <div
      className={cn(
        "flex h-full min-h-28 flex-col justify-between px-shape p-3.5 md:p-4",
        ring
          ? index % 3 === 0
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-foreground ring-1 ring-foreground/10"
          : "bg-secondary text-foreground"
      )}
    >
      <Icon aria-hidden="true" className="h-7 w-7 md:h-8 md:w-8" />
      <p className="font-display text-base font-extrabold uppercase leading-none tracking-[0.03em] md:text-lg">
        {label}
      </p>
    </div>
  );
}
