"use client";

import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

export interface MotionAccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
}

/**
 * Prompt 9 · Acordeón con Motion: una sola respuesta abierta a la vez, la
 * altura se abre con una transición suave y el "+" gira hasta volverse "−"
 * (la barra vertical rota 90° y se acuesta sobre la horizontal), un gesto
 * corto que vuelve al cerrar. Al pasar el cursor, la pregunta se marca en
 * lima sutil. Botones nativos con aria-expanded/aria-controls.
 */
export function MotionAccordion({
  items,
  defaultOpen,
  className,
}: {
  items: MotionAccordionItem[];
  defaultOpen?: string;
  className?: string;
}) {
  const [open, setOpen] = useState<string | null>(defaultOpen ?? null);
  const reduce = useReducedMotion();
  const base = useId();
  const spring = reduce ? { duration: 0 } : { type: "spring" as const, stiffness: 200, damping: 26, mass: 1 };

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      {items.map((item) => {
        const isOpen = open === item.id;
        const btnId = `${base}-b-${item.id}`;
        const panelId = `${base}-p-${item.id}`;
        return (
          <div
            key={item.id}
            data-state={isOpen ? "open" : "closed"}
            className="faq-row rounded-card bg-mint px-3.5 ring-1 ring-ink/[0.05] transition-colors duration-300 data-[state=open]:bg-lime data-[state=open]:ring-0 sm:px-5 lg:px-6"
          >
            <h3 className="flex">
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : item.id)}
                className="group/acc flex min-h-[4.5rem] flex-1 items-center justify-between gap-3 rounded-2xl py-3.5 text-left text-ink sm:gap-4 md:min-h-[5.25rem]"
              >
                <span className="flex flex-1 items-center gap-3 sm:gap-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-xs font-bold tabular-nums text-ink/75 ring-1 ring-ink/[0.06] transition-colors duration-300 group-aria-expanded/acc:bg-ink group-aria-expanded/acc:text-lime group-aria-expanded/acc:ring-0 md:size-11 md:text-sm">
                    {item.id.padStart(2, "0")}
                  </span>
                  <span className="faq-q display-title text-pretty text-[1.0625rem] leading-[1.15] tracking-[-0.02em] sm:text-[1.25rem] lg:text-[1.5rem]">
                    {item.title}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="relative grid size-10 shrink-0 place-items-center rounded-full bg-white text-ink shadow-[0_6px_16px_-10px_hsl(var(--ink)/0.5)] ring-1 ring-ink/[0.07] transition-colors duration-300 group-aria-expanded/acc:bg-ink group-aria-expanded/acc:text-lime md:size-11"
                >
                  <motion.span
                    className="absolute block h-[2.25px] w-[1.1rem] rounded-full bg-current"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={spring}
                  />
                  <motion.span
                    className="absolute block h-[1.1rem] w-[2.25px] rounded-full bg-current"
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={spring}
                  />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  key="panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={reduce ? { duration: 0 } : { height: spring, opacity: { duration: 0.2 } }}
                  className="overflow-hidden"
                >
                  <div className="pb-5 pl-12 pr-1 text-[0.9375rem] leading-relaxed text-ink/80 sm:pl-[3.25rem] md:pb-7 md:pl-[3.75rem] md:pr-16 md:text-base">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
