import type { Product } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import { ProductCard } from "./product-card";

export function ProductGrid({
  products,
  className,
}: {
  products: Product[];
  className?: string;
}) {
  return (
    <ul
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 p-4 sm:p-5",
        className,
      )}
    >
      {products.map((product) => (
        <li key={product._id} className="h-full">
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
