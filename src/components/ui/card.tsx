import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Card({
  className,
  children,
  glow,
}: {
  className?: string;
  children: ReactNode;
  glow?: "red" | "gold" | null;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface/70 backdrop-blur-sm",
        glow === "red" && "shadow-[0_0_40px_-16px_rgba(194,59,34,0.6)]",
        glow === "gold" && "shadow-[0_0_40px_-16px_rgba(184,134,11,0.6)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block font-mono text-xs uppercase tracking-[0.3em] text-gold">
      {children}
    </span>
  );
}

export function SectionTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "text-3xl font-extrabold leading-tight tracking-tight text-paper sm:text-4xl",
        className,
      )}
    >
      {children}
    </h2>
  );
}
