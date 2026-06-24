import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { projects, desktopShot, mobileShot } from "@/lib/projects";
import { SectionHeading } from "@/components/sections/section-heading";

function host(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function ProjectsGrid() {
  return (
    <section
      id="portafolio"
      aria-label="Todos los proyectos"
      className="border-t border-border py-20 md:py-28"
    >
      <div className="container">
        <SectionHeading
          eyebrow="Portafolio completo"
          title="22 sitios en vivo"
          subtitle="Toca cualquier proyecto para visitarlo. Cada uno, diseñado y construido a medida — y responsivo en cualquier dispositivo."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <a
              key={p.slug}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
            >
              {/* Browser chrome */}
              <div className="flex items-center gap-1.5 border-b border-border bg-secondary/50 px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-border" />
                <span className="h-2.5 w-2.5 rounded-full bg-border" />
                <span className="h-2.5 w-2.5 rounded-full bg-border" />
                <span className="ml-2 truncate font-mono text-[10px] text-muted-foreground">
                  {host(p.url)}
                </span>
              </div>

              {/* Desktop screenshot */}
              <div className="relative aspect-[16/10] overflow-hidden bg-background">
                <Image
                  src={desktopShot(p.slug)}
                  alt={`${p.name} — sitio en escritorio`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                />

                {/* Mobile screenshot overlay */}
                <div className="absolute bottom-3 right-3 w-[20%] overflow-hidden rounded-md border-2 border-background bg-background shadow-lg">
                  <div className="relative aspect-[9/16]">
                    <Image
                      src={mobileShot(p.slug)}
                      alt={`${p.name} — versión móvil`}
                      fill
                      sizes="80px"
                      className="object-cover object-top"
                    />
                  </div>
                </div>

                {/* Hover veil + CTA */}
                <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-background/85 via-background/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="m-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    Ver sitio
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between gap-2 px-4 py-3">
                <span className="truncate font-medium text-foreground">
                  {p.name}
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
