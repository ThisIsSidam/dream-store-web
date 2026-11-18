"use client";

import Image from "next/image";
import { useState } from "react";
import { ProductVisual } from "@/components/ui/product-visual";
import type { ProductImage as ProductImageData } from "@/lib/api/types";
import { getProductImageUrls } from "@/lib/product-images";
import { cn } from "@/lib/utils";

type ProductImageProps = {
  /** A product's `images`; the one at `index` is shown. */
  images?: readonly Pick<ProductImageData, "url">[] | null;
  /** A single photo URL (cart and order lines carry one). Wins over `images`. */
  src?: string | null;
  index?: number;
  /** Which hand-drawn artwork to show when there is no photo or it fails to load. */
  visualId: string;
  name?: string;
  className?: string;
  fit?: "cover" | "contain";
  sizes?: string;
  priority?: boolean;
  showStudioLighting?: boolean;
};

/**
 * A product photo that degrades to the store's SVG artwork: no photo, a
 * missing file, or a failed request all end up showing <ProductVisual>
 * instead of a broken-image icon. Both are square by default so swapping
 * between them never shifts the layout.
 *
 * Photos use `unoptimized` because they live on whatever host the admin's
 * uploads land on (no `next/image` host allow-list to maintain).
 */
export function ProductImage({
  images,
  src,
  index = 0,
  visualId,
  name,
  className,
  fit = "cover",
  sizes = "(max-width: 768px) 50vw, 25vw",
  priority,
  showStudioLighting,
}: ProductImageProps) {
  const url = src?.trim() || getProductImageUrls(images)[index] || null;
  // Remember *which* URL failed, so a different photo gets its own chance.
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  if (!url || failedUrl === url) {
    return (
      <ProductVisual
        visualId={visualId}
        name={name}
        className={className}
        showStudioLighting={showStudioLighting}
      />
    );
  }

  return (
    <div className={cn("relative aspect-square select-none overflow-hidden bg-neutral-50", className)}>
      <Image
        src={url}
        alt={name ?? ""}
        fill
        unoptimized
        priority={priority}
        sizes={sizes}
        className={fit === "contain" ? "object-contain" : "object-cover"}
        onError={() => setFailedUrl(url)}
      />
    </div>
  );
}
