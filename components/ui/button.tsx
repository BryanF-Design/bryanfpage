"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

// Píldoras, como en las referencias: texto semibold, radio completo y una
// flecha en círculo opcional (`<ButtonArrow />`) que gira al pasar el puntero.
// `default` usa los tokens de la superficie: lima con tinta sobre el lienzo y
// paneles oscuros, tinta con lima dentro de un panel lima.
const buttonVariants = cva(
  "group relative inline-flex select-none items-center justify-center gap-2.5 whitespace-nowrap rounded-full font-sans font-semibold leading-none tracking-[-0.005em] transition-[background-color,color,box-shadow,transform] duration-200 [transition-timing-function:var(--ease-out)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 cursor-pointer [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_10px_24px_-12px_hsl(var(--ink)/0.45)] hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-12px_hsl(var(--ink)/0.5)]",
        ink: "bg-ink text-white shadow-[0_10px_24px_-12px_hsl(var(--ink)/0.6)] hover:-translate-y-0.5 hover:bg-ink-soft",
        white:
          "bg-white text-ink shadow-[0_10px_24px_-14px_hsl(var(--ink)/0.45)] hover:-translate-y-0.5",
        outline:
          "border-[1.5px] border-foreground/20 bg-transparent text-foreground hover:border-foreground/60 hover:bg-foreground/[0.04]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "text-foreground/80 hover:bg-foreground/[0.06] hover:text-foreground",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link: "text-foreground underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 text-[0.9375rem]",
        sm: "h-10 px-4 text-sm",
        lg: "h-14 px-7 text-base",
        icon: "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

/**
 * La flecha en círculo de las píldoras de las referencias. Va como último
 * hijo del botón; gira 45° cuando el botón (`group`) recibe el puntero.
 * `tone` elige el círculo: contorno del color del texto, o relleno.
 */
const ARROW_TONES = {
  outline: "border-[1.5px] border-current",
  lime: "bg-lime text-ink",
  ink: "bg-ink text-white",
  white: "bg-white text-ink",
} as const;

function ButtonArrow({
  className,
  tone = "outline",
}: {
  className?: string;
  tone?: keyof typeof ARROW_TONES;
}) {
  return (
    <span aria-hidden className={cn("btn-arrow -mr-3 size-9", ARROW_TONES[tone], className)}>
      <ArrowUpRight className="h-4 w-4" />
    </span>
  );
}

export { Button, ButtonArrow, buttonVariants };
