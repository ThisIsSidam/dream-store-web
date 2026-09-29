import type { Metadata } from "next";
import { Search, Smile } from "lucide-react";
import { connection } from "next/server";
import { PageShell } from "@/components/site/page-shell";
import { ProductListing } from "@/components/product/product-listing";
import { EmptyState } from "@/components/ui/state";
import { searchProducts } from "@/lib/api/catalog";
import { parsePage, parseSort } from "@/lib/products";

export async function generateMetadata({ searchParams }: PageProps<"/search">): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: typeof q === "string" && q ? `Search: ${q}` : "Search" };
}

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  await connection();
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";

  if (!q) {
    return (
      <PageShell>
        <EmptyState
          icon={Search}
          title="What are you looking for?"
          message="Type something in the search bar above to begin."
        />
      </PageShell>
    );
  }

  const products = await searchProducts(q);

  return (
    <PageShell title="Search" subtitle={`${products.length} result${products.length === 1 ? "" : "s"} for “${q}”`}>
      {products.length === 0 ? (
        <EmptyState icon={Smile} title={`No results for “${q}”`} message="Try different keywords." />
      ) : (
        <ProductListing
          heading="Results"
          products={products}
          sort={parseSort(sp.sort)}
          page={parsePage(sp.page)}
          pathname="/search"
          params={{ q }}
        />
      )}
    </PageShell>
  );
}
