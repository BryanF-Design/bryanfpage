"use client";

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

import { useLanguage } from "@/lib/i18n/context";

const STACK: { Icon: IconType; label: string }[] = [
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
 * 道具 — la tira de herramientas.
 *
 * Era una sección completa: cabecera con marca de capítulo, párrafo, dos
 * botones y catorce fichas de 9rem de alto en rejilla. Casi mil píxeles de
 * scroll para una lista de logotipos que nadie lee como argumento de compra.
 *
 * Un pie de página del capítulo de trabajo hace el mismo trabajo: aquí están
 * las herramientas con las que está hecho lo que acabas de ver.
 */
export function StackStrip() {
  const { t } = useLanguage();

  return (
    <section
      id="stack"
      aria-label={t.stack.title}
      className="relative isolate overflow-hidden border-b border-border bg-card/35"
    >
      <div className="container">
        <div className="grid gap-6 py-8 lg:grid-cols-[minmax(0,0.36fr)_minmax(0,1fr)] lg:items-start lg:gap-10 md:py-10">
          <div>
            <span className="tech-label inline-flex items-center gap-3 text-primary">
              <span aria-hidden className="size-1.5 bg-primary" />
              {t.stack.eyebrow}
            </span>
            <p className="mt-3 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
              {t.stack.subtitle}
            </p>
          </div>

          <ul className="flex flex-wrap gap-2 lg:justify-end">
            {STACK.map(({ Icon, label }) => (
              <li
                key={label}
                className="group inline-flex items-center gap-2 border border-border bg-background/45 px-3 py-2 transition-colors duration-200 hover:border-primary/55"
              >
                <Icon
                  aria-hidden
                  className="size-4 text-foreground/60 transition-colors duration-200 group-hover:text-primary"
                />
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors group-hover:text-foreground">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
