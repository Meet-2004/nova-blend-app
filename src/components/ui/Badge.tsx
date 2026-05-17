import { cn } from "@/lib/cn";

export function Badge({
  children, tone = "default", className,
}: {
  children: React.ReactNode;
  tone?: "default" | "primary" | "success" | "warning" | "danger" | "veg" | "nonveg";
  className?: string;
}) {
  const tones: Record<string, string> = {
    default: "bg-white/5 text-foreground/80 border-white/10",
    primary: "bg-primary/15 text-primary border-primary/30",
    success: "bg-[oklch(0.74_0.17_155/0.15)] text-[oklch(0.84_0.17_155)] border-[oklch(0.74_0.17_155/0.3)]",
    warning: "bg-primary/15 text-primary border-primary/30",
    danger: "bg-destructive/15 text-destructive border-destructive/30",
    veg: "bg-[oklch(0.74_0.17_155/0.12)] text-[oklch(0.84_0.17_155)] border-[oklch(0.74_0.17_155/0.3)]",
    nonveg: "bg-destructive/12 text-destructive border-destructive/30",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium", tones[tone], className)}>
      {children}
    </span>
  );
}
