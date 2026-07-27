"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import {
  SiCss,
  SiFigma,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiNextdotjs,
  SiNodedotjs,
  SiPhp,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiWordpress,
} from "react-icons/si";

import { SectionHeading } from "@/components/sections/section-heading";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/context";
import { useReducedMotionPreference } from "@/lib/motion-preference";

const stack: { Icon: IconType; label: string }[] = [
  { Icon: SiNextdotjs, label: "Next.js" },
  { Icon: SiReact, label: "React" },
  { Icon: SiTypescript, label: "TypeScript" },
  { Icon: SiJavascript, label: "JavaScript" },
  { Icon: SiTailwindcss, label: "Tailwind CSS" },
  { Icon: SiHtml5, label: "HTML5" },
  { Icon: SiCss, label: "CSS3" },
  { Icon: SiNodedotjs, label: "Node.js" },
  { Icon: SiWordpress, label: "WordPress" },
  { Icon: SiPhp, label: "PHP" },
  { Icon: SiFigma, label: "Figma" },
  { Icon: SiVercel, label: "Vercel" },
  { Icon: SiGit, label: "Git" },
  { Icon: SiGithub, label: "GitHub" },
];

export function StackOrbit() {
  const { t } = useLanguage();
  const reducedMotion = useReducedMotionPreference();

  return (
    <section
      id="stack"
      aria-label={t.stack.title}
      className="relative overflow-hidden border-t border-border py-20 md:py-28"
    >
      <div
        aria-hidden
        className="route-grid pointer-events-none absolute inset-0 opacity-25"
      />

      <div className="container relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <SectionHeading
              eyebrow={t.stack.eyebrow}
              title={t.stack.title}
              subtitle={t.stack.subtitle}
            />

            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Button asChild>
                <Link href="#projects">{t.stack.ctaPrimary}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link
                  href="https://wa.me/525663012505"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.stack.ctaSecondary}
                </Link>
              </Button>
            </div>
          </div>

          <div className="editorial-panel overflow-hidden lg:col-span-8">
            <div className="flex items-center justify-between border-b border-border px-5 py-4 md:px-7">
              <span className="tech-label text-primary">{t.stack.eyebrow}</span>
              <span
                aria-hidden
                className="h-2 w-2 bg-[#E8342A] shadow-[0_0_18px_rgba(232,52,42,0.45)]"
              />
            </div>

            <ul className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">
              {stack.map(({ Icon, label }, index) => (
                <motion.li
                  key={label}
                  initial={reducedMotion ? false : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: reducedMotion ? 0 : 0.38,
                    delay: reducedMotion ? 0 : (index % 7) * 0.035,
                    ease: [0.2, 0, 0, 1],
                  }}
                  className="group relative min-h-32 border-b border-r border-border bg-background/20 p-4 transition-colors duration-200 hover:bg-primary/[0.045] sm:min-h-36 md:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Icon
                      aria-hidden="true"
                      className="h-6 w-6 text-foreground/65 transition-colors duration-200 group-hover:text-primary md:h-7 md:w-7"
                    />
                  </div>
                  <p className="absolute bottom-4 left-4 right-4 font-display text-sm font-semibold text-foreground md:bottom-5 md:left-5 md:right-5 md:text-base">
                    {label}
                  </p>
                  <span
                    aria-hidden
                    className="absolute bottom-0 left-0 h-px w-0 bg-primary transition-[width] duration-300 group-hover:w-full"
                  />
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
