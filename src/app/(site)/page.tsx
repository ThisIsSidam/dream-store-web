import { ProductCard } from "@/components/product/product-card";
import { CategoryGrid } from "@/components/site/home/category-grid";
import { HeroDiscovery } from "@/components/site/home/hero-discovery";
import { HowItWorks } from "@/components/site/home/how-it-works";
import { LimitedSection } from "@/components/site/home/limited-section";
import { MysteryDrop } from "@/components/site/home/mystery-drop";
import { Newsletter } from "@/components/site/home/newsletter";
import { RecentlyViewed } from "@/components/site/home/recently-viewed";
import { WhyExists } from "@/components/site/home/why-exists";
import { getAllProducts, getBanners, getCategories, getSections } from "@/lib/api/catalog";
import type { Product } from "@/lib/api/types";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function HomePage() {
  const [sections, categories, banners, allProducts] = await Promise.all([
    getSections().catch(() => []),
    getCategories().catch(() => []),
    getBanners().catch(() => []),
    getAllProducts().catch(() => []),
  ]);

  const trendingSection = sections.find((s) => s.title === "Trending Now");
  const limitedSection = sections.find(
    (s) => s.title === "The Unnecessarily Limited",
  );
  const favoritesSection = sections.find(
    (s) => s.title === "Customer Favorites",
  );

  const trendingProducts: Product[] =
    trendingSection?.items
      ?.map((i) => i.productId)
      ?.filter((p): p is Product => Boolean(p && p._id)) ||
    allProducts.slice(0, 8);

  const limitedProducts: Product[] =
    limitedSection?.items
      ?.map((i) => i.productId)
      ?.filter((p): p is Product => Boolean(p && p._id)) ||
    allProducts.filter((p) => p.isLimited || p.totalStock < 100).slice(0, 4);

  const customerFavorites: Product[] =
    favoritesSection?.items
      ?.map((i) => i.productId)
      ?.filter((p): p is Product => Boolean(p && p._id)) ||
    [...allProducts]
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      .slice(0, 8);

  return (
    <div className="flex flex-col bg-white">
      {/* 1. Hero / Discovery Section */}
      <HeroDiscovery
        banner={banners[0]}
        featuredProducts={trendingProducts.slice(0, 4)}
      />

      {/* 2. Trending Now (Section 7: Heading: "Trending Now", Subtext: "Apparently, people are buying these.") */}
      <section className="border-b border-neutral-200/80 bg-white py-12 md:py-16">
        <div className="mx-auto max-w-[1360px] px-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
            <div>
              <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
                Trending Now
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                Apparently, people are buying these.
              </p>
            </div>
            <Link
              href="/products"
              className="group inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              <span>View full catalog</span>
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {trendingProducts.slice(0, 8).map((p) => (
              <ProductCard key={p._id || p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Shop by Category / Category Exploration */}
      <CategoryGrid categories={categories} />

      {/* 4. The Unnecessarily Limited Section */}
      <LimitedSection items={limitedProducts} />

      {/* 5. Mystery Drop Section */}
      <MysteryDrop />

      {/* 6. Why Does This Exist? Section */}
      <WhyExists />

      {/* 7. Customer Favorites */}
      <section className="border-b border-neutral-200/80 bg-white py-12 md:py-16">
        <div className="mx-auto max-w-[1360px] px-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
            <div>
              <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
                Customer Favorites
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                Products that have acquired strange cult followings and
                undeniable domestic permanence.
              </p>
            </div>
            <Link
              href="/products?filter=bestseller"
              className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              See all bestsellers →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {customerFavorites.slice(0, 8).map((p) => (
              <ProductCard key={p._id || p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* 8. How It Works Protocol */}
      <HowItWorks />

      {/* 9. Recently Viewed */}
      <RecentlyViewed />

      {/* 10. Newsletter */}
      <div className="border-t border-neutral-200 bg-neutral-50 py-10">
        <div className="mx-auto max-w-[1360px] px-4">
          <Newsletter />
        </div>
      </div>
    </div>
  );
}
