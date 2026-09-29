import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Product } from "@/lib/api/types";
import { ProductRail } from "@/components/site/home/product-rail";
import { ProductCard } from "./product-card";

/** A titled white panel with a horizontally scrolling rail of products. */
export function ProductShelf({
  title,
  products,
  href,
}: {
  title: string;
  products: Product[];
  href?: string;
}) {
  if (products.length === 0) return null;

  return (
    <section className="bg-white shadow-soft">
      <div className="flex items-center justify-between gap-4 border-b border-outline-variant/40 px-4 py-3 sm:px-5 sm:py-4">
        <h2 className="font-display text-lg font-bold sm:text-xl">{title}</h2>
        {href && (
          <Link
            href={href}
            className="flex h-9 items-center gap-1 rounded-sm bg-primary px-4 text-sm font-semibold text-white hover:bg-primary/90"
          >
            View all <ChevronRight className="size-4" aria-hidden />
          </Link>
        )}
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
