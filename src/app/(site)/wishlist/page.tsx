"use client";

import { ProductCard } from "@/components/product/product-card";
import { PageShell } from "@/components/site/page-shell";
import { useStore } from "@/lib/client/store";
import { YC_PRODUCTS, toStoreProduct } from "@/lib/data/products";
import { ArrowRight, Heart, Trash2 } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart } = useStore();

  const wishlistedItems = wishlist
    .map((id) => YC_PRODUCTS.find((p) => p.id === id || p._id === id))
    .filter((p): p is (typeof YC_PRODUCTS)[0] => Boolean(p));

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
              <div key={p.id} className="relative flex flex-col">
                <ProductCard product={toStoreProduct(p)} />
                <button
                  type="button"
                  onClick={() => removeFromWishlist(p.id)}
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
