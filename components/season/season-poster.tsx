"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { ArrowRight, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import type { SeasonId } from "@/lib/seasons";

import { FloralCorner, Marigold, PicadoFlag, SugarSkull } from "./art/muertos";
import { TILE_SEQUENCE, Tile } from "./art/navidad";
import { Barcode, BuenFinLogo, PaperCurl, PriceTag, VENTAS } from "./art/ventas";

/**
 * CARTEL DE TEMPORADA — el mismo diseño en dos tamaños: el cartel grande de
 * la home (`compact` falso) y el pop-up (`compact`). Cada temporada tiene su
 * propia composición, no solo otro color:
 *  · Día de Muertos: morado de noche, esquinas de flores bordadas, papel
 *    picado y calavera de azúcar, rótulo de feria.
 *  · Navidad: mosaico geométrico en verdes y blanco.
 *  · El Buen Fin: el logotipo sobre papel negro que se enrolla.
 *  · Black Friday: tipografía enorme, cinta de "SALE", etiqueta y barras.
 */
export interface PosterCopy {
  titleId: string;
  textId?: string;
  kicker: string;
  title: string;
  lead: string;
  text: string;
  cta: string;
  href: string;
  onCta?: () => void;
  discount: number;
  discountLabel: string;
  /** "15 días", o null si no hay fecha de fin. */
  endsIn: string | null;
  /** Botón extra junto al principal (el "Ahora no" del pop-up). */
  secondary?: ReactNode;
}

export function SeasonPoster({ season, copy, compact = false }: { season: SeasonId; copy: PosterCopy; compact?: boolean }) {
  const Scene = SCENES[season];
  return <Scene copy={copy} compact={compact} />;
}

const SCENES: Record<SeasonId, (p: { copy: PosterCopy; compact: boolean }) => JSX.Element> = {
  muertos: MuertosScene,
  navidad: NavidadScene,
  "buen-fin": BuenFinScene,
  "black-friday": BlackFridayScene,
};

// ——— Piezas comunes ————————————————————————————————————————————————————————

function Cta({ copy, className, arrow }: { copy: PosterCopy; className: string; arrow?: string }) {
  return (
    <Link
      href={copy.href}
      onClick={copy.onCta}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-[0.9375rem] font-bold transition-transform hover:scale-[1.03] active:scale-95",
        className
      )}
    >
      {copy.cta}
      <ArrowRight aria-hidden className={cn("h-4 w-4", arrow)} />
    </Link>
  );
}

function Meta({ copy, chip, className }: { copy: PosterCopy; chip: string; className?: string }) {
  if (!copy.discount && !copy.endsIn) return null;
  return (
    <div className={cn("flex flex-wrap items-center gap-2 text-[0.8125rem] font-bold", className)}>
      {copy.discount > 0 && (
        <span className={cn("rounded-full px-3 py-1 uppercase tracking-wide", chip)}>
          {copy.discountLabel} · -{copy.discount}%
        </span>
      )}
      {copy.endsIn && (
        <span className="inline-flex items-center gap-1.5 opacity-85">
          <Clock aria-hidden className="h-3.5 w-3.5" />
          Termina en {copy.endsIn}
        </span>
      )}
    </div>
  );
}

function Actions({ copy, children, compact }: { copy: PosterCopy; children: ReactNode; compact: boolean }) {
  return (
    <div className={cn("flex flex-col gap-2 sm:flex-row sm:items-center", compact ? "mt-5" : "mt-7")}>
      {children}
      {copy.secondary}
    </div>
  );
}

// ——— Día de Muertos ————————————————————————————————————————————————————————

function MuertosScene({ copy, compact }: { copy: PosterCopy; compact: boolean }) {
  const corner = compact ? "w-[7.5rem] sm:w-[8.5rem]" : "w-[clamp(7.5rem,19vw,15.5rem)]";
  return (
    <div className={cn("poster poster-muertos", compact && "poster-compact")}>
      <span aria-hidden className="poster-grain" />
      <FloralCorner className={cn("poster-corner left-0 top-0", corner)} />
      <FloralCorner className={cn("poster-corner right-0 top-0 -scale-x-100", corner)} />
      <FloralCorner className={cn("poster-corner bottom-0 left-0 -scale-y-100", corner)} />
      <FloralCorner className={cn("poster-corner bottom-0 right-0 -scale-100", corner)} />
      {!compact && (
        <div aria-hidden className="poster-picado">
          {Array.from({ length: 12 }, (_, i) => (
            <PicadoFlag key={i} index={i + 2} className="season-flag" style={{ ["--i" as string]: i } as CSSProperties} />
          ))}
        </div>
      )}

      <div
        className={cn(
          "relative z-[1] grid items-center",
          compact
            ? "gap-2 px-7 pb-8 pt-12 text-center"
            : "gap-8 px-[clamp(1.5rem,7vw,6rem)] pb-[clamp(3.5rem,8vw,6rem)] pt-[clamp(6rem,11vw,8rem)] text-center lg:grid-cols-[1.15fr_1fr] lg:text-left"
        )}
      >
        <div className={cn(compact ? "" : "order-2 lg:order-1")}>
          <p className="text-[0.8125rem] font-bold uppercase tracking-[0.28em] text-[#ffd60a] sm:text-sm">{copy.kicker}</p>
          <h2
            id={copy.titleId}
            className={cn(
              "poster-folk mt-2 text-white",
              compact ? "text-[clamp(2.6rem,12vw,3.4rem)]" : "text-[clamp(3.2rem,9vw,6.6rem)]"
            )}
          >
            {copy.title}
          </h2>
          <p className={cn("mt-3 font-bold text-[#ff7ab8]", compact ? "text-lg leading-snug" : "text-[clamp(1.2rem,2.2vw,1.6rem)] leading-tight")}>
            {copy.lead}
          </p>
          <p id={copy.textId} className={cn("mx-auto mt-3 max-w-[34rem] text-white/80 lg:mx-0", compact ? "text-[0.9375rem]" : "text-base sm:text-lg")}>
            {copy.text}
          </p>
          <Meta copy={copy} chip="bg-[#ff2e8b] text-white" className={cn("mt-4 text-white", compact ? "justify-center" : "justify-center lg:justify-start")} />
          <div className={cn(compact ? "[&>div]:justify-center" : "[&>div]:justify-center lg:[&>div]:justify-start")}>
            <Actions copy={copy} compact={compact}>
              <Cta copy={copy} className="bg-[#ffae00] text-[#2a0b3d] shadow-[0_10px_0_-2px_#ff2e8b]" />
            </Actions>
          </div>
        </div>

        {!compact && (
          <div aria-hidden className="relative order-1 mx-auto w-[min(19rem,72vw)] lg:order-2 lg:w-[min(25rem,100%)]">
            <span className="poster-halo" />
            <SugarSkull className="poster-skull relative w-full drop-shadow-[0_18px_30px_rgba(10,0,20,0.55)]" />
            <Marigold className="poster-bob absolute -left-4 top-[58%] w-[22%]" />
            <Marigold className="poster-bob absolute -right-2 top-[8%] w-[18%]" style={{ animationDelay: "-1.4s" }} />
            <Marigold className="poster-bob absolute bottom-[-4%] right-[8%] w-[16%]" style={{ animationDelay: "-2.6s" }} />
          </div>
        )}
      </div>
    </div>
  );
}

// ——— Navidad ———————————————————————————————————————————————————————————————

function TileRow({ from, count, className }: { from: number; count: number; className?: string }) {
  return (
    <div aria-hidden className={cn("poster-tiles", className)}>
      {Array.from({ length: count }, (_, i) => (
        <Tile key={i} spec={TILE_SEQUENCE[(from + i) % TILE_SEQUENCE.length]} className="poster-tile" />
      ))}
    </div>
  );
}

function NavidadScene({ copy, compact }: { copy: PosterCopy; compact: boolean }) {
  return (
    <div className={cn("poster poster-navidad", compact && "poster-compact")}>
      <TileRow from={0} count={16} />
      {!compact && <TileRow from={7} count={16} className="max-lg:hidden" />}

      <div
        className={cn(
          "relative grid",
          compact ? "px-7 pb-7 pt-6" : "gap-8 px-[clamp(1.5rem,6vw,5rem)] py-[clamp(2.5rem,6vw,4.5rem)] lg:grid-cols-[1.2fr_1fr] lg:items-center"
        )}
      >
        <div>
          <p className="text-[0.8125rem] font-bold uppercase tracking-[0.24em] text-[#bff0d6]">{copy.kicker}</p>
          <h2
            id={copy.titleId}
            className={cn(
              "mt-2 font-sans font-extrabold tracking-[-0.03em]",
              // El interlineado va después del tamaño: cn() descarta el que va antes.
              compact ? "text-[clamp(2.4rem,11vw,3.1rem)] leading-[0.92]" : "text-[clamp(3rem,8vw,6.25rem)] leading-[0.92]"
            )}
          >
            <span className="block text-[#34b27b]">Felices</span>
            <span className="block text-white">fiestas</span>
            <span className="flex items-baseline gap-3">
              <span aria-hidden className="poster-amp text-[#34b27b]">
                &amp;
              </span>
              <span className="text-[0.5em] leading-none">
                <span className="block text-[#34b27b]">feliz</span>
                <span className="block text-white">año nuevo</span>
              </span>
            </span>
          </h2>
          <p className={cn("mt-5 font-bold text-white", compact ? "text-lg leading-snug" : "text-[clamp(1.2rem,2vw,1.5rem)] leading-tight")}>
            {copy.lead}
          </p>
          <p id={copy.textId} className={cn("mt-2 max-w-[34rem] text-[#bff0d6]/85", compact ? "text-[0.9375rem]" : "text-base sm:text-lg")}>
            {copy.text}
          </p>
          <Meta copy={copy} chip="bg-white text-[#0d3a2b]" className="mt-4 text-white" />
          <Actions copy={copy} compact={compact}>
            <Cta copy={copy} className="bg-[#34b27b] text-[#0d3a2b]" />
          </Actions>
        </div>

        {!compact && (
          <div aria-hidden className="poster-tile-block max-lg:hidden">
            {Array.from({ length: 16 }, (_, i) => (
              <Tile key={i} spec={TILE_SEQUENCE[(i * 5 + 3) % TILE_SEQUENCE.length]} className="h-full w-full" />
            ))}
          </div>
        )}
      </div>

      <TileRow from={11} count={16} />
    </div>
  );
}

// ——— El Buen Fin ——————————————————————————————————————————————————————————

function BuenFinScene({ copy, compact }: { copy: PosterCopy; compact: boolean }) {
  return (
    <div className={cn("poster poster-buenfin", compact && "poster-compact")}>
      <PaperCurl className="poster-curl left-0 top-0" />
      <PaperCurl className="poster-curl right-0 top-0 -scale-x-100" />
      <PaperCurl className="poster-curl bottom-0 left-0 -scale-y-100" />
      <PaperCurl className="poster-curl bottom-0 right-0 -scale-100" />
      <span aria-hidden className="poster-hole" />

      <div
        className={cn(
          "relative z-[1] grid items-center text-center",
          compact ? "gap-4 px-7 pb-8 pt-10" : "gap-8 px-[clamp(1.5rem,6vw,5rem)] py-[clamp(3rem,7vw,5.5rem)] lg:grid-cols-[0.9fr_1.1fr] lg:text-left"
        )}
      >
        <h2 id={copy.titleId} className="mx-auto">
          <span className="sr-only">{copy.title}</span>
          <BuenFinLogo
            className={cn(
              "poster-logo mx-auto drop-shadow-[0_24px_30px_rgba(0,0,0,0.7)]",
              compact ? "w-[min(11rem,52vw)]" : "w-[min(20rem,70vw)] lg:w-[min(24rem,100%)]"
            )}
          />
        </h2>
        <div>
          <p className={cn("poster-chrome font-display font-black uppercase tracking-[-0.01em]", compact ? "text-[clamp(1.7rem,7.6vw,2.2rem)] leading-[0.95]" : "text-[clamp(2.2rem,5.4vw,4.2rem)] leading-[0.95]")}>
            {copy.lead}
          </p>
          <p className={cn("mt-2 font-display font-black uppercase tracking-wide text-[#ff2b3a]", compact ? "text-lg" : "text-[clamp(1.2rem,2.4vw,1.9rem)]")}>
            {copy.kicker}
          </p>
          <p id={copy.textId} className={cn("mx-auto mt-3 max-w-[34rem] text-white/75 lg:mx-0", compact ? "text-[0.9375rem]" : "text-base sm:text-lg")}>
            {copy.text}
          </p>
          <Meta copy={copy} chip="bg-[#e30613] text-white" className={cn("mt-4 text-white", compact ? "justify-center" : "justify-center lg:justify-start")} />
          <div className={cn(compact ? "[&>div]:justify-center" : "[&>div]:justify-center lg:[&>div]:justify-start")}>
            <Actions copy={copy} compact={compact}>
              <Cta copy={copy} className="bg-[#e30613] text-white shadow-[0_14px_30px_-12px_rgba(227,6,19,0.8)]" />
            </Actions>
          </div>
          {!compact && (
            <Image
              src="/img/brand/logo-light.png"
              alt=""
              aria-hidden
              width={720}
              height={253}
              sizes="140px"
              className="mx-auto mt-8 h-9 w-auto opacity-90 lg:mx-0"
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ——— Black Friday ————————————————————————————————————————————————————————

export function Tape({ words, className, tone }: { words: string[]; className?: string; tone: "yellow" | "red" }) {
  const run = Array.from({ length: 6 }, () => words).flat();
  return (
    <div aria-hidden className={cn("poster-tape", tone === "red" && "poster-tape-red", className)}>
      <div className="poster-tape-track">
        {[0, 1].map((k) => (
          <span key={k} className="poster-tape-run">
            {run.map((w, i) => (
              <span key={i}>
                {w}
                <span className="poster-tape-dot">✦</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

function BlackFridayScene({ copy, compact }: { copy: PosterCopy; compact: boolean }) {
  const pct = copy.discount ? `-${copy.discount}%` : "SALE";
  return (
    <div className={cn("poster poster-blackfriday", compact && "poster-compact")}>
      <Tape tone="yellow" className="poster-tape-a" words={["BLACK FRIDAY", "SALE", copy.discount ? `HASTA -${copy.discount}%` : "PRECIOS ESPECIALES"]} />
      {!compact && <Tape tone="red" className="poster-tape-b" words={["CYBER MONDAY", "SOLO 4 DÍAS", "BRYANF DESIGN"]} />}

      <div
        className={cn(
          "relative z-[1] grid",
          compact ? "gap-4 px-7 pb-8 pt-[5.5rem]" : "gap-8 px-[clamp(1.5rem,6vw,5rem)] pb-[clamp(5rem,9vw,7rem)] pt-[clamp(5.5rem,10vw,7.5rem)] lg:grid-cols-[1.25fr_1fr] lg:items-end"
        )}
      >
        <div>
          <p className="text-[0.8125rem] font-bold uppercase tracking-[0.24em] text-[#ffd400]">{copy.kicker}</p>
          <h2 id={copy.titleId} className={cn("poster-bf-title mt-2", compact ? "text-[clamp(3.4rem,17vw,4.6rem)]" : "text-[clamp(4rem,13vw,10.5rem)]")}>
            <span className="poster-bf-outline block">Black</span>
            <span className="block text-white">Friday</span>
          </h2>
        </div>
        <div className="relative">
          {!compact && (
            <div aria-hidden className="mb-6 flex items-center gap-4">
              <PriceTag className="poster-swing w-[min(13rem,46vw)]" text={pct} fill={VENTAS.yellow} color={VENTAS.black} />
              <Barcode className="h-12 w-28 opacity-80" />
            </div>
          )}
          <p className={cn("font-display font-black uppercase text-white", compact ? "text-xl leading-[0.98]" : "text-[clamp(1.4rem,2.4vw,2rem)] leading-[0.98]")}>
            {copy.lead}
          </p>
          <p id={copy.textId} className={cn("mt-3 max-w-[34rem] text-white/70", compact ? "text-[0.9375rem]" : "text-base sm:text-lg")}>
            {copy.text}
          </p>
          <Meta copy={copy} chip="bg-[#ffd400] text-black" className="mt-4 text-white" />
          <Actions copy={copy} compact={compact}>
            <Cta copy={copy} className="bg-[#ffd400] text-black" />
          </Actions>
        </div>
      </div>
    </div>
  );
}
