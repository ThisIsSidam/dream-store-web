import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import type { Section } from "@/lib/api/types";
import { ProductRail } from "./product-rail";

/** A curated section as a white panel with a horizontally scrolling rail. */
export function HomeSection({ section }: { section: Section }) {
  const products = section.items.flatMap((item) => (item.productId ? [item.productId] : []));
  if (products.length === 0) return null;

  return (
    <section className="bg-white shadow-soft">
      <div className="flex items-center justify-between gap-4 border-b border-outline-variant/40 px-4 py-3 sm:px-5 sm:py-4">
        <h2 className="font-display text-lg font-bold sm:text-xl">{section.title}</h2>
        <Link
          href={`/sections/${section._id}`}
          className="flex h-9 items-center gap-1 rounded-sm bg-primary px-4 text-sm font-semibold text-white hover:bg-primary/90"
        >
          View all <ChevronRight className="size-4" aria-hidden />
        </Link>
      </div>
      <ProductRail>
        {products.map((product) => (
          <li key={product._id} className="w-40 shrink-0 snap-start border-r border-outline-variant/30 sm:w-56">
            <ProductCard product={product} />
          </li>
        ))}
      </ProductRail>
    </section>
  );
}
