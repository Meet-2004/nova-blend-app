import { cn } from "@/lib/cn";

export function Container({ children, className }) {
  return <div className={cn("mx-auto max-w-lg px-5", className)}>{children}</div>;
}
