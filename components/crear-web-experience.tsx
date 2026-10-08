"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowDown, ArrowLeft, Building2, CreditCard, Rocket, Search, Sparkle, Timer } from "lucide-react";
import { SiMercadopago, SiStripe } from "react-icons/si";

import { SiteHeader } from "@/components/sections/site-header";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { Configurator } from "@/components/sections/configurator";
import { Button } from "@/components/ui/button";
import { CONFIGURATOR_PLANS } from "@/lib/catalog";
import { formatMoney } from "@/lib/currency";
import { useLanguage } from "@/lib/i18n/context";

const SiteFooter = dynamic(() =>
  import("@/components/sections/site-footer").then((m) => m.SiteFooter)
);
// Widget cliente sin contenido SEO: sin SSR para no cargar el bundle de más.
const LuminaChat = dynamic(
  () => import("@/components/lumina-chat").then((m) => m.LuminaChat),
  { ssr: false }
);

const FEATURE_ICONS = [Timer, Search, CreditCard];

/** El paquete principal (el destacado del catálogo) y su precio fuente. */
const FEATURED_PLAN = CONFIGURATOR_PLANS.find((p) => p.featured) ?? CONFIGURATOR_PLANS[0];

function delay(ms: number) {
  return { "--hd": `${ms}ms` } as CSSProperties;
}

/**
 * Página propia del cotizador. El Configurador vive también en la home
 * (`/#precios`), pero aquí tiene URL, encabezado y metadatos propios: es la
 * página que Lumina recomienda y que se puede compartir para "cotiza y paga".
 *
 * La portada sigue el idioma del hero: marco blanco con el titular a la
 * izquierda y, a la derecha, un panel lima del que sale Lumina, con los
 * medios de pago y el precio del paquete principal en píldoras flotantes.
 */
export function CrearWebExperience() {
  const { t } = useLanguage();
  const featuredName =
    t.configurator.plans[FEATURED_PLAN.id as keyof typeof t.configurator.plans]?.name ??
    t.configurator.plans.full.name;

  return (
    <>
      <ScrollProgress />
      <SiteHeader />

      <main id="main-content" tabIndex={-1} className="sheet-main">
        <section
          aria-labelledby="crear-web-title"
          className="panel relative grid gap-6 overflow-visible p-4 pb-4 pt-5 shadow-soft sm:p-6 lg:grid-cols-12 lg:gap-8 lg:p-8"
        >
          {/* Titular, bajada, ventajas y acciones. */}
          <div className="relative flex flex-col gap-7 px-1 sm:px-2 lg:col-span-7 lg:justify-between lg:py-4 lg:pl-4">
            <div className="flex flex-col items-start">
              <Link
                href="/"
                className="hero-in hero-in-fade group inline-flex min-h-11 items-center gap-2 rounded-full bg-ink/[0.06] pl-1.5 pr-4 text-sm font-semibold text-ink transition-colors hover:bg-ink/10"
                style={delay(40)}
              >
                <span className="grid size-8 place-items-center rounded-full bg-ink text-lime transition-transform duration-300 group-hover:-translate-x-0.5">
                  <ArrowLeft aria-hidden className="h-4 w-4" />
                </span>
                {t.nav.inicio}
              </Link>

              <span className="hero-in hero-in-fade eyebrow mt-8 pl-3 sm:mt-10" style={delay(100)}>
                <span aria-hidden className="relative flex size-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-forest/60 motion-reduce:animate-none" />
                  <span className="relative size-2 rounded-full bg-forest" />
                </span>
                {t.configurator.eyebrow}
              </span>

              <h1
                id="crear-web-title"
                className="hero-in hero-in-up display-title mt-5 max-w-[14ch] text-balance text-[clamp(2.75rem,6.6vw,6.5rem)] leading-[0.94] text-ink"
                style={delay(160)}
              >
                {t.configurator.title}
              </h1>
              <p
                className="hero-in hero-in-fade mt-5 max-w-xl text-pretty text-[0.975rem] leading-relaxed text-muted-foreground md:text-lg"
                style={delay(240)}
              >
                {t.configurator.subtitle}
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <ul
                className="hero-in hero-in-fade grid grid-cols-3 gap-2 sm:max-w-lg"
                style={delay(300)}
              >
                {t.hero.features.map((feature, index) => {
                  const Icon = FEATURE_ICONS[index] ?? Timer;
                  return (
                    <li
                      key={feature}
                      className="flex flex-col items-start gap-2.5 rounded-card bg-mint p-3 ring-1 ring-inset ring-ink/[0.06] sm:p-4"
                    >
                      <span className="grid size-11 place-items-center rounded-full bg-ink text-lime">
                        <Icon aria-hidden className="h-5 w-5" />
                      </span>
                      <span className="text-sm font-semibold leading-snug text-ink">
                        {feature}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <div className="hero-in hero-in-up" style={delay(360)}>
                <Button asChild size="lg" variant="ink" className="w-full justify-between pl-6 pr-2.5 sm:w-auto">
                  <Link href="#precios">
                    {t.nav.armaTuWeb}
                    <span aria-hidden className="ml-3 grid size-9 place-items-center rounded-full bg-lime text-ink transition-transform duration-300 group-hover:translate-y-0.5">
                      <ArrowDown className="h-4 w-4" />
                    </span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Panel lima: Lumina sale por el canto superior. */}
          <div
            className="hero-in hero-in-up relative mt-24 min-h-[19rem] sm:mt-32 sm:min-h-[24rem] lg:col-span-5 lg:mt-52 lg:min-h-0 xl:mt-36"
            style={delay(200)}
          >
            <div className="panel-lime relative h-full min-h-[inherit] rounded-[calc(var(--r-panel)-0.5rem)]">
              <span
                aria-hidden
                className="absolute inset-x-6 top-6 h-24 bg-[radial-gradient(circle,hsl(var(--ink)/0.14)_0_4px,transparent_4.5px)] [background-size:20px_20px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
              />
              {/* Recorte: deja salir la cabeza por arriba y los lados, y
                  esconde la base curva del PNG en el canto inferior. En
                  tableta horizontal el panel es angosto: Lumina se mide más
                  baja y nunca pasa del 115 % del ancho (object-contain la
                  apoya en el canto sin deformarla), así no invade el titular
                  ni se sale del marco. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 [clip-path:inset(-80%_-40%_0_-40%)]"
              >
                <svg
                  viewBox="0 0 400 140"
                  className="float-y absolute left-1/2 top-[-6.5rem] w-[26rem] max-w-[115%] -translate-x-1/2 text-ink/30 sm:top-[-8rem] lg:top-[-7rem] xl:top-[-9rem]"
                >
                  <ellipse
                    cx="200"
                    cy="70"
                    rx="190"
                    ry="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    transform="rotate(-8 200 70)"
                  />
                </svg>
                <Image
                  src="/img/brand/lumina-normal.webp"
                  alt=""
                  width={864}
                  height={1121}
                  priority
                  sizes="(min-width: 1024px) 36rem, 26rem"
                  className="absolute bottom-[-2.5rem] left-1/2 h-[calc(100%+7rem)] w-auto max-w-[115%] -translate-x-1/2 object-contain object-bottom drop-shadow-[0_28px_36px_hsl(160_40%_8%/0.3)] sm:h-[calc(100%+8rem)] lg:bottom-[-3rem] lg:h-[calc(100%+8.5rem)] xl:h-[calc(100%+11rem)]"
                />
              </div>

              {/* A la izquierda, sobre el canto: a la derecha el chongo de
                  Lumina (tinta sobre tinta) la escondía. */}
              <Sparkle
                aria-hidden
                className="float-y absolute -top-5 left-5 h-9 w-9 fill-lime text-lime-deep sm:left-7"
              />

              {/* Píldora flotante: el paquete principal y los medios de pago. */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3 rounded-full bg-ink py-2 pl-2 pr-2 text-white shadow-pop sm:bottom-5 sm:left-5 sm:right-5 lg:right-auto">
                <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-full bg-lime text-ink">
                  <Rocket className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1 pr-1">
                  <span className="block truncate text-xs font-semibold text-white/65">{featuredName}</span>
                  <span className="block text-lg font-bold leading-tight tabular-nums text-lime">
                    {formatMoney(FEATURED_PLAN.price, "MXN")} MXN
                  </span>
                </span>
                <span aria-hidden className="flex shrink-0 -space-x-2.5">
                  <span className="grid size-10 place-items-center rounded-full bg-white ring-[3px] ring-ink">
                    <SiStripe className="h-4 w-4 text-[#635BFF]" />
                  </span>
                  <span className="grid size-10 place-items-center rounded-full bg-white ring-[3px] ring-ink">
                    <SiMercadopago className="h-5 w-5 text-[#00B1EA]" />
                  </span>
                  <span className="grid size-10 place-items-center rounded-full bg-lime text-ink ring-[3px] ring-ink">
                    <Building2 className="h-4 w-4" />
                  </span>
                </span>
              </div>
            </div>
          </div>
        </section>

        <Configurator hideHeading />
      </main>

      <SiteFooter />
      <LuminaChat />
    </>
  );
}
