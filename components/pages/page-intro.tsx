"use client";

import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { ChevronRight, House, Sparkle } from "lucide-react";

import { useLanguage } from "@/lib/i18n/context";

function hd(ms: number) {
  return { "--hd": `${ms}ms` } as CSSProperties;
}

/**
 * Cabecera de las páginas a las que se movieron secciones del inicio
 * (/conoceme, /lumina, /contacto, /casos): migas, chip, h1 y bajada en el
 * mismo panel blanco del sitio; `aside` aloja acciones o datos de contacto.
 */
export function PageIntro({
  eyebrow,
  title,
  subtitle,
  aside,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  aside?: ReactNode;
}) {
  const { t } = useLanguage();

  return (
    <section
      aria-labelledby="page-title"
      className="panel relative overflow-hidden p-5 shadow-soft sm:p-7 lg:p-10"
    >
      <div
        aria-hidden
        className="dot-cluster pointer-events-none absolute -right-3 -top-3 h-32 w-44 opacity-50 [mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]"
      />
      <div className="relative grid gap-7 lg:grid-cols-12 lg:items-end lg:gap-10">
        <div className="flex min-w-0 flex-col items-start gap-5 lg:col-span-7">
          <nav
            aria-label={t.pages.breadcrumb}
            className="hero-in hero-in-fade inline-flex max-w-full items-center gap-1 rounded-full bg-ink/[0.05] p-1 pr-4 text-sm font-semibold"
            style={hd(40)}
          >
            <Link
              href="/"
              className="inline-flex h-10 min-w-11 shrink-0 items-center gap-1.5 rounded-full bg-white px-3.5 text-ink shadow-[0_4px_14px_-8px_hsl(var(--ink)/0.45)] transition-colors hover:bg-lime"
            >
              <House aria-hidden className="h-3.5 w-3.5" />
              {t.nav.inicio}
            </Link>
            <ChevronRight aria-hidden className="h-4 w-4 shrink-0 text-ink/35" />
            <span aria-current="page" className="truncate text-ink/70">
              {title}
            </span>
          </nav>

          <span className="hero-in hero-in-fade eyebrow pl-3" style={hd(80)}>
            <span aria-hidden className="size-2 rounded-full bg-lime-deep" />
            {eyebrow}
          </span>

          <h1
            id="page-title"
            className="hero-in hero-in-up display-title text-balance text-[clamp(2.5rem,5.4vw,4.75rem)] text-ink"
            style={hd(100)}
          >
            {title}
            <Sparkle
              aria-hidden
              className="float-y relative -top-[0.4em] ml-2 inline-block size-[0.4em] fill-lime text-lime-deep"
            />
          </h1>

          <p
            className="hero-in hero-in-fade max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg"
            style={hd(160)}
          >
            {subtitle}
          </p>
        </div>

        {aside && (
          <div className="hero-in hero-in-up min-w-0 lg:col-span-5" style={hd(200)}>
            {aside}
          </div>
        )}
      </div>
    </section>
  );
}
