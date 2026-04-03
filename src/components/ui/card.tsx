import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { glassEffect } from "@/styles/glass";

const cardVariants = cva(
  "flex flex-col overflow-hidden text-card-foreground transition-all duration-300",
  {
    variants: {
      variant: {
        default: "rounded-xl border bg-card shadow-sm",
        glass: cn(
          "relative isolate border border-white/30 bg-white/20 shadow-[0_24px_56px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-xl",
          glassEffect,
        ),
        glassDark: cn(
          "relative isolate border border-white/15 bg-black/45 shadow-[0_32px_64px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-2xl",
          "before:from-white/20 before:via-white/5 after:opacity-10",
        ),
      },
      rounded: {
        default: "rounded-xl",
        lg: "rounded-2xl",
        xl: "rounded-3xl",
        "2xl": "rounded-[26px]",
        "3xl": "rounded-[32px]",
        full: "rounded-[40px]",
      },
    },
    defaultVariants: {
      variant: "default",
      rounded: "default",
    },
  },
);

interface CardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof cardVariants> {}

function Card({ className, variant, rounded, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ variant, rounded, className }))}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5 px-6 pt-6 pb-4", className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-neutral-500 font-medium", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("flex-1 px-6 py-4", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 pt-4 pb-6", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
