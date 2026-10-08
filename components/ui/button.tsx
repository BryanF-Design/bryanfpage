"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Botones de arcade: rótulo pixel en mayúsculas, esquinas escalonadas y un
// bisel de dos tonos que se invierte al pulsar (ver `.btn-px` en globals.css).
// Sin sombras externas ni ondas: todo el relieve vive dentro del recorte.
const buttonVariants = cva(
  "btn-px relative inline-flex select-none items-center justify-center gap-2 overflow-hidden whitespace-nowrap font-display text-[1.25rem] uppercase leading-none tracking-[0.04em] disabled:pointer-events-none disabled:opacity-50 cursor-pointer [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:brightness-110",
        destructive: "bg-destructive text-destructive-foreground hover:brightness-110",
        outline: "btn-px-outline text-foreground hover:text-primary",
        secondary: "bg-secondary text-secondary-foreground hover:brightness-125",
        ghost: "btn-px-ghost text-foreground/85 hover:bg-foreground/10 hover:text-foreground",
        link: "btn-px-ghost text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 pb-[3px]",
        sm: "h-11 px-4 pb-[3px]",
        lg: "h-12 px-7 pb-[3px] text-[1.4rem]",
        icon: "h-11 w-11",
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

export { Button, buttonVariants };
