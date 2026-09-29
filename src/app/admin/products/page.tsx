import type { Metadata } from "next";
import { Eye, ImageOff, Plus } from "lucide-react";
import Image from "next/image";
import { AdminCard, DataTable, EmptyRow, IdTag, PageHeading, RowLink, Td, Th, Tr } from "@/components/admin/ui";
import { SearchInput } from "@/components/admin/search-input";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { listProducts } from "@/lib/api/admin";
import { parsePage } from "@/lib/products";
import { formatPriceRange, optimizeImage, pageHref } from "@/lib/utils";

export const metadata: Metadata = { title: "Products" };

export default async function AdminProducts({ searchParams }: PageProps<"/admin/products">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const { products, pagination } = await listProducts({ page: parsePage(sp.page), query: q });

  return (
    <>
      <PageHeading
        title="Product Catalog"
        actions={
          <>
            <SearchInput placeholder="Search products..." />
            <LinkButton href="/admin/products/new" size="sm">
              <Plus className="size-4" aria-hidden /> Add Product
            </LinkButton>
          </>
        }
      />
      <AdminCard className="overflow-hidden">
        <DataTable>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Image</Th>
              <Th>Name</Th>
              <Th>Category</Th>
              <Th>Price range</Th>
              <Th>Stock</Th>
              <Th>
                <span className="sr-only">Actions</span>
              </Th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && <EmptyRow colSpan={7}>No products found.</EmptyRow>}
            {products.map((product) => {
              const image = optimizeImage(product.images[0]?.url, 120);
              return (
                <Tr key={product._id}>
                  <Td>
                    <IdTag id={product._id} kind="products" />
                  </Td>
                  <Td>
                    <span className="relative block size-12 overflow-hidden rounded-lg border border-outline-variant/40 bg-surface-container-low">
                      {image ? (
                        <Image src={image} alt="" fill unoptimized sizes="48px" className="object-cover" />
                      ) : (
                        <ImageOff className="absolute inset-0 m-auto size-5 text-outline" aria-hidden />
                      )}
                    </span>
                  </Td>
                  <Td>
                    <RowLink href={`/admin/products/${product._id}`} className="block max-w-56 truncate font-medium">
                      {product.name}
                    </RowLink>
                  </Td>
                  <Td>
                    <Badge tone="info" className="!py-1 text-[10px]">
                      {product.category}
                    </Badge>
                  </Td>
                  <Td className="font-semibold text-primary">{formatPriceRange(product.minPrice, product.maxPrice)}</Td>
                  <Td className={product.totalStock > 10 ? "font-medium text-emerald-700" : "font-medium text-amber-700"}>
                    {product.totalStock} units
                  </Td>
                  <Td>
                    <Eye className="size-4 text-on-surface-variant" aria-hidden />
                  </Td>
                </Tr>
              );
            })}
          </tbody>
        </DataTable>
        <div className="border-t border-outline-variant/30 p-3">
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            hrefFor={(page) => pageHref("/admin/products", { q, page })}
          />
        </div>
      </AdminCard>
    </>
  );
}
