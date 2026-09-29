import Link from "next/link";
import { RemoteImage } from "@/components/ui/remote-image";
import type { Category } from "@/lib/api/types";

export function CategoryStrip({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="px-6 py-6 md:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="t-headline">Categories</h2>
        <ul className="scrollbar-none -mx-2 mt-4 flex gap-6 overflow-x-auto px-2 pb-2">
          {categories.map((category) => (
            <li key={category._id} className="shrink-0">
              <Link
                href={`/products?category=${encodeURIComponent(category.name)}`}
                className="group flex w-20 flex-col items-center gap-2 text-center"
              >
                <RemoteImage
                  src={category.imageUrl}
                  alt=""
                  width={160}
                  sizes="60px"
                  className="size-[60px] rounded-full bg-surface-container-highest ring-0 ring-primary-container transition-shadow group-hover:ring-4"
                />
                <span className="t-body-md w-full truncate capitalize">{category.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
