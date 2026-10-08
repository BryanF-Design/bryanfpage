"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkle } from "lucide-react";

import { Button, ButtonArrow } from "@/components/ui/button";
import { useReducedMotionPreference } from "@/lib/motion-preference";

const REDIRECT_SECONDS = 5;

/** Atajos por si el visitante prefiere elegir antes de que corra la cuenta. */
const SHORTCUTS = [
  { label: "Proyectos", href: "/#projects" },
  { label: "Servicios", href: "/#servicios-entrada" },
  { label: "Precios", href: "/#precios" },
  { label: "Preguntas", href: "/#faq" },
];

/**
 * 404 en el lenguaje del sitio: marco blanco, panel lima con un "404"
 * enorme y Lumina sorprendida asomándose por encima del canto. La cuenta
 * regresiva devuelve al inicio a los cinco segundos.
 */
export function NotFoundContent() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotionPreference();
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    const tick = window.setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    const redirect = window.setTimeout(() => {
      router.push("/");
    }, REDIRECT_SECONDS * 1000);

    return () => {
      window.clearInterval(tick);
      window.clearTimeout(redirect);
    };
  }, [router]);

  const progress = ((REDIRECT_SECONDS - secondsLeft) / REDIRECT_SECONDS) * 100;

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex min-h-[100dvh] flex-col p-[var(--gutter)]"
    >
      <div className="panel relative flex flex-1 flex-col gap-5 p-4 shadow-soft sm:p-6 lg:gap-8 lg:p-10">
        {/* Barra superior: la marca regresa al inicio. */}
        <div className="flex items-center justify-between gap-3">
          <Link href="/" aria-label="BryanF Design — inicio" className="flex shrink-0 items-center rounded-full">
            <Image
              src="/img/brand/logo-dark.png"
              alt="BryanF Design"
              width={720}
              height={253}
              priority
              sizes="120px"
              className="h-7 w-auto md:h-8"
            />
          </Link>
          <span className="eyebrow pl-3">
            <span aria-hidden className="size-2 rounded-full bg-signal" />
            Error 404
          </span>
        </div>

        <div className="grid flex-1 gap-6 lg:grid-cols-12 lg:items-center lg:gap-10">
          {/* El 404 gigante arriba y, debajo, el panel lima del que sale
              Lumina sorprendida tapando apenas la base del cero. */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 22 }}
            className="relative flex flex-col items-center lg:order-2 lg:col-span-6"
            aria-hidden
          >
            <p className="display-xl relative select-none text-[clamp(8.5rem,40vw,10rem)] leading-[0.78] text-ink sm:text-[clamp(10rem,22vw,15rem)] lg:text-[clamp(12rem,17vw,16.5rem)]">
              404
              <Sparkle className="float-y absolute -right-9 top-0 h-8 w-8 fill-lime text-lime-deep sm:-right-12 sm:h-10 sm:w-10" />
            </p>
            <div className="relative mt-3 w-full sm:mt-4">
              <svg
                viewBox="0 0 400 140"
                className="float-y pointer-events-none absolute inset-x-0 top-[-4rem] z-[2] mx-auto w-[min(26rem,86%)] text-ink/30 sm:top-[-5.5rem]"
              >
                <ellipse
                  cx="200"
                  cy="70"
                  rx="190"
                  ry="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  transform="rotate(-9 200 70)"
                />
              </svg>
              <div className="panel-lime relative h-[14rem] overflow-hidden rounded-[calc(var(--r-panel)-0.5rem)] sm:h-[18rem] lg:h-[20rem]">
                <div className="dot-cluster absolute -left-2 -top-2 h-32 w-44 opacity-40 [--lime:160_30%_9%] [mask-image:radial-gradient(ellipse_at_0%_0%,black_10%,transparent_70%)]" />
                <Sparkle className="float-y absolute bottom-6 right-[9%] h-8 w-8 fill-ink text-ink sm:h-10 sm:w-10" />
                <Sparkle className="float-y absolute left-[12%] top-[46%] h-5 w-5 fill-white text-white [animation-delay:-2s]" />
              </div>
              {/* Fuera del recorte del panel para que la cabeza cruce el canto. */}
              <Image
                src="/img/brand/lumina-sorprendida.webp"
                alt=""
                width={900}
                height={1040}
                priority
                sizes="(min-width: 1024px) 22rem, 16rem"
                className="pointer-events-none absolute bottom-0 left-1/2 z-[1] h-[calc(100%+3.25rem)] w-auto max-w-none -translate-x-1/2 sm:h-[calc(100%+4.5rem)] lg:h-[calc(100%+5rem)]"
              />
            </div>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: prefersReducedMotion ? 0 : 0.08 }}
            className="relative flex flex-col items-start gap-5 lg:order-1 lg:col-span-6 lg:gap-6"
          >
            <h1 className="text-ink">
              <span className="display-italic block text-[clamp(2.25rem,4.4vw,4.25rem)] leading-none">
                ¿Te
              </span>{" "}
              <span className="display-xl block text-[clamp(4.25rem,10vw,9.5rem)] text-forest">
                perdiste?
              </span>
            </h1>

            <p className="max-w-md text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              Esta página no existe o cambió de lugar. Tranquilo, nos pasa hasta a
              nosotros — te regresamos al inicio en unos segundos.
            </p>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <Button asChild size="lg" variant="ink" className="pr-2.5">
                <Link href="/">
                  Volver al inicio ahora
                  <ButtonArrow tone="lime" className="ml-auto -mr-0.5 sm:ml-2" />
                </Link>
              </Button>
              <div className="flex h-12 items-center gap-3 self-start rounded-full bg-ink/[0.05] px-4 text-sm font-semibold text-ink/75 sm:self-auto">
                <div className="h-2 w-24 overflow-hidden rounded-full bg-ink/10">
                  <motion.div
                    className="h-full rounded-full bg-lime-deep"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3, ease: "linear" }}
                  />
                </div>
                <span aria-live="polite">Redirigiendo en {secondsLeft}s</span>
              </div>
            </div>

            <nav aria-label="Atajos" className="mt-1 flex flex-col gap-3 lg:mt-4">
              <span className="text-sm font-semibold text-muted-foreground">O ve directo a:</span>
              <ul className="flex flex-wrap gap-2">
                {SHORTCUTS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group inline-flex h-11 items-center gap-1.5 rounded-full border border-ink/15 pl-4 pr-3 text-sm font-semibold text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
                    >
                      {item.label}
                      <ArrowUpRight
                        aria-hidden
                        className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
