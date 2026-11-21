"use client";

import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { TrackedWhatsAppLink } from "@/components/analytics/tracked-whatsapp-link";
import { useLanguage } from "@/lib/i18n/context";
import { STUDIO_FACTS } from "@/lib/catalog";
import { heroLoader } from "@/lib/image-loaders";

/**
 * Hero de la home: qué vendo, cuánto cuesta y cómo escribirme, en una
 * pantalla que respira.
 *  - Titular enorme en Fraunces; la palabra clave en lima con un subrayado
 *    que crece (400 ms, única animación del texto).
 *  - Subtítulo de una línea, WhatsApp "Quiero mi página" + "Ver precios" y
 *    una sola línea de microcopy.
 *  - Foto de Bryan a la derecha (máx. 1600 px) con zoom lentísimo al entrar
 *    y un parallax de 8 px como máximo, solo con transform.
 * El titular espera a que Fraunces cargue (o 1 s como mucho) para no
 * aparecer con la fuente cambiando a la mitad (`html.fonts-pending`).
 */
export function HeroPop() {
  const { t } = useLanguage();
  const h = t.homeV2.hero;
  const whatsapp = `https://wa.me/${STUDIO_FACTS.whatsapp}?text=${encodeURIComponent(h.whatsappMsg)}`;

  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative grid items-center gap-10 pt-6 md:pt-10 lg:min-h-[calc(100svh-var(--header-h)-2rem)] lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:gap-12"
    >
      <div className="relative z-[1] flex min-w-0 flex-col items-start">
        <p className="inline-flex items-center gap-2 text-sm font-medium text-ink/70">
          <span aria-hidden className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-lime motion-reduce:animate-none" />
            <span className="relative size-2 rounded-full bg-lime-deep" />
          </span>
          {h.badge}
        </p>

        <h1 id="hero-title" className="hero-title mt-6 text-ink">
          <span className="block">
            {h.titleA}{" "}
            <span className="hero-keyword">
              {h.titleWord}
              <span aria-hidden className="hero-underline" />
            </span>
            .
          </span>
          <span className="block whitespace-nowrap">{h.price}</span>
        </h1>
        {/* Quita html.fonts-pending en cuanto Fraunces está lista (lo pone el
            arranque del layout, con 1 s de tope). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=document.documentElement;var done=function(){d.classList.remove("fonts-pending")};var f=getComputedStyle(d).getPropertyValue("--font-display").split(",")[0].trim();if(!f||!document.fonts){done();return}document.fonts.load("600 1em "+f).then(done,done)}catch(e){document.documentElement.classList.remove("fonts-pending")}})();`,
          }}
        />

        <p className="mt-6 max-w-[34rem] text-lg text-ink/70 md:text-xl">{h.subtitle}</p>

        <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button asChild size="lg" variant="lime" className="lift h-14 gap-2.5 px-7 text-base">
            <TrackedWhatsAppLink href={whatsapp} service="hero_quiero_mi_pagina">
              <FaWhatsapp aria-hidden className="h-5 w-5" />
              {h.ctaWhatsapp}
            </TrackedWhatsAppLink>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-14 px-7 text-base">
            <Link href="#precios" data-track-cta="hero_ver_precios">
              {h.ctaPrices}
            </Link>
          </Button>
        </div>

        <p className="mt-7 text-sm text-ink/60">{h.micro.join(" · ")}</p>
      </div>

      <div className="hero-photo relative mx-auto aspect-[704/1184] w-[min(72vw,22rem)] lg:w-full lg:max-w-[26rem]">
        <span aria-hidden className="absolute inset-x-0 bottom-0 top-[18%] rounded-t-full bg-forest" />
        <div className="hero-photo-img absolute inset-0 overflow-hidden rounded-b-[28px]">
          <Image
            src="/img/brand/bryan-hero.webp"
            alt={h.photoAlt}
            fill
            priority
            loader={heroLoader}
            sizes="(min-width: 1024px) 30rem, 72vw"
            className="object-cover object-top"
          />
        </div>
      </div>
    </section>
  );
}
