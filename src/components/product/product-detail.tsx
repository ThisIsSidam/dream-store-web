"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ImageOff, Minus, Plus, ShoppingCart, Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/errors";
import type { Order, Product, Variant } from "@/lib/api/types";
import { api } from "@/lib/client/api";
import { useCart } from "@/lib/client/use-cart";
import { cn, formatPrice, formatPriceRange, optimizeImage } from "@/lib/utils";

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

  function selectVariant(id: string) {
    setVariantId(id);
    setQuantity(1);
  }

  async function addToCart() {
    if (!variant) return;
    setBusy("cart");
    try {
      await changeQuantity(variant._id, product.name, quantity);
      toast.success(`Added ${quantity} ${quantity === 1 ? "item" : "items"} to your cart`, {
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
    <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      {/* Gallery + purchase buttons (sticky on desktop) */}
      <div className="p-4 lg:sticky lg:top-16 lg:self-start lg:p-5">
        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          {images.length > 1 && (
            <ul className="scrollbar-none flex gap-2 overflow-x-auto sm:max-h-[420px] sm:w-16 sm:shrink-0 sm:flex-col sm:overflow-y-auto sm:overflow-x-hidden">
              {images.map((image, index) => (
                <li key={image.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setImageIndex(index)}
                    aria-label={`Show image ${index + 1}`}
                    aria-current={index === imageIndex}
                    className={cn(
                      "relative block size-14 overflow-hidden border-2 bg-white sm:size-16",
                      index === imageIndex ? "border-primary" : "border-outline-variant/60 hover:border-outline",
                    )}
                  >
                    <Image
                      src={optimizeImage(image.url, 200) ?? image.url}
                      alt=""
                      fill
                      unoptimized
                      sizes="64px"
                      className="object-contain"
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="relative aspect-square min-w-0 flex-1 border border-outline-variant/40 bg-white sm:max-h-[420px]">
            {mainImage ? (
              <Image
                src={mainImage}
                alt={product.name}
                fill
                unoptimized
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-contain"
              />
            ) : (
              <div className="grid size-full place-items-center text-outline">
                <ImageOff className="size-16" aria-hidden />
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 max-lg:fixed max-lg:inset-x-0 max-lg:bottom-14 xs:max-lg:bottom-0 max-lg:z-30 max-lg:mt-0 max-lg:gap-0 max-lg:shadow-float">
          <Button
            variant="cta"
            size="xl"
            className="max-lg:rounded-none"
            disabled={soldOut || busy === "buy"}
            loading={busy === "cart"}
            onClick={addToCart}
          >
            <ShoppingCart className="size-5" aria-hidden /> Add to cart
          </Button>
          <Button
            variant="buy"
            size="xl"
            className="max-lg:rounded-none"
            disabled={soldOut || busy === "cart"}
            loading={busy === "buy"}
            onClick={buyNow}
          >
            <Zap className="size-5" aria-hidden /> Buy now
          </Button>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 pb-20 lg:p-6 lg:pb-6">
        <h1 className="font-display text-xl font-semibold leading-snug sm:text-2xl">{product.name}</h1>
        <p className="mt-1 text-sm capitalize text-on-surface-variant">{product.category}</p>

        <p className="mt-4 text-3xl font-semibold">{price}</p>

        {variant && (
          <p
            className={cn(
              "mt-2 text-sm font-semibold",
              soldOut ? "text-error" : variant.stock <= 5 ? "text-buy" : "text-success",
            )}
          >
            {soldOut ? "Out of stock" : variant.stock <= 5 ? `Only ${variant.stock} left` : "In stock"}
          </p>
        )}

        {variants.length > 0 && !isDefaultOnly(variants) && (
          <fieldset className="mt-6 flex gap-6">
            <legend className="sr-only">Options</legend>
            <span className="w-20 shrink-0 pt-2 text-sm font-semibold text-on-surface-variant">Options</span>
            <div className="flex flex-wrap gap-2.5">
              {variants.map((v, index) => {
                const selected = v._id === variantId;
                return (
                  <button
                    key={v._id}
                    type="button"
                    onClick={() => selectVariant(v._id)}
                    aria-pressed={selected}
                    className={cn(
                      "min-w-16 rounded-sm border px-4 py-2 text-sm transition-colors",
                      selected
                        ? "border-primary font-semibold text-primary"
                        : "border-outline-variant hover:border-primary",
                      v.stock <= 0 && "text-on-surface-variant/60 line-through",
                    )}
                  >
                    {variantLabel(v, index)}
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        <div className="mt-6 flex items-center gap-6">
          <span className="w-20 shrink-0 text-sm font-semibold text-on-surface-variant">Quantity</span>
          <div className="flex items-center">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={quantity <= 1}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="grid size-9 place-items-center rounded-l-sm border border-outline-variant hover:bg-surface-container-low disabled:opacity-40"
            >
              <Minus className="size-4" />
            </button>
            <output
              aria-live="polite"
              className="grid h-9 w-12 place-items-center border-y border-outline-variant text-sm font-semibold"
            >
              {quantity}
            </output>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={quantity >= maxQuantity}
              onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
              className="grid size-9 place-items-center rounded-r-sm border border-outline-variant hover:bg-surface-container-low disabled:opacity-40"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>

        <section className="mt-8 border-t border-outline-variant/40 pt-6">
          <h2 className="font-display text-lg font-semibold">Description</h2>
          <p className="mt-2 whitespace-pre-line leading-relaxed text-on-surface-variant">
            {product.description || "No description provided."}
          </p>
        </section>
      </div>
    </div>
  );
}
