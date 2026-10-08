"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, CodeXml, Sparkle } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { ChapterMark } from "@/components/japan/chapter-mark";
import { Button, ButtonArrow } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

const WHATSAPP = "https://wa.me/525663012505";

/** Superficie de cada criterio: lima, blanca y tinta, como las tarjetas de Paytin. */
const PRINCIPLE_SURFACES = [
  "panel panel-lime",
  "panel shadow-soft",
  "panel panel-ink",
] as const;

function fx(ms: number) {
  return { "--fx-delay": `${ms}ms` } as CSSProperties;
}

/** Separa la primera oración del titular ("Soy Bryan.") del resto. */
function splitTitle(title: string) {
  const match = title.match(/^(.+?[.。!！])\s*(.+)$/);
  return match ? { lead: match[1], rest: match[2] } : { lead: "", rest: title };
}

/** "Mi forma de trabajar · precisión, ritmo y conexión" → titular + bajada. */
function splitLabel(label: string) {
  const [head, ...tail] = label.split(/\s*·\s*/);
  return { head, tail: tail.join(" · ") };
}

/**
 * Sobre mí — Bryan sale por arriba de un panel bosque (como los personajes
 * de las referencias), junto a un relato en tarjeta blanca con la cita
 * editorial, los chips y las acciones. Debajo, la foto del escritorio y los
 * tres criterios de trabajo en tarjetas tipo app: lima, blanca y tinta.
 */
export function MeetBryan() {
  const { t, locale } = useLanguage();
  const { lead, rest } = splitTitle(t.about.title);
  // Instrument Serif no trae glifos CJK: en japonés y chino la cita va recta.
  const cjk = locale === "ja" || locale === "zh";
  const label = splitLabel(t.about.principlesLabel);

  return (
    <section
      id="bryan"
      aria-labelledby="bryan-title"
      className="relative flex flex-col gap-gutter"
    >
      <div className="grid gap-gutter lg:grid-cols-12 lg:grid-rows-[auto_1fr]">
        {/* Retrato: el panel arranca a la altura del cuello y la cabeza lo rebasa. */}
        <div data-fx="up" className="min-w-0 lg:col-span-5 lg:row-start-1">
          <figure className="relative mx-auto max-w-[36rem] pt-5 lg:max-w-none lg:pt-2">
            <div className="panel panel-forest absolute inset-x-0 bottom-0 top-[25%]">
              {/* Decoración recortada por el panel. */}
              <div aria-hidden className="absolute inset-0 overflow-hidden rounded-[inherit]">
                <div className="absolute left-1/2 top-[12%] aspect-square w-[82%] -translate-x-1/2 rounded-full bg-lime" />
                <div className="absolute left-1/2 top-[12%] aspect-square w-[82%] -translate-x-1/2 scale-[1.18] rounded-full border border-white/15" />
                <div className="dot-cluster absolute left-5 top-5 h-[2.75rem] w-[4.125rem] opacity-70 sm:left-7 sm:top-7" />
              </div>
              <div className="notch notch-tr">
                <span className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-ink shadow-soft">
                  <span aria-hidden className="relative flex size-2">
                    <span className="absolute inset-0 animate-ping rounded-full bg-forest/60 motion-reduce:animate-none" />
                    <span className="relative size-2 rounded-full bg-forest" />
                  </span>
                  CDMX · MX
                </span>
              </div>
            </div>

            {/* Órbita detrás de la cabeza, como en el hero. El centrado vive en
                el contenedor y la flotación en el SVG: si compartieran
                `transform`, la animación borraría el centrado. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-[9%] top-[4%] z-[9] text-ink/35"
            >
              <svg viewBox="0 0 400 140" className="float-y block w-full">
                <ellipse
                  cx="200"
                  cy="70"
                  rx="190"
                  ry="38"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  transform="rotate(-8 200 70)"
                />
              </svg>
            </div>
            <Sparkle
              aria-hidden
              className="float-y absolute right-[14%] top-[4%] z-[11] h-8 w-8 fill-lime text-lime-deep"
            />

            <Image
              src="/img/brand/bryan-cutout.webp"
              alt={`Bryan F. — ${t.about.role}`}
              width={623}
              height={558}
              sizes="(min-width: 1024px) 34rem, (min-width: 640px) 36rem, 92vw"
              className="relative z-10 mx-auto h-auto w-[94%] drop-shadow-[0_24px_30px_hsl(160_40%_8%/0.35)]"
            />

            <figcaption className="absolute bottom-3 left-3 z-20 inline-flex items-center gap-3 rounded-full bg-white py-1.5 pl-1.5 pr-5 shadow-pop sm:bottom-5 sm:left-5">
              <span className="grid size-10 place-items-center rounded-full bg-ink text-lime">
                <Sparkle aria-hidden className="h-4 w-4 fill-lime" />
              </span>
              <span className="leading-tight">
                <span className="block text-[0.9375rem] font-bold text-ink">Bryan F.</span>
                <span className="block text-xs font-medium text-ink/60">{t.about.role}</span>
              </span>
            </figcaption>
          </figure>
        </div>

        {/* Relato */}
        <div
          data-fx="up"
          style={fx(80)}
          className="min-w-0 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1"
        >
          <div className="panel flex h-full flex-col p-5 shadow-soft sm:p-8 lg:p-12">
            <ChapterMark label={t.about.eyebrow} index={3} />

            <h2 id="bryan-title" className="mt-6 text-ink lg:mt-9">
              {lead && (
                <span className="display-italic block text-[clamp(1.75rem,3vw,2.6rem)] leading-none text-forest">
                  {lead}
                </span>
              )}
              <span className="display-title mt-2 block text-balance text-[clamp(2.1rem,3.9vw,3.6rem)]">
                {rest}
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              {t.about.subtitle}
            </p>

            {/* Cita editorial: etiqueta espaciada, filete fino y serif itálica. */}
            <div className="relative mt-8 rounded-card bg-mint p-5 pt-6 ring-1 ring-ink/[0.05] sm:p-7">
              <span
                aria-hidden
                className="pointer-events-none absolute -top-5 right-5 font-serif text-[6.5rem] italic leading-none text-forest/90 sm:right-7"
              >
                &ldquo;
              </span>
              <p className="flex items-center gap-3 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                <span aria-hidden className="h-px w-8 bg-current" />
                {t.about.inspirationLabel}
              </p>
              <p
                className={cn(
                  "mt-4 text-pretty text-ink",
                  cjk
                    ? "text-[1.0625rem] font-medium leading-[1.8] sm:text-lg"
                    : "font-serif text-[1.35rem] italic leading-[1.32] sm:text-[1.5rem]"
                )}
              >
                {t.about.inspiration}
              </p>
            </div>

            <ul className="mt-6 flex flex-wrap gap-2">
              {t.about.chips.map((chip) => (
                <li
                  key={chip}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-ink/15 pl-1.5 pr-4 text-sm font-semibold text-ink"
                >
                  <span aria-hidden className="grid size-7 place-items-center rounded-full bg-lime">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  {chip}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-2.5 sm:flex-row lg:mt-auto lg:pt-10">
              <Button asChild size="lg" variant="ink" className="pr-2.5">
                <Link href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                  <FaWhatsapp aria-hidden className="h-5 w-5 text-lime" />
                  {t.about.ctaPrimary}
                  <ButtonArrow tone="lime" className="ml-auto -mr-0.5 sm:ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#proceso">{t.about.ctaSecondary}</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* El escritorio */}
        <div data-fx="up" style={fx(140)} className="min-w-0 lg:col-span-5 lg:row-start-2">
          <figure className="group relative h-full min-h-[15rem] overflow-hidden rounded-panel bg-ink sm:min-h-[18rem]">
            <Image
              src="/img/me/about-photo.png"
              alt={t.about.photoAlt}
              fill
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="object-cover object-[50%_42%] transition-transform duration-700 [transition-timing-function:var(--ease-out)] group-hover:scale-[1.04]"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-transparent"
            />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-7">
              <span className="max-w-[24ch] text-pretty text-lg font-semibold leading-snug text-white sm:text-xl">
                {t.about.quote}
              </span>
              <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-full bg-lime text-ink">
                <CodeXml className="h-5 w-5" strokeWidth={2.25} />
              </span>
            </figcaption>
          </figure>
        </div>
      </div>

      {/* Criterios de trabajo: rótulo con filete editorial y tres tarjetas. */}
      <div data-fx="up" className="min-w-0">
        <div className="flex flex-col gap-1.5 px-1 pt-4 sm:flex-row sm:items-center sm:gap-6 md:pt-6">
          <p className="display-title shrink-0 text-[clamp(1.75rem,2.6vw,2.4rem)] text-ink">
            {label.head}
          </p>
          <span aria-hidden className="hidden h-px min-w-8 flex-1 bg-ink/15 sm:block" />
          {label.tail && (
            <p className="text-base font-medium text-muted-foreground first-letter:uppercase sm:text-lg">
              {label.tail}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-gutter md:grid-cols-3">
        {t.about.principles.map((principle, index) => (
          <div
            key={principle.title}
            data-fx="up"
            style={fx(index * 100)}
            className="min-w-0"
          >
            <article
              className={cn(
                "group relative flex h-full min-h-[17rem] flex-col p-6 transition-transform duration-300 [transition-timing-function:var(--ease-out)] hover:-translate-y-1 md:p-7",
                PRINCIPLE_SURFACES[index] ?? "panel shadow-soft"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <span
                  className={cn(
                    "display-xl text-[5.25rem] leading-[0.8]",
                    index === 1 && "text-forest",
                    index === 2 && "text-lime"
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <PrincipleViz index={index} />
              </div>
              <h3 className="display-title mt-auto pt-10 text-[2rem]">{principle.title}</h3>
              <p className="mt-2 text-pretty text-[0.975rem] leading-relaxed text-muted-foreground">
                {principle.body}
              </p>
              <ul className="mt-5 flex flex-wrap gap-1.5">
                {principle.detail.split(/\s*·\s*/).map((item) => (
                  <li
                    key={item}
                    className="rounded-full bg-foreground/[0.08] px-3 py-1.5 text-xs font-semibold text-foreground/85"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Mini gráfico de cada criterio: retícula, barras y nodos (decorativo). */
function PrincipleViz({ index }: { index: number }) {
  if (index === 0) {
    // Precisión: una retícula de puntos con uno solo marcado.
    return (
      <span aria-hidden className="grid grid-cols-4 gap-1.5 pt-1">
        {Array.from({ length: 12 }, (_, i) => (
          <span
            key={i}
            className={cn(
              "size-2.5 rounded-full",
              i === 6 ? "bg-ink ring-[5px] ring-ink/15" : "bg-ink/20"
            )}
          />
        ))}
      </span>
    );
  }
  if (index === 1) {
    // Ritmo: barras redondeadas, la última en lima.
    return (
      <span aria-hidden className="flex h-14 items-end gap-1.5">
        {[38, 64, 48, 86, 70, 100].map((h, i) => (
          <span
            key={i}
            style={{ height: `${h}%` }}
            className={cn("w-2.5 rounded-full", i === 5 ? "bg-lime" : "bg-ink/10")}
          />
        ))}
      </span>
    );
  }
  // Conexión: tres nodos unidos.
  return (
    <svg aria-hidden viewBox="0 0 96 56" className="h-14 w-24 text-lime">
      <path
        d="M12 44 C 30 44, 30 12, 48 12 S 66 44, 84 44"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.45"
        strokeWidth="2"
        strokeDasharray="3 5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="44" r="7" fill="currentColor" />
      <circle cx="48" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="84" cy="44" r="7" fill="currentColor" />
    </svg>
  );
}
