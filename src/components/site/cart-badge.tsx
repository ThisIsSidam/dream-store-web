"use client";

import { useCart } from "@/lib/client/use-cart";
import { cn } from "@/lib/utils";

export function CartBadge({ className }: { className?: string }) {
  const { itemCount } = useCart();
  if (itemCount <= 0) return null;
  return (
    <span
      className={cn(
        "t-caption absolute grid min-h-4 min-w-4 place-items-center rounded-full border-[1.5px] border-surface bg-primary px-1 text-[9px] leading-none text-on-primary",
        className,
      )}
      aria-label={`${itemCount} items in cart`}
    >
      {itemCount > 99 ? "99+" : itemCount}
    </span>
  );
}
