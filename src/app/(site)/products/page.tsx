import type { Metadata } from "next";
import { connection } from "next/server";
import { PageShell } from "@/components/site/page-shell";
import { ProductListing } from "@/components/product/product-listing";
import { getAllProducts, getCategories, getProductsByCategory } from "@/lib/api/catalog";
import { parseFilters, parsePage, parseSort } from "@/lib/products";

export async function generateMetadata({ searchParams }: PageProps<"/products">): Promise<Metadata> {
  const { category } = await searchParams;
  return { title: typeof category === "string" && category ? category : "All products" };
}

export default async function ProductsPage({ searchParams }: PageProps<"/products">) {
  await connection();
  const sp = await searchParams;
  const category = typeof sp.category === "string" ? sp.category.trim() : "";

  const [products, categories] = await Promise.all([
    category ? getProductsByCategory(category) : getAllProducts(),
    getCategories().catch(() => []),
  ]);

  return (
    <PageShell>
      <ProductListing
        title={category || "All products"}
        crumbs={[
          { label: "Home", href: "/" },
          ...(category
            ? [{ label: "Products", href: "/products" }, { label: category }]
            : [{ label: "Products" }]),
        ]}
        products={products}
        sort={parseSort(sp.sort)}
        page={parsePage(sp.page)}
        filters={parseFilters(sp)}
        pathname="/products"
        params={{ category: category || undefined }}
        categories={categories.map((c) => c.name)}
        emptyMessage={category ? `Nothing is filed under “${category}” yet.` : undefined}
      />
    </PageShell>
  );
}
