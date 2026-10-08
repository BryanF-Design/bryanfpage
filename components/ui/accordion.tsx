"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

interface AccordionTriggerProps extends React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Trigger
> {
  /** Clases extra para el botón redondo del "+" (color por superficie). */
  iconClassName?: string;
}

/**
 * Disparador: la fila entera es el botón y cierra con un botón redondo con
 * "+", que gira hasta volverse "×" cuando la pregunta está abierta.
 * El grupo con nombre (`group/acc`) evita choques con otros `group` padres.
 */
const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, iconClassName, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "group/acc flex min-h-11 flex-1 items-center justify-between gap-4 py-4 text-left font-medium",
        className,
      )}
      {...props}
    >
      {children}
      <span
        aria-hidden
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-full bg-white text-ink shadow-[0_6px_16px_-10px_hsl(var(--ink)/0.5)] ring-1 ring-ink/[0.07] transition-[background-color,color,transform] duration-300 [transition-timing-function:var(--ease-out)] group-hover/acc:scale-105 group-data-[state=open]/acc:bg-ink group-data-[state=open]/acc:text-lime md:size-11",
          iconClassName,
        )}
      >
        <Plus
          strokeWidth={2.25}
          className="h-[1.15rem] w-[1.15rem] transition-transform duration-300 [transition-timing-function:var(--ease-out)] group-data-[state=open]/acc:rotate-[135deg]"
        />
      </span>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

/**
 * Contenido: la altura se anima con la variable de Radix y el texto entra
 * con un fundido corto (tailwindcss-animate), sin saltos.
 */
const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="group/content overflow-hidden text-sm data-[state=closed]:animate-[accordion-up_0.26s_cubic-bezier(0.22,1,0.36,1)] data-[state=open]:animate-[accordion-down_0.34s_cubic-bezier(0.22,1,0.36,1)]"
    {...props}
  >
    <div
      className={cn(
        "pb-4 pt-0 duration-300 group-data-[state=closed]/content:animate-out group-data-[state=closed]/content:fade-out-0 group-data-[state=open]/content:animate-in group-data-[state=open]/content:fade-in-0 group-data-[state=open]/content:slide-in-from-top-2",
        className,
      )}
    >
      {children}
    </div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
