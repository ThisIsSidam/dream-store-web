import { PageShell } from "@/components/site/page-shell";
import { getAllProducts, getCategories } from "@/lib/api/catalog";
import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Categories",
  description: "Explore the questionable catalog by taxonomic classification.",
};

export const revalidate = 60;

export default async function CategoriesPage() {
  const [categories, products] = await Promise.all([
    getCategories().catch(() => []),
    getAllProducts().catch(() => []),
  ]);

  const countByCategory = products.reduce<Record<string, number>>((acc, p) => {
    if (p.category) {
      const key = p.category.toLowerCase().trim();
      acc[key] = (acc[key] || 0) + 1;
    }
    return acc;
  }, {});

  // Major categories to feature in large cards
  const majorCategories = categories.filter(
    (cat) => !["All", "New Arrivals", "Limited"].includes(cat.name),
  );
  const displayCards =
    majorCategories.length > 0 ? majorCategories : categories;

  // Build directory list: standard filters first, then all specific categories
  const directoryItems: { name: string; path: string }[] = [
    { name: "All Products", path: "/products" },
    { name: "New Arrivals", path: "/products?filter=new" },
    { name: "Limited Drops", path: "/products?filter=limited" },
    ...categories.map((c) => ({
      name: c.name,
      path: c.path || `/products?category=${encodeURIComponent(c.name)}`,
    })),
  ];

  // Deduplicate by path
  const seenPaths = new Set<string>();
  const uniqueDirectory = directoryItems.filter((item) => {
    if (seenPaths.has(item.path)) return false;
    seenPaths.add(item.path);
    return true;
  });

  return (
    <PageShell>
      <div className="py-6 space-y-8">
        <div className="border-b border-neutral-200 pb-5">
          <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
            All Categories
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500">
            Browse our taxonomy of bizarre, impossible, and unnecessary goods.
          </p>
        </div>

        {/* Major Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCards.map((cat) => {
            const count = countByCategory[cat.name.toLowerCase().trim()] ?? 0;
            const href =
              cat.path || `/products?category=${encodeURIComponent(cat.name)}`;
            const desc =
              cat.description ||
              "Surreal artifacts and items adhering strictly to questionable laws of physics.";

            return (
              <Link
                key={cat._id || cat.name}
                href={href}
                className="group flex flex-col justify-between rounded-xl border border-neutral-200/90 bg-white p-6 transition-all hover:border-neutral-300 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="rounded-md bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-800 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      {cat.name}
                    </span>
                    <span className="text-xs font-mono text-neutral-400">
                      {count} {count === 1 ? "listing" : "listings"}
                    </span>
                  </div>
                  <h2 className="font-sans text-lg font-bold text-neutral-950 group-hover:text-indigo-600 transition-colors">
                    {cat.name}
                  </h2>
                  <p className="mt-2 text-xs text-neutral-500 leading-relaxed">
                    {desc}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-3 text-xs font-semibold text-neutral-800 group-hover:text-indigo-600">
                  <span>View Products</span>
                  <ArrowUpRight className="size-4" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Taxonomic Tag Index */}
        <div className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-6 sm:p-8">
          <h2 className="font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">
            Complete Taxonomic Directory
          </h2>
          <div className="flex flex-wrap gap-2">
            {uniqueDirectory.map((c) => (
              <Link
                key={c.path}
                href={c.path}
                className="rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-xs font-medium text-neutral-800 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
