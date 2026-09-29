import type { Metadata } from "next";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { PageShell } from "@/components/site/page-shell";
import { LinkButton } from "@/components/ui/button";
import { RemoteImage } from "@/components/ui/remote-image";
import { EmptyState } from "@/components/ui/state";
import { getCategories } from "@/lib/api/catalog";
import { blobFor } from "@/lib/utils";
import { connection } from "next/server";

export const metadata: Metadata = { title: "Categories" };

export default async function CategoriesPage() {
  await connection();
  const categories = await getCategories();

  return (
    <PageShell
      title="Impossible Categories"
      subtitle="Choose a corridor of unreality and keep browsing."
      width="max-w-[1180px]"
      actions={
        <LinkButton href="/products" variant="soft">
          Browse everything
        </LinkButton>
      }
    >
      {categories.length === 0 ? (
        <EmptyState icon={LayoutGrid} title="No categories manifested yet." />
      ) : (
        <ul className="grid grid-cols-2 gap-[18px] md:grid-cols-4">
          {categories.map((category) => (
            <li key={category._id}>
              <Link
                href={`/products?category=${encodeURIComponent(category.name)}`}
                className="group flex aspect-[0.82] h-full flex-col rounded-[28px] border-[1.5px] border-surface-container-highest bg-surface-container-low p-[18px] shadow-[0_8px_18px_rgb(0_0_0/0.03)] transition-transform hover:-translate-y-1 md:aspect-[0.9]"
              >
                <RemoteImage
                  src={category.imageUrl}
                  alt=""
                  width={500}
                  sizes="(max-width: 768px) 45vw, 22vw"
                  className={`min-h-0 flex-1 bg-secondary-container/35 ${blobFor(category._id)}`}
                  imgClassName="transition-transform duration-500 group-hover:scale-105"
                />
                <span className="t-label mt-4 line-clamp-2 text-center capitalize">{category.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
