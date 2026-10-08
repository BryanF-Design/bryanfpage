"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, CodeXml, Crosshair, Gauge, Network, Sparkle, type LucideIcon } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { ChapterMark } from "@/components/japan/chapter-mark";
import { Button, ButtonArrow } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

const WHATSAPP = "https://wa.me/525663012505";

/** Icono de cada criterio, en el orden del diccionario: precisión, ritmo, conexión. */
const PRINCIPLE_ICONS: LucideIcon[] = [Crosshair, Gauge, Network];

function fx(ms: number) {
  return { "--fx-delay": `${ms}ms` } as CSSProperties;
}

/**
 * Un carrusel sin enlaces dentro solo se recorre con teclado si el propio
 * contenedor recibe el foco; se vuelve enfocable únicamente mientras de
 * verdad desborda (en la retícula de escritorio no es una parada más).
 */
function useScrollerFocus<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [scrollable, setScrollable] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setScrollable(el.scrollWidth > el.clientWidth + 1);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, scrollable] as const;
}

/** Separa la primera oración del titular ("Soy Bryan.") del resto. */
function splitTitle(title: string) {
  const match = title.match(/^(.+?[.。!！])\s*(.+)$/);
  return match ? { lead: match[1], rest: match[2] } : { lead: "", rest: title };
}

/**
 * "Mi forma de trabajar · precisión, ritmo y conexión" → solo el titular: la
 * bajada repetía los nombres de los tres criterios que vienen justo debajo.
 */
function labelHead(label: string) {
  return label.split(/\s*·\s*/)[0] ?? label;
}

/** Envuelve la última aparición de `accent` dentro de `text` (si no está, queda igual). */
function withAccent(text: string, accent: string, className: string): ReactNode {
  const at = accent ? text.lastIndexOf(accent) : -1;
  if (at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <span className={className}>{accent}</span>
      {text.slice(at + accent.length)}
    </>
  );
}

/**
 * Sobre mí — Bryan sale por arriba de un panel bosque (como los personajes
 * de las referencias), junto a un relato en tarjeta blanca con la cita
 * editorial, los chips y las acciones, y la foto del escritorio (siempre
 * apaisada). Debajo, los tres criterios de trabajo en un solo panel blanco,
 * en columnas separadas por filetes finos.
 *
 * Retícula: en teléfono todo apila; de tableta a 1279px, retrato y foto van
 * lado a lado y el relato debajo a todo lo ancho; desde xl el relato ocupa la
 * columna derecha a dos filas.
 */
export function MeetBryan() {
  const { t, locale } = useLanguage();
  const { lead, rest } = splitTitle(t.about.title);
  // Instrument Serif no trae glifos CJK: en japonés y chino la cita va recta.
  const cjk = locale === "ja" || locale === "zh";
  const principlesTitle = labelHead(t.about.principlesLabel);
  const [chipsRef, chipsScroll] = useScrollerFocus<HTMLUListElement>();
  const [principlesRef, principlesScroll] = useScrollerFocus<HTMLUListElement>();

  const locationChip = (
    <span className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-ink shadow-soft">
      <span aria-hidden className="relative flex size-2">
        <span className="absolute inset-0 animate-ping rounded-full bg-forest/60 motion-reduce:animate-none" />
        <span className="relative size-2 rounded-full bg-forest" />
      </span>
      CDMX · MX
    </span>
  );

  return (
    <section
      id="bryan"
      aria-labelledby="bryan-title"
      className="relative flex flex-col gap-gutter"
    >
      <div className="grid gap-gutter md:grid-cols-12 xl:grid-rows-[auto_1fr]">
        {/* Retrato: el panel arranca a la altura del cuello y la cabeza lo rebasa.
            En teléfono es una cabecera de perfil baja: Bryan más chico a la
            derecha y la ubicación en el recorte de la esquina izquierda. */}
        <div data-fx="up" className="min-w-0 md:col-span-5 md:row-start-1">
          <figure className="relative mx-auto max-w-[36rem] pt-5 md:max-w-none xl:pt-2">
            <div className="panel panel-forest absolute inset-x-0 bottom-0 top-[30%] md:top-[25%]">
              {/* Decoración recortada por el panel; en teléfono el círculo sigue a la cabeza. */}
              <div aria-hidden className="absolute inset-0 overflow-hidden rounded-[inherit]">
                <div className="absolute left-[68%] top-[12%] aspect-square w-[50%] -translate-x-1/2 rounded-full bg-lime md:left-1/2 md:w-[82%]" />
                <div className="absolute left-[68%] top-[12%] aspect-square w-[50%] -translate-x-1/2 scale-[1.18] rounded-full border border-white/15 md:left-1/2 md:w-[82%]" />
                <div className="dot-cluster absolute left-5 top-5 h-[2.75rem] w-[4.125rem] opacity-70 max-md:hidden sm:left-7 sm:top-7" />
              </div>
              {/* La misma ficha en una esquina u otra: a la derecha la taparía el hombro. */}
              <div className="notch notch-tl md:hidden">{locationChip}</div>
              <div className="notch notch-tr max-md:hidden">{locationChip}</div>
            </div>

            {/* Órbita detrás de la cabeza, como en el hero. El centrado vive en
                el contenedor y la flotación en el SVG: si compartieran
                `transform`, la animación borraría el centrado. */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-[43%] right-[7%] top-[4%] z-[9] text-ink/35 md:inset-x-[9%]"
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
              className="float-y absolute right-[6%] top-[4%] z-[11] h-6 w-6 fill-lime text-lime-deep md:right-[14%] md:h-8 md:w-8"
            />

            <Image
              src="/img/brand/bryan-cutout.webp"
              alt={`Bryan F. — ${t.about.role}`}
              width={1122}
              height={1114}
              sizes="(min-width: 1280px) 34rem, (min-width: 768px) 40vw, (min-width: 640px) 21rem, 58vw"
              className="relative z-10 ml-auto mr-[3%] h-auto w-[58%] drop-shadow-[0_24px_30px_hsl(160_40%_8%/0.35)] md:mx-auto md:w-[94%]"
            />

            <figcaption className="absolute bottom-3 left-3 z-20 inline-flex items-center gap-3 rounded-full bg-white py-1.5 pl-1.5 pr-5 shadow-pop sm:bottom-5 sm:left-5">
              <span className="grid size-10 place-items-center rounded-full bg-ink text-lime">
                <Sparkle aria-hidden className="h-4 w-4 fill-lime" />
              </span>
              <span className="leading-tight">
                <span className="block text-[0.9375rem] font-bold text-ink">Bryan F.</span>
                <span className="block text-xs font-medium text-ink/70">{t.about.role}</span>
              </span>
            </figcaption>
          </figure>
        </div>

        {/* Relato */}
        <div
          data-fx="up"
          style={fx(80)}
          className="min-w-0 md:col-span-12 md:row-start-2 xl:col-span-7 xl:col-start-6 xl:row-span-2 xl:row-start-1"
        >
          <div className="panel flex h-full flex-col p-5 shadow-soft sm:p-8 lg:p-12">
            <ChapterMark label={t.about.eyebrow} index={3} />

            <h2 id="bryan-title" className="mt-5 text-ink sm:mt-6 lg:mt-9">
              {lead && (
                <span className="display-italic block text-[clamp(1.75rem,3vw,2.6rem)] leading-none text-forest">
                  {lead}
                </span>
              )}
              <span className="display-title mt-2 block text-balance text-[clamp(2.1rem,3.9vw,3.6rem)]">
                {rest}
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:mt-5 md:text-lg">
              {t.about.subtitle}
            </p>

            {/* Cita editorial: etiqueta espaciada, filete fino y el texto en
                sans legible; solo el remate va en serif itálica. */}
            <div className="relative mt-6 rounded-card bg-mint p-4 pt-5 ring-1 ring-ink/[0.05] sm:mt-8 sm:p-7">
              <span
                aria-hidden
                className="pointer-events-none absolute -top-4 right-4 font-serif text-[5rem] italic leading-none text-forest/90 sm:-top-5 sm:right-7 sm:text-[6.5rem]"
              >
                &ldquo;
              </span>
              <p className="flex items-center gap-3 text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                <span aria-hidden className="h-px w-6 bg-current sm:w-8" />
                {t.about.inspirationLabel}
              </p>
              <p
                className={cn(
                  "mt-3 max-w-[62ch] text-pretty text-[0.9375rem] text-ink/80 sm:mt-4 sm:text-lg",
                  cjk ? "leading-[1.8]" : "leading-[1.6]"
                )}
              >
                {withAccent(
                  t.about.inspiration,
                  t.about.inspirationAccent,
                  cjk
                    ? "font-bold text-forest"
                    : "font-serif text-[1.2em] italic leading-none text-forest"
                )}
              </p>
            </div>

            {/* En teléfono las fichas van en una sola fila que se desliza hasta
                la orilla de la tarjeta, como los filtros de las referencias. */}
            <ul
              ref={chipsRef}
              role="list"
              aria-label={t.about.eyebrow}
              tabIndex={chipsScroll ? 0 : undefined}
              className="-mx-5 mt-5 flex gap-1.5 overflow-x-auto px-5 [scrollbar-width:none] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-forest sm:mx-0 sm:mt-6 sm:flex-wrap sm:gap-2 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
            >
              {t.about.chips.map((chip) => (
                <li
                  key={chip}
                  className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full border border-ink/15 pl-1 pr-3 text-[0.8125rem] font-semibold text-ink max-sm:shrink-0 sm:h-10 sm:gap-2 sm:whitespace-normal sm:pl-1.5 sm:pr-4 sm:text-sm"
                >
                  <span aria-hidden className="grid size-6 place-items-center rounded-full bg-lime sm:size-7">
                    <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={3} />
                  </span>
                  {chip}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col gap-2 sm:mt-8 sm:flex-row sm:gap-2.5 xl:mt-auto xl:pt-10">
              <Button asChild size="lg" variant="ink" className="h-12 pr-2 sm:h-14 sm:pr-2.5">
                <Link href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                  <FaWhatsapp aria-hidden className="h-5 w-5 text-lime" />
                  {t.about.ctaPrimary}
                  <ButtonArrow tone="lime" className="ml-auto -mr-0.5 sm:ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 sm:h-14">
                <Link href="#proceso">{t.about.ctaSecondary}</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* El escritorio: la foto es apaisada (1672×941) y así se queda. En
            teléfono manda la proporción; desde tableta llena su celda, que
            nunca baja de 16rem y siempre es más ancha que alta. */}
        <div
          data-fx="up"
          style={fx(140)}
          className="min-w-0 md:col-span-7 md:col-start-6 md:row-start-1 xl:col-span-5 xl:col-start-1 xl:row-start-2"
        >
          <figure className="group relative aspect-[16/7] overflow-hidden rounded-panel bg-ink md:aspect-auto md:h-full md:min-h-[16rem] xl:min-h-[18rem]">
            <Image
              src="/img/me/about-photo.png"
              alt={t.about.photoAlt}
              fill
              sizes="(min-width: 1280px) 40vw, (min-width: 768px) 58vw, 100vw"
              className="object-cover object-[50%_100%] transition-transform duration-700 [transition-timing-function:var(--ease-out)] group-hover:scale-[1.04] md:object-[50%_40%]"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-transparent"
            />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-7">
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

      {/* Criterios de trabajo: un solo panel blanco, el titular arriba y tres
          columnas separadas por filetes, cada una con su botón redondo. En
          teléfono son tarjetas menta en carrusel (la siguiente asoma por la
          orilla del panel): icono y título en una fila, el resto debajo y las
          etiquetas al pie, alineadas entre tarjetas. */}
      <div data-fx="up" className="min-w-0">
        <div className="panel p-5 shadow-soft sm:p-8 lg:p-10">
          <h3
            id="bryan-principles-title"
            className="display-title text-[clamp(1.75rem,2.6vw,2.4rem)] text-ink"
          >
            {principlesTitle}
          </h3>

          <ul
            ref={principlesRef}
            role="list"
            aria-labelledby="bryan-principles-title"
            tabIndex={principlesScroll ? 0 : undefined}
            className="-mx-5 mt-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 [scrollbar-width:none] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-forest sm:-mx-8 sm:mt-6 sm:scroll-px-8 sm:px-8 md:mx-0 md:mt-9 md:grid md:snap-none md:grid-cols-3 md:gap-0 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {t.about.principles.map((principle, index) => {
              const Icon = PRINCIPLE_ICONS[index] ?? Sparkle;
              return (
                <li
                  key={principle.title}
                  className="grid w-[80%] min-w-0 shrink-0 snap-start grid-cols-[2.75rem_minmax(0,1fr)] grid-rows-[auto_auto_1fr] items-center gap-x-3 rounded-card bg-mint p-4 ring-1 ring-inset ring-ink/[0.05] sm:w-[46%] md:flex md:w-auto md:flex-col md:items-stretch md:gap-6 md:rounded-none md:border-l md:border-border md:bg-transparent md:px-7 md:py-0 md:ring-0 md:first:border-l-0 md:first:pl-0 md:last:pr-0 lg:px-9"
                >
                  <span
                    aria-hidden
                    className="grid size-11 place-items-center rounded-full bg-ink text-lime md:size-12"
                  >
                    <Icon className="h-5 w-5" strokeWidth={2.25} />
                  </span>
                  {/* En teléfono este bloque se disuelve en la retícula de la tarjeta. */}
                  <div className="min-w-0 max-md:contents">
                    <h4 className="display-title text-[1.5rem] text-ink md:text-[1.75rem]">
                      {principle.title}
                    </h4>
                    <p className="mt-3 text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground max-md:col-span-2 md:mt-2 md:text-base">
                      {principle.body}
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-1.5 max-md:col-span-2 max-md:self-end md:mt-4">
                      {principle.detail.split(/\s*·\s*/).map((item) => (
                        <li
                          key={item}
                          className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-ink/80 md:bg-ink/[0.06] md:px-3 md:py-1.5"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
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
