import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BellRing,
  CalendarCheck,
  Check,
  ChevronRight,
  CreditCard,
  House,
  LayoutDashboard,
  MessageCircle,
  Minus,
  Palette,
  QrCode,
  Scissors,
  Sparkle,
  Stamp,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Button, ButtonArrow } from "@/components/ui/button";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { StatCounter } from "@/components/ui/stat-counter";
import { MarqueeBand } from "@/components/sections/marquee-band";
import { SiteFooter } from "@/components/sections/site-footer";
import { SiteHeader } from "@/components/sections/site-header";
import { LandingHeading, Orbit } from "@/components/seo/service-landing-page";
import { SpanishPageLanguage } from "@/components/seo/spanish-page-language";
import { TrackedWhatsAppLink } from "@/components/analytics/tracked-whatsapp-link";
import {
  ADMIN_MODULES,
  BARBER_OS_NAME,
  BARBER_OS_SERVICE,
  BARBER_OS_SLUG,
  BARBER_OS_TRIAL_URL,
  FAQS,
  FEATURES,
  FLOW,
  LIVE_CASE,
  LOYALTY,
  RELATED,
  TRIAL_DAYS,
  TRIAL_EXCLUDES,
  TRIAL_INCLUDES,
  barberOsJsonLd,
  type FeatureIcon,
} from "@/lib/barber-os";
import { WHATSAPP_URL } from "@/lib/seo/service-pages";
import { cn } from "@/lib/utils";

const MARQUEE_WORDS = ["Reservas", "Lealtad", "QR", "Caja", "Reportes", "Google Wallet"];

/** El recorte de los paneles blancos dentro del marco (el hueco es blanco). */
const NOTCH_ON_WHITE = { "--notch-bg": "0 0% 100%" } as CSSProperties;

const FEATURE_ICONS: Record<FeatureIcon, LucideIcon> = {
  calendar: CalendarCheck,
  stamp: Stamp,
  qr: QrCode,
  dashboard: LayoutDashboard,
  card: CreditCard,
  app: BellRing,
  team: Users,
  brand: Palette,
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function fx(ms: number) {
  return { "--fx-delay": `${ms}ms` } as CSSProperties;
}

function hd(ms: number) {
  return { "--hd": `${ms}ms` } as CSSProperties;
}

/* ——— Piezas del producto, dibujadas en código (marca BryanF) ——————— */

/** Fila de sellos: `filled` de `LOYALTY.stamps`; el último lleva el %. */
function StampRow({
  filled,
  tone = "ink",
  size = "md",
}: {
  filled: number;
  tone?: "ink" | "light";
  size?: "sm" | "md" | "lg";
}) {
  const dims = {
    sm: "size-7 [&_svg]:size-3.5",
    md: "size-9 [&_svg]:size-4 sm:size-10",
    lg: "size-11 [&_svg]:size-5 sm:size-14 sm:[&_svg]:size-6",
  }[size];
  return (
    <span className="flex items-center gap-1.5 sm:gap-2">
      {Array.from({ length: LOYALTY.stamps }, (_, i) => {
        const on = i < filled;
        const last = i === LOYALTY.stamps - 1;
        return (
          <span
            key={i}
            className={cn(
              "grid shrink-0 place-items-center rounded-full font-display font-bold",
              dims,
              on
                ? "bg-lime text-ink"
                : tone === "ink"
                  ? "border-[1.5px] border-dashed border-white/30 text-white/50"
                  : "border-[1.5px] border-dashed border-ink/25 text-ink/45"
            )}
          >
            {last && !on ? (
              <span className={size === "sm" ? "text-[0.6rem]" : "text-xs sm:text-sm"}>%</span>
            ) : (
              <Scissors aria-hidden strokeWidth={2.25} />
            )}
          </span>
        );
      })}
    </span>
  );
}

/** Tarjeta de lealtad (como se ve en Wallet): tinta, sellos y QR. */
function LoyaltyCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "panel-ink relative overflow-hidden rounded-card p-4 shadow-float ring-1 ring-white/10 sm:p-5",
        className
      )}
    >
      <div aria-hidden className="mesh-glow-a opacity-60" />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-lime">
            Tarjeta de lealtad
          </p>
          <p className="mt-1 font-display text-lg font-bold leading-tight text-white">Tu barbería</p>
        </div>
        <span className="grid size-12 shrink-0 place-items-center rounded-inner bg-white text-ink">
          <QrCode aria-hidden className="size-8" strokeWidth={1.75} />
        </span>
      </div>
      <div className="relative mt-4">
        <StampRow filled={3} size="sm" />
      </div>
      <div className="relative mt-4 flex items-center justify-between gap-2 text-[0.7rem] font-semibold">
        <span className="tabular-nums text-white/60">LC-0000-0000</span>
        <span className="rounded-full bg-white/10 px-2.5 py-1 text-white">3 de {LOYALTY.stamps} sellos</span>
      </div>
    </div>
  );
}

/** Teléfono con el flujo de reserva: barbero, horario y confirmar. */
function BookingPhone({ className }: { className?: string }) {
  const barbers = [
    { initials: "AL", name: "Alex" },
    { initials: "MR", name: "Mario" },
    { initials: "JC", name: "Juan C." },
  ];
  const slots = ["10:00", "10:45", "11:30", "12:15", "13:00", "16:30"];
  return (
    <div className={cn("rounded-[2.1rem] bg-ink p-2 shadow-float", className)}>
      <div className="overflow-hidden rounded-[1.6rem] bg-white">
        <div className="flex items-center justify-between bg-forest px-4 pb-3 pt-4 text-white">
          <span className="text-[0.7rem] font-semibold text-white/70">Reservar cita</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-lime px-2 py-0.5 text-[0.65rem] font-bold text-ink">
            <span aria-hidden className="size-1.5 rounded-full bg-ink" />
            Abierto
          </span>
        </div>
        <div className="flex flex-col gap-3.5 p-4">
          <div>
            <p className="text-[0.7rem] font-semibold text-ink/55">Servicio</p>
            <div className="mt-1.5 flex items-center justify-between rounded-inner bg-mint px-3 py-2.5">
              <span className="text-sm font-bold text-ink">Corte + barba</span>
              <span className="text-xs font-semibold text-ink/60">45 min</span>
            </div>
          </div>
          <div>
            <p className="text-[0.7rem] font-semibold text-ink/55">Elige barbero</p>
            <div className="mt-1.5 grid grid-cols-3 gap-1.5">
              {barbers.map((b, i) => (
                <span
                  key={b.initials}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-inner px-1 py-2",
                    i === 1 ? "bg-ink text-white" : "bg-mint text-ink"
                  )}
                >
                  <span
                    className={cn(
                      "grid size-8 place-items-center rounded-full text-[0.65rem] font-bold",
                      i === 1 ? "bg-lime text-ink" : "bg-white text-ink"
                    )}
                  >
                    {b.initials}
                  </span>
                  <span className="text-[0.65rem] font-semibold">{b.name}</span>
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[0.7rem] font-semibold text-ink/55">Horario · hoy</p>
            <div className="mt-1.5 grid grid-cols-3 gap-1.5">
              {slots.map((s, i) => (
                <span
                  key={s}
                  className={cn(
                    "rounded-full py-1.5 text-center text-[0.7rem] font-bold tabular-nums",
                    i === 2
                      ? "bg-lime text-ink"
                      : i === 4
                        ? "bg-ink/[0.04] text-ink/30 line-through"
                        : "bg-mint text-ink"
                  )}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
          <span className="mt-0.5 flex items-center justify-between rounded-full bg-ink py-1.5 pl-4 pr-1.5 text-xs font-semibold text-white">
            Confirmar cita
            <span className="grid size-7 place-items-center rounded-full bg-lime text-ink">
              <Check aria-hidden className="size-3.5" strokeWidth={3} />
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

/* ——— Página ——————————————————————————————————————————————————————— */

export function BarberOsPage() {
  return (
    <>
      {barberOsJsonLd().map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
      <SpanishPageLanguage />

      <ScrollProgress />
      <SiteHeader spanishOnly />

      <main id="main-content" tabIndex={-1} className="sheet-main" data-language="es-only">
        {/* ——— Hero: titular partido y, a la derecha, el producto en un
            panel lima: el teléfono reservando y la tarjeta de lealtad. ——— */}
        <section
          id="barber-os"
          aria-labelledby="barber-title"
          className="panel relative overflow-visible p-4 shadow-soft sm:p-6 lg:p-10"
        >
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
            <div className="relative flex min-w-0 flex-col items-start gap-5 pt-1 lg:col-span-6 lg:gap-6 lg:pt-0">
              <nav
                aria-label="Breadcrumb"
                className="hero-in hero-in-fade inline-flex max-w-full items-center gap-1 rounded-full bg-ink/[0.05] p-1 pr-4 text-sm font-semibold"
                style={hd(40)}
              >
                <Link
                  href="/"
                  className="inline-flex h-10 min-w-11 shrink-0 items-center gap-1.5 rounded-full bg-white px-3.5 text-ink shadow-[0_4px_14px_-8px_hsl(var(--ink)/0.45)] transition-colors hover:bg-lime"
                >
                  <House aria-hidden className="h-3.5 w-3.5" />
                  Inicio
                </Link>
                <ChevronRight aria-hidden className="h-4 w-4 shrink-0 text-ink/35" />
                <span aria-current="page" className="truncate text-ink/70">
                  {BARBER_OS_SERVICE}
                </span>
              </nav>

              <span className="hero-in hero-in-fade eyebrow" style={hd(80)}>
                <b>
                  <Scissors aria-hidden className="h-3 w-3" strokeWidth={2.5} />
                </b>
                {BARBER_OS_NAME} · para barberías y salones
              </span>

              <h1 id="barber-title" className="hero-in hero-in-up text-ink" style={hd(100)}>
                <span className="display-italic block text-[clamp(2.3rem,4.6vw,4.5rem)] leading-[1.02] text-forest">
                  {BARBER_OS_SERVICE}
                  <Sparkle
                    aria-hidden
                    className="float-y relative -top-[0.25em] ml-1.5 inline-block size-[0.45em] fill-lime text-lime-deep"
                  />
                </span>{" "}
                <span className="display-title mt-1 block text-balance text-[clamp(2.1rem,3.9vw,3.9rem)] leading-[1.02]">
                  Reservas, lealtad y caja en un solo lugar
                </span>
              </h1>

              <p
                className="hero-in hero-in-fade max-w-xl text-pretty text-[0.975rem] leading-relaxed text-muted-foreground md:text-lg"
                style={hd(180)}
              >
                Tus clientes reservan eligiendo barbero y horario, confirman su
                llegada con QR y juntan sellos en su tarjeta de Google Wallet. Tú
                ves agenda, caja, inventario y reportes desde un panel. Ya
                funciona en vivo en {LIVE_CASE.name}.
              </p>

              <div
                className="hero-in hero-in-up flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:flex-wrap"
                style={hd(240)}
              >
                <Button asChild size="lg" variant="ink" className="pr-2.5">
                  <TrackedWhatsAppLink href={BARBER_OS_TRIAL_URL} service={BARBER_OS_SLUG}>
                    <MessageCircle aria-hidden className="h-[1.1rem] w-[1.1rem] text-lime" />
                    Probar {TRIAL_DAYS} días gratis
                    <ButtonArrow tone="lime" className="ml-auto -mr-0.5 sm:ml-2" />
                  </TrackedWhatsAppLink>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href={LIVE_CASE.url} target="_blank" rel="noopener noreferrer">
                    Ver CortMart en vivo
                    <ArrowUpRight aria-hidden className="h-4 w-4" />
                  </a>
                </Button>
              </div>

              <ul
                className="hero-in hero-in-fade flex flex-wrap gap-2 lg:mt-auto"
                style={hd(300)}
                aria-label="Incluido en la prueba"
              >
                {["Tu marca", "Tus servicios", "Tus barberos", "Tus horarios"].map((item) => (
                  <li
                    key={item}
                    className="inline-flex items-center gap-1.5 rounded-full bg-ink/[0.05] py-1.5 pl-1.5 pr-3.5 text-sm font-semibold text-ink"
                  >
                    <span className="grid size-6 place-items-center rounded-full bg-lime">
                      <Check aria-hidden className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Panel lima con el producto. El teléfono va centrado; la
                tarjeta de lealtad se sobrepone abajo, como en un pase. */}
            <div className="hero-in hero-in-up relative min-w-0 lg:col-span-6" style={hd(160)}>
              <div className="panel-lime relative flex h-full min-h-[34rem] items-start justify-center overflow-hidden rounded-[calc(var(--r-panel)-0.5rem)] px-4 pb-44 pt-16 sm:min-h-[38rem] sm:pb-28 sm:pt-20">
                <span className="notch notch-tl hidden sm:flex" style={NOTCH_ON_WHITE}>
                  <span className="eyebrow pl-3">
                    <span aria-hidden className="size-2 rounded-full bg-lime-deep" />
                    En vivo en {LIVE_CASE.name}
                  </span>
                </span>
                <Orbit className="float-y absolute left-[-10%] top-[30%] w-[120%] text-ink/25" />
                <Sparkle
                  aria-hidden
                  className="float-y absolute right-5 top-5 h-8 w-8 fill-ink text-ink lg:right-7 lg:top-7"
                />
                <BookingPhone className="relative w-[15.5rem] -rotate-2 sm:w-[17rem]" />
                <LoyaltyCard className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-auto sm:right-6 sm:w-[19rem] sm:rotate-2" />
              </div>
            </div>
          </div>
        </section>

        {/* ——— Caso en vivo: las cifras reales de CortMart. ——— */}
        <section id="cortmart" aria-labelledby="cortmart-title" className="flex flex-col gap-gutter">
          <div className="grid gap-gutter lg:grid-cols-12">
            <div suppressHydrationWarning data-fx="left" className="min-w-0 lg:col-span-5">
              <div className="panel panel-ink relative flex h-full flex-col justify-between gap-8 overflow-hidden p-5 sm:p-7 lg:p-10">
                <div aria-hidden className="mesh-glow-a opacity-70" />
                <LandingHeading
                  id="cortmart-title"
                  index={1}
                  eyebrow="Caso en vivo"
                  title={
                    <>
                      Así funciona en <span className="text-lime">{LIVE_CASE.name}</span>
                    </>
                  }
                  className="relative"
                />
                <div className="relative">
                  <p className="text-sm font-semibold text-white/70">Ingresos registrados en el sistema</p>
                  <p className="display-xl mt-2 text-[clamp(3.5rem,11vw,7rem)] leading-[0.85] text-lime">
                    <StatCounter value={LIVE_CASE.revenue} prefix="$" />
                  </p>
                  <p className="mt-2 text-xs font-semibold text-white/50">MXN · {LIVE_CASE.cutoff}</p>
                </div>
                <a
                  href={LIVE_CASE.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex min-h-12 items-center justify-between gap-3 rounded-full bg-white/[0.08] py-1.5 pl-5 pr-1.5 text-sm font-semibold text-white ring-1 ring-white/10 transition-colors hover:bg-lime hover:text-ink"
                >
                  <span className="truncate">Visitar el sitio de CortMart</span>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-lime text-ink transition-colors group-hover:bg-ink group-hover:text-lime">
                    <ArrowUpRight aria-hidden className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                  </span>
                </a>
              </div>
            </div>

            <ul className="grid grid-cols-2 gap-gutter lg:col-span-7">
              {LIVE_CASE.stats.map((stat, i) => (
                <li key={stat.label} suppressHydrationWarning data-fx="up" style={fx(i * 80)} className="min-w-0">
                  <div
                    className={cn(
                      "panel flex h-full min-h-[11rem] flex-col justify-between gap-5 p-4 sm:min-h-[13rem] sm:p-6 lg:p-7",
                      i === 1 ? "panel-lime" : "shadow-soft"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-semibold leading-tight">{stat.label}</span>
                      <span
                        className={cn(
                          "grid size-8 shrink-0 place-items-center rounded-full text-[0.7rem] font-bold",
                          i === 1 ? "bg-ink text-lime" : "bg-ink/[0.06] text-ink/60"
                        )}
                      >
                        {pad(i + 1)}
                      </span>
                    </div>
                    <div>
                      <p className="display-xl text-[clamp(2.75rem,9vw,5.5rem)] leading-[0.85]">
                        <StatCounter value={stat.value} suffix={stat.suffix} />
                      </p>
                      {i === 1 ? (
                        <span aria-hidden className="mt-3 block h-2.5 overflow-hidden rounded-full bg-ink/15">
                          <span className="block h-full rounded-full bg-ink" style={{ width: `${stat.value}%` }} />
                        </span>
                      ) : null}
                      <p
                        className={cn(
                          "mt-2 text-pretty text-xs font-semibold leading-snug sm:text-sm",
                          i === 1 ? "text-ink/70" : "text-muted-foreground"
                        )}
                      >
                        {stat.caption}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <p className="px-2 text-center text-xs font-semibold text-muted-foreground sm:text-sm">
            Cifras reales del panel de administración de {LIVE_CASE.name}. Sin
            proyecciones ni datos de ejemplo.
          </p>
        </section>

        {/* ——— Funciones: mosaico de tarjetas; la primera en lima. ——— */}
        <section
          id="funciones"
          aria-labelledby="funciones-title"
          className="panel p-5 shadow-soft sm:p-7 lg:p-10"
        >
          <div className="grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-10">
            <LandingHeading
              id="funciones-title"
              index={2}
              eyebrow="Funciones"
              title="Todo lo que tu barbería necesita para operar"
              className="lg:col-span-7"
            />
            <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg lg:col-span-5 lg:pb-1.5">
              Reservas, lealtad, cobros y reportes conectados entre sí: cada
              visita que confirmas actualiza todo lo demás, sin capturar dos veces.
            </p>
          </div>

          <ul className="mt-8 grid gap-2.5 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4">
            {FEATURES.map((feature, i) => {
              const Icon = FEATURE_ICONS[feature.icon];
              const tone = i === 0 ? "lime" : i === 1 ? "ink" : "mint";
              return (
                <li key={feature.title} suppressHydrationWarning data-fx="up" style={fx((i % 4) * 70)} className="min-w-0">
                  <article
                    className={cn(
                      "flex h-full flex-col gap-6 rounded-card p-5 sm:gap-10 sm:p-6",
                      tone === "lime" && "bg-lime text-ink",
                      tone === "ink" && "panel-ink",
                      tone === "mint" && "bg-mint text-ink ring-1 ring-ink/[0.04]"
                    )}
                  >
                    <span className="flex items-center justify-between">
                      <span
                        className={cn(
                          "grid size-12 place-items-center rounded-full",
                          tone === "ink" ? "bg-lime text-ink" : "bg-ink text-lime"
                        )}
                      >
                        <Icon aria-hidden className="h-5 w-5" />
                      </span>
                      <span className={cn("text-xs font-bold", tone === "ink" ? "text-white/40" : "text-ink/40")}>
                        {pad(i + 1)}
                      </span>
                    </span>
                    <div>
                      <h3 className="font-display text-[1.3rem] font-bold leading-tight tracking-[-0.02em]">
                        {feature.title}
                      </h3>
                      <p
                        className={cn(
                          "mt-2 text-pretty text-[0.95rem] leading-relaxed",
                          tone === "ink" ? "text-white/75" : tone === "lime" ? "text-ink/75" : "text-muted-foreground"
                        )}
                      >
                        {feature.text}
                      </p>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ——— Lealtad: bosque con la regla de sellos en grande. ——— */}
        <section id="lealtad" aria-labelledby="lealtad-title" className="grid gap-gutter lg:grid-cols-12">
          <div suppressHydrationWarning data-fx="left" className="min-w-0 lg:col-span-7">
            <div className="panel panel-forest relative flex h-full flex-col gap-8 overflow-hidden p-5 sm:p-7 lg:p-10">
              <div
                aria-hidden
                className="dot-cluster absolute -right-2 -top-2 h-28 w-40 opacity-40 [mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)] lg:h-44 lg:w-64 lg:opacity-50"
              />
              <LandingHeading
                id="lealtad-title"
                index={3}
                eyebrow="Tarjeta de lealtad"
                title="Clientes que regresan, sin tarjetas de cartón"
                className="relative"
              />
              <p className="relative max-w-2xl text-pretty text-lg leading-relaxed text-white/85">
                Cada cliente tiene su tarjeta con número y QR, en su cuenta y en
                Google Wallet. Cada visita confirmada pone un sello sola; el
                mostrador también puede sellar visitas sin cita.
              </p>
              <div className="relative mt-auto flex flex-col gap-5 rounded-card bg-white/[0.07] p-4 ring-1 ring-white/10 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <StampRow filled={LOYALTY.stamps - 1} size="lg" />
                  <ArrowRight aria-hidden className="hidden h-6 w-6 text-white/50 sm:block" />
                  <span className="inline-flex items-center gap-2 rounded-full bg-lime py-2 pl-2 pr-4 font-display text-lg font-bold text-ink">
                    <span className="grid size-8 place-items-center rounded-full bg-ink text-sm text-lime">%</span>
                    {LOYALTY.discount}% de descuento
                  </span>
                </div>
                <p className="text-sm font-semibold text-white/70">
                  Un sello por visita · {LOYALTY.stamps} sellos = {LOYALTY.discount}% de descuento
                  (la regla de CortMart; se ajusta a tu negocio).
                </p>
              </div>
            </div>
          </div>

          <div suppressHydrationWarning data-fx="right" className="min-w-0 lg:col-span-5" style={fx(90)}>
            <div className="panel flex h-full flex-col gap-6 p-5 shadow-soft sm:p-7 lg:p-8">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Recorrido de una visita</p>
                <h3 className="display-title mt-1 text-[clamp(1.75rem,2.4vw,2.25rem)] text-ink">
                  De la reserva al sello
                </h3>
              </div>
              <ol className="flex flex-1 flex-col gap-2">
                {FLOW.map((step, i) => (
                  <li
                    key={step.title}
                    className={cn(
                      "flex flex-1 items-center gap-4 rounded-card px-4 py-3.5 sm:px-5",
                      i === 0 ? "bg-lime" : "bg-mint ring-1 ring-ink/[0.04]"
                    )}
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ink font-display text-[0.95rem] font-bold text-lime">
                      {pad(i + 1)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-[0.08em] text-ink/50">{step.who}</p>
                      <p className="font-display text-[1.1rem] font-bold leading-snug text-ink">{step.title}</p>
                      <p className="text-pretty text-sm leading-snug text-ink/70">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <MarqueeBand words={MARQUEE_WORDS} angle={-2} />

        {/* ——— Panel de administración: módulos como chips de app. ——— */}
        <section
          id="panel"
          aria-labelledby="panel-title"
          className="panel panel-ink relative overflow-hidden p-5 sm:p-7 lg:p-10"
        >
          <div aria-hidden className="mesh-glow-b opacity-60" />
          <div className="relative grid gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="flex flex-col gap-6 lg:col-span-5">
              <LandingHeading
                id="panel-title"
                index={4}
                eyebrow="Panel de administración"
                title={
                  <>
                    Tu negocio completo, <span className="text-lime">en una pantalla</span>
                  </>
                }
              />
              <p className="max-w-xl text-pretty text-base leading-relaxed text-white/75 md:text-lg">
                Agenda del día, cobros en efectivo o tarjeta, existencias de
                productos y reportes por barbero. El escáner de QR vive en el
                mismo panel, listo en el celular del mostrador.
              </p>
            </div>
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:col-span-7">
              {ADMIN_MODULES.map((mod, i) => (
                <li
                  key={mod}
                  suppressHydrationWarning
                  data-fx="pop"
                  style={fx((i % 6) * 50)}
                  className="min-w-0"
                >
                  <span
                    className={cn(
                      "flex h-full min-h-[4.25rem] items-center gap-2.5 rounded-inner px-3.5 py-3 text-sm font-semibold leading-snug sm:px-4",
                      i < 5 ? "bg-lime text-ink" : "bg-white/[0.06] text-white ring-1 ring-white/10"
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn("size-2 shrink-0 rounded-full", i < 5 ? "bg-ink" : "bg-lime")}
                    />
                    {mod}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ——— Prueba gratis: la oferta, con lo que entra y lo que no. ——— */}
        <section id="prueba" aria-labelledby="prueba-title" suppressHydrationWarning data-fx="panel">
          <div className="panel panel-lime relative overflow-hidden p-5 sm:p-8 lg:p-12">
            <Orbit className="absolute right-[30%] top-[-3rem] hidden w-[34rem] text-ink/20 lg:block" />
            <div className="relative grid gap-8 lg:grid-cols-12 lg:gap-10">
              <div className="flex flex-col items-start gap-5 lg:col-span-5">
                <span className="eyebrow bg-white/60">
                  <b>{pad(5)}</b>
                  Prueba gratis
                </span>
                <h2 id="prueba-title" className="text-ink">
                  <span className="display-xl block text-[clamp(4.5rem,13vw,10rem)] leading-[0.8]">
                    {TRIAL_DAYS} días
                  </span>
                  <span className="display-title mt-3 block text-balance text-[clamp(1.9rem,3.2vw,3rem)]">
                    para probarlo con tus clientes, gratis
                  </span>
                </h2>
                <p className="max-w-md text-pretty text-base leading-relaxed text-ink/75 md:text-lg">
                  Dejamos tu sistema listo con tu información y lo usas en tu
                  barbería durante {TRIAL_DAYS} días. Al terminar decides si sigues.
                </p>
                <Button asChild size="lg" variant="ink" className="w-full justify-between pl-6 pr-2.5 sm:w-auto">
                  <TrackedWhatsAppLink href={BARBER_OS_TRIAL_URL} service={BARBER_OS_SLUG}>
                    Empezar mi prueba
                    <ButtonArrow tone="lime" className="-mr-0.5 sm:ml-2" />
                  </TrackedWhatsAppLink>
                </Button>
              </div>

              <div className="flex flex-col gap-2.5 lg:col-span-7">
                <div className="card-pop flex flex-col gap-4 p-5 sm:p-7">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-xl font-bold tracking-[-0.02em] text-ink sm:text-2xl">
                      Incluido en la prueba
                    </h3>
                    <span className="rounded-full bg-lime px-3 py-1 text-xs font-bold text-ink">$0</span>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {TRIAL_INCLUDES.map((item) => (
                      <li key={item} className="flex items-start gap-3 rounded-inner bg-mint p-3 sm:p-3.5">
                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ink text-lime">
                          <Check aria-hidden className="h-4 w-4" strokeWidth={2.5} />
                        </span>
                        <span className="pt-1 text-[0.975rem] font-semibold leading-snug text-ink">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="panel-ink flex flex-col gap-3 rounded-card p-5 sm:p-6">
                  <h3 className="font-display text-lg font-bold tracking-[-0.02em] text-white">
                    No incluido · se cotiza aparte
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {TRIAL_EXCLUDES.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/10 text-white">
                          <Minus aria-hidden className="h-4 w-4" strokeWidth={2.5} />
                        </span>
                        <span className="pt-1 text-[0.975rem] font-semibold leading-snug text-white/85">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ——— Preguntas frecuentes (coinciden con el schema). ——— */}
        <section id="preguntas" aria-labelledby="preguntas-title" className="grid gap-gutter lg:grid-cols-12">
          <div suppressHydrationWarning data-fx="left" className="min-w-0 lg:col-span-5">
            <div className="panel relative flex h-full flex-col gap-8 overflow-hidden p-5 shadow-soft sm:p-7 lg:p-10">
              <div
                aria-hidden
                className="dot-cluster absolute -right-3 -top-3 h-36 w-48 opacity-60 [mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]"
              />
              <LandingHeading
                id="preguntas-title"
                index={6}
                eyebrow="Preguntas frecuentes"
                title="Lo que preguntan las barberías"
                className="relative"
              />
              <div className="relative mt-auto flex items-end gap-3">
                <div className="panel-ink flex flex-1 flex-col gap-4 rounded-card p-5 sm:p-6">
                  <p className="text-[0.975rem] font-semibold leading-snug text-white">
                    ¿Tienes otra duda? Escríbenos y te mostramos el sistema.
                  </p>
                  <Button asChild className="w-full justify-between pl-6 pr-2">
                    <TrackedWhatsAppLink href={WHATSAPP_URL} service={BARBER_OS_SLUG}>
                      Preguntar por WhatsApp
                      <ButtonArrow tone="ink" className="-mr-0.5" />
                    </TrackedWhatsAppLink>
                  </Button>
                </div>
                <Image
                  src="/img/brand/lumina-duda.webp"
                  alt=""
                  aria-hidden
                  width={900}
                  height={968}
                  sizes="7rem"
                  className="hidden h-auto w-[7rem] shrink-0 sm:block"
                />
              </div>
            </div>
          </div>

          <div suppressHydrationWarning data-fx="right" className="min-w-0 lg:col-span-7" style={fx(90)}>
            <div className="panel flex h-full flex-col gap-1.5 p-2 shadow-soft sm:p-3">
              {FAQS.map((faq, i) => (
                <article
                  key={faq.question}
                  className="flex flex-1 gap-4 rounded-card bg-mint p-4 ring-1 ring-ink/[0.04] sm:gap-5 sm:p-5"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-xs font-bold text-ink/60 ring-1 ring-ink/10">
                    {pad(i + 1)}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-pretty font-display text-[1.125rem] font-bold leading-snug tracking-[-0.015em] text-ink sm:text-[1.2rem]">
                      {faq.question}
                    </h3>
                    <p className="mt-1.5 text-pretty text-[0.95rem] leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ——— Servicios relacionados (bosque). ——— */}
        <nav aria-labelledby="relacionados-title" suppressHydrationWarning data-fx="up">
          <div className="panel panel-forest relative overflow-hidden p-5 sm:p-7 lg:p-10">
            <Orbit className="absolute -right-24 -top-8 w-[26rem] text-white/15 lg:right-[38%] lg:w-[34rem]" />
            <div className="relative grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
              <LandingHeading
                id="relacionados-title"
                index={7}
                eyebrow="Enlaces relacionados"
                title="¿Necesitas algo más a la medida?"
                size="md"
                className="lg:col-span-4"
              />
              <ul className="grid gap-2 sm:grid-cols-3 sm:gap-2.5 lg:col-span-8">
                {RELATED.map((related) => (
                  <li key={related.href}>
                    <Link
                      href={related.href}
                      className="group flex h-full min-h-14 items-center justify-between gap-3 rounded-full bg-white/[0.08] py-2 pl-5 pr-2 font-semibold text-white ring-1 ring-white/10 transition-colors hover:bg-lime hover:text-ink sm:min-h-[8.5rem] sm:flex-col-reverse sm:items-start sm:rounded-card sm:p-5"
                    >
                      <span className="text-[1.0625rem] leading-snug sm:font-display sm:text-xl sm:font-bold sm:tracking-[-0.02em]">
                        {related.label}
                      </span>
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-lime text-ink transition-colors group-hover:bg-ink group-hover:text-lime sm:self-end">
                        <ArrowUpRight
                          aria-hidden
                          className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45"
                        />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>

        {/* ——— Cierre: el mismo panel blanco con Lumina y la oferta. ——— */}
        <section id="contacto" aria-labelledby="contacto-title" suppressHydrationWarning data-fx="up">
          <div className="panel relative overflow-hidden p-5 shadow-soft sm:p-8 lg:p-12">
            <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-10">
              <div className="flex flex-col items-start gap-5 lg:col-span-8">
                <span className="eyebrow">
                  <b>{pad(8)}</b>
                  Siguiente paso
                </span>
                <h2
                  id="contacto-title"
                  className="display-xl text-balance text-[clamp(2.5rem,5.6vw,5.25rem)] text-ink"
                >
                  Tu barbería, con reservas y lealtad <span className="text-forest">esta semana</span>
                </h2>
                <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
                  Mándanos tu logo, servicios, barberos y horarios. Nosotros lo
                  configuramos y empiezas tus {TRIAL_DAYS} días de prueba gratis.
                </p>
                <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row">
                  <Button asChild size="lg" variant="ink" className="justify-between pl-6 pr-2.5">
                    <TrackedWhatsAppLink href={BARBER_OS_TRIAL_URL} service={BARBER_OS_SLUG}>
                      Quiero mi prueba gratis
                      <ButtonArrow tone="lime" className="-mr-0.5 sm:ml-2" />
                    </TrackedWhatsAppLink>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <a href={LIVE_CASE.url} target="_blank" rel="noopener noreferrer">
                      Ver CortMart en vivo
                      <ArrowUpRight aria-hidden className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
              <div aria-hidden className="relative mx-auto w-[10rem] sm:w-[12rem] lg:col-span-4 lg:w-[14rem]">
                <span className="absolute bottom-0 left-1/2 aspect-square w-[92%] -translate-x-1/2 rounded-full bg-lime" />
                <Orbit className="float-y absolute left-[-45%] top-[10%] w-[190%] text-ink/25" />
                <Image
                  src="/img/brand/lumina-normal.webp"
                  alt=""
                  width={900}
                  height={1059}
                  sizes="(min-width: 1024px) 14rem, 12rem"
                  className="relative h-auto w-full"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter spanishOnly />
    </>
  );
}
