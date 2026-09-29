"use client";

import { ProductVisual } from "@/components/ui/product-visual";
import type { Product } from "@/lib/api/types";
import { useStore } from "@/lib/client/store";
import { getProductBySlugOrId } from "@/lib/data/products";
import { cn, formatPrice, formatPriceRange } from "@/lib/utils";
import { Heart, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
  className?: string;
  dense?: boolean;
}

export function ProductCard({
  product,
  className,
  dense = false,
}: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const catalogItem =
    getProductBySlugOrId(product._id) ||
    getProductBySlugOrId(product.slug || "");
  const isWishlisted = isInWishlist(catalogItem?.id || product._id);

  const visualId =
    product.visualId || catalogItem?.visualId || product.slug || "generic";
  const badge = product.badge || catalogItem?.badge;
  const rating = product.rating ?? catalogItem?.rating ?? 4.8;
  const reviewCount = product.reviewCount ?? catalogItem?.reviewCount ?? 84;
  const shortDesc =
    product.shortDescription ||
    catalogItem?.shortDescription ||
    product.description;
  const totalStock = product.totalStock ?? catalogItem?.totalStock ?? 100;
  const originalPrice = product.originalPrice || catalogItem?.originalPrice;

  const isLowStock = totalStock <= 10 && totalStock > 0;
  const isSoldOut = totalStock <= 0;

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (catalogItem) {
      addToCart(catalogItem);
    }
  }

  function handleWishlistClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(catalogItem?.id || product._id);
  }

  return (
    <div
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-md border border-neutral-200/90 bg-white transition-all duration-200 hover:border-neutral-300 hover:shadow-md",
        className,
      )}
    >
      {/* Top Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-50/70 border-b border-neutral-100">
        <Link
          href={`/product/${catalogItem?.id || product._id}`}
          className="block size-full"
        >
          <ProductVisual
            visualId={visualId}
            name={product.name}
            className="size-full transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Small Badges */}
        {badge && (
          <div className="absolute top-2.5 left-2.5 z-20">
            <span
              className={cn(
                "inline-flex items-center rounded px-2 py-0.5 text-[11px] font-semibold tracking-tight shadow-2xs",
                badge === "Bestseller" &&
                  "bg-amber-100 text-amber-900 border border-amber-200",
                badge === "Staff Pick" &&
                  "bg-indigo-100 text-indigo-900 border border-indigo-200",
                badge === "Limited" &&
                  "bg-rose-100 text-rose-900 border border-rose-200",
                badge === "Almost Gone" &&
                  "bg-orange-100 text-orange-900 border border-orange-200",
                badge === "Verified Somehow" &&
                  "bg-emerald-100 text-emerald-900 border border-emerald-200",
                badge === "Questionable" &&
                  "bg-purple-100 text-purple-900 border border-purple-200",
                badge === "New" &&
                  "bg-blue-100 text-blue-900 border border-blue-200",
                badge === "Somehow Popular" &&
                  "bg-slate-100 text-slate-800 border border-slate-200",
              )}
            >
              {badge}
            </span>
          </div>
        )}

        {/* Wishlist Heart Button */}
        <button
          type="button"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={handleWishlistClick}
          className="absolute top-2.5 right-2.5 z-20 grid size-8 place-items-center rounded-full bg-white/90 text-neutral-600 backdrop-blur-xs transition-colors hover:bg-white hover:text-rose-600 shadow-2xs"
        >
          <Heart
            className={cn(
              "size-4 transition-transform active:scale-125",
              isWishlisted && "fill-rose-500 text-rose-500",
            )}
          />
        </button>
      </div>

      {/* Product Content Details */}
      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        {/* Category */}
        <div className="text-[11px] font-medium tracking-wide uppercase text-neutral-500">
          {product.category}
        </div>

        {/* Name */}
        <Link
          href={`/product/${catalogItem?.id || product._id}`}
          className="mt-1 line-clamp-1 font-sans text-sm sm:text-base font-semibold text-neutral-900 group-hover:text-indigo-600 transition-colors"
        >
          {product.name}
        </Link>

        {/* Short Description */}
        {!dense && (
          <p className="mt-1 line-clamp-2 text-xs text-neutral-500 leading-relaxed">
            {shortDesc}
          </p>
        )}

        {/* Rating and Reviews */}
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-neutral-600">
          <div className="flex items-center text-amber-500">
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
            <span className="ml-1 font-semibold text-neutral-800">
              {rating.toFixed(1)}
            </span>
          </div>
          <span className="text-neutral-400">({reviewCount})</span>
          {catalogItem?.oddness && (
            <span className="ml-auto hidden xs:inline text-[10px] text-neutral-400 font-mono">
              {catalogItem.oddness === "Completely Normal"
                ? "Normal"
                : "Strange"}
            </span>
          )}
        </div>

        {/* Price and Stock Row */}
        <div className="mt-3 pt-2 border-t border-neutral-100 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-bold text-neutral-950">
              {formatPriceRange(product.minPrice, product.maxPrice)}
            </span>
            {originalPrice && (
              <span className="text-xs text-neutral-400 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          {/* Stock Indicator */}
          <div className="text-[11px] font-medium">
            {isSoldOut ? (
              <span className="text-rose-600">Out of Stock</span>
            ) : isLowStock ? (
              <span className="text-amber-600 font-semibold">
                Only {totalStock} left
              </span>
            ) : (
              <span className="text-neutral-500">
                {totalStock.toLocaleString()} units
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="mt-3 pt-1">
          <button
            type="button"
            disabled={isSoldOut}
            onClick={handleQuickAdd}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-neutral-900 py-2 text-xs sm:text-sm font-semibold text-white transition-all hover:bg-indigo-600 active:scale-[0.99] disabled:bg-neutral-200 disabled:text-neutral-400"
          >
            <ShoppingCart className="size-3.5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
