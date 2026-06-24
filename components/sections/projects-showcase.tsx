import { ArrowUpRight } from "lucide-react";

import { projects, desktopShot, mobileShot } from "@/lib/projects";
import { TextRotate } from "@/components/ui/text-rotate";
import { cn } from "@/lib/utils";

function host(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function ProjectsShowcase() {
  return (
    <section
      id="portafolio"
      aria-label="Portafolio de proyectos"
      className="border-t border-border py-20 md:py-28"
    >
      <div className="container">
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
            22 sitios en vivo. Cada uno diseñado y construido a la medida. Toca
            cualquiera para visitarlo.
          </p>
        </div>

        {/* Alternating rows */}
        <div className="mt-16 flex flex-col gap-16 md:gap-24">
          {projects.map((p, idx) => {
            const flip = idx % 2 === 1;
            return (
              <a
                key={p.slug}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid items-center gap-8 md:grid-cols-2 md:gap-14"
              >
                {/* Visual: a phone-tall card on mobile, a browser-framed card on desktop.
                    <picture> loads ONLY the screenshot that matches the breakpoint. */}
                <div className={cn("mx-auto w-full max-w-[280px] md:max-w-none", flip ? "md:order-2" : "md:order-1")}>
                  <div className="overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/50 group-hover:shadow-xl group-hover:shadow-primary/5 md:rounded-xl">
                    {/* Browser chrome — desktop only, decorative */}
                    <div className="hidden items-center gap-1.5 border-b border-border bg-secondary/50 px-3 py-2 md:flex">
                      <span className="h-2.5 w-2.5 rounded-full bg-border" />
                      <span className="h-2.5 w-2.5 rounded-full bg-border" />
                      <span className="h-2.5 w-2.5 rounded-full bg-border" />
                      <span className="ml-2 truncate font-mono text-[10px] text-muted-foreground">
                        {host(p.url)}
                      </span>
                    </div>
                    <div className="relative aspect-[9/16] overflow-hidden bg-background md:aspect-[16/10]">
                      <picture>
                        <source
                          media="(min-width: 768px)"
                          srcSet={desktopShot(p.slug)}
                        />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={mobileShot(p.slug)}
                          alt={`${p.name} — captura del sitio`}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </picture>
                    </div>
                  </div>
                </div>

                {/* Text */}
                <div
                  className={cn(
                    "flex flex-col items-start gap-3",
                    flip ? "md:order-1 md:items-end md:text-right" : "md:order-2"
                  )}
                >
                  <span className="font-mono text-sm text-primary">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                    {p.name}
                  </h3>
                  <p className="text-lg text-muted-foreground">{p.desc}</p>
                  <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                    Visitar sitio
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
