"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { api } from "@/lib/client/api";
import type { Paginated, Product } from "@/lib/api/types";
import { cn, formatPriceRange } from "@/lib/utils";

const MIN_CHARS = 3;

/**
 * Header search with live suggestions from the catalogue.
 * Enter (or picking "See all results") goes to /search?q=...
 */
export function SearchBox({ className, autoFocus }: { className?: string; autoFocus?: boolean }) {
  const router = useRouter();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [active, setActive] = useState(-1);
  const query = value.trim();
  const searchable = query.length >= MIN_CHARS;

  useEffect(() => {
    if (!searchable) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const data = await api<Paginated<"products", Product>>(
          `products/search?query=${encodeURIComponent(query)}&limit=6`,
        );
        if (!controller.signal.aborted) {
          setResults(data.products);
          setActive(-1);
        }
      } catch {
        if (!controller.signal.aborted) setResults([]);
      }
    }, 250);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query, searchable]);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const showList = open && searchable;
  const visible = searchable ? results : [];

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
      setActive((i) => Math.min(i + 1, visible.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => Math.max(i - 1, -1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const picked = visible[active];
      if (picked) {
        setOpen(false);
        router.push(`/product/${picked._id}`);
      } else {
        submit();
      }
    }
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <div className="flex h-[46px] items-center gap-2.5 rounded-[14px] border border-outline-variant/60 bg-surface-container-highest px-3.5 focus-within:ring-2 focus-within:ring-primary-container/40">
        <Search className="size-5 shrink-0 text-on-surface-variant" aria-hidden />
        <input
          type="search"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          aria-label="Search products"
          autoFocus={autoFocus}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search products..."
          className="t-body-md min-w-0 flex-1 bg-transparent text-on-surface outline-none placeholder:text-on-surface-variant [&::-webkit-search-cancel-button]:hidden"
        />
        {value && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setValue("");
              setOpen(false);
            }}
            className="grid size-8 place-items-center rounded-full text-on-surface-variant hover:bg-surface-container-high"
          >
            <X className="size-5" />
          </button>
        )}
      </div>

      {showList && (
        <div className="absolute inset-x-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-[18px] bg-surface py-2 shadow-[0_16px_40px_rgb(0_0_0/0.14)] ring-1 ring-outline-variant/40">
          <ul id={listId} role="listbox" className="max-h-80 overflow-y-auto">
            {visible.map((product, i) => (
              <li
                key={product._id}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
              >
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    router.push(`/product/${product._id}`);
                  }}
                  onMouseEnter={() => setActive(i)}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-2.5 text-left",
                    i === active && "bg-surface-container-high",
                  )}
                >
                  <Search className="size-4 shrink-0 text-on-surface-variant" aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="t-body-md block truncate text-on-surface">{product.name}</span>
                    <span className="block truncate text-xs capitalize text-on-surface-variant">
                      {product.category}
                    </span>
                  </span>
                  <span className="t-label shrink-0 text-primary">
                    {formatPriceRange(product.minPrice, product.maxPrice)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          {visible.length === 0 && (
            <p className="t-body-md px-4 py-3 text-on-surface-variant">No matches yet.</p>
          )}
          <button
            type="button"
            onClick={() => submit()}
            className="t-label mt-1 block w-full border-t border-outline-variant/40 px-4 py-3 text-left text-primary hover:bg-surface-container-high"
          >
            See all results for “{query}”
          </button>
        </div>
      )}
    </div>
  );
}
