"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { useReducedMotionPreference } from "@/lib/motion-preference";

interface DisclosureProps {
  /** Etiqueta cuando está cerrado. */
  label: string;
  /** Etiqueta cuando está abierto. Si falta, se reusa `label`. */
  labelOpen?: string;
  children: React.ReactNode;
  /** Abre el bloque desde el primer render (usar con cuenta: la página se
   *  condensó justamente para no llegar saturada). */
  defaultOpen?: boolean;
  /** Estira el disparador a todo el ancho con la etiqueta a la izquierda. */
  block?: boolean;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

let uid = 0;

/**
 * 開閉 — bloque plegable.
 *
 * La página larga se condensó dejando visible sólo lo que hay que leer sí o
 * sí; todo lo demás vive aquí dentro y sólo aparece si alguien lo pide. Es un
 * `<button aria-expanded>` + región etiquetada, no un `<details>`, porque
 * necesitamos la misma animación material del resto del sitio y control sobre
 * el estado desde el componente padre.
 *
 * El contenido plegado no se renderiza: un scroll largo no se arregla si el
 * DOM sigue pesando lo mismo.
 */
export function Disclosure({
  label,
  labelOpen,
  children,
  defaultOpen = false,
  block = false,
  className,
  triggerClassName,
  contentClassName,
}: DisclosureProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  const reduced = useReducedMotionPreference();
  const id = React.useMemo(() => `disclosure-${++uid}`, []);

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={id}
        className={cn(
          "group inline-flex min-h-11 items-center gap-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/75 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          block && "w-full justify-between border-t border-border pt-4 text-left",
          triggerClassName
        )}
      >
        <span>{open ? labelOpen ?? label : label}</span>
        <span
          aria-hidden
          className="grid size-6 shrink-0 place-items-center border border-current/40 text-current transition-colors group-hover:border-primary"
        >
          <Plus
            className={cn(
              "size-3 transition-transform duration-300 [transition-timing-function:var(--ease-material)]",
              open && "rotate-45"
            )}
          />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            key="content"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? undefined : { height: 0, opacity: 0 }}
            transition={{
              duration: reduced ? 0 : 0.36,
              ease: [0.2, 0, 0, 1],
            }}
            className="overflow-hidden"
          >
            <div className={cn("pt-5", contentClassName)}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
