"use client";

import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";

const logos = [
  { src: "/img/clients/Cartoon_Network_2010_logo.svg", alt: "Cartoon Network" },
  { src: "/img/clients/Citibanamex_logo.svg", alt: "Citibanamex" },
  { src: "/img/clients/Warner_Bros_logo.svg", alt: "Warner Bros" },
  { src: "/img/clients/MillerKnoll_Logo_2021.svg", alt: "MillerKnoll" },
  { src: "/img/clients/herman-miller-1.svg", alt: "Herman Miller" },
  { src: "/img/clients/brand-ufc-svgrepo-com.svg", alt: "UFC" },
  { src: "/img/clients/hyundai-svgrepo-com.svg", alt: "Hyundai" },
  { src: "/img/clients/mercado-libre-svgrepo-com.svg", alt: "Mercado Libre" },
  { src: "/img/clients/logo-indusecc.png", alt: "Indusecc" },
  { src: "/img/clients/partum-design.png", alt: "Partum Design" },
];

/**
 * Marcas que han confiado. Retícula pareja, no marquee: cada logo recibe la
 * misma caja y se escala dentro (object-contain), así una insignia cuadrada y
 * un logotipo ancho se leen del mismo tamaño. Las fichas caen en cascada.
 */
export function ClientsMarquee() {
  const { t } = useLanguage();

  return (
    <section
      aria-label={t.clients.label}
      className="panel relative overflow-hidden px-4 pb-6 pt-20 md:px-8 md:pb-8 md:pt-24"
    >
      <div className="notch notch-tl">
        <span className="tag-pill">
          <span aria-hidden lang="ja" className="seal">
            信
          </span>
          {t.clients.label}
        </span>
      </div>
      <div aria-hidden className="dot-grid absolute inset-0 rounded-[inherit] opacity-20" />

      <div className="relative grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5 md:gap-3">
        {logos.map((logo, i) => (
          <div
            key={logo.alt}
            data-fx="drop"
            style={{ "--fx-delay": `${(i % 5) * 70 + Math.floor(i / 5) * 140}ms` } as CSSProperties}
            className="min-w-0"
          >
            <div
              className={cn(
                "group flex aspect-[3/2] items-center justify-center px-shape p-5 ring-1 ring-foreground/10 transition-[background-color,transform] duration-300 hover:-translate-y-1 md:p-6",
                i === 4 ? "bg-primary hover:bg-primary/90" : "bg-secondary hover:bg-moss"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.src}
                alt={logo.alt}
                className={cn(
                  "h-full max-h-14 w-full max-w-full object-contain transition-opacity duration-300 md:max-h-16",
                  i === 4
                    ? "opacity-80 [filter:brightness(0)] group-hover:opacity-100"
                    : "opacity-60 [filter:brightness(0)_invert(1)] group-hover:opacity-100"
                )}
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
