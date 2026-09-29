"use client";

import { ProductCard } from "@/components/product/product-card";
import { getLimitedProducts, toStoreProduct } from "@/lib/data/products";
import { AlertCircle, Flame, ShieldAlert } from "lucide-react";

export function LimitedSection() {
  const limitedItems = getLimitedProducts();

  return (
    <section className="border-b border-neutral-200 bg-neutral-100/70 py-12 md:py-16">
      <div className="mx-auto max-w-[1360px] px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 mb-1.5">
              <Flame className="size-3.5 text-amber-600" />
              <span>Artificial Scarcity &amp; Anomalous Supply</span>
            </div>
            <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
              The Unnecessarily Limited
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Products with questionable availability, strange discovery rates,
              or imminent discontinuation.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-600">
            <ShieldAlert className="size-3.5 text-neutral-400" />
            <span>Purchase limit: 1 per household</span>
          </div>
        </div>

        {/* 4-Column Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {limitedItems.slice(0, 4).map((item) => (
            <div key={item.id} className="flex flex-col">
              <ProductCard product={toStoreProduct(item)} />
              {/* Scarcity Note Banner below card */}
              <div className="mt-2 flex items-center gap-1.5 px-1 text-[11px] font-semibold text-amber-800">
                <AlertCircle className="size-3 text-amber-600 shrink-0" />
                <span className="truncate">
                  {item.scarcityNote ||
                    "Available until someone figures out what this is"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
