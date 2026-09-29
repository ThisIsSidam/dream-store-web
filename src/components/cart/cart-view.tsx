"use client";

import { ProductVisual } from "@/components/ui/product-visual";
import { useStore } from "@/lib/client/store";
import { formatPrice } from "@/lib/utils";
import {
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CartView() {
  const router = useRouter();
  const {
    cart,
    savedForLater,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    cartCount,
    promoCode,
    isPromoApplied,
    applyPromo,
    removePromo,
    updateQuantity,
    removeFromCart,
    saveForLater,
    moveToCartFromSaved,
  } = useStore();

  const [inputPromo, setInputPromo] = useState("");

  function handlePromoSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!inputPromo.trim()) return;
    const ok = applyPromo(inputPromo);
    if (ok) setInputPromo("");
  }

  if (cart.length === 0 && savedForLater.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-12 text-center shadow-xs">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-neutral-100 text-neutral-400 mb-4">
          <ShoppingCart className="size-8" />
        </div>
        <h1 className="font-sans text-2xl font-bold text-neutral-950">
          Your Cart is empty.
        </h1>
        <p className="mt-2 text-sm text-neutral-500 max-w-sm mx-auto">
          Surely there is something here you don&apos;t need. Explore our
          questionable catalog and make a decision.
        </p>
        <div className="mt-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-600"
          >
            <span>Explore Products</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid items-start gap-8 lg:grid-cols-12">
      {/* Left Column: Cart items & Saved items (8 cols) */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <section className="rounded-xl border border-neutral-200 bg-white shadow-xs overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
            <h1 className="font-sans text-xl font-bold text-neutral-950">
              Your Cart ({cartCount})
            </h1>
            <span className="text-xs text-neutral-500 font-mono">
              STANDARD TEMPORAL DISPATCH
            </span>
          </div>

          {/* Cart items list */}
          {cart.length > 0 ? (
            <ul className="divide-y divide-neutral-200">
              {cart.map((item) => (
                <li
                  key={item.variantId}
                  className="flex flex-col sm:flex-row gap-4 p-6"
                >
                  {/* Item Image */}
                  <div className="size-24 shrink-0 rounded-lg border border-neutral-200 bg-neutral-50 overflow-hidden">
                    <Link href={`/product/${item.productId}`}>
                      <ProductVisual
                        visualId={item.visualId}
                        name={item.name}
                        showStudioLighting={false}
                      />
                    </Link>
                  </div>

                  {/* Item Content */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Link
                            href={`/product/${item.productId}`}
                            className="font-sans text-base font-semibold text-neutral-900 hover:text-indigo-600 transition-colors"
                          >
                            {item.name}
                          </Link>
                          {item.variantName && (
                            <p className="text-xs text-neutral-500 mt-0.5">
                              Variant: {item.variantName}
                            </p>
                          )}
                          <p className="text-[11px] text-neutral-400 uppercase tracking-wider mt-0.5">
                            Category: {item.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-sans text-lg font-bold text-neutral-950">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                          {item.quantity > 1 && (
                            <span className="block text-xs text-neutral-400">
                              {formatPrice(item.price)} each
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Stepper and Row Actions */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-100 pt-3">
                      <div className="flex items-center rounded-md border border-neutral-300 bg-white">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity - 1)
                          }
                          className="grid size-8 place-items-center text-neutral-600 hover:bg-neutral-100"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="grid h-8 w-9 place-items-center font-mono text-xs font-semibold text-neutral-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity + 1)
                          }
                          className="grid size-8 place-items-center text-neutral-600 hover:bg-neutral-100"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-medium">
                        <button
                          type="button"
                          onClick={() => saveForLater(item.variantId)}
                          className="flex items-center gap-1 text-neutral-600 hover:text-neutral-900 transition-colors"
                        >
                          <Bookmark className="size-3.5" />
                          <span>Save for later</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.variantId)}
                          className="flex items-center gap-1 text-rose-600 hover:text-rose-700 transition-colors"
                        >
                          <Trash2 className="size-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center text-sm text-neutral-500">
              No active items in cart right now.
            </div>
          )}
        </section>

        {/* Saved For Later Section */}
        {savedForLater.length > 0 && (
          <section className="rounded-xl border border-neutral-200 bg-white shadow-xs overflow-hidden">
            <div className="border-b border-neutral-200 px-6 py-4">
              <h2 className="font-sans text-base font-bold text-neutral-950">
                Saved for Later ({savedForLater.length})
              </h2>
            </div>
            <ul className="divide-y divide-neutral-200">
              {savedForLater.map((item) => (
                <li
                  key={item.variantId}
                  className="flex items-center justify-between p-4 sm:p-6 gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-16 rounded-md border border-neutral-200 bg-neutral-50 overflow-hidden shrink-0">
                      <ProductVisual
                        visualId={item.visualId}
                        name={item.name}
                        showStudioLighting={false}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 text-sm">
                        {item.name}
                      </h3>
                      <p className="text-xs text-neutral-500">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => moveToCartFromSaved(item.variantId)}
                    className="rounded-md border border-neutral-300 px-3.5 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors shrink-0"
                  >
                    Move to Cart
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Right Column: Order Summary (4 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs sticky top-20">
          <h2 className="font-sans text-lg font-bold text-neutral-950 border-b border-neutral-100 pb-3">
            Order Summary
          </h2>

          {/* Deadpan Subtext */}
          <p className="mt-2 text-xs italic text-neutral-500">
            &ldquo;You&apos;re really doing this.&rdquo;
          </p>

          {/* Pricing breakdown */}
          <div className="mt-4 space-y-2.5 text-xs sm:text-sm">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal ({cartCount} items)</span>
              <span className="font-medium text-neutral-900">
                {formatPrice(subtotal)}
              </span>
            </div>

            {isPromoApplied && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Discount (QUESTIONABLE10)</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}

            <div className="flex justify-between text-neutral-600">
              <span className="flex items-center gap-1">
                <span>Shipping</span>
                {shipping === 0 && (
                  <span className="text-[10px] text-emerald-700">
                    (Free over $500)
                  </span>
                )}
              </span>
              <span className="font-medium text-neutral-900">
                {shipping === 0 ? "FREE" : formatPrice(shipping)}
              </span>
            </div>

            <div className="flex justify-between text-neutral-600">
              <span>Estimated Tax (8%)</span>
              <span className="font-medium text-neutral-900">
                {formatPrice(tax)}
              </span>
            </div>

            <div className="border-t border-neutral-200 pt-3 flex justify-between font-sans text-base sm:text-lg font-bold text-neutral-950">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          {/* Promo code form */}
          <div className="mt-5 border-t border-neutral-100 pt-4">
            {isPromoApplied ? (
              <div className="flex items-center justify-between rounded-md bg-emerald-50 border border-emerald-200 p-2 text-xs text-emerald-800">
                <span className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                  Code applied: QUESTIONABLE10
                </span>
                <button
                  type="button"
                  onClick={removePromo}
                  className="text-xs font-semibold text-rose-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handlePromoSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo code (try QUESTIONABLE10)"
                  value={inputPromo}
                  onChange={(e) => setInputPromo(e.target.value)}
                  className="h-9 min-w-0 flex-1 rounded border border-neutral-300 px-3 text-xs outline-none focus:border-indigo-600"
                />
                <button
                  type="submit"
                  className="h-9 rounded bg-neutral-900 px-3 text-xs font-semibold text-white hover:bg-neutral-800"
                >
                  Apply
                </button>
              </form>
            )}
          </div>

          {/* Proceed to checkout button */}
          <button
            type="button"
            disabled={cart.length === 0}
            onClick={() => router.push("/checkout")}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-neutral-900 py-3.5 text-sm font-semibold text-white transition-all hover:bg-indigo-600 disabled:bg-neutral-200 disabled:text-neutral-400 shadow-sm"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="size-4" />
          </button>

          {/* Secure Guarantee */}
          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-neutral-400">
            <ShieldCheck className="size-3.5 text-emerald-600" />
            <span>256-Bit Encrypted Questionable Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
