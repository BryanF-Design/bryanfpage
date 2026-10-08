"use client";

import type { CSSProperties, FocusEvent } from "react";
import Image from "next/image";
import {
  AppWindowMac,
  Check,
  Globe,
  Info,
  Mail,
  Nfc,
  Package,
  Phone,
  Printer,
  ShoppingBag,
  Signature,
  SmartphoneNfc,
  Sparkle,
  type LucideIcon,
} from "lucide-react";

import { Button, ButtonArrow } from "@/components/ui/button";
import { SectionHeading } from "@/components/sections/section-heading";
import { openLuminaChat } from "@/components/sections/lumina-feature";
import { ENTRY_SERVICE_PRICES } from "@/lib/catalog";
import { formatMoney } from "@/lib/currency";
import { useLanguage } from "@/lib/i18n/context";
import { isReducedMotionRequested } from "@/lib/motion-preference";

/** Ícono de cada producto, por id del catálogo. */
const ICONS: Record<string, LucideIcon> = {
  tarjetaDigital: SmartphoneNfc,
  tarjetaImprimible: Printer,
  firmaCorreo: Signature,
  kitPresencia: Package,
  landingEsencial: AppWindowMac,
};

/** El punto de entrada más barato del catálogo (precio fuente en MXN). */
const STARTING_PRICE = Math.min(...ENTRY_SERVICE_PRICES.map((p) => p.price));

const pad = (n: number) => String(n).padStart(2, "0");

function fxDelay(ms: number) {
  return { "--fx-delay": `${ms}ms` } as CSSProperties;
}

/**
 * Teclado en el carrusel del teléfono: el navegador no desplaza hacia un
 * botón que ya asoma por la orilla, así que la ficha que recibe el foco se
 * trae completa. En la retícula (md+) la lista no se desplaza y no hace nada.
 */
function revealFocusedCard(e: FocusEvent<HTMLUListElement>) {
  const list = e.currentTarget;
  if (list.scrollWidth <= list.clientWidth + 1) return;
  const card = (e.target as HTMLElement).closest("li");
  if (!card || card.parentElement !== list) return;
  const lr = list.getBoundingClientRect();
  const cr = card.getBoundingClientRect();
  if (cr.left >= lr.left - 1 && cr.right <= lr.right + 1) return;
  const pad = parseFloat(getComputedStyle(list).paddingLeft) || 0;
  list.scrollBy({ left: cr.left - lr.left - pad, behavior: isReducedMotionRequested() ? "auto" : "smooth" });
}

/**
 * Código QR decorativo (no se escanea): módulos pseudoaleatorios con semilla
 * fija para que servidor y cliente pinten exactamente lo mismo.
 */
const QR_SIZE = 21;
const QR_PATH = (() => {
  let seed = 0x2f6b9a1;
  const rand = () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
  const inFinder = (x: number, y: number) =>
    (x < 8 && y < 8) || (x >= QR_SIZE - 8 && y < 8) || (x < 8 && y >= QR_SIZE - 8);
  let d = "";
  for (let y = 0; y < QR_SIZE; y++) {
    for (let x = 0; x < QR_SIZE; x++) {
      if (!inFinder(x, y) && rand() > 0.5) d += `M${x} ${y}h1v1h-1z`;
    }
  }
  return d;
})();

function QrMark({ className }: { className?: string }) {
  const finders = [
    [0, 0],
    [QR_SIZE - 7, 0],
    [0, QR_SIZE - 7],
  ];
  return (
    <svg aria-hidden viewBox={`0 0 ${QR_SIZE} ${QR_SIZE}`} className={className} shapeRendering="crispEdges">
      <path d={QR_PATH} fill="currentColor" />
      {finders.map(([x, y]) => (
        <g key={`${x}-${y}`} shapeRendering="geometricPrecision">
          <rect x={x + 0.5} y={y + 0.5} width={6} height={6} rx={1.8} fill="none" stroke="currentColor" />
          <rect x={x + 2} y={y + 2} width={3} height={3} rx={0.9} fill="currentColor" />
        </g>
      ))}
    </svg>
  );
}

/**
 * La tarjeta de presentación digital, dibujada como objeto: el producto
 * estrella de la carta, inclinado sobre una segunda tarjeta de tinta y con
 * la píldora flotante del precio de entrada (como la bolsa de la referencia),
 * colgada de la esquina inferior derecha para no tapar la fila de íconos.
 */
function CardMock({ fromLabel }: { fromLabel: string }) {
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-[22rem] select-none lg:max-w-[23.5rem]">
      {/* Tarjeta trasera de tinta. */}
      <div className="absolute inset-x-5 inset-y-1 translate-x-3 rotate-[9deg] rounded-[1.6rem] bg-ink shadow-float transition-transform duration-500 [transition-timing-function:var(--ease-out)] group-hover/intro:rotate-[12deg]">
        <span className="dot-cluster absolute right-4 top-4 h-[4.5rem] w-[7rem] opacity-80 [mask-image:linear-gradient(to_left,black,transparent)]" />
        <Sparkle className="absolute bottom-5 left-5 h-6 w-6 fill-lime text-lime" />
      </div>

      {/* Tarjeta frontal. */}
      <div className="relative -rotate-[4deg] rounded-[1.6rem] bg-white p-4 pb-10 text-ink shadow-float transition-transform duration-500 [transition-timing-function:var(--ease-out)] group-hover/intro:-rotate-[2deg] sm:p-5 sm:pb-10">
        <div className="flex items-center justify-between">
          <Image
            src="/img/brand/logo-dark.png"
            alt=""
            width={720}
            height={253}
            sizes="96px"
            className="h-6 w-auto"
          />
          <span className="grid size-8 place-items-center rounded-full bg-lime text-ink">
            <Nfc className="h-4 w-4" />
          </span>
        </div>

        <div className="mt-5 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <span className="relative block size-14 overflow-hidden rounded-full bg-lime-soft ring-[3px] ring-lime">
              <Image
                src="/img/brand/bryan-cutout.webp"
                alt=""
                fill
                sizes="128px"
                className="origin-top scale-[1.35] object-cover object-top"
              />
            </span>
            <span className="mt-3 block text-lg font-bold leading-tight tracking-[-0.01em]">Bryan F.</span>
            <span className="block truncate text-xs font-medium text-ink/70">bryanfdesign.com</span>
          </div>
          <QrMark className="size-[5.25rem] shrink-0 rounded-lg text-ink" />
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-dashed border-ink/15 pt-4">
          {[Phone, Mail, Globe].map((Icon, i) => (
            <span key={i} className="grid size-9 place-items-center rounded-full bg-ink text-lime">
              <Icon className="h-4 w-4" />
            </span>
          ))}
        </div>
      </div>

      {/* Píldora flotante: el precio de entrada. */}
      <div className="absolute -bottom-6 right-0 flex items-center gap-3 whitespace-nowrap rounded-full bg-ink py-2 pl-5 pr-2 text-white shadow-pop ring-1 ring-white/10 sm:-bottom-5 sm:right-2">
        <span className="text-[0.9375rem] font-bold tabular-nums">{fromLabel}</span>
        <span className="grid size-9 place-items-center rounded-full bg-lime text-ink">
          <ShoppingBag className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}

/**
 * La misma tarjeta, en el teléfono: una fila tipo pase de cartera (foto,
 * nombre, QR) sobre la tarjeta de tinta, con la píldora del precio de entrada
 * colgada de la esquina. Ocupa un tercio del alto del objeto completo.
 */
function MiniCardMock({ fromLabel }: { fromLabel: string }) {
  return (
    <div className="relative pb-8">
      <Sparkle aria-hidden className="absolute -top-3 right-0 h-6 w-6 fill-lime text-lime" />
      <div aria-hidden className="relative mr-6 select-none">
        <div className="absolute inset-0 translate-x-2.5 translate-y-1 rotate-[5deg] rounded-[1.35rem] bg-ink shadow-float" />
        <div className="relative flex -rotate-[2.5deg] items-center gap-3 rounded-[1.35rem] bg-white p-3 pr-3.5 text-ink shadow-float">
          <span className="relative block size-12 shrink-0 overflow-hidden rounded-full bg-lime-soft ring-[3px] ring-lime">
            <Image
              src="/img/brand/bryan-cutout.webp"
              alt=""
              fill
              sizes="128px"
              className="origin-top scale-[1.35] object-cover object-top"
            />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-base font-bold leading-tight tracking-[-0.01em]">Bryan F.</span>
            <span className="block truncate text-xs font-medium text-ink/70">bryanfdesign.com</span>
          </span>
          <QrMark className="size-12 shrink-0 text-ink" />
        </div>
      </div>
      <p className="absolute bottom-0 right-0 flex items-center gap-3 whitespace-nowrap rounded-full bg-ink py-1.5 pl-4 pr-1.5 text-white shadow-pop ring-1 ring-white/10">
        <span className="text-[0.9375rem] font-bold tabular-nums">{fromLabel}</span>
        <span aria-hidden className="grid size-8 place-items-center rounded-full bg-lime text-ink">
          <ShoppingBag className="h-4 w-4" />
        </span>
      </p>
    </div>
  );
}

/**
 * Servicios de entrada — la vitrina de productos.
 *
 * Productos de bajo costo y entrega rápida para quien todavía no necesita el
 * sitio completo del Configurador. Un panel bosque presenta la carta con la
 * tarjeta digital dibujada como objeto; a su lado, las fichas tipo app (ícono
 * redondo, precio en píldora lima, lista con palomitas) y, abajo, la landing
 * como ficha destacada en lima. En el teléfono (debajo de md) todo se compacta:
 * la tarjeta dibujada pasa a una fila, las fichas forman un carrusel con el
 * precio en la esquina y la landing entra como última ficha (lima) del mismo
 * carrusel en vez de ocupar su propio panel.
 * Cada ficha abre el chat de Lumina con la pregunta ya escrita.
 */
export function EntryServices() {
  const { t } = useLanguage();
  const items = t.entryServices.items;
  const featured = items[items.length - 1];
  const regular = items.slice(0, -1);
  const fromLabel = t.entryServices.fromPrice(`${formatMoney(STARTING_PRICE, "MXN")} MXN`);

  return (
    <section
      id="servicios-entrada"
      aria-label={t.entryServices.title}
      className="relative grid gap-gutter xl:grid-cols-12"
    >
      {/* Presentación de la carta. De tableta a laptop va a todo lo ancho
          (texto | tarjeta) para que las fichas de abajo respiren en 2×2;
          desde xl vuelve a ser la columna izquierda de la vitrina. */}
      <div data-fx="panel" className="min-w-0 xl:col-span-4">
        <div className="group/intro panel panel-forest relative flex h-full flex-col overflow-hidden p-5 pb-6 sm:p-7 md:grid md:grid-cols-2 md:gap-x-10 lg:p-9 xl:flex">
          <svg
            aria-hidden
            viewBox="0 0 400 140"
            className="pointer-events-none absolute -right-16 bottom-[22%] w-[130%] max-w-[34rem] text-white/15"
          >
            <ellipse
              cx="200"
              cy="70"
              rx="190"
              ry="44"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              transform="rotate(-12 200 70)"
            />
          </svg>

          <SectionHeading
            eyebrow={t.entryServices.eyebrow}
            title={t.entryServices.title}
            subtitle={t.entryServices.subtitle}
            chapter={{ index: 6 }}
            className="relative [&_h2]:text-[clamp(2.1rem,3.4vw,3.35rem)] [&_p]:text-[0.975rem] md:[&_p]:text-base"
          />

          <div className="relative mb-6 mt-10 hidden flex-1 items-center justify-center sm:mt-12 md:col-start-2 md:flex md:row-span-2 md:row-start-1 md:my-6 xl:mb-8 xl:mt-12">
            <CardMock fromLabel={fromLabel} />
          </div>
          <div className="relative mt-7 w-full max-w-[23rem] md:hidden">
            <MiniCardMock fromLabel={fromLabel} />
          </div>

          <p className="relative mt-5 flex items-start gap-3 rounded-card md:mt-6 bg-white/[0.08] p-3 pr-4 text-[0.9375rem] leading-relaxed text-white/85 ring-1 ring-white/10 sm:text-sm md:col-start-1 md:self-end">
            <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-lime text-ink">
              <Info className="h-4 w-4" />
            </span>
            <span className="pt-1">{t.entryServices.note}</span>
          </p>
        </div>
      </div>

      {/* Fichas de producto: carrusel en el teléfono (la siguiente ficha
          asoma por la orilla), retícula 2×2 desde md. */}
      <ul
        role="list"
        aria-label={t.entryServices.eyebrow}
        onFocus={revealFocusedCard}
        className="-mx-[var(--gutter)] flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-[var(--gutter)] px-[var(--gutter)] pb-2 [scrollbar-width:none] md:mx-0 md:grid md:snap-none md:grid-cols-2 md:gap-gutter md:overflow-visible md:p-0 xl:col-span-8 [&::-webkit-scrollbar]:hidden"
      >
        {regular.map((item, index) => {
          const Icon = ICONS[item.id] ?? Package;
          return (
            <li
              key={item.id}
              data-fx="up"
              style={fxDelay((index % 2) * 90 + Math.floor(index / 2) * 60)}
              className="flex w-[82%] shrink-0 snap-start sm:w-[56%] md:w-auto"
            >
              {/* Debajo de md: el número (decorativo) se oculta y el precio sube
                  a la esquina, a la altura del ícono; sigue después del
                  título en el DOM, así que se lee en el mismo orden. */}
              <article className="panel group flex w-full flex-col p-4 shadow-soft transition-transform duration-500 [transition-timing-function:var(--ease-out)] hover:-translate-y-1 sm:p-6 xl:p-7">
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-12 place-items-center rounded-full bg-ink text-lime transition-transform duration-500 [transition-timing-function:var(--ease-pop)] group-hover:-rotate-12 group-hover:scale-105 md:size-14">
                    <Icon aria-hidden className="h-5 w-5 md:h-6 md:w-6" />
                  </span>
                  <span
                    aria-hidden
                    className="inline-grid h-8 min-w-[2.75rem] place-items-center rounded-full bg-mint px-2.5 text-xs font-bold tabular-nums text-ink ring-1 ring-ink/10 max-md:hidden"
                  >
                    {pad(index + 1)}
                  </span>
                </div>

                <h3 className="display-title mt-4 text-balance text-[1.375rem] leading-[1.02] md:mt-5 md:min-h-[2.04em] md:text-[1.6rem] xl:text-[1.75rem]">
                  {item.name}
                </h3>
                <p className="mt-3 inline-flex h-10 w-fit items-center rounded-full bg-lime px-4 text-base font-bold tabular-nums text-ink max-md:absolute max-md:right-4 max-md:top-5 max-md:mt-0 sm:max-md:right-6 sm:max-md:top-7">
                  {item.price}
                </p>
                <p className="mt-2 text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground md:mt-4">
                  {item.desc}
                </p>

                <ul className="mt-3.5 flex flex-1 flex-col gap-2 border-t border-border pt-3.5 md:mt-4 md:gap-2.5 md:pt-4">
                  {item.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm leading-snug text-foreground/85">
                      <span
                        aria-hidden
                        className="mt-px grid size-5 shrink-0 place-items-center rounded-full bg-lime-soft text-forest-deep"
                      >
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  variant="outline"
                  onClick={() => openLuminaChat(item.question)}
                  className="mt-4 w-full justify-between whitespace-normal pl-4 pr-2 text-left leading-tight hover:border-ink hover:bg-ink hover:text-white md:mt-6 md:pl-5"
                >
                  <span>
                    {t.entryServices.cta}
                    <span className="sr-only"> — {item.name}</span>
                  </span>
                  <ButtonArrow tone="ink" className="mr-0 size-8 [button:hover>&]:bg-lime [button:hover>&]:text-ink" />
                </Button>
              </article>
            </li>
          );
        })}

        {/* Teléfono: la landing cierra el carrusel como ficha lima (título con
            su ícono, precio en píldora de tinta). Desde md vive en su panel
            ancho de abajo, así que esta copia no existe para nadie ahí. */}
        {featured && (
          <li data-fx="up" style={fxDelay(120)} className="flex w-[82%] shrink-0 snap-start sm:w-[56%] md:hidden">
            <article className="panel panel-lime group flex w-full flex-col p-4 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <h3 className="display-title min-w-0 text-balance text-[1.375rem] leading-[1.02] [overflow-wrap:anywhere]">
                  {featured.name}
                </h3>
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-ink text-lime transition-transform duration-500 [transition-timing-function:var(--ease-pop)] group-hover:-rotate-12 group-hover:scale-105">
                  {(() => {
                    const Icon = ICONS[featured.id] ?? AppWindowMac;
                    return <Icon aria-hidden className="h-5 w-5" />;
                  })()}
                </span>
              </div>
              <p className="mt-2 inline-flex h-10 w-fit items-center rounded-full bg-ink px-4 text-base font-bold tabular-nums text-lime">
                {featured.price}
              </p>
              <p className="mt-2.5 text-pretty text-[0.9375rem] leading-relaxed text-ink/75">{featured.desc}</p>

              <ul className="mt-3.5 flex flex-1 flex-col gap-2 border-t border-ink/15 pt-3.5">
                {featured.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm font-medium leading-snug text-ink">
                    <span aria-hidden className="mt-px grid size-5 shrink-0 place-items-center rounded-full bg-ink text-lime">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                variant="ink"
                onClick={() => openLuminaChat(featured.question)}
                className="mt-4 w-full justify-between whitespace-normal pl-4 pr-2 text-left leading-tight"
              >
                <span>
                  {t.entryServices.cta}
                  <span className="sr-only"> — {featured.name}</span>
                </span>
                <ButtonArrow tone="lime" className="mr-0 size-8" />
              </Button>
            </article>
          </li>
        )}
      </ul>

      {/* La ficha destacada: la landing, en lima y a todo lo ancho. Dos
          columnas: la propuesta | lo que incluye + la acción. En el teléfono
          vive en el carrusel (arriba). */}
      {featured && (
        <div data-fx="up" className="min-w-0 max-md:hidden xl:col-span-12">
          <article className="panel panel-lime group relative overflow-hidden p-5 pt-6 sm:p-7 lg:p-10">
            <span
              aria-hidden
              className="pointer-events-none absolute right-28 top-9 hidden h-14 w-60 bg-[radial-gradient(circle,hsl(var(--ink)/0.16)_0_5px,transparent_5.5px)] [background-size:22px_22px] [mask-image:linear-gradient(to_left,black,transparent)] xl:block"
            />
            {/* Recorte cóncavo con el número de la ficha. */}
            <div className="notch notch-tr">
              <span className="inline-flex h-10 items-center gap-2 rounded-full bg-ink pl-1.5 pr-4 text-sm font-bold text-white">
                <span className="grid size-7 place-items-center rounded-full bg-lime text-ink">
                  <Sparkle aria-hidden className="h-3.5 w-3.5 fill-ink" />
                </span>
                <span className="tabular-nums">{pad(items.length)}</span>
              </span>
            </div>

            <div className="relative grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-end lg:gap-12">
              <div className="min-w-0">
                <span className="grid size-14 place-items-center rounded-full bg-ink text-lime transition-transform duration-500 [transition-timing-function:var(--ease-pop)] group-hover:-rotate-12 group-hover:scale-105">
                  {(() => {
                    const Icon = ICONS[featured.id] ?? AppWindowMac;
                    return <Icon aria-hidden className="h-6 w-6" />;
                  })()}
                </span>
                <h3 className="display-title mt-5 max-w-[16ch] text-balance pr-16 text-[clamp(1.9rem,3.2vw,2.9rem)] leading-[0.98] lg:pr-0">
                  {featured.name}
                </h3>
                <p className="mt-3 max-w-md text-pretty text-[0.975rem] leading-relaxed text-ink/75">
                  {featured.desc}
                </p>
                <p className="mt-5 inline-flex h-11 items-center rounded-full bg-ink px-5 text-lg font-bold tabular-nums text-lime">
                  {featured.price}
                </p>
              </div>

              <div className="flex min-w-0 flex-col gap-4 lg:gap-5">
                <ul className="grid gap-x-5 gap-y-2.5 rounded-card bg-white/45 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-1 xl:grid-cols-2">
                  {featured.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[0.9375rem] font-medium leading-snug text-ink">
                      <span aria-hidden className="mt-px grid size-5 shrink-0 place-items-center rounded-full bg-ink text-lime">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  size="lg"
                  variant="ink"
                  onClick={() => openLuminaChat(featured.question)}
                  className="w-full justify-between whitespace-normal pl-6 pr-2.5 text-left leading-tight sm:w-auto sm:self-end sm:whitespace-nowrap"
                >
                  <span>
                    {t.entryServices.cta}
                    <span className="sr-only"> — {featured.name}</span>
                  </span>
                  <ButtonArrow tone="lime" className="-mr-0.5 ml-2" />
                </Button>
              </div>
            </div>
          </article>
        </div>
      )}
    </section>
  );
}
