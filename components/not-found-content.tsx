"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LazyMount } from "@/components/three/lazy-mount";
import { SiteHeader } from "@/components/sections/site-header";
import { SiteFooter } from "@/components/sections/site-footer";
import { useLanguage } from "@/lib/i18n/context";

const FloatingShape = dynamic(
  () => import("@/components/three/floating-shape").then((m) => m.FloatingShape),
  { ssr: false }
);

const REDIRECT_SECONDS = 8;
const WHATSAPP_URL = "https://wa.me/525663012505";

export function NotFoundContent() {
  const { t } = useLanguage();
  const router = useRouter();
  const reduced = useReducedMotion();
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);
  const [autoRedirect, setAutoRedirect] = useState(true);

  useEffect(() => {
    if (!autoRedirect) return;
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
  }, [autoRedirect, router]);

  const progress = ((REDIRECT_SECONDS - secondsLeft) / REDIRECT_SECONDS) * 100;
  const nf = t.notFound;

  const quickLinks = [
    { label: nf.linkHome, href: "/" },
    { label: nf.linkProjects, href: "/#projects" },
    { label: nf.linkPricing, href: "/#precios" },
    { label: nf.linkFaq, href: "/#faq" },
  ];

  return (
    <>
      <SiteHeader />
      <main className="relative overflow-hidden bg-background bg-grain">
        <div aria-hidden className="bg-blueprint absolute inset-0 opacity-60" />
        <div aria-hidden className="mesh-glow-a absolute inset-0" />

        {/* 404 gigante en capa profunda — el mismo lenguaje visual del
            nombre de Lumina en el home. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center"
        >
          <span className="text-stroke-lime font-display text-[42vw] font-bold leading-none opacity-[0.14] md:text-[24vw]">
            404
          </span>
        </div>

        <div className="container relative z-10 flex flex-col items-center gap-10 px-6 pb-20 pt-32 text-center md:pt-40">
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
            className="tech-label inline-flex items-center gap-3 text-primary"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            {nf.errorLabel} · {nf.liveLabel}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.2, 0, 0, 1] }}
            className="max-w-3xl font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl xl:text-7xl"
          >
            {nf.title}{" "}
            <ScrambleText
              text={nf.titleHighlight}
              className="text-primary drop-shadow-[0_0_24px_hsl(76_76%_54%/0.35)]"
            />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease: [0.2, 0, 0, 1] }}
            className="max-w-lg text-pretty text-base text-muted-foreground md:text-lg"
          >
            {nf.subtitle}
          </motion.p>

          {/* Pieza 3D interactiva: arrastrar cuenta como parte de la
              exploración, no solo decoración. */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.2, 0, 0, 1] }}
            className="corner-ticks relative h-56 w-56 sm:h-64 sm:w-64"
          >
            <LazyMount
              className="absolute inset-0"
              rootMargin="0px"
              fallback={<div className="absolute inset-8 animate-pulse rounded-full bg-secondary/40" />}
            >
              <FloatingShape variant="torusKnot" opacity={0.7} className="absolute inset-0" />
            </LazyMount>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="tech-label -mt-4 text-muted-foreground"
          >
            {nf.dragHint}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.26, ease: [0.2, 0, 0, 1] }}
            className="flex flex-col items-center gap-3 sm:flex-row"
          >
            <Button asChild size="lg">
              <Link href="/">{nf.ctaHome}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" />
                {nf.ctaWhatsapp}
              </Link>
            </Button>
          </motion.div>

          {/* Enlaces rápidos: la salida no es solo "al inicio", es a
              cualquier parte del sitio. */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32, ease: [0.2, 0, 0, 1] }}
            className="flex flex-col items-center gap-3"
          >
            <span className="tech-label text-muted-foreground">{nf.quickLinksLabel}</span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="elevate group inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs text-foreground transition-colors hover:border-primary hover:text-primary md:text-sm"
                >
                  {link.label}
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-2 flex min-h-[2rem] items-center gap-3 text-xs text-muted-foreground"
          >
            {autoRedirect ? (
              <>
                <div className="h-1 w-28 overflow-hidden rounded-full bg-border">
                  <motion.div
                    className="h-full bg-primary"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3, ease: "linear" }}
                  />
                </div>
                <span aria-live="polite">{nf.redirecting(secondsLeft)}</span>
                <button
                  type="button"
                  onClick={() => setAutoRedirect(false)}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  {nf.stay}
                </button>
              </>
            ) : (
              <span aria-live="polite">{nf.cancelled}</span>
            )}
          </motion.div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#$%01";

/**
 * Efecto "decodificando": el texto entra revuelto y se resuelve letra por
 * letra, como una señal que se sintoniza — coherente con el "404: señal
 * perdida" de la página. Longitud fija durante toda la animación (mismos
 * caracteres, sin espacios), así que no hay salto de layout.
 */
function ScrambleText({ text, className }: { text: string; className?: string }) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState("");

  useEffect(() => {
    if (reduced) {
      setDisplay(text);
      return;
    }
    let frame = 0;
    const totalFrames = text.length * 3;
    const id = window.setInterval(() => {
      frame++;
      const revealCount = Math.floor((frame / totalFrames) * text.length);
      setDisplay(
        text
          .split("")
          .map((c, i) => {
            if (c === " ") return " ";
            if (i < revealCount) return c;
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          })
          .join("")
      );
      if (revealCount >= text.length) {
        setDisplay(text);
        window.clearInterval(id);
      }
    }, 35);
    return () => window.clearInterval(id);
  }, [text, reduced]);

  return <span className={className}>{display}</span>;
}
