import Link from "next/link";
import { RemoteImage } from "@/components/ui/remote-image";
import type { Category } from "@/lib/api/types";

export function CategoryStrip({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <section aria-label="Shop by category" className="bg-white shadow-soft">
      <ul className="scrollbar-none mx-auto flex max-w-[1280px] gap-2 overflow-x-auto px-2 py-3 sm:justify-center sm:gap-6 sm:py-4">
        {categories.map((category) => (
          <li key={category._id} className="shrink-0">
            <Link
              href={`/products?category=${encodeURIComponent(category.name)}`}
              className="group flex w-20 flex-col items-center gap-2 text-center sm:w-24"
            >
              <RemoteImage
                src={category.imageUrl}
                alt=""
                width={200}
                sizes="72px"
                className="size-14 rounded-full bg-surface-container-high sm:size-[72px]"
                imgClassName="transition-transform duration-300 group-hover:scale-110"
              />
              <span className="w-full truncate text-xs font-semibold capitalize group-hover:text-primary sm:text-sm">
                {category.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
