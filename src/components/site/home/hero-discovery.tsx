"use client";

import { ProductVisual } from "@/components/ui/product-visual";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function HeroDiscovery() {
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
              Things you didn&apos;t know you needed.
            </h1>

            <p className="mt-5 text-base sm:text-xl text-neutral-600 leading-relaxed max-w-2xl">
              A marketplace for objects, ideas, and other questionable
              necessities. Engineered with complete seriousness for the
              discerning absurdist.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/products"
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

          {/* Right Column: Visually interesting composition of several bizarre products floating like a premium campaign */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              {/* Outer decorative ring */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-indigo-50/50 via-neutral-100/30 to-purple-50/50 blur-xl pointer-events-none" />

              {/* Composition arrangement */}
              <div className="relative grid grid-cols-2 gap-3.5">
                {/* Product 1: Bottled Echoes */}
                <Link
                  href="/product/bottled-echoes"
                  className="group relative rounded-xl border border-neutral-200/80 bg-white p-3 shadow-xs transition-all hover:shadow-md hover:border-indigo-300"
                >
                  <div className="aspect-square w-full rounded-lg bg-neutral-50 overflow-hidden">
                    <ProductVisual
                      visualId="bottled-echoes"
                      name="Bottled Echoes"
                    />
                  </div>
                  <div className="mt-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wide">
                        Collectibles
                      </span>
                      <span className="text-xs font-bold text-neutral-900">
                        $399
                      </span>
                    </div>
                    <p className="truncate text-xs font-semibold text-neutral-900 group-hover:text-indigo-600">
                      Bottled Echoes
                    </p>
                  </div>
                </Link>

                {/* Product 2: Emergency Backup Moon */}
                <Link
                  href="/product/emergency-backup-moon"
                  className="group relative rounded-xl border border-neutral-200/80 bg-white p-3 shadow-xs transition-all hover:shadow-md hover:border-indigo-300"
                >
                  <div className="aspect-square w-full rounded-lg bg-neutral-50 overflow-hidden">
                    <ProductVisual
                      visualId="emergency-backup-moon"
                      name="Emergency Backup Moon"
                    />
                  </div>
                  <div className="mt-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-rose-600 uppercase tracking-wide">
                        Only 3 Left
                      </span>
                      <span className="text-xs font-bold text-neutral-900">
                        $12,999
                      </span>
                    </div>
                    <p className="truncate text-xs font-semibold text-neutral-900 group-hover:text-indigo-600">
                      Backup Moon
                    </p>
                  </div>
                </Link>

                {/* Product 3: Luxury Cardboard */}
                <Link
                  href="/product/luxury-cardboard"
                  className="group relative rounded-xl border border-neutral-200/80 bg-white p-3 shadow-xs transition-all hover:shadow-md hover:border-indigo-300"
                >
                  <div className="aspect-square w-full rounded-lg bg-neutral-50 overflow-hidden">
                    <ProductVisual
                      visualId="luxury-cardboard"
                      name="Luxury Cardboard"
                    />
                  </div>
                  <div className="mt-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-amber-700 uppercase tracking-wide">
                        Artisanal
                      </span>
                      <span className="text-xs font-bold text-neutral-900">
                        $399
                      </span>
                    </div>
                    <p className="truncate text-xs font-semibold text-neutral-900 group-hover:text-indigo-600">
                      Luxury Cardboard
                    </p>
                  </div>
                </Link>

                {/* Product 4: Extra Tuesday */}
                <Link
                  href="/product/extra-tuesday"
                  className="group relative rounded-xl border border-neutral-200/80 bg-white p-3 shadow-xs transition-all hover:shadow-md hover:border-indigo-300"
                >
                  <div className="aspect-square w-full rounded-lg bg-neutral-50 overflow-hidden">
                    <ProductVisual
                      visualId="extra-tuesday"
                      name="Extra Tuesday"
                    />
                  </div>
                  <div className="mt-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wide">
                        +24 Hours
                      </span>
                      <span className="text-xs font-bold text-neutral-900">
                        $89
                      </span>
                    </div>
                    <p className="truncate text-xs font-semibold text-neutral-900 group-hover:text-indigo-600">
                      Extra Tuesday
                    </p>
                  </div>
                </Link>
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
