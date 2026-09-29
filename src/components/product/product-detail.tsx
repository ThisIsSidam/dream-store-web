"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ImageOff, Minus, Plus, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/errors";
import type { Order, Product, Variant } from "@/lib/api/types";
import { api } from "@/lib/client/api";
import { useCart } from "@/lib/client/use-cart";
import { cn, formatPrice, formatPriceRange, hashString, optimizeImage } from "@/lib/utils";

const specs = [
  ["Weight", "Theoretical"],
  ["Origin", "29,032ft+"],
  ["Shelf Life", "Eternal"],
  ["Legality", "Questionable"],
] as const;

const variantLabel = (variant: Variant, index: number) => {
  const values = Object.values(variant.attributes ?? {});
  return values.length ? values.join(" / ") : `Option ${index + 1}`;
};

const isDefaultOnly = (variants: Variant[]) =>
  variants.length === 1 && variants[0].attributes?.type === "Default";

export function ProductDetail({ product, variants }: { product: Product; variants: Variant[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const { changeQuantity } = useCart();

  const [variantId, setVariantId] = useState(
    (variants.find((v) => v.stock > 0) ?? variants[0])?._id,
  );
  const [imageIndex, setImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [busy, setBusy] = useState<"cart" | "buy" | null>(null);

  const variant = variants.find((v) => v._id === variantId);
  const images = product.images;
  const mainImage = optimizeImage(images[imageIndex]?.url, 1000);
  const soldOut = !variant || variant.stock <= 0;
  const maxQuantity = Math.max(1, variant?.stock ?? 1);
  const price = variant ? formatPrice(variant.price) : formatPriceRange(product.minPrice, product.maxPrice);
  const starCredits = Math.trunc((variant?.price ?? product.minPrice ?? 100) * 4);

  function selectVariant(id: string) {
    setVariantId(id);
    setQuantity(1);
  }

  async function addToCart() {
    if (!variant) return;
    setBusy("cart");
    try {
      await changeQuantity(variant._id, product.name, quantity);
      toast.success(`Added ${quantity} ${quantity === 1 ? "item" : "items"} to your Wonder Basket`, {
        action: { label: "View cart", onClick: () => router.push("/cart") },
      });
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Could not update your cart.");
    } finally {
      setBusy(null);
    }
  }

  async function buyNow() {
    if (!variant) return;
    setBusy("buy");
    try {
      const { order } = await api<{ order: Order }>("orders/buy-now", {
        method: "POST",
        body: { products: [{ variantId: variant._id, name: product.name, quantity }] },
      });
      router.push(`/checkout/${order._id}`);
    } catch (error) {
      if (error instanceof ApiError && error.isAuth) {
        toast.message("Sign in to check out");
        router.push(`/signin?next=${encodeURIComponent(pathname)}`);
      } else {
        toast.error(error instanceof ApiError ? error.message : "Could not start checkout.");
      }
      setBusy(null);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      {/* Gallery */}
      <div>
        <div className="relative">
          <div className="blob-gallery relative h-[320px] overflow-hidden bg-secondary-container/30 shadow-[0_15px_30px_rgb(0_0_0/0.05)] sm:h-[380px]">
            {mainImage ? (
              <Image
                src={mainImage}
                alt={product.name}
                fill
                unoptimized
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="grid size-full place-items-center text-outline">
                <ImageOff className="size-16" aria-hidden />
              </div>
            )}
          </div>
          <span className="t-label absolute right-4 top-4 rotate-[8.6deg] rounded-full bg-tertiary-container px-4 py-2 text-on-tertiary-container shadow-[0_4px_10px_rgb(0_0_0/0.1)]">
            Actually Impossible
          </span>
        </div>

        {images.length > 1 && (
          <ul className="scrollbar-none mt-6 flex gap-4 overflow-x-auto p-1">
            {images.map((image, index) => (
              <li key={image.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setImageIndex(index)}
                  aria-label={`Show image ${index + 1}`}
                  aria-current={index === imageIndex}
                  className={cn(
                    "relative block size-20 overflow-hidden border-[3px] bg-surface-container-highest transition-colors",
                    index % 2 === 0 ? "blob-thumb-a" : "blob-thumb-b",
                    index === imageIndex ? "border-primary" : "border-transparent",
                  )}
                >
                  <Image
                    src={optimizeImage(image.url, 200) ?? image.url}
                    alt=""
                    fill
                    unoptimized
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Details */}
      <div>
        <p className="t-label tracking-[2px] text-secondary">
          {product.category.toUpperCase()} {"//"} 00{hashString(product._id) % 10}
        </p>
        <h1 className="mt-3 font-display text-[2rem] font-extrabold leading-[1.1] sm:text-5xl">{product.name}</h1>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="flex" aria-label="5 out of 5 stars" role="img">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className="size-5 fill-tertiary text-tertiary" aria-hidden />
            ))}
          </div>
          <span className="t-body-md text-on-surface-variant">1 Verified Review (Literate Goat)</span>
        </div>

        <p className="t-body-lg mt-6 whitespace-pre-line">{product.description}</p>

        <div className="mt-8 rounded-3xl bg-surface-container-highest/50 p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="t-label text-on-surface-variant">INVESTMENT</p>
              <p className="mt-1 font-display text-[2rem] font-extrabold text-primary">{price}</p>
            </div>
            <div className="text-right">
              <p className="t-label text-on-surface-variant">STAR CREDITS</p>
              <p className="mt-1 font-display text-2xl font-bold text-tertiary">{starCredits} SC</p>
            </div>
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-3">
            {specs.map(([label, value]) => (
              <div key={label} className="rounded-xl border-[1.5px] border-outline/10 bg-surface/60 px-3 py-2">
                <dt className="t-caption text-[10px] uppercase text-on-surface-variant">{label}</dt>
                <dd className="mt-0.5 text-sm font-bold">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {variants.length > 0 && !isDefaultOnly(variants) && (
          <fieldset className="mt-6">
            <legend className="t-headline mb-3">Select Variant</legend>
            <div className="flex flex-wrap gap-3">
              {variants.map((v, index) => {
                const selected = v._id === variantId;
                return (
                  <button
                    key={v._id}
                    type="button"
                    onClick={() => selectVariant(v._id)}
                    aria-pressed={selected}
                    className={cn(
                      "t-body-md rounded-full border px-4 py-2.5 transition-colors",
                      selected
                        ? "border-primary-container bg-primary-container/25 font-semibold"
                        : "border-outline/40 hover:bg-surface-container-high",
                      v.stock <= 0 && "opacity-50",
                    )}
                  >
                    {variantLabel(v, index)}
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {variant && (
          <p className={cn("mt-4 text-sm font-semibold", soldOut ? "text-error" : variant.stock <= 5 ? "text-tertiary" : "text-secondary")}>
            {soldOut ? "Sold out" : variant.stock <= 5 ? `Only ${variant.stock} left` : "In stock"}
          </p>
        )}

        <div className="mt-6 flex items-center gap-4">
          <div className="flex items-center rounded-full border-2 border-on-surface/80 bg-surface-container-highest px-3 py-1">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={quantity <= 1}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="grid size-8 place-items-center rounded-full hover:bg-surface-container-high disabled:opacity-40"
            >
              <Minus className="size-4" />
            </button>
            <output aria-live="polite" className="w-8 text-center font-bold">
              {quantity}
            </output>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={quantity >= maxQuantity}
              onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
              className="grid size-8 place-items-center rounded-full hover:bg-surface-container-high disabled:opacity-40"
            >
              <Plus className="size-4" />
            </button>
          </div>
          <Button
            variant="accent"
            size="lg"
            className="flex-1"
            disabled={soldOut || busy === "buy"}
            loading={busy === "cart"}
            onClick={addToCart}
          >
            Add to Wonder Basket
          </Button>
        </div>

        <Button
          variant="outline"
          size="lg"
          className="mt-4 w-full"
          disabled={soldOut || busy === "cart"}
          loading={busy === "buy"}
          onClick={buyNow}
        >
          Buy Now
        </Button>

        <p className="t-caption mt-4 text-center font-bold text-on-surface-variant/70">
          † Shipping subject to weather patterns and bird migration.
        </p>
        <p className="mt-3 text-center text-sm text-on-surface-variant">
          Not sure yet?{" "}
          <Link href="/categories" className="font-semibold text-primary hover:underline">
            Keep browsing
          </Link>
        </p>
      </div>
    </div>
  );
}
