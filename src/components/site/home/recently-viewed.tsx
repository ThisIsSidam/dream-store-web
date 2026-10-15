"use client";

import { ProductCard } from "@/components/product/product-card";
import { useStore } from "@/lib/client/store";
import type { Product } from "@/lib/api/types";

export function RecentlyViewed() {
  const { recentlyViewedProducts } = useStore();

  const products: Product[] = recentlyViewedProducts || [];

  if (products.length === 0) return null;

  return (
    <section className="border-b border-neutral-200/80 bg-white py-12 md:py-16">
      <div className="mx-auto max-w-[1360px] px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              Recently Viewed
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-neutral-500">
              Items you inspected previously with varying degrees of
              seriousness.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p._id || p.slug} product={p} dense />
          ))}
        </div>
      </div>
    </section>
  );
}
