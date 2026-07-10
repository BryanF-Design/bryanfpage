"use client";

import * as React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// La laptop 3D es clienteside puro y va en su propio chunk: el HTML del hero
// (h1, subtítulo, CTAs — lo que lee Google y pinta el LCP) no depende de ella.
const LaptopScene = dynamic(
  () => import("@/components/three/laptop-scene").then((m) => m.LaptopScene),
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
        <div ref={wrapperRef} className="relative h-[185svh]">
          <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden bg-background">
            <div aria-hidden className="bg-blueprint absolute inset-0" />
            <div aria-hidden className="mesh-glow-a absolute inset-0" />

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
                  <div className={cn("mt-2 flex flex-wrap items-center gap-3", actionsClassName)}>
                    {actions.map((action, index) => (
                      <Button key={index} size="lg" variant={action.variant || "default"} asChild>
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

            {/* Pie técnico del hero */}
            <div className="relative z-10 border-t border-border">
              <div className="container flex items-center justify-between py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                <span>19.4326° N — 99.1332° O · CDMX</span>
                <span className="hidden sm:block">MX · ES · FR</span>
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
