"use client";

import { useStore } from "@/lib/client/store";
import { cn } from "@/lib/utils";

export function CartBadge({ className }: { className?: string }) {
  const { cartCount } = useStore();
  if (cartCount <= 0) return null;
  return (
    <span
      className={cn(
        "absolute -top-1.5 -right-2 grid min-h-4 min-w-4 place-items-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold leading-none text-white shadow-xs",
        className,
      )}
      aria-label={`${cartCount} items in cart`}
    >
      {cartCount > 99 ? "99+" : cartCount}
    </span>
  );
}
