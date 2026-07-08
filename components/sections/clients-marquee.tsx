"use client";

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

export function ClientsMarquee() {
  const { t } = useLanguage();

  return (
    <section
      aria-label={t.clients.label}
      className="relative overflow-hidden border-t border-border py-16"
    >
      <div className="container relative">
        <p className="mb-10 text-center text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
          {t.clients.label}
        </p>

        {/* Even grid, not a marquee — every logo gets the same box and scales
            to fit it (object-contain), so a square badge and a wide wordmark
            read as the same visual size instead of fighting for height. */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {logos.map((logo) => (
            <div
              key={logo.alt}
              className="elevate glass flex aspect-[3/2] items-center justify-center rounded-xl p-4 md:p-5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-full max-h-14 w-full max-w-full object-contain opacity-60 transition-opacity duration-300 hover:opacity-100 [filter:brightness(0)_invert(1)] md:max-h-16"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
