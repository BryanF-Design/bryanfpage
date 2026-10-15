"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, MessageCircle, Sparkle } from "lucide-react";

import { Button, ButtonArrow } from "@/components/ui/button";
import { SUBSCRIPTION_PLAN } from "@/lib/catalog";
import { formatMoney } from "@/lib/currency";
import { useLanguage } from "@/lib/i18n/context";

/**
 * Puertas de la home a las subpáginas. La home quedó corta (quién soy, mi
 * trabajo, cotización y dudas) y lo demás vive en su propia página: la
 * suscripción mensual, la historia de Bryan y todo lo que hace Lumina.
 */
export function HomeTeasers() {
  const { t } = useLanguage();
  const copy = t.homeTeasers;

  return (
    <section aria-label={t.nav.suscripcion} className="grid gap-gutter lg:grid-cols-12">
      {/* Suscripción: la tarjeta grande, en lima. */}
      <div data-fx="up" className="min-w-0 lg:col-span-6 lg:row-span-2">
        <div className="panel panel-lime relative flex h-full flex-col gap-6 overflow-hidden p-5 sm:p-8 lg:p-10">
          <span className="eyebrow w-fit bg-white/60 pl-3">
            <Sparkle aria-hidden className="h-3.5 w-3.5 fill-ink text-ink" />
            {copy.subscriptionEyebrow}
          </span>
          <h2 className="display-title text-balance text-[clamp(2rem,4.2vw,3.4rem)] leading-[0.98] text-ink">
            {copy.subscriptionTitle}
          </h2>
          <p className="max-w-xl text-pretty text-[0.975rem] leading-relaxed text-ink/75 md:text-base">
            {copy.subscriptionBody}
          </p>
          <p className="flex items-baseline gap-2">
            <span className="display-xl text-[clamp(3rem,7vw,5.25rem)] leading-none tabular-nums text-ink">
              {formatMoney(SUBSCRIPTION_PLAN.price, "MXN")}
            </span>
            <span className="text-lg font-bold text-ink/70">MXN{copy.perMonth}</span>
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {copy.subscriptionItems.map((item) => (
              <li key={item} className="flex items-center gap-2.5 rounded-full bg-white/55 py-1.5 pl-1.5 pr-4 text-sm font-semibold text-ink">
                <span aria-hidden className="grid size-7 shrink-0 place-items-center rounded-full bg-ink text-lime">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <Button asChild size="lg" variant="ink" className="mt-auto w-full justify-between pl-6 pr-2.5 sm:w-fit">
            <Link href="/suscripcion">
              {copy.subscriptionCta}
              <ButtonArrow tone="lime" className="ml-4 -mr-0.5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Conoce a Bryan. */}
      <div data-fx="up" className="min-w-0 lg:col-span-6" style={{ "--fx-delay": "90ms" } as CSSProperties}>
        <Link
          href="/conoce-a-bryan"
          className="panel group grid h-full grid-cols-[minmax(0,1fr)_auto] items-center gap-5 p-5 shadow-soft transition-transform duration-300 hover:-translate-y-0.5 sm:p-7"
        >
          <span className="flex min-w-0 flex-col gap-3">
            <span className="eyebrow w-fit pl-3">
              <span aria-hidden className="size-2 rounded-full bg-lime" />
              {copy.aboutEyebrow}
            </span>
            <span className="display-title text-balance text-[clamp(1.5rem,2.6vw,2.1rem)] leading-tight text-ink">
              {copy.aboutTitle}
            </span>
            <span className="text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">{copy.aboutBody}</span>
            <span className="mt-1 inline-flex items-center gap-2 text-sm font-bold text-ink">
              {copy.aboutCta}
              <ButtonArrow tone="ink" className="-mr-0 size-8" />
            </span>
          </span>
          <span className="relative hidden size-32 overflow-hidden rounded-full bg-lime ring-4 ring-mint sm:block lg:size-36">
            <Image
              src="/img/brand/bryan-cutout.webp"
              alt=""
              fill
              sizes="144px"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
          </span>
        </Link>
      </div>

      {/* Lumina. */}
      <div data-fx="up" className="min-w-0 lg:col-span-6" style={{ "--fx-delay": "180ms" } as CSSProperties}>
        <div className="panel panel-ink relative grid h-full grid-cols-[minmax(0,1fr)_auto] items-center gap-5 overflow-hidden p-5 sm:p-7">
          <div aria-hidden className="mesh-glow-a opacity-60" />
          <span className="relative flex min-w-0 flex-col gap-3">
            <span className="eyebrow w-fit pl-3">
              <span aria-hidden className="size-2 rounded-full bg-lime" />
              {copy.luminaEyebrow}
            </span>
            <span className="display-title text-balance text-[clamp(1.5rem,2.6vw,2.1rem)] leading-tight text-white">
              {copy.luminaTitle}
            </span>
            <span className="text-pretty text-[0.9375rem] leading-relaxed text-white/70">{copy.luminaBody}</span>
            <span className="mt-1 flex flex-wrap gap-2">
              <Button asChild size="sm" className="bg-lime pr-1.5 text-ink">
                <Link href="/lumina">
                  {copy.luminaCta}
                  <ButtonArrow tone="ink" className="-mr-0 size-7" />
                </Link>
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="border-white/25 text-white"
                onClick={() => window.dispatchEvent(new CustomEvent("lumina:open"))}
              >
                <MessageCircle aria-hidden className="h-4 w-4 text-lime" />
                {copy.luminaChat}
              </Button>
            </span>
          </span>
          <span className="relative hidden h-40 w-28 sm:block">
            <Image
              src="/img/brand/lumina-normal.webp"
              alt=""
              fill
              sizes="112px"
              className="float-y object-contain object-bottom"
            />
          </span>
        </div>
      </div>
    </section>
  );
}
