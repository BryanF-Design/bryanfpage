"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/context";
import { cardLoader, thumbLoader } from "@/lib/image-loaders";

/** Abre a Lumina; con mensaje, lo manda al instante (lo escucha lumina-chat). */
function askLumina(message?: string) {
  window.dispatchEvent(new CustomEvent("lumina:open", { detail: { message } }));
}

/**
 * Diagonal Lumina: fondo verde oscuro con corte inclinado (clip-path, más
 * suave en móvil). Titular, una línea, el botón y tres preguntas tocables
 * que abren el chat; Lumina contesta y lleva a la sección que responde.
 */
export function LuminaDiagonal() {
  const { t } = useLanguage();
  const l = t.homeV2.lumina;
  return (
    <section id="lumina" aria-labelledby="lumina-title" className="diagonal diagonal--ink full-bleed relative">
      <div className="mx-auto grid max-w-[1320px] items-center gap-10 py-28 md:grid-cols-[minmax(0,1fr)_auto] md:py-36">
        <div className="reveal reveal-left max-w-2xl">
          <h2 id="lumina-title" className="section-title text-[hsl(var(--canvas))]">{l.title}</h2>
          <p className="mt-4 text-lg text-white/75">{l.line}</p>
          <div className="mt-8 flex flex-wrap gap-2.5">
            {l.chips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => askLumina(chip)}
                data-track-cta={`lumina_chip`}
                className="lift min-h-11 rounded-full px-4 text-left text-[0.9375rem] text-white ring-1 ring-white/25 transition-colors hover:bg-white hover:text-ink"
              >
                {chip}
              </button>
            ))}
          </div>
          <Button
            variant="lime"
            size="lg"
            className="mt-8 h-14 px-7 text-base"
            onClick={() => askLumina()}
            data-track-cta="lumina_preguntale"
          >
            {l.cta}
          </Button>
        </div>
        <div aria-hidden className="reveal reveal-right relative mx-auto hidden size-56 overflow-hidden rounded-full bg-forest md:block lg:size-64">
          <Image
            src="/img/lumina/v2/face/normal.webp"
            alt=""
            fill
            loader={thumbLoader}
            sizes="16rem"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

/**
 * Diagonal Nosotros: de vuelta al crema, con foto de Bryan. Titular, una
 * línea y el botón a /conoceme (la historia completa vive ahí).
 */
export function AboutDiagonal() {
  const { t } = useLanguage();
  const a = t.homeV2.about;
  return (
    <section id="nosotros" aria-labelledby="nosotros-title" className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
      <div className="reveal reveal-left relative aspect-[16/11] overflow-hidden rounded-card bg-white">
        <Image
          src="/img/me/about-photo.png"
          alt={a.photoAlt}
          fill
          loader={cardLoader}
          sizes="(min-width: 768px) 46vw, 92vw"
          className="zoom-img object-cover"
        />
      </div>
      <div className="reveal reveal-right max-w-xl">
        <h2 id="nosotros-title" className="section-title">{a.title}</h2>
        <p className="mt-4 text-lg text-ink/70">{a.line}</p>
        <Button asChild size="lg" variant="ink" className="mt-8 h-14 px-7 text-base">
          <Link href="/conoceme">{a.cta}</Link>
        </Button>
      </div>
    </section>
  );
}
