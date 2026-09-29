import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ProductDetail } from "@/components/product/product-detail";
import { ProductShelf } from "@/components/product/product-shelf";
import Link from "next/link";
import { getProduct, getProductsByCategory } from "@/lib/api/catalog";
import { siteConfig } from "@/config/site";

export async function generateMetadata({ params }: PageProps<"/product/[id]">): Promise<Metadata> {
  const { id } = await params;
  const detail = await getProduct(id).catch(() => null);
  if (!detail) return { title: "Product not found" };
  const { product } = detail;
  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: product.images[0] ? [product.images[0].url] : undefined,
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/product/[id]">) {
  await connection();
  const { id } = await params;
  const detail = await getProduct(id);
  if (!detail) notFound();
  const { product, variants } = detail;
  const similar = (await getProductsByCategory(product.category).catch(() => []))
    .filter((p) => p._id !== product._id)
    .slice(0, 12);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    category: product.category,
    image: product.images.map((image) => image.url),
    offers:
      product.minPrice != null
        ? {
            "@type": "AggregateOffer",
            priceCurrency: siteConfig.currency,
            lowPrice: product.minPrice,
            highPrice: product.maxPrice ?? product.minPrice,
            availability:
              product.totalStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          }
        : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-3 pb-6 sm:px-4 sm:pt-3">
        <nav aria-label="Breadcrumb" className="px-4 pt-3 text-xs text-on-surface-variant sm:px-0 sm:pt-0">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-primary">Home</Link>
            </li>
            <li aria-hidden>›</li>
            <li>
              <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="capitalize hover:text-primary">
                {product.category}
              </Link>
            </li>
            <li aria-hidden>›</li>
            <li className="max-w-[50ch] truncate text-on-surface">{product.name}</li>
          </ol>
        </nav>
        <div className="bg-white shadow-soft">
          <ProductDetail product={product} variants={variants} />
        </div>
        <ProductShelf
          title="Similar products"
          products={similar}
          href={`/products?category=${encodeURIComponent(product.category)}`}
        />
      </div>
    </>
  );
}
