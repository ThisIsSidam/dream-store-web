import type { Product } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import { ProductCard } from "./product-card";

/** Cards sit on hairlines inside one white panel, like a shelf. */
export function ProductGrid({ products, className }: { products: Product[]; className?: string }) {
  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-px overflow-hidden bg-outline-variant/40 sm:grid-cols-3 lg:grid-cols-4",
        className,
      )}
    >
      {products.map((product) => (
        <li key={product._id} className="bg-white">
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
