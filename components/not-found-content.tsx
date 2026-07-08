"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Compass } from "lucide-react";

import { Button } from "@/components/ui/button";

const REDIRECT_SECONDS = 5;

export function NotFoundContent() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
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
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background bg-grain px-6 text-center">
      <div className="pointer-events-none absolute inset-auto top-1/2 z-0 h-72 w-72 -translate-y-1/2 rounded-full bg-primary/20 opacity-70 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        <motion.div
          animate={prefersReducedMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 10, ease: "linear", repeat: Infinity }}
          className="flex h-20 w-20 items-center justify-center rounded-full border border-primary/40 bg-primary/10"
          aria-hidden="true"
        >
          <Compass className="h-10 w-10 text-primary" />
        </motion.div>

        <span className="font-mono text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Error 404
        </span>

        <h1 className="font-display text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
          ¿Te <span className="text-primary">perdiste?</span>
        </h1>

        <p className="max-w-md text-balance text-base text-muted-foreground md:text-lg">
          Esta página no existe o cambió de lugar. Tranquilo, nos pasa hasta a
          nosotros — te regresamos al inicio en unos segundos.
        </p>

        <div className="flex flex-col items-center gap-3">
          <Button asChild size="lg">
            <Link href="/">Volver al inicio ahora</Link>
          </Button>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-1 w-32 overflow-hidden rounded-full bg-border">
              <motion.div
                className="h-full bg-primary"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "linear" }}
              />
            </div>
            <span aria-live="polite">Redirigiendo en {secondsLeft}s</span>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
