import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { siteConfig } from "@/config/site";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const money = new Intl.NumberFormat(siteConfig.locale, {
  style: "currency",
  currency: siteConfig.currency,
});

export function formatMoney(value: number) {
  return money.format(value);
}

/** "$12" for whole numbers, "$12.50" otherwise - used on product cards. */
export function formatPrice(value: number) {
  return Number.isInteger(value)
    ? money.format(value).replace(/\.00$/, "")
    : money.format(value);
}

export function formatPriceRange(min: number | null, max: number | null) {
  const low = min ?? max;
  if (low == null) return formatPrice(0);
  if (max == null || min == null || min === max) return formatPrice(low);
  return `${formatPrice(min)} - ${formatPrice(max)}`;
}

export function formatDate(value: string | Date, style: "short" | "medium" | "long" = "medium") {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat(siteConfig.locale, {
    dateStyle: style,
  }).format(date);
}

export function formatDateTime(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat(siteConfig.locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

/** Last N characters of a Mongo id, upper-cased ("#A1B2C3"). */
export function shortId(id: string, length = 6) {
  return id.slice(-length).toUpperCase();
}

/** Stable pseudo-random pick, so a given id always gets the same blob shape. */
export function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

const blobs = ["blob-a", "blob-b", "blob-c"] as const;
export function blobFor(seed: string) {
  return blobs[hashString(seed) % blobs.length];
}

/**
 * Cloudinary can resize + re-encode on the fly. Anything that isn't a
 * Cloudinary upload URL is returned untouched.
 */
export function optimizeImage(url: string | null | undefined, width = 800) {
  if (!url) return null;
  const marker = "/image/upload/";
  if (!url.includes("res.cloudinary.com") || !url.includes(marker)) return url;
  return url.replace(marker, `${marker}f_auto,q_auto,w_${width}/`);
}

/** Only allow same-site relative redirects (`?next=`), never open redirects. */
export function safeNext(value: string | null | undefined, fallback = "/") {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
}

/** "/admin/products?q=x&page=2" from a path plus params, skipping empty values. */
export function pageHref(pathname: string, params: Record<string, string | number | undefined | null>) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value != null && value !== "" && !(key === "page" && Number(value) <= 1)) {
      query.set(key, String(value));
    }
  }
  const qs = query.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}
