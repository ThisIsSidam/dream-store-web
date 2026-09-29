import Link from "next/link";
import { SearchX } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/state";
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
import { ProductFilters } from "./product-filters";
import { ProductGrid } from "./product-grid";

const PAGE_SIZE = 12;

export type Crumb = { label: string; href?: string };

/** Filterable, sortable, paginated catalogue shared by /products, /search and /sections/[id]. */
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
  emptyTitle = "No products found",
  emptyMessage = "Try changing or clearing the filters.",
}: {
  title: string;
  crumbs: Crumb[];
  products: Product[];
  sort: SortOption;
  page: number;
  filters: ListingFilters;
  pathname: string;
  /** Params that identify the listing (`q`, `category`); kept in every link. */
  params?: Record<string, string | undefined>;
  /** Category names for the sidebar (catalogue page only). */
  categories?: string[];
  emptyTitle?: string;
  emptyMessage?: string;
}) {
  const filtered = sortProducts(filterProducts(products, filters), sort);
  const { items, page: current, totalPages } = paginate(filtered, page, PAGE_SIZE);
  const first = filtered.length === 0 ? 0 : (current - 1) * PAGE_SIZE + 1;
  const last = first === 0 ? 0 : first + items.length - 1;

  const linkParams = {
    ...params,
    min: filters.min,
    max: filters.max,
    stock: filters.inStock ? 1 : undefined,
  };
  const sortHref = (value: SortOption) =>
    pageHref(pathname, { ...linkParams, sort: value === "relevance" ? undefined : value });
  const pageLink = (target: number) =>
    pageHref(pathname, { ...linkParams, sort: sort === "relevance" ? undefined : sort, page: target });

  return (
    <div className="grid items-start gap-3 lg:grid-cols-[260px_1fr]">
      <ProductFilters
        pathname={pathname}
        params={{ ...params, sort: sort === "relevance" ? undefined : sort }}
        filters={filters}
        categories={categories}
        activeCategory={params.category}
      />

      <section className="min-w-0 bg-white shadow-soft">
        <div className="border-b border-outline-variant/40 px-4 pb-0 pt-3">
          <nav aria-label="Breadcrumb" className="text-xs text-on-surface-variant">
            <ol className="flex flex-wrap items-center gap-1.5">
              {crumbs.map((crumb, i) => (
                <li key={crumb.label} className="flex items-center gap-1.5">
                  {i > 0 && <span aria-hidden>›</span>}
                  {crumb.href ? (
                    <Link href={crumb.href} className="hover:text-primary">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="capitalize text-on-surface">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <h1 className="mt-2 font-display text-lg font-bold capitalize">{title}</h1>
          <p className="mt-0.5 text-xs text-on-surface-variant">
            {filtered.length === 0
              ? "No results"
              : `Showing ${first}–${last} of ${filtered.length} ${filtered.length === 1 ? "product" : "products"}`}
          </p>
          <div className="mt-3 flex items-center gap-1 overflow-x-auto text-sm">
            <span className="shrink-0 pr-2 font-bold">Sort by</span>
            {sortOptions.map((option) => (
              <Link
                key={option.value}
                href={sortHref(option.value)}
                aria-current={sort === option.value ? "true" : undefined}
                className={cn(
                  "shrink-0 border-b-2 px-3 py-2.5 transition-colors",
                  sort === option.value
                    ? "border-primary font-bold text-primary"
                    : "border-transparent text-on-surface-variant hover:text-on-surface",
                )}
              >
                {option.label}
              </Link>
            ))}
          </div>
        </div>

        {items.length === 0 ? (
          <EmptyState icon={SearchX} title={emptyTitle} message={emptyMessage} />
        ) : (
          <ProductGrid products={items} />
        )}

        <Pagination page={current} totalPages={totalPages} hrefFor={pageLink} className="py-6" />
      </section>
    </div>
  );
}
