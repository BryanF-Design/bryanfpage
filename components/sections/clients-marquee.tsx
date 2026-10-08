"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { Sparkle } from "lucide-react";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";
import { useReducedMotionPreference } from "@/lib/motion-preference";

interface ClientLogo {
  src: string;
  alt: string;
  /** Proporción real del archivo (next/image la necesita para no saltar). */
  w: number;
  h: number;
  /** Tamaño del logo dentro de su ficha: los logotipos anchos se miden por
   *  ancho y las insignias por alto, para que todos pesen lo mismo. */
  size: string;
  /** Recorte propio cuando el viewBox del archivo corta el dibujo: se pinta
   *  con <use> sobre el grupo del SVG original. */
  crop?: { id: string; viewBox: string };
}

const WIDE = "h-auto";
const TALL = "w-auto";

const logos: ClientLogo[] = [
  {
    src: "/img/clients/Cartoon_Network_2010_logo.svg",
    alt: "Cartoon Network",
    w: 1241,
    h: 86,
    size: `w-[88%] ${WIDE}`,
    // El viewBox del archivo empieza en x=60 y se come la "C".
    crop: { id: "Cartoon_Network", viewBox: "17 680 1241 86" },
  },
  {
    src: "/img/clients/Citibanamex_logo.svg",
    alt: "Citibanamex",
    w: 438,
    h: 68,
    size: `w-[80%] ${WIDE}`,
  },
  {
    src: "/img/clients/Warner_Bros_logo.svg",
    alt: "Warner Bros",
    w: 355,
    h: 370,
    size: `h-[58%] ${TALL}`,
  },
  {
    src: "/img/clients/MillerKnoll_Logo_2021.svg",
    alt: "MillerKnoll",
    w: 1320,
    h: 226,
    size: `w-[74%] ${WIDE}`,
  },
  {
    src: "/img/clients/herman-miller-1.svg",
    alt: "Herman Miller",
    w: 1002,
    h: 1007,
    size: `h-[52%] ${TALL}`,
  },
  {
    src: "/img/clients/brand-ufc-svgrepo-com.svg",
    alt: "UFC",
    w: 800,
    h: 800,
    size: `h-[86%] ${TALL}`,
  },
  {
    src: "/img/clients/hyundai-svgrepo-com.svg",
    alt: "Hyundai",
    w: 800,
    h: 800,
    size: `h-[84%] ${TALL}`,
  },
  {
    src: "/img/clients/mercado-libre-svgrepo-com.svg",
    alt: "Mercado Libre",
    w: 800,
    h: 800,
    size: `h-[80%] ${TALL}`,
  },
  {
    src: "/img/clients/logo-indusecc.png",
    alt: "Indusecc",
    w: 3354,
    h: 1312,
    size: `h-[50%] ${TALL}`,
  },
  {
    src: "/img/clients/partum-design.png",
    alt: "Partum Design",
    w: 3978,
    h: 1200,
    size: `h-[44%] ${TALL}`,
  },
];

/** Dos filas de cinco: cada una corre en sentido contrario. */
const ROWS = [logos.slice(0, 5), logos.slice(5)];

/** Insignias del montón de "avatares" de la tarjeta lima. */
const STACK = [logos[2], logos[4], logos[6]];

// Bucle de CSS: dos copias idénticas por fila y -50 % de recorrido.
const LOGO_KEYFRAMES = "@keyframes logos-x{to{transform:translate3d(-50%,0,0)}}";

/** El logo siempre en tinta sobre claro: los originales traen blancos y colores. */
const LOGO_INK = "[filter:brightness(0)]";
const LOGO_CLASS = cn(
  "max-h-full max-w-full object-contain opacity-[0.78] transition-opacity duration-300 group-hover/tile:opacity-100",
  LOGO_INK
);

function LogoTile({
  logo,
  decorative,
  fluid,
}: {
  logo: ClientLogo;
  /** Copia del bucle: sin texto alternativo (la lee el lector una sola vez). */
  decorative?: boolean;
  /** Ocupa su celda de la retícula en vez de medir lo de la cinta. */
  fluid?: boolean;
}) {
  return (
    <li className={fluid ? "min-w-0" : "shrink-0"}>
      <div
        className={cn(
          "group/tile flex h-[5.5rem] items-center justify-center rounded-card bg-canvas px-5 transition-colors duration-300 hover:bg-lime sm:h-24 lg:h-32",
          fluid ? "w-full" : "w-[10.5rem] sm:w-[12rem] lg:w-[15rem]"
        )}
      >
        <span className="relative flex h-[62%] w-full items-center justify-center">
          {logo.crop ? (
            <svg
              role={decorative ? undefined : "img"}
              aria-label={decorative ? undefined : logo.alt}
              aria-hidden={decorative || undefined}
              viewBox={logo.crop.viewBox}
              width={logo.w}
              height={logo.h}
              className={cn(LOGO_CLASS, logo.size)}
            >
              <use href={`${logo.src}#${logo.crop.id}`} />
            </svg>
          ) : (
            <Image
              src={logo.src}
              alt={decorative ? "" : logo.alt}
              width={logo.w}
              height={logo.h}
              sizes="(min-width: 1024px) 190px, 150px"
              className={cn(LOGO_CLASS, logo.size)}
            />
          )}
        </span>
      </div>
    </li>
  );
}

/**
 * Marcas que han confiado. Una tarjeta lima con el titular y una pila de
 * insignias (como la prueba social del hero) junto a un panel blanco con dos
 * cintas de logos en fichas redondeadas que corren en sentidos opuestos.
 * Los logos van en tinta sobre el lienzo; la ficha se vuelve lima al pasar.
 * Con movimiento reducido las cintas se convierten en una retícula quieta.
 */
export function ClientsMarquee() {
  const { t } = useLanguage();
  const reduced = useReducedMotionPreference();

  return (
    <section aria-label={t.clients.label} className="grid gap-gutter lg:grid-cols-12">
      <style>{LOGO_KEYFRAMES}</style>

      {/* Tarjeta lima: qué es esta fila de logos. */}
      <div data-fx="up" className="min-w-0 lg:col-span-4">
        <div className="panel panel-lime flex h-full flex-col justify-between gap-7 overflow-hidden p-6 sm:p-7 lg:p-9">
          {/* Trama de puntos de tinta (la de las referencias), en la esquina. */}
          <div
            aria-hidden
            className="pointer-events-none absolute right-5 top-5 h-20 w-[7.5rem] bg-[radial-gradient(circle,hsl(var(--ink)/0.16)_0_4px,transparent_4.5px)] bg-[length:20px_20px] [mask-image:linear-gradient(225deg,black_30%,transparent_85%)] sm:right-7 sm:top-7"
          />
          <div className="relative flex items-center justify-between gap-3">
            <span className="eyebrow pl-3">
              <Sparkle aria-hidden className="size-3.5 fill-ink text-ink" />
              {t.clients.eyebrow}
            </span>
          </div>

          <div className="relative">
            <h2 className="display-title text-balance text-[clamp(2.25rem,3.4vw,3.35rem)] text-ink">
              {t.clients.label}
            </h2>
            <p className="mt-3 max-w-sm text-pretty text-[0.975rem] leading-relaxed text-ink/75 md:text-base">
              {t.clients.subtitle}
            </p>
          </div>

          <div className="relative flex w-fit items-center gap-3 rounded-full bg-white/55 py-1.5 pl-1.5 pr-5">
            <span aria-hidden className="flex -space-x-3">
              {STACK.map((logo) => (
                <span
                  key={logo.alt}
                  className="grid size-11 place-items-center rounded-full bg-white p-2.5 ring-[3px] ring-lime"
                >
                  <Image
                    src={logo.src}
                    alt=""
                    width={logo.w}
                    height={logo.h}
                    sizes="28px"
                    className={cn("h-auto max-h-full w-auto max-w-full object-contain", LOGO_INK)}
                  />
                </span>
              ))}
            </span>
            <span className="text-sm font-semibold leading-tight text-ink">
              <b className="display-xl mr-1 text-[1.6rem] leading-none">{logos.length}</b>
              {t.clients.brands}
            </span>
          </div>
        </div>
      </div>

      {/* Panel blanco: las dos cintas de logos. */}
      <div
        data-fx="up"
        className="min-w-0 lg:col-span-8"
        style={{ "--fx-delay": "90ms" } as CSSProperties}
      >
        <div className="panel flex h-full flex-col justify-center gap-3 overflow-hidden py-5 shadow-soft sm:py-7 lg:gap-4 lg:py-9">
          {reduced ? (
            <ul className="grid grid-cols-2 gap-2.5 px-4 sm:grid-cols-3 sm:gap-3 sm:px-7 md:grid-cols-5">
              {logos.map((logo) => (
                <LogoTile key={logo.alt} logo={logo} fluid />
              ))}
            </ul>
          ) : (
            ROWS.map((row, r) => (
              <div
                key={r}
                className="group/row overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_7%,black_93%,transparent)]"
              >
                <div
                  className="flex w-max group-hover/row:[animation-play-state:paused]"
                  style={{
                    animationName: "logos-x",
                    animationDuration: r === 0 ? "30s" : "36s",
                    animationTimingFunction: "linear",
                    animationIterationCount: "infinite",
                    animationDirection: r === 0 ? "normal" : "reverse",
                  }}
                >
                  {[0, 1].map((copy) => (
                    <ul
                      key={copy}
                      aria-hidden={copy === 1 || undefined}
                      className="flex shrink-0 gap-2.5 pr-2.5 sm:gap-3 sm:pr-3"
                    >
                      {row.map((logo) => (
                        <LogoTile key={logo.alt} logo={logo} decorative={copy === 1} />
                      ))}
                    </ul>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
