import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const variants = {
  /** Primary CTA: solid red pill. */
  primary:
    "bg-primary text-on-primary hover:bg-primary/90 active:bg-primary/80 shadow-soft",
  /** The "Add to Wonder Basket" style: coral pill with a red glow. */
  accent:
    "bg-primary-container text-on-primary-container hover:brightness-95 shadow-[0_8px_20px_color-mix(in_srgb,var(--color-primary)_30%,transparent)]",
  outline:
    "border-2 border-outline text-on-surface hover:bg-surface-container-high",
  soft: "bg-surface-container-highest text-on-surface hover:bg-surface-container-high",
  ghost: "text-on-surface-variant hover:bg-primary-container/20 hover:text-primary",
  danger: "bg-error text-on-error hover:bg-error/90",
} as const;

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-base",
  xl: "h-16 px-10 text-lg",
} as const;

type Shared = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  loading?: boolean;
  className?: string;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-display font-bold transition-[background-color,filter,box-shadow,transform] duration-150 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer select-none";

export function buttonClass({ variant = "primary", size = "md", className }: Shared) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = Shared & React.ComponentProps<"button">;

export function Button({ variant, size, loading, className, children, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={buttonClass({ variant, size, className })}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

type LinkButtonProps = Shared & React.ComponentProps<typeof Link>;

export function LinkButton({ variant, size, className, ...props }: LinkButtonProps) {
  return <Link className={buttonClass({ variant, size, className })} {...props} />;
}
