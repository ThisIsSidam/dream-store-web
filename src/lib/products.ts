import type { Product } from "./api/types";

export const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "price-asc", label: "Price — Low to High" },
  { value: "price-desc", label: "Price — High to Low" },
  { value: "newest", label: "Newest" },
] as const;

export type SortOption = (typeof sortOptions)[number]["value"];

export function parseSort(value: string | string[] | undefined): SortOption {
  const raw = Array.isArray(value) ? value[0] : value;
  return sortOptions.find((option) => option.value === raw)?.value ?? "relevance";
}

const lowestPrice = (p: Product) => p.minPrice ?? p.maxPrice ?? Number.POSITIVE_INFINITY;

export function sortProducts(products: Product[], sort: SortOption) {
  const sorted = [...products];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => lowestPrice(a) - lowestPrice(b));
    case "price-desc":
      return sorted.sort((a, b) => lowestPrice(b) - lowestPrice(a));
    case "newest":
      return sorted.sort(
        (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime(),
      );
    default:
      return sorted;
  }
}

export function paginate<T>(items: T[], page: number, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(Math.max(1, page), totalPages);
  return {
    items: items.slice((current - 1) * pageSize, current * pageSize),
    page: current,
    totalPages,
  };
}

/** Reads a positive integer out of a search param, defaulting to 1. */
export function parsePage(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  const n = Number.parseInt(raw ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

export type ListingFilters = { min?: number; max?: number; inStock: boolean };

function parsePrice(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  const n = Number.parseFloat(raw ?? "");
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

export function parseFilters(sp: Record<string, string | string[] | undefined>): ListingFilters {
  return { min: parsePrice(sp.min), max: parsePrice(sp.max), inStock: sp.stock === "1" };
}

/** Keeps products whose price range overlaps [min, max]. */
export function filterProducts(products: Product[], { min, max, inStock }: ListingFilters) {
  return products.filter((product) => {
    if (inStock && product.totalStock <= 0) return false;
    const low = product.minPrice ?? product.maxPrice ?? 0;
    const high = product.maxPrice ?? low;
    if (min !== undefined && high < min) return false;
    if (max !== undefined && low > max) return false;
    return true;
  });
}
