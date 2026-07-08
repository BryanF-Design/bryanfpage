"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronDown } from "lucide-react";

import { projects, desktopShot, mobileShot } from "@/lib/projects";
import { TextRotate } from "@/components/ui/text-rotate";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Lead with these four, then fold the rest behind "Mostrar más" so the
// section doesn't turn into an endless scroll of all live projects.
const FEATURED_SLUGS = [
  "koi-arquitectura-vercel-app",
  "element-experiences-com",
  "efficientplasticolors-com",
  "nkmohcafe-com",
];

const orderedProjects = [
  ...FEATURED_SLUGS.map((slug) => projects.find((p) => p.slug === slug)).filter(
    (p): p is (typeof projects)[number] => Boolean(p)
  ),
  ...projects.filter((p) => !FEATURED_SLUGS.includes(p.slug)),
];

// Bento span pattern, repeated over the grid. Index 0 is the hero tile.
const BENTO_SPANS = [
  "lg:col-span-2 lg:row-span-2",
  "lg:col-span-2 lg:row-span-1",
  "lg:col-span-1 lg:row-span-1",
  "lg:col-span-1 lg:row-span-1",
  "lg:col-span-1 lg:row-span-2",
  "lg:col-span-1 lg:row-span-1",
  "lg:col-span-2 lg:row-span-1",
  "lg:col-span-1 lg:row-span-1",
];

export function ProjectsShowcase() {
  const [showAll, setShowAll] = useState(false);
  const visibleProjects = showAll ? orderedProjects : orderedProjects.slice(0, 4);

  return (
    <section
      id="portafolio"
      aria-label="Portafolio de proyectos"
      className="relative overflow-hidden border-t border-border py-20 md:py-28"
    >
      <div aria-hidden className="mesh-glow-b opacity-60" />
      <div className="container relative">
        {/* Animated heading */}
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-primary">
            <span className="h-px w-6 bg-primary" />
            Portafolio
          </span>
          <h2 className="flex flex-wrap items-baseline justify-center gap-x-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">
            <span>Webs que</span>
            <TextRotate
              texts={["venden", "convierten", "conectan", "destacan"]}
              mainClassName="text-primary justify-center"
              splitLevelClassName="overflow-hidden pb-1"
              rotationInterval={2200}
              staggerDuration={0.02}
              staggerFrom="first"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-110%", opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
            />
          </h2>
          <p className="text-balance text-base text-muted-foreground md:text-lg">
            {projects.length} sitios en vivo. Cada uno diseñado y construido a la
            medida. Toca cualquiera para visitarlo.
          </p>
        </div>

        {/* Bento grid */}
        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:auto-rows-[13rem] lg:grid-flow-dense lg:grid-cols-4">
          {visibleProjects.map((p, idx) => {
            const featured = idx < FEATURED_SLUGS.length;
            const span = BENTO_SPANS[idx % BENTO_SPANS.length];

            return (
              <a
                key={p.slug}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "elevate glass group relative flex min-h-[16rem] flex-col justify-end overflow-hidden rounded-2xl lg:min-h-0",
                  span
                )}
              >
                {/* Screenshot fill. <picture>-style breakpoint swap keeps the
                    same bandwidth optimization as before — only the matching
                    shot downloads. */}
                <Image
                  src={mobileShot(p.slug)}
                  alt={`${p.name} — captura del sitio`}
                  fill
                  sizes="100vw"
                  loading="lazy"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.05] md:hidden"
                />
                <Image
                  src={desktopShot(p.slug)}
                  alt={`${p.name} — captura del sitio`}
                  fill
                  sizes="(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw"
                  loading="lazy"
                  className="hidden object-cover object-top transition-transform duration-500 group-hover:scale-[1.05] md:block"
                />

                {/* Scrim so the whole tile reads as "photo with a dark floor",
                    regardless of how light the screenshot is. */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/95" />

                {/* Index chip */}
                <span className="glass absolute right-3 top-3 z-10 rounded-full px-2.5 py-1 font-mono text-[11px] text-primary">
                  {String(idx + 1).padStart(2, "0")}
                </span>

                {/* Text overlay — its own solid+blurred backing plate, so the
                    title/description stay legible even when the screenshot has
                    its own bold text sitting right behind them (common on hero
                    shots), not just when it's merely light-colored. */}
                <div className="relative z-10 mx-2.5 mb-2.5 flex flex-col gap-1.5 rounded-xl bg-black/55 p-3.5 backdrop-blur-md">
                  <h3
                    className={cn(
                      "font-display font-semibold tracking-tight text-white",
                      featured ? "text-2xl md:text-3xl" : "text-lg"
                    )}
                  >
                    {p.name}
                  </h3>
                  <p
                    className={cn(
                      "text-white/70",
                      featured ? "text-sm md:text-base" : "text-xs"
                    )}
                  >
                    {p.desc}
                  </p>
                  <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-white/90 transition-colors group-hover:text-primary">
                    Visitar sitio
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </a>
            );
          })}
        </div>

        {!showAll && orderedProjects.length > visibleProjects.length && (
          <div className="mt-16 flex justify-center">
            <Button variant="outline" size="lg" onClick={() => setShowAll(true)}>
              Mostrar más proyectos
              <ChevronDown className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
