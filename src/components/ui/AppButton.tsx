import { cn } from "@/lib/cn";
import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "size"> {
  variant?: Variant;
  size?: Size;
  block?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-[0_10px_40px_-12px_oklch(0.82_0.16_75/0.6)] hover:shadow-[0_14px_50px_-12px_oklch(0.82_0.16_75/0.8)]",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "text-foreground/80 hover:text-foreground hover:bg-white/5",
  outline: "border border-border text-foreground hover:bg-white/5",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm rounded-lg",
  md: "h-11 px-5 text-sm rounded-xl",
  lg: "h-14 px-6 text-base rounded-2xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", block, children, ...rest },
  ref
) {
  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -1 }}
      transition={{ type: "spring", stiffness: 400, damping: 24 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold tracking-tight transition-colors disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        block && "w-full",
        className
      )}
      {...rest}
    >
      {children}
    </motion.button>
  );
});
