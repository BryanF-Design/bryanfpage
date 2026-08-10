"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CircleBadge } from "@/components/ui/circle-badge";
import { StatCounter } from "@/components/ui/stat-counter";
import { useLanguage } from "@/lib/i18n/context";
import { useReducedMotionPreference } from "@/lib/motion-preference";

/**
 * Hero 版面 — la portada.
 *
 * La versión anterior medía 218svh: dos pantallas y media de scroll enganchado
 * antes de que apareciera la primera línea de contenido real. Aquí la portada
 * vuelve a ser una portada —una pantalla, un titular, un rostro— al modo de las
 * referencias brutalistas: tipografía de display a sangre, retrato en blanco y
 * negro recortado contra un bloque lima, y una tira de datos cerrando la hoja.
 *
 * El Civic no desaparece: se mudó a su propio capítulo (走り), donde por fin
 * puede contarse como lo que es —una obsesión personal— en vez de competir con
 * el titular por el mismo espacio.
 */
export function HeroEditorial() {
  const { t } = useLanguage();
  const reduced = useReducedMotionPreference();

  const rise = (delay: number) => ({
    initial: reduced ? false : { y: 18, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: {
      ease: [0.2, 0, 0, 1] as [number, number, number, number],
      delay: reduced ? 0 : delay,
      duration: reduced ? 0 : 0.55,
    },
  });

  return (
    <section id="home" className="relative isolate w-full overflow-hidden">
      <div aria-hidden className="japan-halftone absolute inset-0 opacity-[0.13]" />
      <div aria-hidden className="mesh-glow-a absolute inset-0 opacity-40" />

      <div className="container relative z-10 flex min-h-[100svh] flex-col pb-0 pt-24 sm:pt-28">
        <div className="grid flex-1 items-center gap-10 lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] lg:gap-12">
          {/* ——— Columna de texto ——————————————————————————————— */}
          <div className="relative z-20 flex min-w-0 flex-col items-start gap-6 py-6 lg:py-10">
            <motion.span
              {...rise(0.06)}
              className="tech-label signal-kicker inline-flex items-center gap-3 text-muted-foreground"
            >
              <span aria-hidden className="h-1.5 w-1.5 bg-primary" />
              {t.hero.eyebrow}
            </motion.span>

            <h1 className="hero-title max-w-[11ch] font-display text-[15.5vw] font-bold uppercase leading-[0.8] tracking-[-0.055em] text-foreground sm:text-[5rem] md:text-[6rem] lg:text-[6.4rem] xl:text-[7.6rem]">
              <span className="block">{t.hero.titlePrefix}</span>
              <span className="block text-primary drop-shadow-[0_0_32px_hsl(var(--primary)/0.16)]">
                {t.hero.titleHighlight}
              </span>
            </h1>

            {/* El párrafo va en caja, no suelto: en la referencia el bloque de
                texto pequeño es un elemento de composición con su propio
                borde, no un pie de titular. */}
            <motion.p
              {...rise(0.14)}
              className="max-w-[30rem] border-l border-primary/50 pl-5 text-pretty text-sm leading-relaxed text-muted-foreground md:text-base"
            >
              {t.hero.subtitle}
            </motion.p>

            <motion.div
              {...rise(0.2)}
              className="mt-1 flex w-full flex-col items-start gap-4 sm:w-auto sm:flex-row sm:items-center"
            >
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link href="#precios">{t.nav.armaTuWeb}</Link>
              </Button>
              <Link
                href="#projects"
                className="group inline-flex min-h-11 items-center gap-2 border-b border-foreground/35 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {t.nav.verProyectos}
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          </div>

          {/* ——— Retrato ————————————————————————————————————————
              El rostro entra en la portada. Es la pieza que faltaba para que
              el sitio se leyera como el trabajo de una persona y no como el
              de un estudio anónimo. */}
          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: reduced ? 0 : 0.16,
              duration: reduced ? 0 : 0.7,
              ease: [0.2, 0, 0, 1],
            }}
            className="relative mx-auto w-full max-w-[26rem] pb-10 lg:max-w-none lg:pb-0"
          >
            {/* 日の丸 detrás del sujeto: el mismo ancla circular que sostenía
                al Civic. La composición no cambió de gramática, cambió de
                protagonista. */}
            <div
              aria-hidden
              className="hinomaru left-1/2 top-1/2 aspect-square w-[min(120%,34rem)] -translate-x-1/2 -translate-y-1/2"
            />

            {/* El bloque de color que la referencia pone detrás del recorte.
                Sobresale por arriba y por la derecha: si quedara entero debajo
                de la fotografía no se vería, y el bloque existe justamente
                para que el retrato tenga contra qué recortarse. */}
            <div
              aria-hidden
              className="absolute -right-3 -top-4 hidden h-[58%] w-[44%] bg-primary/85 sm:block lg:-right-4 lg:-top-5"
            />

            <figure className="relative">
              <div className="amiten relative aspect-[4/5] w-full overflow-hidden border border-foreground/15 bg-[#07110d] lg:aspect-[3/4.1]">
                <Image
                  src="/img/me/20260517_022824-IMG_STYLE.jpg"
                  alt={`Bryan F. — ${t.about.role}`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 46vw, (min-width: 640px) 26rem, 100vw"
                  className="object-cover object-[52%_18%]"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background via-background/45 to-transparent"
                />
                <div aria-hidden className="absolute inset-y-0 left-0 w-1 bg-signal" />
              </div>

              <figcaption className="mt-3 flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                <span className="text-foreground">Bryan F.</span>
                <span className="h-px flex-1 bg-border" />
                <span>{t.about.role}</span>
              </figcaption>
            </figure>

            <CircleBadge
              text="BryanF Design · CDMX"
              center="B."
              size={116}
              className="absolute -left-3 bottom-16 hidden sm:grid lg:-left-10 lg:bottom-20"
            />

          </motion.div>
        </div>
      </div>

      {/* ——— 記録帯 · La tira de cifras ————————————————————————————
          El «pit board» era una sección propia con tres columnas de 9rem de
          alto. Aquí cierra la portada en una sola banda: mismos datos, misma
          voz mono, una fracción del scroll. */}
      <div className="relative z-10 border-y border-border bg-card/45">
        <div className="container">
          <dl className="grid grid-cols-3 divide-x divide-border">
            <HeroStat
              value={<StatCounter value={5} prefix="+" />}
              label={t.trust.years}
              caption={t.trust.yearsCaption}
            />
            <HeroStat
              value={<StatCounter value={100} prefix="+" />}
              label={t.trust.projects}
              caption={t.trust.projectsCaption}
            />
            <HeroStat
              value={
                <>
                  <span className="hidden sm:inline">{t.trust.deliveryPrefix} </span>
                  <StatCounter value={3} />{" "}
                  <span className="text-primary">{t.trust.days}</span>
                </>
              }
              label={t.trust.deliveryCaption}
            />
          </dl>
        </div>

        <div className="container data-strip border-t border-border py-3">
          <span>19.4326° N · 99.1332° W</span>
          <span aria-hidden className="sep" />
          <span className="hidden sm:inline">CDMX · MX — EST. 2020</span>
          <span aria-hidden className="sep hidden sm:block" />
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="size-1 bg-signal" />
            <span lang="ja" className="font-jp tracking-[0.2em]">
              始動
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}

function HeroStat({
  value,
  label,
  caption,
}: {
  value: React.ReactNode;
  label: string;
  caption?: string;
}) {
  return (
    <div className="flex flex-col gap-1 py-5 pl-3 pr-3 first:pl-0 last:pr-0 sm:py-7 sm:pl-6 sm:pr-6">
      <dt className="order-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground sm:text-[10px]">
        {label} {caption && <span className="hidden sm:inline">{caption}</span>}
      </dt>
      <dd className="order-1 font-display text-3xl font-bold leading-none text-foreground sm:text-4xl md:text-5xl">
        {value}
      </dd>
    </div>
  );
}
