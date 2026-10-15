"use client";

import { ProductCard } from "@/components/product/product-card";
import { PageShell } from "@/components/site/page-shell";
import { useStore } from "@/lib/client/store";
import type { Product } from "@/lib/api/types";
import { swrFetcher } from "@/lib/client/api";
import { ArrowRight, Heart, Trash2 } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";

export default function WishlistPage() {
  const { wishlist, wishlistProducts, removeFromWishlist } = useStore();

  const { data: backendWishlist } = useSWR<{ wishlist: any[] }>(
    "users/wishlist",
    swrFetcher,
    { shouldRetryOnError: false },
  );

  const liveItems =
    backendWishlist?.wishlist ||
    (wishlistProducts.length > 0 ? wishlistProducts : []);

  const wishlistedItems: Product[] = wishlist
    .map((id) => {
      const fromLive = liveItems.find(
        (p) => typeof p === "object" && (p._id === id || p.slug === id),
      );
      if (fromLive) {
        return {
          _id: fromLive._id,
          name: fromLive.name,
          category: fromLive.category,
          description: fromLive.description || "",
          shortDescription: fromLive.shortDescription,
          images: fromLive.images || [],
          minPrice: fromLive.minPrice || fromLive.price || 99,
          maxPrice: fromLive.maxPrice || fromLive.price || 99,
          totalStock: fromLive.totalStock || 10,
          slug: fromLive.slug,
          visualId: fromLive.visualId || fromLive.slug,
          badge: fromLive.badge,
          oddness: fromLive.oddness,
          rating: fromLive.rating || 5,
          reviewCount: fromLive.reviewCount || 0,
          isLimited: fromLive.isLimited,
          scarcityNote: fromLive.scarcityNote,
        } as Product;
      }
      return null;
    })
    .filter((p): p is Product => Boolean(p));

  return (
    <PageShell>
      <div className="mx-auto max-w-[1360px] py-6">
        <div className="mb-8 border-b border-neutral-200 pb-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 uppercase tracking-wider mb-1">
            <Heart className="size-3.5 fill-rose-600" />
            <span>Saved for contemplation</span>
          </div>
          <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
            Things you&apos;re considering unnecessarily.
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500">
            Items saved during moments of questionable judgment.
          </p>
        </div>

        {wishlistedItems.length === 0 ? (
          <div className="rounded-xl border border-neutral-200 bg-white p-12 text-center shadow-xs">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-neutral-100 text-neutral-400 mb-4">
              <Heart className="size-8" />
            </div>
            <h2 className="font-sans text-xl font-bold text-neutral-950">
              Your wishlist is empty.
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto">
              Surely there&apos;s something here you don&apos;t need.
            </p>
            <div className="mt-6">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-6 py-3 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-indigo-600"
              >
                <span>Explore Products</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistedItems.map((p) => (
              <div key={p._id} className="relative flex flex-col">
                <ProductCard product={p} />
                <button
                  type="button"
                  onClick={() => removeFromWishlist(p._id || p.slug || "")}
                  className="mt-2 flex items-center justify-center gap-1.5 py-1.5 text-xs text-neutral-500 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="size-3" />
                  <span>Remove from wishlist</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
