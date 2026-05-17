import { Link, useLocation } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

export function TopBar({
  title, subtitle, right, backTo,
}: { title?: string; subtitle?: string; right?: ReactNode; backTo?: string }) {
  const loc = useLocation();
  const showBack = backTo || loc.pathname !== "/";
  return (
    <header className="sticky top-0 z-30 -mx-5 px-5 py-3 glass-strong">
      <div className="flex items-center gap-3">
        {showBack ? (
          <Link
            to={backTo ?? ".."}
            className="grid h-10 w-10 place-items-center rounded-full bg-white/5 hover:bg-white/10 transition"
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
        ) : <div className="h-10 w-10" />}
        <div className="flex-1 min-w-0">
          {title && <h1 className="truncate text-base font-semibold tracking-tight">{title}</h1>}
          {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {right}
      </div>
    </header>
  );
}
