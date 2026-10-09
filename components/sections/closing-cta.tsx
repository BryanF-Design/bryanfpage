"use client";

import type { CSSProperties } from "react";
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

/** Los tres teléfonos del abanico (izquierda, centro, derecha): otros sitios
 *  reales, distintos de los del hero y de la prueba social. */
const FAN = [
  {
    slug: "nkmohcafe-com",
    className: "left-[2%] -bottom-[1%] z-[1] w-[35%] -rotate-[10deg]",
    delay: "160ms",
  },
  {
    slug: "homeflowoficial-com",
    className: "left-1/2 bottom-0 z-[2] w-[43.5%] -translate-x-1/2",
    delay: "60ms",
  },
  {
    slug: "epiko-vercel-app",
    className: "right-[2%] -bottom-[1%] z-[1] w-[35%] rotate-[10deg]",
    delay: "260ms",
  },
];

/** Teléfono de tinta con la primera pantalla del sitio (390 × 845). */
function Phone({ slug, sizes }: { slug: string; sizes: string }) {
  return (
    <div
      className="aspect-[390/800] bg-ink p-[3.2%] shadow-[0_30px_50px_-20px_hsl(var(--ink)/0.55)] ring-1 ring-ink/10"
      style={{ borderRadius: "16% / 7.8%" }}
    >
      <div
        className="relative flex h-full w-full flex-col overflow-hidden bg-white"
        style={{ borderRadius: "13% / 6.3%" }}
      >
        <span aria-hidden className="relative block h-[5.5%] shrink-0 bg-white">
          <span className="absolute left-1/2 top-[30%] h-[52%] w-[34%] -translate-x-1/2 rounded-full bg-ink" />
        </span>
        <span className="relative block flex-1">
          <Image
            src={mobileShot(slug)}
            alt=""
            fill
            sizes={sizes}
            quality={75}
            className="object-cover object-top"
          />
        </span>
      </div>
    </div>
  );
}

/**
 * El cierre — el panel lima más grande de la página. A la izquierda, el
 * rótulo gigante y la prueba social; a la derecha, un abanico de tres
 * teléfonos con sitios reales que sale por encima del canto del panel y se
 * queda "detrás" de una tarjeta de tinta con la bajada y las dos acciones
 * (como la tarjeta oscura de promo de las referencias): la última imagen de
 * la página es trabajo entregado. Bryan ya tiene su sección; aquí no se
 * repite. Un recorte cóncavo arriba a la izquierda lleva el chip de agenda.
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

          {/* Derecha: el abanico de teléfonos detrás de la tarjeta de tinta.
              En escritorio la columna no aporta altura (h-0 + min-h-full) y
              reparte su alto en dos filas: el abanico ocupa lo que deja la
              tarjeta y, con margen negativo, sube por encima del canto del
              panel. Su alto se topa con `cqw` para que nunca sea más ancho
              que la columna; en teléfono lo manda el ancho. */}
          <div className="relative flex min-w-0 flex-col xl:grid xl:h-0 xl:min-h-full xl:grid-cols-[minmax(0,1fr)] xl:grid-rows-[minmax(0,1fr)_auto]">
            <div
              aria-hidden
              className="pointer-events-none relative z-[1] -mb-10 flex min-w-0 justify-center sm:-mb-12 xl:-mt-[10.25rem] xl:min-h-0 xl:items-end xl:[container-type:inline-size]"
            >
              <div className="scroll-float relative aspect-[10/9] w-full max-w-[20rem] sm:max-w-[26rem] xl:h-full xl:max-h-[min(31rem,90cqw)] xl:w-auto xl:max-w-none">
                <span className="absolute left-1/2 top-[4%] aspect-square w-[96%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,hsl(0_0%_100%/0.6),hsl(0_0%_100%/0)_100%)]" />
                <svg
                  viewBox="0 0 400 140"
                  className="float-y absolute left-1/2 top-[14%] w-[112%] -translate-x-1/2 text-ink/30"
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
                {FAN.map((phone) => (
                  <div
                    key={phone.slug}
                    data-fx="up"
                    className={cn("absolute", phone.className)}
                    style={{ "--fx-delay": phone.delay } as CSSProperties}
                  >
                    <Phone
                      slug={phone.slug}
                      sizes="(min-width: 1280px) 240px, (min-width: 640px) 180px, 150px"
                    />
                  </div>
                ))}
                <Sparkle className="float-y absolute right-[1%] top-[4%] z-[3] h-8 w-8 fill-ink text-ink sm:h-10 sm:w-10" />
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
