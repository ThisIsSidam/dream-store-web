import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import type { Section } from "@/lib/api/types";
import { cn } from "@/lib/utils";

export function HomeSection({ section, index }: { section: Section; index: number }) {
  const products = section.items.flatMap((item) => (item.productId ? [item.productId] : []));
  if (products.length === 0) return null;

  return (
    <section
      className={cn("px-6 py-14 md:px-8 md:py-[60px]", index % 2 === 0 && "bg-surface-container-highest/30")}
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-4">
          <h2 className="t-headline-lg">{section.title}</h2>
          <Link
            href={`/sections/${section._id}`}
            className="t-label flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-primary hover:bg-primary-container/20"
          >
            View All <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <ul className="scrollbar-none -mx-2 mt-6 flex snap-x gap-4 overflow-x-auto px-2 py-2">
          {products.map((product) => (
            <li key={product._id} className="w-[220px] shrink-0 snap-start sm:w-[260px]">
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
