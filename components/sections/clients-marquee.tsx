import { cn } from "@/lib/utils";

// `square` logos (badges/marks close to a 1:1 aspect ratio) read visually
// smaller than wordmarks at the same height, so they get a taller box to
// even out their presence in the strip — capped so they don't outsize the
// wordmarks next to them.
const logos = [
  { src: "/img/clients/Cartoon_Network_2010_logo.svg", alt: "Cartoon Network" },
  { src: "/img/clients/Citibanamex_logo.svg", alt: "Citibanamex" },
  { src: "/img/clients/Warner_Bros_logo.svg", alt: "Warner Bros", square: true },
  { src: "/img/clients/MillerKnoll_Logo_2021.svg", alt: "MillerKnoll" },
  { src: "/img/clients/herman-miller-1.svg", alt: "Herman Miller", square: true },
  { src: "/img/clients/brand-ufc-svgrepo-com.svg", alt: "UFC", square: true },
  { src: "/img/clients/hyundai-svgrepo-com.svg", alt: "Hyundai", square: true },
  { src: "/img/clients/mercado-libre-svgrepo-com.svg", alt: "Mercado Libre", square: true },
  { src: "/img/clients/logo-indusecc.png", alt: "Indusecc" },
  { src: "/img/clients/partum-design.png", alt: "Partum Design" },
];

export function ClientsMarquee() {
  return (
    <section
      aria-label="Marcas que han confiado"
      className="relative overflow-hidden border-t border-border py-16"
    >
      <div className="container">
        <p className="mb-10 text-center text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
          Marcas que han confiado
        </p>
      </div>
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_8%,white_92%,transparent)]">
        <div className="flex w-max animate-marquee items-center gap-16 pr-16">
          {[...logos, ...logos].map((logo, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={logo.src}
              alt={logo.alt}
              className={cn(
                "w-auto shrink-0 opacity-60 transition-opacity duration-300 hover:opacity-100 [filter:brightness(0)_invert(1)]",
                logo.square ? "h-11 md:h-14" : "h-9 md:h-11"
              )}
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
