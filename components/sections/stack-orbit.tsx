"use client";

import Link from "next/link";
import type { IconType } from "react-icons";
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiHtml5,
  SiCss,
  SiNodedotjs,
  SiWordpress,
  SiPhp,
  SiFigma,
  SiVercel,
  SiGit,
  SiGithub,
} from "react-icons/si";
import { Code2 } from "lucide-react";

import { Button } from "@/components/ui/button";

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

const ORBIT_COUNT = 3;
const ORBIT_GAP = 8; // rem between orbits
const iconsPerOrbit = Math.ceil(stack.length / ORBIT_COUNT);

export function StackOrbit() {
  return (
    <section
      id="stack"
      aria-label="Lenguajes y herramientas que manejo"
      className="py-20 md:py-28"
    >
      <div className="container">
        <div className="relative flex h-[34rem] flex-col items-center justify-between overflow-hidden rounded-3xl border border-border bg-card/40 bg-grain p-8 md:h-[30rem] md:flex-row md:p-12">
          {/* Left: copy */}
          <div className="z-10 max-w-lg text-center md:w-1/2 md:text-left">
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-primary">
              <span className="h-px w-6 bg-primary" />
              Stack
            </span>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Los lenguajes que manejo
            </h2>
            <p className="mt-4 text-muted-foreground">
              Frameworks y herramientas modernas con las que construyo: rápido,
              escalable y a medida. La tecnología al servicio de la idea, no al
              revés.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <Button asChild>
                <Link href="#projects">Ver proyectos</Link>
              </Button>
              <Button asChild variant="outline">
                <Link
                  href="https://wa.me/525663012505"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Trabajemos juntos
                </Link>
              </Button>
            </div>
          </div>

          {/* Right: orbit (cropped) */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 flex h-[18rem] items-start justify-center md:relative md:h-full md:w-1/2 md:items-center md:justify-start"
            aria-hidden="true"
          >
            <div className="relative flex h-[42rem] w-[42rem] -translate-y-24 items-center justify-center md:translate-x-[40%] md:translate-y-0">
              {/* Center */}
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-primary/40 bg-primary/10 shadow-lg shadow-primary/10">
                <Code2 className="h-9 w-9 text-primary" />
              </div>

              {[...Array(ORBIT_COUNT)].map((_, orbitIdx) => {
                const size = `${12 + ORBIT_GAP * (orbitIdx + 1)}rem`;
                const duration = 26 + orbitIdx * 8;
                const angleStep = (2 * Math.PI) / iconsPerOrbit;

                return (
                  <div
                    key={orbitIdx}
                    className="absolute rounded-full border border-dashed border-border"
                    style={{
                      width: size,
                      height: size,
                      animation: `spin ${duration}s linear infinite`,
                    }}
                  >
                    {stack
                      .slice(
                        orbitIdx * iconsPerOrbit,
                        orbitIdx * iconsPerOrbit + iconsPerOrbit
                      )
                      .map(({ Icon, label }, iconIdx) => {
                        const angle = iconIdx * angleStep;
                        // Round so SSR and client agree (avoids hydration mismatch).
                        const r3 = (n: number) => Math.round(n * 1000) / 1000;
                        const x = r3(50 + 50 * Math.cos(angle));
                        const y = r3(50 + 50 * Math.sin(angle));

                        return (
                          <div
                            key={label}
                            className="absolute"
                            style={{
                              left: `${x}%`,
                              top: `${y}%`,
                              transform: "translate(-50%, -50%)",
                            }}
                          >
                            {/* Counter-rotate so the logo stays upright */}
                            <div
                              className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-secondary/80 backdrop-blur"
                              style={{
                                animation: `spin ${duration}s linear infinite reverse`,
                              }}
                            >
                              <Icon
                                className="h-6 w-6 text-foreground/75"
                                title={label}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
