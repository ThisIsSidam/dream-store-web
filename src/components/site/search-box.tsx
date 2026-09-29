"use client";

import { ProductVisual } from "@/components/ui/product-visual";
import { searchCatalog, type CatalogProduct } from "@/lib/data/products";
import { cn, formatPrice } from "@/lib/utils";
import {
  ArrowRight,
  HelpCircle,
  Search,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

const POPULAR_SEARCHES = [
  "things that shouldn't exist",
  "cheap weird stuff",
  "black hole",
  "something unnecessary",
  "gift for someone impossible to shop for",
];

const SUGGESTED_CATEGORIES = [
  { name: "Science", query: "Science" },
  { name: "Collectibles", query: "Collectibles" },
  { name: "Home", query: "Home" },
  { name: "Weird Stuff", query: "Weird Stuff" },
];

export function SearchBox({
  className,
  autoFocus,
  placeholder = "Search for something questionable...",
}: {
  className?: string;
  autoFocus?: boolean;
  placeholder?: string;
}) {
  const router = useRouter();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<CatalogProduct[]>([]);
  const [active, setActive] = useState(-1);

  const query = value.trim();

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const matches = searchCatalog(query).slice(0, 5);
    setResults(matches);
    setActive(-1);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function submit(term = query) {
    if (!term) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(term)}`);
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      setOpen(false);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => Math.max(i - 1, -1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const picked = results[active];
      if (picked) {
        setOpen(false);
        router.push(`/product/${picked.id}`);
      } else {
        submit();
      }
    }
  }

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      {/* Search Input Bar */}
      <div className="flex h-10 w-full items-center rounded-lg border border-neutral-300/80 bg-neutral-50/70 px-3 transition-all focus-within:border-indigo-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 shadow-xs">
        <Search className="size-4 shrink-0 text-neutral-400 mr-2" aria-hidden />
        <input
          type="search"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-label="Search questionable products"
          autoFocus={autoFocus}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400 [&::-webkit-search-cancel-button]:hidden"
        />
        {value && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setValue("");
              setResults([]);
            }}
            className="grid size-6 place-items-center rounded-full text-neutral-400 hover:bg-neutral-200/60 hover:text-neutral-700 mr-1"
          >
            <X className="size-3.5" />
          </button>
        )}
        <button
          type="button"
          onClick={() => submit()}
          className="rounded-md bg-indigo-600 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          Search
        </button>
      </div>

      {/* Autocomplete / Suggested Dropdown */}
      {open && (
        <div className="absolute inset-x-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-xl border border-neutral-200 bg-white p-3 shadow-xl">
          {/* If user is typing query, show instant product results */}
          {query ? (
            <div>
              <div className="mb-2 flex items-center justify-between px-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                <span>Matching Products</span>
                <span className="font-normal lowercase text-neutral-400">
                  press enter to see all
                </span>
              </div>

              {results.length > 0 ? (
                <ul
                  id={listId}
                  role="listbox"
                  className="divide-y divide-neutral-100"
                >
                  {results.map((product, i) => (
                    <li
                      key={product.id}
                      role="option"
                      aria-selected={i === active}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setOpen(false);
                          router.push(`/product/${product.id}`);
                        }}
                        onMouseEnter={() => setActive(i)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors",
                          i === active
                            ? "bg-neutral-100"
                            : "hover:bg-neutral-50",
                        )}
                      >
                        <div className="size-10 shrink-0 overflow-hidden rounded-md border border-neutral-200">
                          <ProductVisual
                            visualId={product.visualId}
                            name={product.name}
                            showStudioLighting={false}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-neutral-900">
                            {product.name}
                          </p>
                          <p className="truncate text-xs text-neutral-500">
                            {product.category} • {product.shortDescription}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <span className="text-sm font-bold text-neutral-900">
                            {formatPrice(product.price)}
                          </span>
                          <span className="block text-[10px] text-emerald-600 font-medium">
                            In Stock
                          </span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-6 text-center text-neutral-500">
                  <p className="text-sm font-medium">
                    No questionable matches for &ldquo;{query}&rdquo;.
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    Whatever you are looking for might be too normal for our
                    catalog.
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={() => submit()}
                className="mt-3 flex w-full items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-semibold text-neutral-800 transition-colors hover:bg-neutral-100"
              >
                <span>View all search results for &ldquo;{query}&rdquo;</span>
                <ArrowRight className="size-3.5 text-neutral-500" />
              </button>
            </div>
          ) : (
            /* If search bar is empty, show Popular Searches, Suggested Categories, and Easter Egg */
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-1.5 px-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                  <TrendingUp className="size-3.5 text-indigo-500" />
                  <span>Popular Searches</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_SEARCHES.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => {
                        setValue(term);
                        submit(term);
                      }}
                      className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs text-neutral-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 px-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                  <Sparkles className="size-3.5 text-indigo-500" />
                  <span>Suggested Categories</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {SUGGESTED_CATEGORIES.map((cat) => (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        router.push(
                          `/products?category=${encodeURIComponent(cat.query)}`,
                        );
                      }}
                      className="flex items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50/70 p-2 text-left text-xs text-neutral-800 transition-colors hover:bg-neutral-100"
                    >
                      <span className="font-medium">{cat.name}</span>
                      <ArrowRight className="size-3 text-neutral-400" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Deadpan Easter Egg Note */}
              <div className="flex items-center gap-2 rounded-lg bg-indigo-50/60 p-2.5 text-xs text-indigo-900">
                <HelpCircle className="size-4 shrink-0 text-indigo-500" />
                <p>
                  <span className="font-semibold">Live metric:</span> People are
                  currently searching for &ldquo;why&rdquo;.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
