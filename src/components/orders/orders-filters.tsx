"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { orderRanges } from "@/lib/orders";
import { orderStatuses, orderStatusLabel } from "@/components/orders/status-badge";
import { cn } from "@/lib/utils";

function Group({
  legend,
  name,
  options,
  selected,
  onToggle,
}: {
  legend: string;
  name: string;
  options: { value: string; label: string }[];
  selected: string[];
  onToggle: (name: string, value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="t-label mb-3 uppercase tracking-wide">{legend}</legend>
      <div className="flex flex-col gap-1">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-center gap-3 rounded-lg px-1 py-1.5 text-sm hover:bg-surface-container-high"
          >
            <input
              type="checkbox"
              checked={selected.includes(option.value)}
              onChange={() => onToggle(name, option.value)}
              className="size-4 accent-primary"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function OrdersFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  // Reflect clicks instantly; the URL (and the server-rendered list) catches up.
  const [query, setQuery] = useOptimistic(searchParams.toString());
  const current = new URLSearchParams(query);

  const read = (name: string) => current.get(name)?.split(",").filter(Boolean) ?? [];

  function toggle(name: string, value: string) {
    const selected = read(name);
    const next = selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value];
    const params = new URLSearchParams(query);
    params.delete("page");
    if (next.length) params.set(name, next.join(","));
    else params.delete(name);
    startTransition(() => {
      setQuery(params.toString());
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  const active = read("status").length + read("range").length > 0;

  return (
    <aside
      aria-label="Filter orders"
      className={cn(
        "flex flex-col gap-6 rounded-3xl bg-surface-container-lowest p-6 shadow-card transition-opacity",
        pending && "opacity-60",
      )}
    >
      <h2 className="t-headline">Filters</h2>
      <Group
        legend="Order status"
        name="status"
        options={orderStatuses.map((s) => ({ value: s, label: orderStatusLabel(s) }))}
        selected={read("status")}
        onToggle={toggle}
      />
      <hr className="border-outline-variant/40" />
      <Group
        legend="Order time"
        name="range"
        options={orderRanges.map((r) => ({ value: r.value, label: r.label }))}
        selected={read("range")}
        onToggle={toggle}
      />
      {active && (
        <button
          type="button"
          onClick={() =>
            startTransition(() => {
              setQuery("");
              router.replace(pathname);
            })
          }
          className="t-label self-start text-primary hover:underline"
        >
          Clear filters
        </button>
      )}
    </aside>
  );
}
