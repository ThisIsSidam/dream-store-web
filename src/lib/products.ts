import type { Product } from "./api/types";

export const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "oddness", label: "Most Questionable" },
  { value: "newest", label: "Newest Arrivals" },
] as const;

export type SortOption = (typeof sortOptions)[number]["value"];

export function parseSort(value: string | string[] | undefined): SortOption {
  const raw = Array.isArray(value) ? value[0] : value;
  return (
    sortOptions.find((option) => option.value === raw)?.value ?? "relevance"
  );
}

const lowestPrice = (p: Product) =>
  p.minPrice ?? p.maxPrice ?? Number.POSITIVE_INFINITY;

const oddnessScore: Record<string, number> = {
  "We Should Probably Investigate": 4,
  "Very Strange": 3,
  "Slightly Strange": 2,
  "Completely Normal": 1,
};

export function sortProducts(products: Product[], sort: SortOption) {
  const sorted = [...products];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => lowestPrice(a) - lowestPrice(b));
    case "price-desc":
      return sorted.sort((a, b) => lowestPrice(b) - lowestPrice(a));
    case "rating":
      return sorted.sort((a, b) => (b.rating ?? 4.5) - (a.rating ?? 4.5));
    case "oddness":
      return sorted.sort(
        (a, b) =>
          (oddnessScore[b.oddness ?? ""] ?? 0) -
          (oddnessScore[a.oddness ?? ""] ?? 0),
      );
    case "newest":
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() -
          new Date(a.createdAt ?? 0).getTime(),
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

export function parsePage(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  const n = Number.parseInt(raw ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

export type ListingFilters = {
  min?: number;
  max?: number;
  inStock: boolean;
  oddness?: string;
  badge?: string;
  minRating?: number;
};

function parsePrice(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  const n = Number.parseFloat(raw ?? "");
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

function parseString(value: string | string[] | undefined): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw && raw.trim().length > 0 ? raw.trim() : undefined;
}

export function parseFilters(
  sp: Record<string, string | string[] | undefined>,
): ListingFilters {
  const rawOdd = parseString(sp.oddness);
  const rawBadge = parseString(sp.badge) || parseString(sp.filter);
  const rawRating = parseString(sp.rating);

  return {
    min: parsePrice(sp.min),
    max: parsePrice(sp.max),
    inStock: sp.stock === "1",
    oddness: rawOdd,
    badge: rawBadge,
    minRating: rawRating ? Number.parseFloat(rawRating) : undefined,
  };
}

export function filterProducts(products: Product[], filters: ListingFilters) {
  return products.filter((product) => {
    if (filters.inStock && product.totalStock <= 0) return false;
    const low = product.minPrice ?? product.maxPrice ?? 0;
    const high = product.maxPrice ?? low;
    if (filters.min !== undefined && high < filters.min) return false;
    if (filters.max !== undefined && low > filters.max) return false;

    if (filters.oddness && product.oddness) {
      if (product.oddness.toLowerCase() !== filters.oddness.toLowerCase())
        return false;
    }

    if (filters.badge) {
      const b = filters.badge.toLowerCase();
      if (
        b === "limited" &&
        !product.isLimited &&
        product.badge?.toLowerCase() !== "limited"
      ) {
        return false;
      }
      if (b === "new" && product.badge?.toLowerCase() !== "new") {
        return false;
      }
      if (b === "bestseller" && product.badge?.toLowerCase() !== "bestseller") {
        return false;
      }
    }

    if (filters.minRating && (product.rating ?? 0) < filters.minRating) {
      return false;
    }

    return true;
  });
}
