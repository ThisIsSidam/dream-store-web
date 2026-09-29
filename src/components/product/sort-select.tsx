"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { sortOptions, type SortOption } from "@/lib/products";

export function SortSelect({ value }: { value: SortOption }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function onChange(next: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (next === "relevance") params.delete("sort");
    else params.set("sort", next);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">Sort by</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="t-body-md h-11 cursor-pointer appearance-none rounded-[14px] border border-outline-variant/60 bg-surface-container-highest pl-3.5 pr-10 text-on-surface outline-none focus-visible:ring-2 focus-visible:ring-primary-container/50"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 size-5 text-on-surface-variant" aria-hidden />
    </label>
  );
}
