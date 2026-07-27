"use client";

import * as React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { WebCorner } from "@/components/ui/web-corner";
import { VerticalLabel } from "@/components/ui/vertical-label";

// La laptop 3D es clienteside puro y va en su propio chunk: el HTML del hero
// (h1, subtítulo, CTAs — lo que lee Google y pinta el LCP) no depende de ella.
const LaptopScene = dynamic(
  () => import("@/components/three/laptop-scene").then((m) => m.LaptopScene),
  { ssr: false }
);
// Terreno de partículas al fondo del hero: mismo chunk diferido, cero SSR.
const ParticleField = dynamic(
  () => import("@/components/three/particle-field").then((m) => m.ParticleField),
  { ssr: false }
);

interface HeroAction {
  label: string;
  href: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
}

interface HeroProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  eyebrow?: React.ReactNode;
  actions?: HeroAction[];
  /** Pista mono junto a la laptop ("Desliza para abrirla"). */
  scrollHint?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  actionsClassName?: string;
}

/**
 * Hero "obra en vivo": composición asimétrica sobre retícula de taller.
 * A la izquierda el titular expandido; a la derecha una laptop 3D que se
 * abre conforme bajas — la sección mide más de una pantalla y el contenido
 * queda pegado (sticky) mientras dura la apertura.
 */
const Hero = React.forwardRef<HTMLElement, HeroProps>(
  (
    {
      className,
      title,
      subtitle,
      eyebrow,
      actions,
      scrollHint,
      titleClassName,
      subtitleClassName,
      actionsClassName,
      ...props
    },
    ref
  ) => {
    const wrapperRef = React.useRef<HTMLDivElement>(null);
    const progressRef = React.useRef(0);

    // Progreso de scroll del hero (0 = arriba, 1 = tapa abierta). Se escribe
    // en un ref — la escena 3D lo lee en su propio RAF, sin re-renders React.
    React.useEffect(() => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      let raf = 0;
      const update = () => {
        raf = 0;
        const range = wrapper.offsetHeight - window.innerHeight;
        if (range <= 0) {
          progressRef.current = 1;
          return;
        }
        const y = -wrapper.getBoundingClientRect().top;
        progressRef.current = Math.min(1, Math.max(0, (y / range) * 1.35));
      };
      const onScroll = () => {
        if (!raf) raf = requestAnimationFrame(update);
      };
      update();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        if (raf) cancelAnimationFrame(raf);
      };
    }, []);

    return (
      <section
        ref={ref}
        className={cn("relative z-0 w-full", className)}
        {...props}
      >
        <div ref={wrapperRef} className="relative h-[165svh] md:h-[185svh]">
          <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden bg-background">
            <div aria-hidden className="bg-blueprint absolute inset-0" />
            <div aria-hidden className="mesh-glow-a absolute inset-0" />
            {/* Capa de autor: la tela anclada arriba a la derecha y la
                columna vertical al margen. Ambas por debajo del contenido. */}
            <WebCorner corner="tr" size={190} opacity={0.2} className="z-[1]" />
            <VerticalLabel
              jp="速さと精度"
              romaji="hayasa to seido"
              tone="primary"
              className="right-4 top-1/2 z-[1] hidden -translate-y-1/2 xl:flex"
            />
            {/* Terreno de partículas vivo: ondula solo, se levanta bajo el
                puntero y se hunde hacia el horizonte conforme bajas. */}
            <ParticleField
              progressRef={progressRef}
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[62svh] md:h-[70svh] [mask-image:linear-gradient(to_bottom,transparent,black_42%)]"
            />

            <div className="container relative z-10 flex flex-1 flex-col justify-center gap-10 pb-10 pt-28 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-6">
              {/* Copy */}
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ ease: [0.2, 0, 0, 1], delay: 0.15, duration: 0.8 }}
                className="flex flex-col items-start gap-6"
              >
                {eyebrow && (
                  <span className="tech-label inline-flex items-center gap-3 text-muted-foreground">
                    <span className="h-1.5 w-1.5 bg-primary" />
                    {eyebrow}
                  </span>
                )}
                <h1
                  className={cn(
                    "font-display text-[13vw] font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl md:text-7xl xl:text-[5.4rem]",
                    titleClassName
                  )}
                >
                  {title}
                </h1>
                {subtitle && (
                  <p
                    className={cn(
                      "max-w-xl text-pretty text-base text-muted-foreground md:text-lg",
                      subtitleClassName
                    )}
                  >
                    {subtitle}
                  </p>
                )}
                {actions && actions.length > 0 && (
                  <div
                    className={cn(
                      "mt-2 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center",
                      actionsClassName
                    )}
                  >
                    {actions.map((action, index) => (
                      <Button
                        key={index}
                        size="lg"
                        variant={action.variant || "default"}
                        asChild
                        className="w-full sm:w-auto"
                      >
                        <Link href={action.href}>{action.label}</Link>
                      </Button>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Laptop 3D */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.9 }}
                className="corner-ticks relative h-[34svh] min-h-[220px] w-full sm:h-[40svh] lg:h-[56svh] lg:min-h-[380px]"
              >
                <LaptopScene progressRef={progressRef} className="absolute inset-0" />
                {scrollHint && (
                  <span className="tech-label pointer-events-none absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap text-muted-foreground">
                    <ScrollArrow />
                    {scrollHint}
                  </span>
                )}
              </motion.div>
            </div>

            {/* Pie técnico del hero, ahora con telemetría viva */}
            <div className="relative z-10 border-t border-border">
              <div className="container flex items-center justify-between py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                <span>19.4326° N — 99.1332° O · CDMX</span>
                <GearReadout progressRef={progressRef} />
                <span className="text-primary">EST. 2020</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
);
Hero.displayName = "Hero";

/**
 * Telemetría del hero: la marcha sube conforme abres la laptop y la barra de
 * gases la acompaña. Lee el mismo ref de progreso que la escena 3D y escribe
 * directo al DOM en su propio rAF — ni un re-render de React por scroll.
 */
function GearReadout({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const gearRef = React.useRef<HTMLSpanElement>(null);
  const barRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    let raf = 0;
    let lastGear = -1;
    const loop = () => {
      const p = Math.min(1, Math.max(0, progressRef.current));
      const gear = Math.min(5, 1 + Math.floor(p * 5));
      if (gear !== lastGear && gearRef.current) {
        gearRef.current.textContent = String(gear);
        lastGear = gear;
      }
      if (barRef.current) barRef.current.style.transform = `scaleX(${p.toFixed(3)})`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [progressRef]);

  return (
    <span aria-hidden className="hidden items-center gap-3 sm:flex">
      <span className="text-muted-foreground/70">Gear</span>
      <span ref={gearRef} className="text-primary">
        1
      </span>
      <span className="relative block h-[3px] w-16 bg-border">
        <span
          ref={barRef}
          className="absolute inset-0 origin-left bg-primary"
          style={{ transform: "scaleX(0)" }}
        />
      </span>
    </span>
  );
}

function ScrollArrow() {
  return (
    <motion.span
      aria-hidden
      animate={{ y: [0, 5, 0] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      className="inline-block text-primary"
    >
      ↓
    </motion.span>
  );
}

export { Hero };
export type { HeroProps, HeroAction };
