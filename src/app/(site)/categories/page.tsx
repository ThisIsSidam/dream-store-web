import type { Metadata } from "next";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { connection } from "next/server";
import { PageShell } from "@/components/site/page-shell";
import { RemoteImage } from "@/components/ui/remote-image";
import { EmptyState } from "@/components/ui/state";
import { getCategories } from "@/lib/api/catalog";

export const metadata: Metadata = { title: "Categories" };

export default async function CategoriesPage() {
  await connection();
  const categories = await getCategories();

  return (
    <PageShell>
      <section className="bg-white shadow-soft">
        <h1 className="border-b border-outline-variant/40 px-4 py-4 font-display text-lg font-bold sm:px-6">
          Shop by category
        </h1>
        {categories.length === 0 ? (
          <EmptyState icon={LayoutGrid} title="No categories yet" />
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {categories.map((category) => (
              <li key={category._id} className="-mb-px -mr-px border-b border-r border-outline-variant/40">
                <Link
                  href={`/products?category=${encodeURIComponent(category.name)}`}
                  className="group flex flex-col items-center gap-3 p-5 text-center transition-shadow hover:shadow-float"
                >
                  <RemoteImage
                    src={category.imageUrl}
                    alt=""
                    width={400}
                    sizes="160px"
                    className="size-28 rounded-full bg-surface-container-high sm:size-32"
                    imgClassName="transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="font-medium capitalize group-hover:text-primary">{category.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </PageShell>
  );
}
