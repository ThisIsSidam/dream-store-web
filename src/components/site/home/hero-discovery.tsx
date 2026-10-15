import { ProductVisual } from "@/components/ui/product-visual";
import type { Banner, Product } from "@/lib/api/types";
import { formatPrice } from "@/lib/utils";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

interface HeroDiscoveryProps {
  banner?: Banner;
  featuredProducts?: Product[];
}

export function HeroDiscovery({ banner, featuredProducts }: HeroDiscoveryProps) {
  const title = banner?.title || "Things you didn't know you needed.";
  const description =
    banner?.description ||
    "A marketplace for objects, ideas, and other questionable necessities. Engineered with complete seriousness for the discerning absurdist.";
  const ctaLink = banner?.link || "/products";
  return (
    <section className="relative overflow-hidden border-b border-neutral-200/80 bg-white py-12 md:py-16">
      {/* Subtle background grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="relative mx-auto max-w-[1360px] px-4">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral-700 mb-6">
              <Sparkles className="size-3.5 text-indigo-600" />
              <span>Autumn 2026 Questionable Collection</span>
            </div>

            <h1 className="font-sans text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-950 leading-[1.12]">
              {title}
            </h1>

            <p className="mt-5 text-base sm:text-xl text-neutral-600 leading-relaxed max-w-2xl">
              {description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href={ctaLink}
                className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-indigo-600 shadow-sm hover:shadow"
              >
                <span>Start Exploring</span>
                <ArrowRight className="size-4" />
              </Link>

              <Link
                href="/products?filter=new"
                className="inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-6 py-3.5 text-sm font-semibold text-neutral-800 transition-colors hover:bg-neutral-50"
              >
                <span>See What&apos;s New</span>
              </Link>
            </div>

            {/* Micro Deadpan Statistics */}
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-neutral-100 pt-6 max-w-lg">
              <div>
                <p className="text-xl sm:text-2xl font-bold text-neutral-900">
                  100%
                </p>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Serious Delivery
                </p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-neutral-900">
                  0.00%
                </p>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Utility Guaranteed
                </p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-neutral-900">
                  2,730
                </p>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Cardboard Units
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Visually interesting composition of bizarre products */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              {/* Outer decorative ring */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-indigo-50/50 via-neutral-100/30 to-purple-50/50 blur-xl pointer-events-none" />

              {/* Dynamic composition arrangement */}
              <div className="relative grid grid-cols-2 gap-3.5">
                {(featuredProducts && featuredProducts.length > 0
                  ? featuredProducts.slice(0, 4)
                  : [
                      {
                        _id: "bottled-echoes",
                        slug: "bottled-echoes",
                        name: "Bottled Echoes",
                        category: "Collectibles",
                        minPrice: 399,
                        visualId: "bottled-echoes",
                        badge: "Collectibles",
                        isLimited: false,
                      },
                      {
                        _id: "emergency-backup-moon",
                        slug: "emergency-backup-moon",
                        name: "Backup Moon",
                        category: "Science",
                        minPrice: 12999,
                        visualId: "emergency-backup-moon",
                        badge: "Only 3 Left",
                        isLimited: true,
                      },
                      {
                        _id: "luxury-cardboard",
                        slug: "luxury-cardboard",
                        name: "Luxury Cardboard",
                        category: "Home",
                        minPrice: 399,
                        visualId: "luxury-cardboard",
                        badge: "Artisanal",
                        isLimited: false,
                      },
                      {
                        _id: "extra-tuesday",
                        slug: "extra-tuesday",
                        name: "Extra Tuesday",
                        category: "Everyday Things",
                        minPrice: 89,
                        visualId: "extra-tuesday",
                        badge: "+24 Hours",
                        isLimited: false,
                      },
                    ]
                ).map((item) => {
                  const href = `/product/${item.slug || item._id}`;
                  const priceStr = formatPrice(
                    item.minPrice ?? ("maxPrice" in item ? (item.maxPrice as number) : 99) ?? 99,
                  );
                  const isItemLimited = "isLimited" in item && Boolean(item.isLimited);
                  const badgeText =
                    item.badge ||
                    (isItemLimited ? "Limited" : item.category) ||
                    "Surreal";

                  return (
                    <Link
                      key={item._id || item.slug}
                      href={href}
                      className="group relative rounded-xl border border-neutral-200/80 bg-white p-3 shadow-xs transition-all hover:shadow-md hover:border-indigo-300"
                    >
                      <div className="aspect-square w-full rounded-lg bg-neutral-50 overflow-hidden">
                        <ProductVisual
                          visualId={item.visualId || item.slug || "generic"}
                          name={item.name}
                        />
                      </div>
                      <div className="mt-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wide truncate max-w-[90px]">
                            {badgeText}
                          </span>
                          <span className="text-xs font-bold text-neutral-900 shrink-0">
                            {priceStr}
                          </span>
                        </div>
                        <p className="truncate text-xs font-semibold text-neutral-900 group-hover:text-indigo-600">
                          {item.name}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Floating verified badge */}
              <div className="absolute -bottom-3 -right-3 rounded-lg border border-neutral-200 bg-white/95 px-3 py-1.5 shadow-md backdrop-blur-xs flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-neutral-800">
                  Verified Somehow
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
