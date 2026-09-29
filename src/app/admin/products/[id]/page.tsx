import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, ImageOff } from "lucide-react";
import { ImageManager, ProductActions, VariantsCard } from "@/components/admin/product-admin";
import { AdminCard, Overline, PageHeading } from "@/components/admin/ui";
import { Badge } from "@/components/ui/badge";
import { RemoteImage } from "@/components/ui/remote-image";
import { getProductDetail } from "@/lib/api/admin";
import { formatPriceRange } from "@/lib/utils";

export const metadata: Metadata = { title: "Product" };

export default async function AdminProductPage({ params }: PageProps<"/admin/products/[id]">) {
  const { id } = await params;
  const detail = await getProductDetail(id);
  if (!detail) notFound();
  const { product, variants } = detail;

  return (
    <>
      <PageHeading
        title={product.name}
        back="/admin/products"
        actions={
          <>
            <Link
              href={`/product/${product._id}`}
              className="inline-flex h-9 items-center gap-2 rounded-full px-4 text-sm font-bold text-on-surface-variant hover:bg-surface-container-high"
            >
              <ExternalLink className="size-4" aria-hidden /> View in store
            </Link>
            <ProductActions key={product.updatedAt} product={product} />
          </>
        }
      />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6">
          <AdminCard className="overflow-hidden">
            <RemoteImage
              src={product.images[0]?.url}
              alt={product.name}
              width={800}
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="h-64 w-full bg-surface-container-low"
              fallback={<ImageOff className="size-10" aria-hidden />}
            />
            <div className="space-y-4 p-6">
              <div>
                <Overline>Category</Overline>
                <Badge tone="info">{product.category}</Badge>
              </div>
              <div>
                <Overline>Description</Overline>
                <p className="whitespace-pre-line text-sm leading-relaxed text-on-surface-variant">
                  {product.description || "—"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-outline-variant/30 pt-4">
                <div>
                  <Overline>Total stock</Overline>
                  <p className="text-lg font-bold">{product.totalStock}</p>
                </div>
                <div>
                  <Overline>Price range</Overline>
                  <p className="text-sm font-bold text-primary">
                    {product.minPrice == null ? "—" : formatPriceRange(product.minPrice, product.maxPrice)}
                  </p>
                </div>
              </div>
            </div>
          </AdminCard>
          <ImageManager product={product} />
        </div>

        <div className="lg:col-span-2">
          <VariantsCard productId={product._id} variants={variants} />
        </div>
      </div>
    </>
  );
}
