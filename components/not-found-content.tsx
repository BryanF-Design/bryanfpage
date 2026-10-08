"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, Pause, Sparkle } from "lucide-react";

import { Button, ButtonArrow } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/context";
import { useReducedMotionPreference } from "@/lib/motion-preference";
import { cn } from "@/lib/utils";

const REDIRECT_SECONDS = 10;
/** Interacciones que pausan la redirección (WCAG 2.2.1: tiempo ajustable). */
const PAUSE_EVENTS = ["keydown", "pointerdown", "touchstart", "wheel", "focusin"] as const;

/**
 * 404 en el lenguaje del sitio: marco blanco, panel lima con un "404"
 * enorme y Lumina sorprendida asomándose por encima del canto. La cuenta
 * regresiva devuelve al inicio a los diez segundos, pero se pausa en cuanto
 * el visitante hace algo (bajar, tocar, teclear) o pulsa "Quedarme aquí".
 */
export function NotFoundContent() {
  const router = useRouter();
  const { t } = useLanguage();
  const copy = t.notFound;
  const prefersReducedMotion = useReducedMotionPreference();
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const tick = window.setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    const redirect = window.setTimeout(() => {
      router.push("/");
    }, REDIRECT_SECONDS * 1000);

    // Cualquier gesto del visitante detiene la cuenta: quien baja a elegir
    // un atajo no debe salir disparado al inicio a medio gesto. El scroll
    // cuenta solo si es real (el salto al tope de una navegación no).
    const pause = () => setPaused(true);
    const onScroll = () => {
      if (window.scrollY > 24) pause();
    };
    PAUSE_EVENTS.forEach((type) => window.addEventListener(type, pause, { passive: true }));
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.clearInterval(tick);
      window.clearTimeout(redirect);
      PAUSE_EVENTS.forEach((type) => window.removeEventListener(type, pause));
      window.removeEventListener("scroll", onScroll);
    };
  }, [router, paused]);

  const progress = ((REDIRECT_SECONDS - secondsLeft) / REDIRECT_SECONDS) * 100;

  /** Atajos por si el visitante prefiere elegir antes de que corra la cuenta. */
  const shortcuts = [
    { label: t.nav.proyectos, href: "/#projects" },
    { label: t.nav.servicios, href: "/#servicios-entrada" },
    { label: t.nav.precios, href: "/#precios" },
    { label: t.nav.faq, href: "/#faq" },
  ];

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex min-h-[100dvh] flex-col p-[var(--gutter)]"
    >
      <div className="panel relative flex flex-1 flex-col gap-5 p-4 shadow-soft sm:p-6 lg:gap-8 lg:p-10">
        {/* Barra superior: la marca regresa al inicio. */}
        <div className="flex items-center justify-between gap-3">
          <Link href="/" aria-label={`BryanF Design — ${t.nav.inicio}`} className="flex shrink-0 items-center rounded-full">
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
            {copy.badge}
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
                {copy.titleLead}
              </span>{" "}
              <span className="display-xl block text-[clamp(4.25rem,10vw,9.5rem)] text-forest">
                {copy.titleWord}
              </span>
            </h1>

            <p className="max-w-md text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              {copy.body}
            </p>

            {/* En teléfono la fila se "disuelve" (contents) para ordenar:
                botón, atajos y, al final, la cuenta regresiva. */}
            <div className="contents sm:flex sm:w-auto sm:flex-row sm:items-center sm:gap-3">
              <Button asChild size="lg" variant="ink" className="order-1 w-full pr-2.5 sm:order-none sm:w-auto">
                <Link href="/">
                  {copy.homeNow}
                  <ButtonArrow tone="lime" className="ml-auto -mr-0.5 sm:ml-2" />
                </Link>
              </Button>
              <div className="order-3 flex h-12 max-w-full items-center gap-2.5 rounded-full bg-ink/[0.05] pl-3.5 pr-1.5 text-[0.8125rem] font-semibold text-ink/75 sm:order-none sm:gap-3 sm:pl-4 sm:text-sm">
                {paused ? (
                  <Pause aria-hidden className="h-4 w-4 shrink-0 fill-ink/60 text-ink/60" />
                ) : (
                  <div aria-hidden className="h-2 w-9 shrink-0 overflow-hidden rounded-full bg-ink/10 max-[379px]:hidden sm:w-20">
                    <motion.div
                      className="h-full rounded-full bg-lime-deep"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3, ease: "linear" }}
                    />
                  </div>
                )}
                <span aria-live="polite" className="min-w-0 truncate">
                  {paused ? copy.paused : copy.redirecting(secondsLeft)}
                </span>
                {/* Siempre montado (no pierde el foco del teclado): al pausar
                    se queda como confirmación redonda con palomita. */}
                <button
                  type="button"
                  onClick={() => setPaused(true)}
                  aria-pressed={paused}
                  aria-label={paused ? copy.stay : undefined}
                  className={cn(
                    "grid h-9 shrink-0 place-items-center rounded-full text-[0.8125rem] font-semibold transition-colors",
                    paused
                      ? "w-9 bg-ink text-lime"
                      : "bg-white px-3 text-ink shadow-[0_4px_14px_-8px_hsl(var(--ink)/0.45)] hover:bg-ink hover:text-white"
                  )}
                >
                  {paused ? <Check aria-hidden className="h-4 w-4" strokeWidth={2.5} /> : copy.stay}
                </button>
              </div>
            </div>

            <nav aria-label={copy.shortcutsAria} className="order-2 flex flex-col gap-3 sm:order-none lg:mt-4">
              <span className="text-sm font-semibold text-muted-foreground">{copy.shortcutsLabel}</span>
              <ul className="flex flex-wrap gap-2">
                {shortcuts.map((item) => (
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
