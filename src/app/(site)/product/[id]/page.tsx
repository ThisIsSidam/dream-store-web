import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ProductDetail } from "@/components/product/product-detail";
import { ProductExtras } from "@/components/product/product-extras";
import { getProduct } from "@/lib/api/catalog";
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
      <div className="mx-auto w-full max-w-7xl px-6 pb-8 pt-8 md:px-8 md:pt-12">
        <ProductDetail product={product} variants={variants} />
      </div>
      <ProductExtras />
    </>
  );
}
