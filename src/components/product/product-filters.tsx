import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { ListingFilters } from "@/lib/products";
import { cn, pageHref } from "@/lib/utils";

type Props = {
  pathname: string;
  /** Params that identify the listing itself and survive filtering (`q`, `category`, `sort`). */
  params: Record<string, string | undefined>;
  filters: ListingFilters;
  /** Category names to offer (only for the catalogue page). */
  categories?: string[];
  activeCategory?: string;
};

const heading = "text-xs font-bold uppercase tracking-wide text-on-surface-variant";
const input =
  "h-9 w-full min-w-0 rounded-sm border border-outline-variant bg-white px-2.5 text-sm outline-none focus:border-primary";

function FilterForm({ pathname, params, filters, categories, activeCategory }: Props) {
  const hasFilters = filters.min !== undefined || filters.max !== undefined || filters.inStock;
  const kept = Object.entries(params).filter(([key, value]) => value && key !== "category");

  return (
    <div className="flex flex-col divide-y divide-outline-variant/40">
      {categories && categories.length > 0 && (
        <div className="p-4">
          <h3 className={heading}>Categories</h3>
          <ul className="mt-3 flex flex-col gap-0.5 text-sm">
            <li>
              <Link
                href={pageHref(pathname, { ...Object.fromEntries(kept), min: filters.min, max: filters.max, stock: filters.inStock ? 1 : undefined })}
                className={cn("block rounded-sm px-2 py-1.5 hover:bg-surface-container-low", !activeCategory && "font-bold text-primary")}
              >
                All products
              </Link>
            </li>
            {categories.map((name) => (
              <li key={name}>
                <Link
                  href={pageHref(pathname, {
                    ...Object.fromEntries(kept),
                    category: name,
                    min: filters.min,
                    max: filters.max,
                    stock: filters.inStock ? 1 : undefined,
                  })}
                  aria-current={activeCategory === name ? "page" : undefined}
                  className={cn(
                    "block rounded-sm px-2 py-1.5 capitalize hover:bg-surface-container-low",
                    activeCategory === name && "font-bold text-primary",
                  )}
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <form action={pathname} method="get" className="flex flex-col gap-5 p-4">
        {Object.entries(params).map(([key, value]) =>
          value ? <input key={key} type="hidden" name={key} value={value} /> : null,
        )}
        <fieldset>
          <legend className={heading}>Price</legend>
          <div className="mt-3 flex items-center gap-2">
            <input
              name="min"
              type="number"
              inputMode="decimal"
              min={0}
              step="any"
              placeholder="Min"
              aria-label="Minimum price"
              defaultValue={filters.min}
              className={input}
            />
            <span className="text-on-surface-variant">to</span>
            <input
              name="max"
              type="number"
              inputMode="decimal"
              min={0}
              step="any"
              placeholder="Max"
              aria-label="Maximum price"
              defaultValue={filters.max}
              className={input}
            />
          </div>
        </fieldset>
        <fieldset>
          <legend className={heading}>Availability</legend>
          <label className="mt-3 flex cursor-pointer items-center gap-2.5 text-sm">
            <input type="checkbox" name="stock" value="1" defaultChecked={filters.inStock} className="size-4 accent-primary" />
            Exclude out of stock
          </label>
        </fieldset>
        <div className="flex items-center gap-3">
          <Button type="submit" size="sm">
            Apply
          </Button>
          {hasFilters && (
            <Link
              href={pageHref(pathname, params)}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Clear
            </Link>
          )}
        </div>
      </form>
    </div>
  );
}

/** Filter panel: a collapsible block on small screens, a sticky sidebar from lg. */
export function ProductFilters(props: Props) {
  return (
    <>
      <details className="bg-white shadow-soft lg:hidden">
        <summary className="cursor-pointer select-none px-4 py-3 text-sm font-bold uppercase tracking-wide">
          Filters
        </summary>
        <div className="border-t border-outline-variant/40">
          <FilterForm {...props} />
        </div>
      </details>
      <aside aria-label="Filters" className="hidden bg-white shadow-soft lg:block">
        <h2 className="border-b border-outline-variant/40 px-4 py-3 text-lg font-bold">Filters</h2>
        <FilterForm {...props} />
      </aside>
    </>
  );
}
