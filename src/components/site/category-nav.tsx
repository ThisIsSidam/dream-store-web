import { CATEGORIES_LIST } from "@/lib/data/products";
import Link from "next/link";

export function CategoryNav() {
  return (
    <nav
      aria-label="Categories"
      className="border-b border-neutral-200/80 bg-white/95 backdrop-blur-xs shadow-xs"
    >
      <div className="mx-auto max-w-[1360px] px-4">
        <ul className="scrollbar-none flex items-center gap-1 sm:gap-2 overflow-x-auto py-1.5 text-xs sm:text-sm font-medium text-neutral-600">
          {CATEGORIES_LIST.map((cat) => (
            <li key={cat.id} className="shrink-0">
              <Link
                href={cat.path}
                className="inline-block rounded-md px-3 py-1.5 transition-colors hover:bg-neutral-100 hover:text-neutral-950 focus-visible:bg-neutral-100 focus-visible:outline-hidden"
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
