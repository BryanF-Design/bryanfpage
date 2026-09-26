"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Compass } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useReducedMotionPreference } from "@/lib/motion-preference";

const REDIRECT_SECONDS = 5;

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
      className="flex min-h-screen flex-col p-[var(--gutter)]"
    >
      <div className="panel panel-moss relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-16 text-center">
        <div
          aria-hidden
          className="hinomaru-dots left-1/2 top-1/2 aspect-square w-[min(90vw,40rem)] -translate-x-1/2 -translate-y-1/2 opacity-30"
        />
        <span
          aria-hidden
          className="ghost-word absolute bottom-[-0.1em] left-1/2 -translate-x-1/2 text-[42vw] md:text-[30vw]"
        >
          404
        </span>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative z-10 flex flex-col items-center gap-6"
        >
          <motion.div
            animate={prefersReducedMotion ? undefined : { rotate: 360 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground"
            aria-hidden="true"
          >
            <Compass className="h-10 w-10" />
          </motion.div>

          <span className="tag-pill pl-4">Error 404</span>

          <h1 className="display-xl text-[clamp(4rem,14vw,10rem)] text-foreground">
            ¿Te <span className="text-primary">perdiste?</span>
          </h1>

          <p className="max-w-md text-balance text-base text-foreground/75 md:text-lg">
            Esta página no existe o cambió de lugar. Tranquilo, nos pasa hasta a
            nosotros — te regresamos al inicio en unos segundos.
          </p>

          <div className="flex flex-col items-center gap-3">
            <Button asChild size="lg">
              <Link href="/">Volver al inicio ahora</Link>
            </Button>
            <div className="flex items-center gap-3 rounded-full bg-background/60 px-4 py-2 text-xs text-foreground/75">
              <div className="h-1.5 w-32 overflow-hidden rounded-full bg-foreground/10">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: "linear" }}
                />
              </div>
              <span aria-live="polite">Redirigiendo en {secondsLeft}s</span>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
