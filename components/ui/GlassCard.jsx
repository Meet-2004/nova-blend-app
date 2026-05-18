import { cn } from "@/lib/cn";

export function GlassCard({ children, className, strong, onClick }) {
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

export function Card({ children, className }) {
  return (
    <div className={cn("rounded-2xl bg-card border border-border", className)}>
      {children}
    </div>
  );
}
