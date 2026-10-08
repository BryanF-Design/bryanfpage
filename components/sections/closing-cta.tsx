"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Sparkle } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { Button, ButtonArrow } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/context";
import { mobileShot } from "@/lib/projects";
import { cn } from "@/lib/utils";

const WHATSAPP = "https://wa.me/525663012505";

/** Miniaturas de la prueba social: tres sitios reales del portafolio. */
const PROOF_SHOTS = [
  "efficientplasticolors-com",
  "mielyabejas-mx",
  "gecomex-web-vercel-app",
];

/**
 * El cierre — el panel lima más grande de la página. A la izquierda, el
 * rótulo gigante y la prueba social; a la derecha, Bryan sale por encima del
 * canto del panel y se queda "detrás" de una tarjeta de tinta con la bajada
 * y las dos acciones (como la tarjeta oscura de promo de las referencias).
 * Un recorte cóncavo arriba a la izquierda lleva el chip de agenda abierta.
 */
export function ClosingCta() {
  const { t, locale } = useLanguage();
  // El rótulo gigante se ajusta a la longitud real: los títulos largos
  // (francés, alemán) bajan un punto y el japonés/chino gana interlineado.
  const cjk = locale === "ja" || locale === "zh";
  const titleSize = cjk
    ? "text-[clamp(2.5rem,5vw,4.75rem)] leading-[1.08] tracking-normal"
    : t.closingCta.title.length > 52
      ? "text-[clamp(2.75rem,6vw,5.75rem)]"
      : "text-[clamp(3rem,7.3vw,6.75rem)]";

  return (
    <section aria-labelledby="closing-title" className="relative xl:pt-[5rem]">
      <div data-fx="panel">
        <div className="panel panel-lime grid gap-8 px-4 pb-4 pt-[5rem] sm:px-7 sm:pb-7 sm:pt-[5.75rem] lg:px-10 lg:pb-10 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] xl:gap-8 xl:p-12 xl:pt-[6.25rem]">
          {/* Recorte cóncavo con el chip de disponibilidad. */}
          <div className="notch notch-tl">
            <span className="eyebrow bg-white pl-3 text-ink shadow-soft">
              <span aria-hidden className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-forest/60 motion-reduce:animate-none" />
                <span className="relative size-2 rounded-full bg-forest" />
              </span>
              {t.hero.available}
            </span>
          </div>

          {/* Izquierda: rótulo y prueba social. */}
          <div className="relative flex min-w-0 flex-col gap-6 xl:justify-between xl:gap-12">
            <h2
              id="closing-title"
              className={cn(
                "display-xl text-balance break-words text-ink",
                titleSize,
              )}
            >
              {t.closingCta.title}
            </h2>

            <div className="flex w-fit items-center gap-3 rounded-full bg-white/55 py-1.5 pl-1.5 pr-4">
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
              <span className="text-sm font-semibold leading-tight text-ink">
                {t.hero.proof}
              </span>
              <Heart aria-hidden className="h-4 w-4 fill-ink text-ink" />
            </div>
          </div>

          {/* Derecha: Bryan detrás de la tarjeta de tinta. En escritorio la
              columna no aporta altura (h-0 + min-h-full) y reparte su alto en
              dos filas: la foto ocupa lo que deja la tarjeta y, con margen
              negativo, sube por encima del canto del panel. Su alto se topa
              con `cqw` para que nunca sea más ancha que la tarjeta. */}
          <div className="relative flex min-w-0 flex-col xl:grid xl:h-0 xl:min-h-full xl:grid-cols-[minmax(0,1fr)] xl:grid-rows-[minmax(0,1fr)_auto]">
            <div className="pointer-events-none relative z-[1] -mb-10 flex min-w-0 justify-center xl:-mb-12 xl:-mt-[10.25rem] xl:min-h-0 xl:items-end xl:[container-type:inline-size]">
              <div className="relative w-fit xl:h-full xl:max-h-[min(34rem,88cqw)]">
                <span
                  aria-hidden
                  className="absolute left-1/2 top-[4%] aspect-square w-[105%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,hsl(0_0%_100%/0.55),hsl(0_0%_100%/0)_100%)]"
                />
                <svg
                  aria-hidden
                  viewBox="0 0 400 140"
                  className="float-y absolute left-1/2 top-[2%] w-[118%] -translate-x-1/2 text-ink/30"
                >
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
                <Image
                  src="/img/brand/bryan-cutout.webp"
                  alt="Bryan F., listo para arrancar tu proyecto"
                  width={623}
                  height={558}
                  sizes="(min-width: 1280px) 600px, 340px"
                  className="relative h-[16.5rem] w-auto max-w-none drop-shadow-[0_24px_30px_hsl(160_40%_8%/0.3)] sm:h-[19rem] lg:h-[22rem] xl:h-full"
                />
                <Sparkle
                  aria-hidden
                  className="float-y absolute right-[2%] top-[13%] h-8 w-8 fill-ink text-ink sm:h-10 sm:w-10"
                />
              </div>
            </div>

            <div className="panel-ink relative z-[2] rounded-card p-5 shadow-pop sm:p-6 xl:p-7">
              <p className="text-pretty text-[0.9375rem] leading-relaxed text-white/80 md:text-base">
                {t.closingCta.subtitle}
              </p>
              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-lime pr-2.5 text-ink sm:w-auto sm:flex-1 sm:pl-6"
                >
                  <Link href="#precios">
                    {t.closingCta.ctaPrimary}
                    <ButtonArrow
                      tone="ink"
                      className="ml-auto -mr-0.5 sm:ml-2"
                    />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto sm:flex-1"
                >
                  <Link
                    href={WHATSAPP}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaWhatsapp
                      aria-hidden
                      className="h-[1.1rem] w-[1.1rem] text-lime"
                    />
                    {t.closingCta.ctaSecondary}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
