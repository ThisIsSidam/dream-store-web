import Link from "next/link";
import { getCategories } from "@/lib/api/catalog";
import { HideOnHome } from "./hide-on-home";

/** Text-link category bar under the header (md and up); the home page has its icon strip instead. */
export async function CategoryNav() {
  const categories = await getCategories().catch(() => []);
  if (categories.length === 0) return null;

  return (
    <HideOnHome>
      <nav aria-label="Categories" className="hidden bg-white shadow-soft md:block">
        <ul className="scrollbar-none mx-auto flex max-w-[1280px] items-center gap-8 overflow-x-auto px-4">
          <li className="shrink-0">
            <Link href="/products" className="block py-2.5 text-sm font-semibold hover:text-primary">
              All products
            </Link>
          </li>
          {categories.map((category) => (
            <li key={category._id} className="shrink-0">
              <Link
                href={`/products?category=${encodeURIComponent(category.name)}`}
                className="block py-2.5 text-sm font-semibold capitalize hover:text-primary"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </HideOnHome>
  );
}
