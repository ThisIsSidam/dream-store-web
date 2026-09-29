import { ProductCard } from "@/components/product/product-card";
import { CategoryGrid } from "@/components/site/home/category-grid";
import { HeroDiscovery } from "@/components/site/home/hero-discovery";
import { HowItWorks } from "@/components/site/home/how-it-works";
import { LimitedSection } from "@/components/site/home/limited-section";
import { MysteryDrop } from "@/components/site/home/mystery-drop";
import { Newsletter } from "@/components/site/home/newsletter";
import { RecentlyViewed } from "@/components/site/home/recently-viewed";
import { WhyExists } from "@/components/site/home/why-exists";
import {
  getCustomerFavorites,
  getTrendingProducts,
  toStoreProduct,
} from "@/lib/data/products";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const trendingProducts = getTrendingProducts();
  const customerFavorites = getCustomerFavorites();

  return (
    <div className="flex flex-col bg-white">
      {/* 1. Hero / Discovery Section */}
      <HeroDiscovery />

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
            {trendingProducts.map((p) => (
              <ProductCard key={p.id} product={toStoreProduct(p)} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Shop by Category / Category Exploration */}
      <CategoryGrid />

      {/* 4. The Unnecessarily Limited Section */}
      <LimitedSection />

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
            {customerFavorites.map((p) => (
              <ProductCard key={p.id} product={toStoreProduct(p)} />
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
