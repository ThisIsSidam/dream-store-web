import type { Product } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import { ProductCard } from "./product-card";

/** Cards are separated by hairlines inside one white panel, like a shelf. */
export function ProductGrid({ products, className }: { products: Product[]; className?: string }) {
  return (
    <ul
      className={cn(
        "grid grid-cols-2 overflow-hidden sm:grid-cols-3 lg:grid-cols-4",
        className,
      )}
    >
      {products.map((product) => (
        <li key={product._id} className="-mb-px -mr-px border-b border-r border-outline-variant/40 bg-white">
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
