"use client";

import { useStore } from "@/lib/client/store";
import { Heart, Package, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { CartBadge } from "./cart-badge";

export function HeaderNavItems() {
  const { wishlist } = useStore();
  const wishCount = wishlist.length;

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <Link
        href="/orders"
        className="flex h-9 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
        title="Track Orders"
      >
        <Package className="size-4 text-neutral-500" aria-hidden />
        <span className="hidden sm:inline">Orders</span>
      </Link>

      <Link
        href="/wishlist"
        className="relative flex h-9 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
        title="Wishlist"
      >
        <span className="relative">
          <Heart className="size-4 text-neutral-500" aria-hidden />
          {wishCount > 0 && (
            <span className="absolute -top-1.5 -right-2 grid min-h-4 min-w-4 place-items-center rounded-full bg-neutral-900 px-1 text-[10px] font-bold text-white">
              {wishCount}
            </span>
          )}
        </span>
        <span className="hidden sm:inline">Wishlist</span>
      </Link>

      <Link
        href="/cart"
        className="relative flex h-9 items-center gap-2 rounded-md bg-neutral-900 px-3.5 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors shadow-xs ml-1"
        title="View Cart"
      >
        <span className="relative">
          <ShoppingCart className="size-4 text-neutral-200" aria-hidden />
          <CartBadge />
        </span>
        <span>Cart</span>
      </Link>
    </div>
  );
}
