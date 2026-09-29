"use client";

import { ProductVisual } from "@/components/ui/product-visual";
import type { Product, Variant } from "@/lib/api/types";
import { useStore } from "@/lib/client/store";
import {
  getProductBySlugOrId,
  YC_PRODUCTS,
  type CatalogProduct,
  type CatalogReview,
} from "@/lib/data/products";
import { cn, formatPrice } from "@/lib/utils";
import {
  Award,
  Box,
  Check,
  CheckCircle2,
  Eye,
  Heart,
  Minus,
  Package,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Star,
  ThumbsUp,
  Truck,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface ProductDetailProps {
  product: Product;
  variants: Variant[];
}

export function ProductDetail({ product, variants }: ProductDetailProps) {
  const router = useRouter();
  const { addToCart, toggleWishlist, isInWishlist } = useStore();

  const catalogItem =
    getProductBySlugOrId(product._id) ||
    getProductBySlugOrId(product.slug || "") ||
    (product as unknown as CatalogProduct);

  const [selectedVariantId, setSelectedVariantId] = useState(
    variants[0]?._id || catalogItem.variants?.[0]?.id || "default",
  );
  const [quantity, setQuantity] = useState(1);
  const [activeAngle, setActiveAngle] = useState<
    "front" | "macro" | "packaging" | "certificate"
  >("front");
  const [zipCode, setZipCode] = useState("");
  const [zipChecked, setZipChecked] = useState(false);
  const [userReviews, setUserReviews] = useState<CatalogReview[]>(
    catalogItem.reviews || [],
  );
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState("");
  const [newReviewTitle, setNewReviewTitle] = useState("");
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);

  const isWishlisted = isInWishlist(catalogItem.id || product._id);

  // Selected variant details
  const activeVariant =
    catalogItem.variants?.find((v) => v.id === selectedVariantId) ||
    variants.find((v) => v._id === selectedVariantId);

  const price = activeVariant
    ? activeVariant.price
    : product.minPrice || product.maxPrice || 399;
  const stock = activeVariant ? activeVariant.stock : product.totalStock || 100;
  const isSoldOut = stock <= 0;

  // Frequently Bought Together Bundle
  const bundleItemIds = catalogItem.frequentlyBoughtTogether?.slice(0, 2) || [
    "luxury-cardboard",
    "extra-tuesday",
  ];
  const bundleItems = bundleItemIds
    .map((id) => YC_PRODUCTS.find((p) => p.id === id))
    .filter((p): p is CatalogProduct => Boolean(p));

  const bundleTotal =
    price + bundleItems.reduce((acc, item) => acc + item.price, 0);
  const bundleDiscounted = Math.round(bundleTotal * 0.9);

  function handleAddToCart() {
    if (catalogItem) {
      addToCart(catalogItem, selectedVariantId, quantity);
    }
  }

  function handleBuyNow() {
    handleAddToCart();
    router.push("/checkout");
  }

  function handleAddBundle() {
    if (catalogItem) {
      addToCart(catalogItem, selectedVariantId, 1);
      bundleItems.forEach((item) => addToCart(item, undefined, 1));
      toast.success("Added bundle to cart with 10% synergy discount!");
    }
  }

  function handleUpvote(revId: string) {
    setUserReviews((prev) =>
      prev.map((r) =>
        r.id === revId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r,
      ),
    );
    toast.message("Helpful vote recorded.");
  }

  function handleCheckZip(e: React.FormEvent) {
    e.preventDefault();
    if (zipCode.length >= 3) {
      setZipChecked(true);
      toast.message(`Temporal logistics verified for ${zipCode}.`);
    }
  }

  function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newReviewAuthor || !newReviewTitle || !newReviewComment) {
      toast.error("Please fill in all review fields.");
      return;
    }
    const created: CatalogReview = {
      id: `rev_user_${Date.now()}`,
      author: newReviewAuthor,
      title: newReviewTitle,
      comment: newReviewComment,
      rating: newReviewRating,
      date: "Just now",
      verified: true,
      helpfulCount: 0,
    };
    setUserReviews([created, ...userReviews]);
    setShowReviewModal(false);
    setNewReviewAuthor("");
    setNewReviewTitle("");
    setNewReviewComment("");
    toast.success("Review published. Thank you for your questionable honesty.");
  }

  return (
    <div className="flex flex-col bg-white">
      {/* Top Product Section: Gallery + Purchase Config */}
      <div className="grid gap-8 p-4 sm:p-8 lg:grid-cols-12 lg:gap-12">
        {/* Left Column: Image Gallery (5 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {/* Main Visual Display */}
          <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50/80 shadow-xs">
            {activeAngle === "certificate" ? (
              <div className="size-full flex flex-col items-center justify-center p-8 text-center bg-amber-50/30">
                <div className="rounded-full border-2 border-amber-600 p-3 text-amber-700 mb-3">
                  <Award className="size-8" />
                </div>
                <h4 className="font-serif text-lg font-bold text-neutral-900">
                  Official Certificate of Questionable Origin
                </h4>
                <p className="mt-2 text-xs font-mono text-neutral-600 max-w-sm">
                  This document certifies that specimen #
                  {catalogItem.sku || "YC-0001"} was audited under ISO-999
                  guidelines and determined to serve no justifiable utilitarian
                  necessity.
                </p>
                <div className="mt-4 border-t border-amber-200 pt-3 text-[11px] font-mono text-neutral-400">
                  SEALED IN THE YEAR 2026 • Y-COMBINONSENSE ARCHIVES
                </div>
              </div>
            ) : (
              <ProductVisual
                visualId={catalogItem.visualId || "generic"}
                name={product.name}
                className="size-full"
              />
            )}

            {/* Badges on main image */}
            {catalogItem.badge && (
              <div className="absolute top-4 left-4 z-20">
                <span className="rounded bg-neutral-900/90 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-xs">
                  {catalogItem.badge}
                </span>
              </div>
            )}
          </div>

          {/* Gallery Angle Thumbnails */}
          <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
            {[
              { id: "front", label: "Studio View", icon: Box },
              { id: "macro", label: "Macro Detail", icon: Eye },
              { id: "packaging", label: "Packaging", icon: Package },
              { id: "certificate", label: "Certificate", icon: Award },
            ].map((angle) => {
              const Icon = angle.icon;
              const isSelected = activeAngle === angle.id;
              return (
                <button
                  key={angle.id}
                  type="button"
                  onClick={() => setActiveAngle(angle.id as typeof activeAngle)}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-lg border p-2 text-center transition-all",
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/50 text-indigo-950 ring-2 ring-indigo-600/20"
                      : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-5 mb-1",
                      isSelected ? "text-indigo-600" : "text-neutral-500",
                    )}
                  />
                  <span className="text-[10px] font-medium leading-tight">
                    {angle.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Security & Integrity Badges */}
          <div className="grid grid-cols-3 gap-2 border-t border-neutral-100 pt-4 text-center">
            <div className="flex flex-col items-center">
              <ShieldCheck className="size-4 text-emerald-600 mb-1" />
              <span className="text-[11px] font-semibold text-neutral-800">
                Authentic Specimen
              </span>
              <span className="text-[10px] text-neutral-400">
                Inspected by hand
              </span>
            </div>
            <div className="flex flex-col items-center">
              <Truck className="size-4 text-indigo-600 mb-1" />
              <span className="text-[11px] font-semibold text-neutral-800">
                Discreet Delivery
              </span>
              <span className="text-[10px] text-neutral-400">
                Bewildered courier
              </span>
            </div>
            <div className="flex flex-col items-center">
              <RotateCcw className="size-4 text-neutral-600 mb-1" />
              <span className="text-[11px] font-semibold text-neutral-800">
                30-Day Question
              </span>
              <span className="text-[10px] text-neutral-400">
                If too normal, return
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Buy Panel & Specs (6 cols) */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div>
            {/* Category and SKU */}
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span className="font-semibold uppercase tracking-wider text-indigo-600">
                {product.category}
              </span>
              <span className="font-mono">
                SKU: {catalogItem.sku || "YC-SPEC-001"}
              </span>
            </div>

            {/* Product Title */}
            <h1 className="mt-2 font-sans text-2xl sm:text-4xl font-bold tracking-tight text-neutral-950">
              {product.name}
            </h1>

            {/* Rating & Oddness Bar */}
            <div className="mt-3 flex flex-wrap items-center gap-3 border-b border-neutral-100 pb-4 text-xs">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "size-4",
                      i < Math.floor(catalogItem.rating || 5)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-neutral-200 text-neutral-200",
                    )}
                  />
                ))}
                <span className="ml-1.5 font-bold text-neutral-900">
                  {(catalogItem.rating || 4.8).toFixed(1)}
                </span>
              </div>
              <span className="text-neutral-400">•</span>
              <a
                href="#reviews"
                className="font-medium text-neutral-600 hover:text-indigo-600 hover:underline"
              >
                {userReviews.length} verified ratings
              </a>
              <span className="text-neutral-400">•</span>
              <span className="rounded bg-neutral-100 px-2 py-0.5 font-medium text-neutral-700">
                Oddness: {catalogItem.oddness}
              </span>
            </div>

            {/* Price & Scarcity */}
            <div className="mt-5 flex items-baseline gap-3">
              <span className="font-sans text-3xl sm:text-4xl font-extrabold text-neutral-950">
                {formatPrice(price)}
              </span>
              {catalogItem.originalPrice && (
                <span className="text-sm sm:text-base text-neutral-400 line-through">
                  {formatPrice(catalogItem.originalPrice)}
                </span>
              )}
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                Free Shipping Available
              </span>
            </div>

            {/* Stock status indicator */}
            <div className="mt-2 text-xs font-semibold">
              {isSoldOut ? (
                <span className="text-rose-600">
                  Out of Stock — Reality has caught up
                </span>
              ) : stock <= 10 ? (
                <span className="text-amber-600">
                  Only {stock} left in existence
                </span>
              ) : (
                <span className="text-emerald-700">
                  In Stock — {stock.toLocaleString()} units available
                </span>
              )}
            </div>

            {/* Short Tagline */}
            <p className="mt-4 text-sm text-neutral-600 leading-relaxed">
              {catalogItem.shortDescription}
            </p>

            {/* Variant Selector */}
            {catalogItem.variants && catalogItem.variants.length > 0 && (
              <div className="mt-6 border-t border-neutral-100 pt-5">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2.5">
                  Select Variant:
                </label>
                <div className="flex flex-wrap gap-2">
                  {catalogItem.variants.map((v) => {
                    const isSelected = selectedVariantId === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariantId(v.id)}
                        className={cn(
                          "rounded-md border px-3.5 py-2 text-xs font-medium transition-all text-left",
                          isSelected
                            ? "border-neutral-900 bg-neutral-900 text-white shadow-xs"
                            : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50",
                        )}
                      >
                        <span className="block font-semibold">{v.name}</span>
                        <span
                          className={cn(
                            "text-[11px]",
                            isSelected
                              ? "text-neutral-300"
                              : "text-neutral-500",
                          )}
                        >
                          {formatPrice(v.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Stepper */}
            <div className="mt-6 flex items-center gap-4">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Quantity:
              </label>
              <div className="flex items-center rounded-md border border-neutral-300 bg-white">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="grid size-9 place-items-center text-neutral-600 hover:bg-neutral-100 disabled:opacity-40"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="grid h-9 w-10 place-items-center font-mono text-sm font-semibold text-neutral-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={quantity >= stock}
                  onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                  className="grid size-9 place-items-center text-neutral-600 hover:bg-neutral-100 disabled:opacity-40"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                disabled={isSoldOut}
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 rounded-md bg-indigo-600 py-3.5 px-6 text-sm font-semibold text-white transition-all hover:bg-indigo-700 active:scale-[0.99] disabled:bg-neutral-200 disabled:text-neutral-400 shadow-sm"
              >
                <ShoppingCart className="size-4" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                disabled={isSoldOut}
                onClick={handleBuyNow}
                className="flex-1 flex items-center justify-center gap-2 rounded-md bg-neutral-900 py-3.5 px-6 text-sm font-semibold text-white transition-all hover:bg-neutral-800 active:scale-[0.99] disabled:bg-neutral-200 disabled:text-neutral-400 shadow-sm"
              >
                <Zap className="size-4" />
                <span>Buy Now</span>
              </button>

              <button
                type="button"
                aria-label={
                  isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                }
                onClick={() => toggleWishlist(catalogItem.id || product._id)}
                className={cn(
                  "grid size-12 place-items-center rounded-md border transition-colors shrink-0",
                  isWishlisted
                    ? "border-rose-300 bg-rose-50 text-rose-600"
                    : "border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-50",
                )}
              >
                <Heart
                  className={cn("size-5", isWishlisted && "fill-rose-500")}
                />
              </button>
            </div>

            {/* Pincode & Temporal Shipping Checker */}
            <div className="mt-8 rounded-lg border border-neutral-200/90 bg-neutral-50/70 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
                Estimate Temporal Delivery
              </p>
              <form onSubmit={handleCheckZip} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter postal / zip code..."
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="h-9 min-w-0 flex-1 rounded border border-neutral-300 bg-white px-3 text-xs text-neutral-900 outline-none focus:border-indigo-600"
                />
                <button
                  type="submit"
                  className="h-9 rounded bg-neutral-900 px-4 text-xs font-semibold text-white hover:bg-neutral-800"
                >
                  Verify
                </button>
              </form>

              {zipChecked && (
                <div className="mt-3 flex items-start gap-2 text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded border border-emerald-200">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">
                      Delivery guaranteed in 2–4 business days.
                    </p>
                    <p className="text-[11px] text-emerald-700">
                      Standard dispatch will arrive in discreet packaging via
                      bewildered courier.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Middle Tabbed Specifications & Absurd Bundle */}
      <div className="border-t border-neutral-200 bg-neutral-50/50 p-4 sm:p-8">
        <div className="mx-auto max-w-5xl space-y-12">
          {/* 1. Believable Specifications Table */}
          <section>
            <h2 className="font-sans text-xl font-bold text-neutral-950 mb-4 flex items-center gap-2">
              <span>Technical Specifications</span>
              <span className="text-xs font-normal text-neutral-500">
                (ISO-Audited)
              </span>
            </h2>
            <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-xs">
              <dl className="divide-y divide-neutral-200">
                {Object.entries(catalogItem.specifications || {}).map(
                  ([key, val], idx) => (
                    <div
                      key={key}
                      className={cn(
                        "grid grid-cols-1 sm:grid-cols-3 p-3.5 text-xs sm:text-sm",
                        idx % 2 === 0 ? "bg-white" : "bg-neutral-50/60",
                      )}
                    >
                      <dt className="font-semibold text-neutral-900">{key}</dt>
                      <dd className="sm:col-span-2 text-neutral-700">{val}</dd>
                    </div>
                  ),
                )}
              </dl>
            </div>
          </section>

          {/* 2. What's Included */}
          <section>
            <h2 className="font-sans text-xl font-bold text-neutral-950 mb-4">
              What&apos;s Included in the Box
            </h2>
            <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-xs">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-neutral-700">
                {(
                  catalogItem.whatsIncluded || [
                    "1 × Main Specimen",
                    "1 × Unnecessary Certificate of Authenticity",
                    "1 × Instruction Manual (translated into deadpan English)",
                  ]
                ).map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <Check className="size-4 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 3. Frequently Bought Together (Absurd Bundle) */}
          {bundleItems.length > 0 && (
            <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
              <h2 className="font-sans text-lg sm:text-xl font-bold text-neutral-950 mb-1">
                Frequently Bought Together
              </h2>
              <p className="text-xs text-neutral-500 mb-6">
                Customers frequently combine these inexplicable artifacts into a
                unified domestic anomaly.
              </p>

              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                {/* Visual Chain */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <div className="flex flex-col items-center">
                    <div className="size-20 rounded-lg border border-neutral-200 bg-neutral-50 overflow-hidden">
                      <ProductVisual
                        visualId={catalogItem.visualId}
                        showStudioLighting={false}
                      />
                    </div>
                    <span className="mt-1 text-xs font-bold text-neutral-900">
                      {formatPrice(price)}
                    </span>
                    <span className="text-[11px] text-neutral-500 truncate max-w-24">
                      {product.name}
                    </span>
                  </div>

                  <span className="text-lg font-bold text-neutral-400">+</span>

                  {bundleItems.map((bItem, bIdx) => (
                    <div key={bItem.id} className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <div className="size-20 rounded-lg border border-neutral-200 bg-neutral-50 overflow-hidden">
                          <ProductVisual
                            visualId={bItem.visualId}
                            showStudioLighting={false}
                          />
                        </div>
                        <span className="mt-1 text-xs font-bold text-neutral-900">
                          {formatPrice(bItem.price)}
                        </span>
                        <span className="text-[11px] text-neutral-500 truncate max-w-24">
                          {bItem.name}
                        </span>
                      </div>
                      {bIdx < bundleItems.length - 1 && (
                        <span className="text-lg font-bold text-neutral-400">
                          +
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Bundle Purchase Callout */}
                <div className="border-t lg:border-t-0 lg:border-l border-neutral-200 pt-4 lg:pt-0 lg:pl-6 text-center lg:text-left shrink-0">
                  <div className="text-xs text-neutral-500">
                    Bundle Price (3 items):
                  </div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-black text-neutral-950">
                      {formatPrice(bundleDiscounted)}
                    </span>
                    <span className="text-xs text-neutral-400 line-through">
                      {formatPrice(bundleTotal)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddBundle}
                    className="mt-3 rounded-md bg-neutral-900 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-600"
                  >
                    Add All 3 to Cart
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* 4. Customer Reviews Section */}
          <section id="reviews" className="border-t border-neutral-200 pt-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="font-sans text-2xl font-bold text-neutral-950">
                  Customer Reviews
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-neutral-500">
                  Completely serious feedback from verified purchasers.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowReviewModal(true)}
                className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-neutral-800 transition-colors hover:bg-neutral-50"
              >
                Write a Questionable Review
              </button>
            </div>

            {/* Rating Summary Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 rounded-xl border border-neutral-200 bg-white shadow-xs mb-8">
              <div className="md:col-span-4 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-neutral-100 pb-6 md:pb-0 md:pr-6">
                <span className="font-sans text-5xl font-black text-neutral-950">
                  {(catalogItem.rating || 4.8).toFixed(1)}
                </span>
                <div className="flex items-center text-amber-500 my-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <span className="text-xs text-neutral-500">
                  Based on {userReviews.length} verified purchases
                </span>
              </div>

              <div className="md:col-span-8 flex flex-col justify-center gap-2">
                {[
                  { stars: 5, pct: 82 },
                  { stars: 4, pct: 14 },
                  { stars: 3, pct: 2 },
                  { stars: 2, pct: 1 },
                  { stars: 1, pct: 1 },
                ].map((row) => (
                  <div
                    key={row.stars}
                    className="flex items-center gap-3 text-xs text-neutral-600"
                  >
                    <span className="w-12 text-right font-medium">
                      {row.stars} stars
                    </span>
                    <div className="h-2 flex-1 rounded-full bg-neutral-100 overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{ width: `${row.pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-neutral-400">{row.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Cards List */}
            <div className="space-y-4">
              {userReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="rounded-lg border border-neutral-200 bg-white p-5 shadow-2xs"
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "size-3.5",
                              i < rev.rating
                                ? "fill-amber-400 text-amber-400"
                                : "fill-neutral-200 text-neutral-200",
                            )}
                          />
                        ))}
                      </div>
                      <span className="font-semibold text-neutral-900">
                        {rev.author}
                      </span>
                      {rev.verified && (
                        <span className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                          <CheckCircle2 className="size-3 text-emerald-600" />
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <span className="text-neutral-400">{rev.date}</span>
                  </div>

                  <h4 className="font-sans text-sm font-bold text-neutral-900 mt-1">
                    {rev.title}
                  </h4>
                  <p className="mt-1.5 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    {rev.comment}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3 text-xs text-neutral-500">
                    <span>Was this review helpful?</span>
                    <button
                      type="button"
                      onClick={() => handleUpvote(rev.id)}
                      className="flex items-center gap-1 rounded border border-neutral-200 px-2.5 py-1 text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      <ThumbsUp className="size-3 text-neutral-500" />
                      <span>Helpful ({rev.helpfulCount})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Review Submission Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-6 shadow-2xl">
            <h3 className="font-sans text-lg font-bold text-neutral-950">
              Submit Customer Review
            </h3>
            <p className="mt-1 text-xs text-neutral-500">
              Please maintain strict deadpan seriousness regarding your purchase
              experience.
            </p>

            <form
              onSubmit={handleReviewSubmit}
              className="mt-4 space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-neutral-800 mb-1">
                  Your Name / Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. H. Vance"
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  className="h-9 w-full rounded border border-neutral-300 px-3 outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[5, 4, 3, 2, 1].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewReviewRating(s)}
                      className={cn(
                        "rounded px-3 py-1 font-bold",
                        newReviewRating === s
                          ? "bg-amber-400 text-neutral-900"
                          : "border border-neutral-200 text-neutral-600",
                      )}
                    >
                      {s}★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1">
                  Review Headline
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arrived exactly as described. Unfortunately."
                  value={newReviewTitle}
                  onChange={(e) => setNewReviewTitle(e.target.value)}
                  className="h-9 w-full rounded border border-neutral-300 px-3 outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1">
                  Comments
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe your anomalous experience..."
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  className="w-full rounded border border-neutral-300 p-2.5 outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="rounded px-4 py-2 text-neutral-600 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-neutral-900 px-4 py-2 font-semibold text-white hover:bg-indigo-600"
                >
                  Post Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
