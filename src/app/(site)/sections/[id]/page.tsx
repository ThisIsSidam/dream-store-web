import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { PageShell } from "@/components/site/page-shell";
import { ProductListing } from "@/components/product/product-listing";
import { getSection } from "@/lib/api/catalog";
import { parsePage, parseSort } from "@/lib/products";

export async function generateMetadata({ params }: PageProps<"/sections/[id]">): Promise<Metadata> {
  const { id } = await params;
  const section = await getSection(id).catch(() => null);
  return { title: section?.title ?? "Collection" };
}

export default async function SectionPage({ params, searchParams }: PageProps<"/sections/[id]">) {
  await connection();
  const { id } = await params;
  const sp = await searchParams;
  const section = await getSection(id);
  if (!section) notFound();

  const products = section.items.flatMap((item) => (item.productId ? [item.productId] : []));

  return (
    <PageShell title={section.title} subtitle="A curated shelf from the back of the void.">
      <ProductListing
        heading={`${products.length} ${products.length === 1 ? "impossibility" : "impossibilities"}`}
        products={products}
        sort={parseSort(sp.sort)}
        page={parsePage(sp.page)}
        pathname={`/sections/${id}`}
      />
    </PageShell>
  );
}
