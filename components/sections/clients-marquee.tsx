"use client";

import { motion } from "framer-motion";

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
        <p className="tech-label mb-10 text-center text-muted-foreground">
          {t.clients.label}
        </p>

        {/* Even grid, not a marquee — every logo gets the same box and scales
            to fit it (object-contain), so a square badge and a wide wordmark
            read as the same visual size instead of fighting for height. */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4">
          {logos.map((logo, i) => (
            <motion.div
              key={logo.alt}
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (i % 5) * 0.06, ease: [0.2, 0, 0, 1] }}
              className="elevate glass flex aspect-[3/2] items-center justify-center rounded-lg p-4 md:p-5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-full max-h-14 w-full max-w-full object-contain opacity-60 transition-opacity duration-300 hover:opacity-100 [filter:brightness(0)_invert(1)] md:max-h-16"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
