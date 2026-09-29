import type { OrderStatus } from "./api/types";

export const orderRanges = [
  { value: "last30", label: "Last 30 days" },
  { value: "thisYear", label: "This year" },
  { value: "lastYear", label: "Last year" },
  { value: "older", label: "Older" },
] as const;

export type OrderRange = (typeof orderRanges)[number]["value"];

const STATUSES: OrderStatus[] = ["pending", "confirmed", "failed", "cancelled"];

export function parseStatuses(value: string | string[] | undefined): OrderStatus[] {
  const raw = (Array.isArray(value) ? value.join(",") : (value ?? "")).split(",");
  return raw.filter((s): s is OrderStatus => STATUSES.includes(s as OrderStatus));
}

export function parseRanges(value: string | string[] | undefined): OrderRange[] {
  const raw = (Array.isArray(value) ? value.join(",") : (value ?? "")).split(",");
  return raw.filter((r): r is OrderRange => orderRanges.some((o) => o.value === r));
}

function rangeBounds(range: OrderRange, now: Date): { from?: Date; to?: Date } {
  const year = now.getFullYear();
  switch (range) {
    case "last30":
      return { from: new Date(now.getTime() - 30 * 86_400_000), to: now };
    case "thisYear":
      return { from: new Date(year, 0, 1), to: new Date(year + 1, 0, 1, 0, 0, 0, -1) };
    case "lastYear":
      return { from: new Date(year - 1, 0, 1), to: new Date(year, 0, 1, 0, 0, 0, -1) };
    case "older":
      return { to: new Date(year - 1, 0, 1, 0, 0, 0, -1) };
  }
}

/**
 * The backend takes a single from/to window, so several ranges collapse into
 * their bounding box (an open-ended range like "Older" leaves `from` unset).
 */
export function rangesToWindow(ranges: OrderRange[], now = new Date()) {
  if (ranges.length === 0) return {};
  const bounds = ranges.map((r) => rangeBounds(r, now));
  const openStart = bounds.some((b) => !b.from);
  const froms = bounds.flatMap((b) => (b.from ? [b.from.getTime()] : []));
  const tos = bounds.flatMap((b) => (b.to ? [b.to.getTime()] : []));
  return {
    from: openStart || froms.length === 0 ? undefined : new Date(Math.min(...froms)).toISOString(),
    to: tos.length ? new Date(Math.max(...tos)).toISOString() : undefined,
  };
}
