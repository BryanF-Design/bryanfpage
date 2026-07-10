"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronDown } from "lucide-react";

import { projects, desktopShot, mobileShot } from "@/lib/projects";
import { TextRotate } from "@/components/ui/text-rotate";
import { Tilt } from "@/components/ui/tilt";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";

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

const hostname = (url: string) => new URL(url).hostname.replace(/^www\./, "");

export function ProjectsShowcase() {
  const { t } = useLanguage();
  const [showAll, setShowAll] = useState(false);
  const visibleProjects = showAll ? orderedProjects : orderedProjects.slice(0, 6);

  return (
    <section
      id="projects"
      aria-label={t.projects.eyebrow}
      className="relative overflow-hidden border-t border-border py-20 md:py-28"
    >
      {/* Legacy anchor: keep older internal links (#portafolio) landing here. */}
      <span id="portafolio" className="absolute -top-24" aria-hidden />
      <div aria-hidden className="mesh-glow-b opacity-60" />
      <div className="container relative">
        {/* Animated heading */}
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <span className="tech-label inline-flex items-center gap-3 text-primary">
            <span className="h-1.5 w-1.5 bg-primary" />
            {t.projects.eyebrow}
          </span>
          <h2 className="flex flex-wrap items-baseline justify-center gap-x-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">
            <span>{t.projects.titlePrefix}</span>
            <TextRotate
              key={t.projects.rotatingWords.join("|")}
              texts={t.projects.rotatingWords}
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
            {t.projects.subtitle}
          </p>
        </div>

        {/* Card grid. Every tile is a little browser window — screenshot on
            top, real domain in the address bar — because the point of this
            section is that these aren't mockups, they're live sites. The
            first card runs wider (a light bento touch), and every screenshot
            shows in full via object-contain — nothing gets cropped, a tall
            mobile capture just gets more letterbox padding than a wide
            desktop one. Title and description live in their own solid
            footer below the image, never on top of it. */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
          {visibleProjects.map((p, idx) => (
            <Tilt
              key={p.slug}
              reveal
              revealDelay={(idx % 3) * 0.08}
              className={cn(idx === 0 && "sm:col-span-2 lg:col-span-2")}
            >
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="elevate group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card hover:border-primary/40"
            >
              {/* Browser chrome */}
              <div className="flex items-center gap-3 border-b border-border bg-secondary/50 px-3.5 py-2.5">
                <span className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/25" />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/25" />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/25" />
                </span>
                <span className="min-w-0 flex-1 truncate rounded-full bg-background/60 px-2.5 py-0.5 text-center font-mono text-[11px] text-muted-foreground">
                  {hostname(p.url)}
                </span>
              </div>

              {/* Screenshot: object-cover desde arriba, así el marco 4:3
                  siempre se llena con la parte superior del sitio (nada de
                  tiras letterboxeadas en móvil — la captura de teléfono es
                  muy alta y solo interesa su inicio). El swap tipo <picture>
                  mantiene la optimización: solo se descarga la captura que
                  corresponde al breakpoint. */}
              <div className="relative aspect-[4/3] overflow-hidden bg-secondary/20">
                <Image
                  src={mobileShot(p.slug)}
                  alt={`${p.name} — captura del sitio`}
                  fill
                  sizes="100vw"
                  loading="lazy"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03] md:hidden"
                />
                <Image
                  src={desktopShot(p.slug)}
                  alt={`${p.name} — captura del sitio`}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  loading="lazy"
                  className="hidden object-cover object-top transition-transform duration-500 group-hover:scale-[1.03] md:block"
                />
              </div>

              {/* Caption — solid card background, never over the image. */}
              <div className="flex flex-1 flex-col gap-1.5 p-5">
                <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
                  {p.name}
                </h3>
                <p className="text-sm text-muted-foreground">{t.projects.descs[p.slug] ?? p.desc}</p>
                <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground/90 transition-colors group-hover:text-primary">
                  {t.projects.visitSite}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </a>
            </Tilt>
          ))}
        </div>

        {!showAll && orderedProjects.length > visibleProjects.length && (
          <div className="mt-16 flex justify-center">
            <Button variant="outline" size="lg" onClick={() => setShowAll(true)}>
              {t.projects.showMore}
              <ChevronDown className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
