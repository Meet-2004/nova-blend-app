import { cn } from "@/lib/cn";

export function Container({ children, className }) {
  return (
    <div className={cn("mx-auto w-full max-w-md px-5", className)}>
      {children}
    </div>
  );
}
