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
        "pixel-3d rounded-lg border-2 border-border bg-surface/80 backdrop-blur-sm",
        glow === "red" && "border-red/40 shadow-[3px_3px_0_0_rgba(11,10,9,0.7),6px_6px_0_0_rgba(11,10,9,0.35),0_0_40px_-16px_rgba(194,59,34,0.7)]",
        glow === "gold" && "border-gold/40 shadow-[3px_3px_0_0_rgba(11,10,9,0.7),6px_6px_0_0_rgba(11,10,9,0.35),0_0_40px_-16px_rgba(184,134,11,0.7)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="font-pixel inline-block text-[10px] uppercase tracking-[0.25em] text-gold">
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
        "text-3d text-3xl font-extrabold leading-tight tracking-tight text-paper sm:text-4xl",
        className,
      )}
    >
      {children}
    </h2>
  );
}
