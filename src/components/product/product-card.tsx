import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { RemoteImage } from "@/components/ui/remote-image";
import type { Product } from "@/lib/api/types";
import { cn, formatPriceRange } from "@/lib/utils";

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const soldOut = product.totalStock <= 0;

  return (
    <Link
      href={`/product/${product._id}`}
      className={cn(
        "group flex h-full flex-col rounded-[28px] border border-outline-variant/35 bg-surface p-3.5 shadow-card transition-transform duration-200 hover:-translate-y-1",
        className,
      )}
    >
      <RemoteImage
        src={product.images[0]?.url}
        alt={product.name}
        width={600}
        className="aspect-[1.05] rounded-3xl bg-surface-container-highest/45"
        imgClassName="transition-transform duration-500 group-hover:scale-105"
        fallback={<ShoppingBag className="size-10" aria-hidden />}
      />
      <div className="flex flex-1 flex-col px-1 pb-1 pt-3.5">
        <h3 className="t-headline line-clamp-2 text-[1.35rem] font-extrabold leading-tight">
          {product.name}
        </h3>
        <p className="t-body-md mt-2.5 line-clamp-3 text-on-surface-variant">{product.description}</p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <p className="t-headline text-[1.5rem] font-extrabold">
            {formatPriceRange(product.minPrice, product.maxPrice)}
          </p>
          {soldOut && (
            <span className="t-caption mb-1 rounded-full bg-error/10 px-2.5 py-1 text-error">Sold out</span>
          )}
        </div>
      </div>
    </Link>
  );
}
