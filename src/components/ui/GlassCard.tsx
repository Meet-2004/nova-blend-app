import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function GlassCard({
  children, className, strong, onClick,
}: { children: ReactNode; className?: string; strong?: boolean; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        strong ? "glass-strong" : "glass",
        "rounded-3xl",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl bg-card border border-border", className)}>{children}</div>
  );
}
