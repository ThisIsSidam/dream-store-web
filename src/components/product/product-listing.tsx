import { Pagination } from "@/components/ui/pagination";
import type { Product } from "@/lib/api/types";
import {
  filterProducts,
  paginate,
  sortOptions,
  sortProducts,
  type ListingFilters,
  type SortOption,
} from "@/lib/products";
import { cn, pageHref } from "@/lib/utils";
import { ArrowUpDown, PackageX } from "lucide-react";
import Link from "next/link";
import { ProductFilters } from "./product-filters";
import { ProductGrid } from "./product-grid";

const PAGE_SIZE = 12;

export type Crumb = { label: string; href?: string };

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "All products":
    "Objects, ideas, and other questionable necessities. Completely serious e-commerce.",
  Collectibles:
    "Objects that probably deserve to be kept for reasons we cannot explain.",
  Home: "Things that technically belong in your home.",
  Science:
    "Science-adjacent objects of varying legitimacy and gravitational behavior.",
  "Everyday Things": "Ordinary objects with extraordinary problems.",
  Objects: "Tangible items with alarming metaphysical weight.",
  "Things You Didn't Need":
    "You definitely don't need this, yet here it is with an Add to Cart button.",
  "Weird Stuff":
    "Anomalies that passed quality control under curious circumstances.",
  Mysterious: "You won't know what it is until you buy it.",
};

export function ProductListing({
  title,
  crumbs,
  products,
  sort,
  page,
  filters,
  pathname,
  params = {},
  categories,
  emptyTitle = "Nothing found.",
  emptyMessage = "Unfortunately, whatever you are looking for appears to be even more questionable than our inventory.",
}: {
  title: string;
  crumbs: Crumb[];
  products: Product[];
  sort: SortOption;
  page: number;
  filters: ListingFilters;
  pathname: string;
  params?: Record<string, string | undefined>;
  categories?: string[];
  emptyTitle?: string;
  emptyMessage?: string;
}) {
  const filtered = sortProducts(filterProducts(products, filters), sort);
  const {
    items,
    page: current,
    totalPages,
  } = paginate(filtered, page, PAGE_SIZE);
  const first = filtered.length === 0 ? 0 : (current - 1) * PAGE_SIZE + 1;
  const last = first === 0 ? 0 : first + items.length - 1;

  const linkParams = {
    ...params,
    min: filters.min,
    max: filters.max,
    stock: filters.inStock ? 1 : undefined,
    oddness: filters.oddness,
    badge: filters.badge,
    rating: filters.minRating,
  };

  const sortHref = (value: SortOption) =>
    pageHref(pathname, {
      ...linkParams,
      sort: value === "relevance" ? undefined : value,
    });

  const pageLink = (target: number) =>
    pageHref(pathname, {
      ...linkParams,
      sort: sort === "relevance" ? undefined : sort,
      page: target,
    });

  const description =
    CATEGORY_DESCRIPTIONS[title] ||
    "Objects, ideas, and other questionable necessities.";

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[280px_1fr]">
      {/* Left Sidebar Filters */}
      <ProductFilters
        pathname={pathname}
        params={{ ...params, sort: sort === "relevance" ? undefined : sort }}
        filters={filters}
        categories={categories}
        activeCategory={params.category}
      />

      {/* Main Catalog Section */}
      <section className="min-w-0 rounded-lg border border-neutral-200/90 bg-white shadow-xs">
        {/* Top Header / Breadcrumb / Sorting */}
        <div className="border-b border-neutral-200 p-4 sm:p-6">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="text-xs text-neutral-500 mb-2"
          >
            <ol className="flex flex-wrap items-center gap-1.5">
              {crumbs.map((crumb, i) => (
                <li key={crumb.label} className="flex items-center gap-1.5">
                  {i > 0 && <span className="text-neutral-300">/</span>}
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="hover:text-indigo-600 transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="font-medium text-neutral-900">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-2">
            <div>
              <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 capitalize">
                {title}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-neutral-500 max-w-xl">
                {description}
              </p>
            </div>

            <div className="text-xs text-neutral-500 shrink-0">
              {filtered.length === 0
                ? "0 results"
                : `Showing ${first}–${last} of ${filtered.length} products`}
            </div>
          </div>

          {/* Sort bar */}
          <div className="mt-5 flex items-center gap-2 border-t border-neutral-100 pt-3 overflow-x-auto text-xs">
            <span className="shrink-0 font-bold uppercase tracking-wider text-neutral-600 flex items-center gap-1">
              <ArrowUpDown className="size-3.5 text-indigo-600" />
              Sort:
            </span>
            <div className="flex items-center gap-1">
              {sortOptions.map((option) => (
                <Link
                  key={option.value}
                  href={sortHref(option.value)}
                  className={cn(
                    "rounded-md px-2.5 py-1.5 font-medium transition-colors shrink-0",
                    sort === option.value
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
                  )}
                >
                  {option.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid or Empty State */}
        {items.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-neutral-100 text-neutral-400 mb-4">
              <PackageX className="size-8" />
            </div>
            <h3 className="font-sans text-lg font-bold text-neutral-900">
              {emptyTitle}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-neutral-500 max-w-md mx-auto leading-relaxed">
              {emptyMessage}
            </p>
            <div className="mt-6">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-600"
              >
                Continue Browsing
              </Link>
            </div>
          </div>
        ) : (
          <ProductGrid products={items} />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            page={current}
            totalPages={totalPages}
            hrefFor={pageLink}
            className="py-6 border-t border-neutral-100"
          />
        )}
      </section>
    </div>
  );
}
