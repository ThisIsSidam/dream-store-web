import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { RemoteImage } from "@/components/ui/remote-image";
import type { Product } from "@/lib/api/types";
import { cn, formatPriceRange } from "@/lib/utils";

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const soldOut = product.totalStock <= 0;
  const lowStock = !soldOut && product.totalStock <= 5;

  return (
    <Link
      href={`/product/${product._id}`}
      className={cn(
        "group flex h-full flex-col bg-white p-3 transition-shadow hover:shadow-float sm:p-4",
        className,
      )}
    >
      <RemoteImage
        src={product.images[0]?.url}
        alt={product.name}
        width={500}
        sizes="(max-width: 640px) 45vw, 240px"
        className="aspect-square bg-white"
        imgClassName="object-contain transition-transform duration-300 group-hover:scale-105"
        fallback={<ShoppingBag className="size-10" aria-hidden />}
      />
      <div className="mt-3 flex flex-1 flex-col gap-1">
        <h3 className="line-clamp-1 text-sm font-medium group-hover:text-primary">{product.name}</h3>
        <p className="line-clamp-1 text-xs capitalize text-on-surface-variant">{product.category}</p>
        <p className="mt-auto pt-1 text-base font-semibold">
          {formatPriceRange(product.minPrice, product.maxPrice)}
        </p>
        {soldOut && <p className="text-xs font-semibold text-error">Out of stock</p>}
        {lowStock && <p className="text-xs font-semibold text-buy">Only {product.totalStock} left</p>}
      </div>
    </Link>
  );
}
