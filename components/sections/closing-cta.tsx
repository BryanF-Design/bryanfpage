"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/context";

const WHATSAPP = "https://wa.me/525663012505";

/**
 * 結 — el cierre.
 *
 * Un panel lima a sangre, como el bloque de color pleno de la referencia:
 * rótulo de tinta enorme, las dos acciones y el kanji de arranque ocupando
 * la esquina. Los tokens del panel se invierten solos (ver `.panel-lime`),
 * así que el botón principal pasa a tinta con texto lima sin tocarlo.
 */
export function ClosingCta() {
  const { t } = useLanguage();

  return (
    <section aria-label={t.closingCta.title} data-fx="panel">
      <div className="panel panel-lime relative overflow-hidden px-6 pb-8 pt-12 sm:px-10 md:px-14 md:pb-12 md:pt-16 lg:px-16">
        <span
          aria-hidden
          lang="ja"
          className="drift-y pointer-events-none absolute -right-6 -top-10 select-none font-jp text-[14rem] leading-none text-[hsl(150_42%_6%/0.08)] md:text-[22rem]"
        >
          始動
        </span>
        <div aria-hidden className="absolute inset-0 rounded-[inherit] opacity-50 [background-image:radial-gradient(circle,hsl(150_42%_6%/0.12)_1px,transparent_1.2px)] [background-size:16px_16px] [mask-image:linear-gradient(120deg,transparent_30%,black)]" />

        <div className="relative grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div data-fx="up" className="lg:col-span-8">
            <h2 className="display-xl max-w-5xl text-balance text-[clamp(3.2rem,8.5vw,8.5rem)] text-foreground">
              {t.closingCta.title}
            </h2>
          </div>

          <div data-fx="right" className="lg:col-span-4" style={{ "--fx-delay": "140ms" } as CSSProperties}>
            <p className="max-w-xl text-base leading-relaxed text-foreground/80 md:text-lg">
              {t.closingCta.subtitle}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="#precios">
                  {t.closingCta.ctaPrimary}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full border-foreground/40 sm:w-auto"
              >
                <Link href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                  <FaWhatsapp className="h-4 w-4" />
                  {t.closingCta.ctaSecondary}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div aria-hidden className="relative mt-12 flex items-center gap-3 md:mt-16">
          <span className="size-3 shrink-0 rounded-full bg-signal" />
          <span className="h-[2px] flex-1 rounded-full bg-foreground/80" />
          <span className="font-mono text-[10px] uppercase tracking-[0.24em]">
            <span lang="ja" className="font-jp">
              結
            </span>{" "}
            · BryanF Design
          </span>
        </div>
      </div>
    </section>
  );
}
