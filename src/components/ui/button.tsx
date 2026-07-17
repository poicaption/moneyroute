import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "gold" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "pixel-3d-press inline-flex items-center justify-center gap-2 rounded-md border-2 font-semibold tracking-tight transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none select-none shadow-[3px_3px_0_0_rgba(11,10,9,0.7)]";

const variants: Record<Variant, string> = {
  primary: "border-red/60 bg-red text-paper hover:bg-red-soft",
  gold: "border-gold/60 bg-gold text-ink hover:bg-gold-soft",
  outline:
    "border-gold/50 text-paper hover:bg-gold/10 hover:border-gold",
  ghost:
    "border-transparent text-muted shadow-none hover:text-paper hover:bg-surface-2",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-base",
  lg: "h-14 px-8 text-lg",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & ComponentProps<"button">) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  ...props
}: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </Link>
  );
}
