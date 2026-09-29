import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  page: number;
  totalPages: number;
  /** Builds the href for a page number, keeping the other search params. */
  hrefFor: (page: number) => string;
  className?: string;
};

function pageList(page: number, total: number, siblings = 1): (number | null)[] {
  const pages: (number | null)[] = [1];
  const start = Math.max(1, page - siblings);
  const end = Math.min(total, page + siblings);
  if (start > 2) pages.push(null);
  for (let i = start; i <= end; i++) if (i !== 1 && i !== total) pages.push(i);
  if (end < total - 1) pages.push(null);
  if (total > 1) pages.push(total);
  return pages;
}

export function Pagination({ page, totalPages, hrefFor, className }: Props) {
  if (totalPages <= 1) return null;

  const arrow = "grid size-10 place-items-center rounded-full transition-colors";
  const enabled = "text-on-surface hover:bg-surface-container-high";
  const disabled = "pointer-events-none text-on-surface/30";

  return (
    <nav aria-label="Pagination" className={cn("flex items-center justify-center gap-1", className)}>
      <Link
        href={hrefFor(Math.max(1, page - 1))}
        aria-label="Previous page"
        aria-disabled={page <= 1}
        className={cn(arrow, page <= 1 ? disabled : enabled)}
      >
        <ChevronLeft className="size-5" />
      </Link>
      {pageList(page, totalPages).map((p, i) =>
        p === null ? (
          <span key={`gap-${i}`} className="px-1.5 text-on-surface-variant">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={hrefFor(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "t-label grid h-10 min-w-10 place-items-center rounded-full px-3 transition-colors",
              p === page ? "bg-primary text-on-primary" : "text-on-surface hover:bg-surface-container-high",
            )}
          >
            {p}
          </Link>
        ),
      )}
      <Link
        href={hrefFor(Math.min(totalPages, page + 1))}
        aria-label="Next page"
        aria-disabled={page >= totalPages}
        className={cn(arrow, page >= totalPages ? disabled : enabled)}
      >
        <ChevronRight className="size-5" />
      </Link>
    </nav>
  );
}
