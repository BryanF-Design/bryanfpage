"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CreditCard, Heart, Search, Sparkle, Timer } from "lucide-react";

import { Button, ButtonArrow } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/context";
import { desktopShot, mobileShot } from "@/lib/projects";

const FEATURE_ICONS = [Timer, Search, CreditCard];

/** El proyecto que presume el hero: el lanzamiento más reciente con captura. */
const FEATURED = {
  slug: "gecomex-web-vercel-app",
  name: "Gecomex",
  url: "https://gecomex-web.vercel.app/",
};

/** Miniaturas de la prueba social: tres sitios reales del portafolio. */
const PROOF_SHOTS = ["koi-arquitectura-vercel-app", "ceahestructural-com-mx", "element-experiences-com"];

function delay(ms: number) {
  return { "--hd": `${ms}ms` } as CSSProperties;
}

/**
 * Hero — la pieza de las referencias: titular partido en dos alrededor de
 * Bryan, que sale del panel lima y cruza hacia el titular. El panel lleva la
 * propuesta y las acciones a la izquierda, y las ventajas con el proyecto
 * destacado a la derecha. Todo entra con CSS (`.hero-in`), sin esperar a la
 * hidratación; la foto es la imagen LCP y carga con prioridad.
 */
export function HeroPop() {
  const { t } = useLanguage();

  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="panel relative overflow-visible px-4 pb-4 pt-7 shadow-soft sm:px-6 sm:pt-9 lg:px-10 lg:pb-10 lg:pt-12"
    >
      {/* Titular partido: izquierda (h1) y derecha (eco). En móvil se apilan. */}
      <div className="relative grid gap-1 lg:grid-cols-[1fr_minmax(18rem,30%)_1fr] lg:items-end lg:gap-0">
        <h1
          id="hero-title"
          className="hero-in hero-in-up relative z-[1] text-ink"
          style={delay(60)}
        >
          <span className="display-italic block text-[clamp(1.9rem,4.2vw,4.25rem)] leading-none">
            {t.hero.titlePrefix}
          </span>
          <span className="display-xl block text-[clamp(4.75rem,13vw,12rem)]">
            {t.hero.titleHighlight}
          </span>
        </h1>
        <div aria-hidden className="hidden lg:block" />
        <p
          className="hero-in hero-in-up relative z-[1] flex flex-wrap items-baseline gap-x-3 text-ink lg:block lg:text-right"
          style={delay(140)}
        >
          <span className="display-italic block text-[clamp(1.5rem,4.2vw,4.25rem)] leading-none">
            {t.hero.sideTop}
          </span>
          <span className="display-xl relative inline-block text-[clamp(3.1rem,13vw,12rem)] text-forest">
            {t.hero.sideHighlight}
            <Sparkle
              aria-hidden
              className="float-y absolute -right-7 -top-3 h-7 w-7 fill-lime text-lime-deep sm:h-10 sm:w-10 lg:-left-14 lg:right-auto lg:top-2"
            />
          </span>
        </p>
      </div>

      {/* Panel lima: propuesta, acciones y ventajas. Bryan sale de él. */}
      <div className="panel-lime relative mt-20 rounded-[calc(var(--r-panel)-0.5rem)] sm:mt-24 lg:mt-2">
        <div className="relative grid gap-6 p-5 pt-0 sm:p-7 sm:pt-0 lg:grid-cols-[1fr_minmax(18rem,30%)_1fr] lg:gap-8 lg:p-10">
          {/* Foto: en teléfono encabeza la tarjeta y asoma sobre su canto; en
              escritorio ocupa la columna central y sube hasta el titular. */}
          <div
            className="hero-in hero-in-up pointer-events-none relative -mt-16 flex justify-center sm:-mt-20 lg:order-2 lg:mt-0 lg:self-stretch"
            style={delay(220)}
          >
            <svg
              aria-hidden
              viewBox="0 0 400 140"
              className="float-y absolute left-1/2 top-[2%] z-0 w-[130%] max-w-[36rem] -translate-x-1/2 text-ink/30 lg:top-[-12.5rem]"
            >
              <ellipse
                cx="200"
                cy="70"
                rx="190"
                ry="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                transform="rotate(-9 200 70)"
              />
            </svg>
            <Image
              src="/img/brand/bryan-hero.webp"
              alt="Bryan F., diseñador y desarrollador web"
              width={704}
              height={1184}
              priority
              sizes="(min-width: 1024px) 26rem, 18rem"
              className="relative z-[1] h-[19rem] w-auto [mask-image:linear-gradient(to_bottom,black_78%,transparent)] lg:[mask-image:none] drop-shadow-[0_30px_40px_hsl(160_40%_8%/0.35)] sm:h-[25rem] lg:absolute lg:bottom-[-2.5rem] lg:left-1/2 lg:h-[calc(100%+13rem)] lg:max-w-none lg:-translate-x-1/2"
            />
          </div>

          {/* Izquierda: propuesta + acciones + prueba social. */}
          <div className="relative flex flex-col items-start gap-5 lg:order-1 lg:justify-end">
            <span className="hero-in hero-in-fade eyebrow bg-white/55 pl-3" style={delay(260)}>
              <span aria-hidden className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-forest/60 motion-reduce:animate-none" />
                <span className="relative size-2 rounded-full bg-forest" />
              </span>
              {t.hero.available}
            </span>
            <h2
              className="hero-in hero-in-up display-title max-w-[22ch] text-[clamp(1.75rem,3vw,2.75rem)] text-ink"
              style={delay(300)}
            >
              {t.hero.panelTitle}
            </h2>
            <p
              className="hero-in hero-in-fade max-w-md text-pretty text-[0.975rem] leading-relaxed text-ink/75 md:text-base"
              style={delay(360)}
            >
              {t.hero.subtitle}
            </p>
            <div
              className="hero-in hero-in-up flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row"
              style={delay(420)}
            >
              <Button asChild size="lg" variant="ink" className="pr-2.5">
                <Link href="#precios">
                  {t.nav.armaTuWeb}
                  <ButtonArrow tone="lime" className="ml-auto -mr-0.5 sm:ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="white">
                <Link href="#projects">{t.nav.verProyectos}</Link>
              </Button>
            </div>

            <div
              className="hero-in hero-in-fade mt-1 flex items-center gap-3 rounded-full bg-white/50 py-1.5 pl-1.5 pr-4"
              style={delay(480)}
            >
              <span className="flex -space-x-3">
                {PROOF_SHOTS.map((slug) => (
                  <span
                    key={slug}
                    className="relative size-10 overflow-hidden rounded-full bg-white ring-[3px] ring-lime"
                  >
                    <Image
                      src={mobileShot(slug)}
                      alt=""
                      fill
                      sizes="40px"
                      className="object-cover object-top"
                    />
                  </span>
                ))}
              </span>
              <span className="text-sm font-semibold leading-tight text-ink">{t.hero.proof}</span>
              <Heart aria-hidden className="h-4 w-4 fill-ink text-ink" />
            </div>
          </div>

          {/* Derecha: ventajas + proyecto destacado. */}
          <div className="relative flex flex-col gap-5 lg:order-3 lg:items-end lg:justify-between">
            <ul
              className="hero-in hero-in-fade grid grid-cols-3 gap-2 lg:w-full lg:max-w-[22rem]"
              style={delay(380)}
            >
              {t.hero.features.map((feature, index) => {
                const Icon = FEATURE_ICONS[index] ?? Timer;
                return (
                  <li key={feature} className="flex flex-col items-center gap-2 text-center">
                    <span className="grid size-11 place-items-center rounded-full bg-ink text-lime">
                      <Icon aria-hidden className="h-5 w-5" />
                    </span>
                    <span className="text-[0.8125rem] font-semibold leading-snug text-ink">
                      {feature}
                    </span>
                  </li>
                );
              })}
            </ul>

            <a
              href={FEATURED.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-in hero-in-up group card-pop flex w-full gap-3 p-2.5 transition-transform duration-300 hover:-translate-y-1 lg:max-w-[22rem] lg:flex-col lg:p-3"
              style={delay(460)}
            >
              <span className="relative aspect-[4/3] w-32 shrink-0 overflow-hidden rounded-inner bg-mint sm:w-40 lg:w-full">
                <Image
                  src={desktopShot(FEATURED.slug)}
                  alt={`${FEATURED.name} — captura del sitio`}
                  fill
                  sizes="(min-width: 1024px) 22rem, 10rem"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </span>
              <span className="flex min-w-0 flex-1 flex-col justify-between gap-2 py-1 lg:flex-row lg:items-center lg:px-1">
                <span className="min-w-0">
                  <span className="block text-xs font-semibold text-ink/55">{t.hero.featured}</span>
                  <span className="block truncate text-lg font-bold text-ink">{FEATURED.name}</span>
                </span>
                <span className="inline-flex h-10 w-fit shrink-0 items-center gap-1.5 rounded-full bg-lime px-4 text-sm font-semibold text-ink">
                  {t.projects.visitSite}
                  <ArrowUpRight aria-hidden className="h-4 w-4 transition-transform group-hover:rotate-45" />
                </span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
