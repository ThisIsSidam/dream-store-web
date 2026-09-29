import { SearchX } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/state";
import type { Product } from "@/lib/api/types";
import { paginate, sortProducts, type SortOption } from "@/lib/products";
import { ProductGrid } from "./product-grid";
import { SortSelect } from "./sort-select";

const PAGE_SIZE = 12;

/** Sortable, paginated product grid shared by /products, /search and /sections/[id]. */
export function ProductListing({
  heading,
  products,
  sort,
  page,
  pathname,
  params = {},
  emptyTitle = "Nothing here yet",
  emptyMessage = "Check back soon - we're still capturing things.",
  showSort = true,
}: {
  heading: React.ReactNode;
  products: Product[];
  sort: SortOption;
  page: number;
  pathname: string;
  /** Extra query params to keep in pagination links (e.g. `category`, `q`). */
  params?: Record<string, string | undefined>;
  emptyTitle?: string;
  emptyMessage?: string;
  showSort?: boolean;
}) {
  const sorted = sortProducts(products, sort);
  const { items, page: current, totalPages } = paginate(sorted, page, PAGE_SIZE);

  function hrefFor(target: number) {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) if (value) query.set(key, value);
    if (sort !== "relevance") query.set("sort", sort);
    if (target > 1) query.set("page", String(target));
    const qs = query.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  return (
    <>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="t-headline-md !text-[1.75rem] font-extrabold">{heading}</h2>
        {showSort && products.length > 1 && <SortSelect value={sort} />}
      </div>

      {items.length === 0 ? (
        <EmptyState icon={SearchX} title={emptyTitle} message={emptyMessage} />
      ) : (
        <ProductGrid products={items} />
      )}

      <Pagination page={current} totalPages={totalPages} hrefFor={hrefFor} className="mt-12" />
    </>
  );
}
