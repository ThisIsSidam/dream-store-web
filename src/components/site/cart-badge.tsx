"use client";

import { useCart } from "@/lib/client/use-cart";
import { cn } from "@/lib/utils";

export function CartBadge({ className }: { className?: string }) {
  const { itemCount } = useCart();
  if (itemCount <= 0) return null;
  return (
    <span
      className={cn(
        "t-caption absolute grid min-h-4 min-w-4 place-items-center rounded-full border border-white bg-cta px-1 text-[10px] leading-none text-white",
        className,
      )}
      aria-label={`${itemCount} items in cart`}
    >
      {itemCount > 99 ? "99+" : itemCount}
    </span>
  );
}
