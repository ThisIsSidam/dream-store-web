import type { Product } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import { ProductCard } from "./product-card";

export function ProductGrid({ products, className }: { products: Product[]; className?: string }) {
  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-4 min-[451px]:grid-cols-3 min-[801px]:grid-cols-4",
        className,
      )}
    >
      {products.map((product) => (
        <li key={product._id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
