import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const variants = {
  /** Brand red. */
  primary: "bg-primary text-on-primary hover:bg-primary/90 active:bg-primary/80 shadow-soft",
  /** "Add to cart": orange, uppercase. */
  cta: "bg-cta text-white uppercase tracking-wide hover:brightness-95 shadow-soft",
  /** "Buy now" / "Place order": deep orange, uppercase. */
  buy: "bg-buy text-white uppercase tracking-wide hover:brightness-95 shadow-soft",
  /** Kept for existing call sites: same as `buy`. */
  accent: "bg-buy text-white uppercase tracking-wide hover:brightness-95 shadow-soft",
  outline: "border border-outline-variant bg-white text-on-surface hover:bg-surface-container-low",
  soft: "bg-surface-container-high text-on-surface hover:bg-surface-container-highest",
  ghost: "text-on-surface-variant hover:bg-surface-container-high hover:text-primary",
  danger: "bg-error text-on-error hover:bg-error/90",
} as const;

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-6 text-[15px]",
  xl: "h-14 px-8 text-base",
} as const;

type Shared = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  loading?: boolean;
  className?: string;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-sm font-display font-semibold transition-[background-color,filter,box-shadow] duration-150 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none";

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
