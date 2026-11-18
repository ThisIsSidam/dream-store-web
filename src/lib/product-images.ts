import type { ProductImage } from "./api/types";

/**
 * The usable photo URLs of a product, in the order the admin arranged them.
 * Entries without a real string URL are dropped. Relative URLs are kept on
 * purpose: if the file is missing, <ProductImage> falls back to the artwork.
 */
export function getProductImageUrls(
  images: readonly Pick<ProductImage, "url">[] | null | undefined,
): string[] {
  if (!images) return [];
  const urls: string[] = [];
  for (const image of images) {
    if (typeof image?.url !== "string") continue;
    const url = image.url.trim();
    if (url) urls.push(url);
  }
  return urls;
}
