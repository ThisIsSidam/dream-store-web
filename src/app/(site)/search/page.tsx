import { ProductListing } from "@/components/product/product-listing";
import { PageShell } from "@/components/site/page-shell";
import { EmptyState } from "@/components/ui/state";
import { searchProducts } from "@/lib/api/catalog";
import { parseFilters, parsePage, parseSort } from "@/lib/products";
import { Search } from "lucide-react";
import type { Metadata } from "next";
import { connection } from "next/server";

export async function generateMetadata({
  searchParams,
}: PageProps<"/search">): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: typeof q === "string" && q ? `Search: ${q}` : "Search" };
}

export default async function SearchPage({
  searchParams,
}: PageProps<"/search">) {
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
    <PageShell>
      <ProductListing
        title={`Results for “${q}”`}
        crumbs={[{ label: "Home", href: "/" }, { label: "Search" }]}
        products={products}
        sort={parseSort(sp.sort)}
        page={parsePage(sp.page)}
        filters={parseFilters(sp)}
        pathname="/search"
        params={{ q }}
        emptyTitle="Nothing found."
        emptyMessage="We searched everywhere. Unfortunately, whatever you are looking for appears to be even more questionable than our inventory."
      />
    </PageShell>
  );
}
