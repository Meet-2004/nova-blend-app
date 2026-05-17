import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-md px-5", className)}>{children}</div>;
}
