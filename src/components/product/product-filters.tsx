import type { ListingFilters } from "@/lib/products";
import { pageHref } from "@/lib/utils";
import { SlidersHorizontal, Star } from "lucide-react";
import Link from "next/link";

type Props = {
  pathname: string;
  params: Record<string, string | undefined>;
  filters: ListingFilters;
  categories?: string[];
  activeCategory?: string;
};

const ODDNESS_OPTIONS = [
  "Completely Normal",
  "Slightly Strange",
  "Very Strange",
  "We Should Probably Investigate",
];

const QUICK_FILTERS = [
  { label: "All Items", key: "badge", value: undefined },
  { label: "New Arrivals", key: "badge", value: "new" },
  { label: "Best Sellers", key: "badge", value: "bestseller" },
  { label: "Limited Drops", key: "badge", value: "limited" },
];

export function ProductFilters(props: Props) {
  const { pathname, params, filters, categories, activeCategory } = props;
  const hasActiveFilters =
    filters.min !== undefined ||
    filters.max !== undefined ||
    filters.inStock ||
    filters.oddness !== undefined ||
    filters.badge !== undefined ||
    filters.minRating !== undefined;

  const keptParams = Object.entries(params).filter(
    ([k, v]) =>
      v &&
      k !== "category" &&
      k !== "min" &&
      k !== "max" &&
      k !== "stock" &&
      k !== "oddness" &&
      k !== "badge" &&
      k !== "rating",
  );

  return (
    <>
      {/* Mobile Collapsible Drawer */}
      <details className="rounded-lg border border-neutral-200 bg-white shadow-xs lg:hidden mb-4">
        <summary className="flex cursor-pointer items-center justify-between p-3.5 text-xs font-bold uppercase tracking-wider text-neutral-800">
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-indigo-600" />
            Filter Questionable Products
          </span>
          {hasActiveFilters && (
            <span className="size-2 rounded-full bg-indigo-600" />
          )}
        </summary>
        <div className="border-t border-neutral-100 p-4">
          <FilterFormContent {...props} />
        </div>
      </details>

      {/* Desktop Sticky Sidebar */}
      <aside aria-label="Filters" className="hidden lg:block">
        <div className="sticky top-20 rounded-lg border border-neutral-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3.5 border-b border-neutral-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <SlidersHorizontal className="size-4 text-indigo-600" />
              Filters
            </h2>
            {hasActiveFilters && (
              <Link
                href={pageHref(pathname, Object.fromEntries(keptParams))}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                Reset
              </Link>
            )}
          </div>
          <FilterFormContent {...props} />
        </div>
      </aside>
    </>
  );
}

function FilterFormContent({
  pathname,
  params,
  filters,
  categories,
  activeCategory,
}: Props) {
  return (
    <form
      action={pathname}
      method="get"
      className="flex flex-col gap-6 pt-4 text-xs"
    >
      {/* Retain other search params like q or sort */}
      {Object.entries(params).map(([key, value]) =>
        value &&
        key !== "min" &&
        key !== "max" &&
        key !== "stock" &&
        key !== "oddness" &&
        key !== "badge" &&
        key !== "rating" ? (
          <input key={key} type="hidden" name={key} value={value} />
        ) : null,
      )}

      {/* Category selector */}
      {categories && categories.length > 0 && (
        <fieldset>
          <legend className="font-bold uppercase tracking-wider text-neutral-900 mb-2.5">
            Category
          </legend>
          <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-1">
            <label className="flex items-center gap-2 py-0.5 cursor-pointer text-neutral-700 hover:text-neutral-950">
              <input
                type="radio"
                name="category"
                value=""
                defaultChecked={!activeCategory}
                className="size-3.5 accent-indigo-600"
              />
              <span>All Categories</span>
            </label>
            {categories.map((cat) => (
              <label
                key={cat}
                className="flex items-center gap-2 py-0.5 cursor-pointer text-neutral-700 hover:text-neutral-950"
              >
                <input
                  type="radio"
                  name="category"
                  value={cat}
                  defaultChecked={
                    activeCategory?.toLowerCase() === cat.toLowerCase()
                  }
                  className="size-3.5 accent-indigo-600"
                />
                <span className="capitalize">{cat}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {/* Oddness Filter (Section 14 explicit requirement) */}
      <fieldset className="border-t border-neutral-100 pt-4">
        <legend className="font-bold uppercase tracking-wider text-neutral-900 mb-2.5">
          Oddness Level
        </legend>
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-2 py-0.5 cursor-pointer text-neutral-700 hover:text-neutral-950">
            <input
              type="radio"
              name="oddness"
              value=""
              defaultChecked={!filters.oddness}
              className="size-3.5 accent-indigo-600"
            />
            <span>Any Level</span>
          </label>
          {ODDNESS_OPTIONS.map((level) => (
            <label
              key={level}
              className="flex items-center gap-2 py-0.5 cursor-pointer text-neutral-700 hover:text-neutral-950"
            >
              <input
                type="radio"
                name="oddness"
                value={level}
                defaultChecked={
                  filters.oddness?.toLowerCase() === level.toLowerCase()
                }
                className="size-3.5 accent-indigo-600"
              />
              <span>{level}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Price Range Filter */}
      <fieldset className="border-t border-neutral-100 pt-4">
        <legend className="font-bold uppercase tracking-wider text-neutral-900 mb-2.5">
          Price Range ($)
        </legend>
        <div className="flex items-center gap-2">
          <input
            name="min"
            type="number"
            min={0}
            placeholder="Min"
            defaultValue={filters.min}
            className="h-8 w-full rounded border border-neutral-300 bg-white px-2.5 text-xs text-neutral-900 outline-none focus:border-indigo-600"
          />
          <span className="text-neutral-400">to</span>
          <input
            name="max"
            type="number"
            min={0}
            placeholder="Max"
            defaultValue={filters.max}
            className="h-8 w-full rounded border border-neutral-300 bg-white px-2.5 text-xs text-neutral-900 outline-none focus:border-indigo-600"
          />
        </div>
      </fieldset>

      {/* Availability / Stock */}
      <fieldset className="border-t border-neutral-100 pt-4">
        <legend className="font-bold uppercase tracking-wider text-neutral-900 mb-2.5">
          Availability
        </legend>
        <label className="flex items-center gap-2 cursor-pointer text-neutral-700 hover:text-neutral-950">
          <input
            type="checkbox"
            name="stock"
            value="1"
            defaultChecked={filters.inStock}
            className="size-3.5 rounded accent-indigo-600"
          />
          <span>In Stock Only</span>
        </label>
      </fieldset>

      {/* Minimum Rating */}
      <fieldset className="border-t border-neutral-100 pt-4">
        <legend className="font-bold uppercase tracking-wider text-neutral-900 mb-2.5">
          Customer Rating
        </legend>
        <div className="flex flex-col gap-1.5">
          {[4, 4.5].map((stars) => (
            <label
              key={stars}
              className="flex items-center gap-2 cursor-pointer text-neutral-700 hover:text-neutral-950"
            >
              <input
                type="radio"
                name="rating"
                value={stars}
                defaultChecked={filters.minRating === stars}
                className="size-3.5 accent-indigo-600"
              />
              <span className="flex items-center gap-1">
                <span>{stars}★ and above</span>
                <Star className="size-3 fill-amber-400 text-amber-400 inline" />
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Submit Button */}
      <button
        type="submit"
        className="mt-2 w-full rounded-md bg-neutral-900 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-600"
      >
        Apply Filters
      </button>
    </form>
  );
}
