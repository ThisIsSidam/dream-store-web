import type { Metadata } from "next";
import { connection } from "next/server";
import { PageShell } from "@/components/site/page-shell";
import { ProductListing } from "@/components/product/product-listing";
import { getAllProducts, getProductsByCategory } from "@/lib/api/catalog";
import { parsePage, parseSort } from "@/lib/products";

export async function generateMetadata({ searchParams }: PageProps<"/products">): Promise<Metadata> {
  const { category } = await searchParams;
  return { title: typeof category === "string" && category ? category : "All products" };
}

export default async function ProductsPage({ searchParams }: PageProps<"/products">) {
  await connection();
  const sp = await searchParams;
  const category = typeof sp.category === "string" ? sp.category.trim() : "";
  const sort = parseSort(sp.sort);
  const page = parsePage(sp.page);

  const products = category ? await getProductsByCategory(category) : await getAllProducts();

  return (
    <PageShell
      title={category ? category : "Everything"}
      subtitle={category ? "Handpicked from this corridor of unreality." : "Every impossibility we currently stock."}
      className="[&_h1]:capitalize"
    >
      <ProductListing
        heading={category ? `Showing results for “${category}”` : "Showing all products"}
        products={products}
        sort={sort}
        page={page}
        pathname="/products"
        params={{ category: category || undefined }}
        emptyTitle="No products found"
        emptyMessage={category ? `Nothing is filed under “${category}” yet.` : undefined}
      />
    </PageShell>
  );
}
