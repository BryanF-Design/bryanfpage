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
 * Ancho aproximado de una palabra en `em` con `.display-xl` (Archivo 800,
 * condensada, mayúsculas). Medido: ~0.58 em por letra latina, ~1 em por
 * ideograma o kana. Sirve para que la palabra gigante quepa en su columna
 * en cualquier idioma (ver `.fit-word` en globals.css).
 */
function wordEm(word: string) {
  let em = 0;
  for (const ch of word.toUpperCase()) {
    if (/[\u3000-\u9fff\uff00-\uffef]/.test(ch)) em += 1;
    else if (/[.,;:!'’I]/.test(ch)) em += 0.3;
    else if (/[MW]/.test(ch)) em += 0.8;
    else em += 0.58;
  }
  return Math.max(em, 1);
}

/**
 * Hero — la pieza de las referencias: titular partido en dos alrededor de
 * Bryan, que sale del panel lima dentro de un arco bosque. Tres arreglos:
 *  - Teléfono: titular apilado, foto encabezando la tarjeta lima y, debajo,
 *    propuesta → acciones → texto (el CTA queda en la primera pantalla).
 *  - md–lg: titular en dos columnas; tarjeta con la propuesta a la izquierda
 *    y la foto a la derecha; ventajas y proyecto destacado en una fila abajo.
 *  - xl: la composición completa en tres columnas con la foto al centro.
 * Las palabras gigantes se ajustan a su columna (`.fit-word`), así que
 * ningún idioma se sale del marco. Todo entra con CSS (`.hero-in`), sin
 * esperar a la hidratación; el titular y la foto (candidatos a LCP) solo
 * suben, sin fundido, para no retrasar su pintado.
 */
export function HeroPop() {
  const { t } = useLanguage();

  // Ancho de cada palabra gigante; desde md comparten el tamaño de la mayor.
  const fitTitle = wordEm(t.hero.titleHighlight);
  const fitSide = wordEm(t.hero.sideHighlight);
  const fitShared = Math.max(fitTitle, fitSide);
  const fit = (own: number) =>
    ({ "--fit-own": own.toFixed(2), "--fit-shared": fitShared.toFixed(2) }) as CSSProperties;

  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="panel relative overflow-visible px-4 pb-4 pt-7 shadow-soft sm:px-6 sm:pt-9 md:pb-6 lg:px-10 lg:pb-10 lg:pt-12"
    >
      {/* Titular partido: izquierda (h1) y derecha (eco). En teléfono se apilan. */}
      <div className="relative grid gap-1 md:grid-cols-2 md:items-end md:gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(16rem,26%)_minmax(0,1fr)] xl:gap-0">
        <h1
          id="hero-title"
          className="hero-in hero-in-rise relative z-[1] min-w-0 text-ink [container-type:inline-size]"
          style={delay(60)}
        >
          <span className="display-italic block text-[clamp(1.9rem,4.2vw,4.25rem)] leading-none">
            {t.hero.titlePrefix}
          </span>
          <span
            className="display-xl fit-word block [--fit-max:clamp(4.25rem,18vw,6rem)] md:[--fit-max:clamp(4.75rem,10.5vw,11rem)]"
            style={fit(fitTitle)}
          >
            {t.hero.titleHighlight}
          </span>
        </h1>
        <div aria-hidden className="hidden xl:block" />
        <p
          className="hero-in hero-in-rise relative z-[1] flex min-w-0 flex-wrap items-baseline gap-x-3 text-ink [container-type:inline-size] md:block md:text-right"
          style={delay(140)}
        >
          <span className="display-italic block text-[clamp(1.5rem,4.2vw,4.25rem)] leading-none">
            {t.hero.sideTop}
          </span>
          <span
            className="display-xl fit-word relative inline-block text-forest [--fit-max:clamp(3.1rem,13vw,4.5rem)] md:[--fit-max:clamp(4.75rem,10.5vw,11rem)]"
            style={fit(fitSide)}
          >
            {t.hero.sideHighlight}
            <Sparkle
              aria-hidden
              className="float-y absolute -right-7 -top-3 h-7 w-7 fill-lime text-lime-deep sm:h-10 sm:w-10 md:-left-12 md:right-auto md:top-1 xl:-left-14"
            />
          </span>
        </p>
      </div>

      {/* Panel lima: propuesta, acciones y ventajas. Bryan sale de él. */}
      <div className="panel-lime relative mt-24 rounded-[calc(var(--r-panel)-0.5rem)] md:mt-16 xl:mt-2">
        <div className="relative grid grid-cols-[minmax(0,1fr)] gap-6 p-5 pt-0 sm:p-7 sm:pt-0 md:grid-cols-[minmax(0,1fr)_minmax(15rem,38%)] md:gap-x-8 md:gap-y-7 md:p-8 lg:p-10 xl:grid-cols-[minmax(0,1fr)_minmax(16rem,26%)_minmax(0,1fr)]">
          {/* Foto dentro de un arco bosque: los cantos rectos del saco
              coinciden con los del arco, y la cabeza sale por arriba. En
              teléfono encabeza la tarjeta; en md–lg ocupa la columna derecha;
              en xl la central y sube hasta el titular. Su ancho nunca pasa
              de su columna (`cqi`), así que no tapa el texto de al lado. */}
          <div className="hero-in hero-in-rise pointer-events-none relative -mt-24 [container-type:inline-size] md:order-2 md:mt-0 md:self-stretch">
            <div className="relative mx-auto aspect-[704/1184] h-[16rem] sm:h-[19rem] md:absolute md:left-1/2 md:top-[-6rem] md:h-[min(calc(100%+6rem),calc(100cqi*1.68))] md:-translate-x-1/2 xl:bottom-[-2.5rem] xl:top-auto xl:h-[min(calc(100%+13rem),calc((100cqi+3rem)*1.68))]">
              <svg
                aria-hidden
                viewBox="0 0 400 140"
                className="float-y absolute left-1/2 top-[3%] w-[160%] max-w-none -translate-x-1/2 text-ink/30"
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
              <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_80%,transparent)] xl:[mask-image:none]">
                <span aria-hidden className="absolute inset-x-0 bottom-0 top-[19%] rounded-t-full bg-forest" />
                <Image
                  src="/img/brand/bryan-hero.webp"
                  alt="Bryan F., diseñador y desarrollador web"
                  fill
                  priority
                  sizes="(min-width: 1280px) 26rem, (min-width: 768px) 20rem, 10rem"
                  className="object-cover object-top"
                />
              </div>
            </div>
          </div>

          {/* Izquierda: propuesta + acciones + prueba social. En teléfono el
              texto va después de las acciones para que el CTA se vea al cargar. */}
          <div className="relative flex min-w-0 flex-col items-start gap-5 md:order-1 md:justify-center xl:justify-end">
            <span
              className="hero-in hero-in-fade eyebrow max-w-full whitespace-normal bg-white/55 py-1.5 pl-3 text-left leading-snug"
              style={delay(260)}
            >
              <span aria-hidden className="relative flex size-2 shrink-0">
                <span className="absolute inset-0 animate-ping rounded-full bg-forest/60 motion-reduce:animate-none" />
                <span className="relative size-2 rounded-full bg-forest" />
              </span>
              {t.hero.available}
            </span>
            <h2
              className="hero-in hero-in-up display-title max-w-[22ch] text-balance text-[clamp(1.75rem,3vw,2.75rem)] text-ink"
              style={delay(300)}
            >
              {t.hero.panelTitle}
            </h2>
            <p
              className="hero-in hero-in-fade max-w-md text-pretty text-[0.975rem] leading-relaxed text-ink/75 max-sm:order-1 md:text-base"
              style={delay(360)}
            >
              {t.hero.subtitle}
            </p>
            <div
              className="hero-in hero-in-up flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:flex-wrap"
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
              className="hero-in hero-in-fade mt-1 flex max-w-full items-center gap-3 rounded-full bg-white/50 py-1.5 pl-1.5 pr-4 max-sm:order-2"
              style={delay(480)}
            >
              <span className="flex shrink-0 -space-x-3">
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
              <span className="text-balance text-sm font-semibold leading-tight text-ink">{t.hero.proof}</span>
              <Heart aria-hidden className="h-4 w-4 shrink-0 fill-ink text-ink" />
            </div>
          </div>

          {/* Ventajas + proyecto destacado: fila inferior en md–lg, columna
              derecha en xl. */}
          <div className="relative flex min-w-0 flex-col gap-5 md:order-3 md:col-span-2 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:items-center md:gap-8 xl:col-span-1 xl:flex xl:flex-col xl:items-end xl:justify-between xl:gap-5">
            <ul
              className="hero-in hero-in-fade grid grid-cols-3 gap-2 xl:w-full xl:max-w-[22rem]"
              style={delay(380)}
            >
              {t.hero.features.map((feature, index) => {
                const Icon = FEATURE_ICONS[index] ?? Timer;
                return (
                  <li key={feature} className="flex min-w-0 flex-col items-center gap-2 text-center">
                    <span className="grid size-11 place-items-center rounded-full bg-ink text-lime">
                      <Icon aria-hidden className="h-5 w-5" />
                    </span>
                    <span className="text-balance text-sm font-semibold leading-snug text-ink">
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
              className="hero-in hero-in-up group card-pop flex w-full min-w-0 gap-3 p-2.5 transition-transform duration-300 hover:-translate-y-1 xl:max-w-[22rem] xl:flex-col xl:p-3"
              style={delay(460)}
            >
              <span className="relative aspect-[4/3] w-32 shrink-0 overflow-hidden rounded-inner bg-mint sm:w-40 xl:w-full">
                <Image
                  src={desktopShot(FEATURED.slug)}
                  alt={`${FEATURED.name} — captura del sitio`}
                  fill
                  sizes="(min-width: 1280px) 22rem, 10rem"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </span>
              <span className="flex min-w-0 flex-1 flex-col justify-between gap-2 py-1 xl:flex-row xl:items-center xl:px-1">
                <span className="min-w-0">
                  <span className="block text-xs font-semibold text-ink/65">{t.hero.featured}</span>
                  <span className="block truncate text-lg font-bold text-ink">{FEATURED.name}</span>
                </span>
                <span className="inline-flex min-h-10 w-fit max-w-full items-center gap-1.5 rounded-full bg-lime px-4 py-1.5 text-sm font-semibold leading-tight text-ink sm:shrink-0 sm:whitespace-nowrap">
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
