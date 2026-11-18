"use client";

import { PaymentPendingError, messageOf } from "@/lib/api/errors";
import type { Cart, CartLine, Order, Product } from "@/lib/api/types";
import { useRouter } from "next/navigation";
import React, { createContext, useCallback, useContext } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { api, swrFetcher } from "./api";
import { useLocalStorage } from "./use-local-storage";

/**
 * The storefront's client state.
 *
 * The backend is the single source of truth for the cart, wishlist and
 * orders: every action waits for it, shows its error if it refuses, and then
 * updates the SWR cache from its answer. Only things that are genuinely
 * per-browser (recently viewed, the mystery drop reveal) live in localStorage.
 */

export interface CartItem {
  variantId: string;
  productId: string;
  name: string;
  variantName?: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  /** Photo URL, when the product has one. */
  image?: string | null;
  /** Artwork id: drawn when there is no photo or it fails to load. */
  visualId: string;
  category: string;
  stock: number;
}

export type PaymentMethod = NonNullable<Order["paymentMethod"]>;

/**
 * All the cart needs to add something: the backend takes an id (or a product
 * slug) and the name is only used for the confirmation toast.
 */
export type AddableProduct = Pick<Product, "_id" | "name">;

export interface PlacedOrder {
  id: string;
  orderNumber: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  deliveryOption: "standard" | "express" | "temporal";
  deliveryAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pin: string;
    addressType: string;
  };
  paymentMethod: PaymentMethod;
  status: "Ordered" | "Packed" | "Shipped" | "Out for Delivery" | "Delivered";
  statusDescription: string;
  estimatedDelivery: string;
}

interface StoreContextType {
  /** Whether the visitor has an account session (wishlist and orders need one). */
  signedIn: boolean;

  // Cart
  cart: CartItem[];
  savedForLater: CartItem[];
  isCartLoading: boolean;
  cartCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  promoCode: string;
  /** Human-readable effect of the applied code, e.g. "10% imaginary discount". */
  promoDescription: string;
  isPromoApplied: boolean;
  applyPromo: (code: string) => Promise<boolean>;
  removePromo: () => Promise<void>;
  /** Resolves `true` when the backend accepted the item. */
  addToCart: (
    product: AddableProduct,
    variantId?: string,
    quantity?: number,
  ) => Promise<boolean>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeFromCart: (variantId: string) => Promise<void>;
  saveForLater: (variantId: string) => Promise<void>;
  moveToCartFromSaved: (variantId: string) => Promise<void>;

  // Wishlist
  wishlist: string[];
  wishlistProducts: Product[];
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => Promise<void>;

  // Orders
  orders: PlacedOrder[];
  /**
   * Creates the order and confirms payment. Rejects with the backend's
   * message when it refuses (e.g. out of stock). If the order was created but
   * payment failed it rejects with a {@link PaymentPendingError} so the
   * caller can send the visitor to `/checkout/<orderId>` to retry.
   */
  placeOrder: (details: {
    address: PlacedOrder["deliveryAddress"];
    deliveryOption: PlacedOrder["deliveryOption"];
    paymentMethod: PaymentMethod;
  }) => Promise<PlacedOrder>;
  getOrder: (id: string) => PlacedOrder | undefined;

  // Recently Viewed
  recentlyViewed: string[];
  recentlyViewedProducts: Product[];
  recordView: (productId: string, productObj?: Product) => void;

  // Mystery Drop
  isMysteryRevealed: boolean;
  revealMysteryDrop: () => void;
  subscribeMysteryNotification: (email: string) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | null>(null);

const STORAGE_KEYS = {
  RECENT: "dream_store_recent_v2",
  RECENT_ITEMS: "dream_store_recent_items_v2",
  MYSTERY: "dream_store_mystery_v2",
};

// Stable fallbacks for useLocalStorage (it compares by reference).
const NO_IDS: string[] = [];
const NO_PRODUCTS: Product[] = [];

const EMPTY_ADDRESS: PlacedOrder["deliveryAddress"] = {
  fullName: "Recipient",
  phone: "",
  address: "Local Sector",
  city: "Home",
  state: "Primary Timeline",
  pin: "00000",
  addressType: "Home",
};

function toCartItem(line: CartLine): CartItem {
  return {
    variantId: line.variantId,
    productId: line.productId,
    name: line.name || "Artifact",
    variantName: line.variantName,
    price: line.price,
    quantity: line.quantity,
    image: line.productImage ?? null,
    visualId: line.visualId ?? "",
    category: "",
    // The cart API doesn't report stock; the order call is what enforces it.
    stock: Number.POSITIVE_INFINITY,
  };
}

export function toPlacedOrder(order: Order): PlacedOrder {
  const lastEvent = order.trackingTimeline?.[order.trackingTimeline.length - 1];
  return {
    id: order._id,
    orderNumber: order.orderNumber || `DRM-${order._id.slice(-4).toUpperCase()}`,
    date: new Date(order.createdAt).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    items: order.items.map((item) => ({
      variantId: item.variantId,
      productId: item.productId,
      name: item.name,
      variantName: item.variantName,
      price: item.price,
      quantity: item.quantity,
      image: item.productImage ?? null,
      visualId: item.visualId ?? "",
      category: "",
      stock: Number.POSITIVE_INFINITY,
    })),
    subtotal: order.priceBreakup?.subtotal ?? 0,
    discount: order.priceBreakup?.discount ?? 0,
    shipping: order.priceBreakup?.shipping ?? 0,
    tax: order.priceBreakup?.tax ?? 0,
    total: order.priceBreakup?.total ?? 0,
    deliveryOption: order.deliveryOption ?? "standard",
    deliveryAddress: order.deliveryAddress ?? EMPTY_ADDRESS,
    paymentMethod: order.paymentMethod ?? "card",
    status: order.trackingStatus ?? "Ordered",
    statusDescription: lastEvent?.desc ?? "Order confirmed and logged.",
    estimatedDelivery: order.estimatedDelivery ?? "In 3-5 business days",
  };
}

type WishlistResponse = { wishlist: (string | Product)[] };

export function StoreProvider({
  children,
  signedIn = false,
}: {
  children: React.ReactNode;
  signedIn?: boolean;
}) {
  const router = useRouter();

  const {
    data: backendCart,
    mutate: mutateCart,
    isLoading: isCartLoading,
  } = useSWR<Cart>("cart", swrFetcher, {
    revalidateOnFocus: true,
    shouldRetryOnError: false,
  });

  // Wishlists and order history belong to accounts; guests never ask for them.
  const { data: backendWishlist, mutate: mutateWishlist } =
    useSWR<WishlistResponse>(signedIn ? "users/wishlist" : null, swrFetcher, {
      shouldRetryOnError: false,
    });

  const { data: backendOrders, mutate: mutateOrders } = useSWR<{ orders: Order[] }>(
    signedIn ? "orders" : null,
    swrFetcher,
    { shouldRetryOnError: false },
  );

  const [recentlyViewed, setRecentlyViewed] = useLocalStorage<string[]>(
    STORAGE_KEYS.RECENT,
    NO_IDS,
  );
  const [recentlyViewedProducts, setRecentlyViewedProducts] = useLocalStorage<Product[]>(
    STORAGE_KEYS.RECENT_ITEMS,
    NO_PRODUCTS,
  );
  const [isMysteryRevealed, setIsMysteryRevealed] = useLocalStorage<boolean>(
    STORAGE_KEYS.MYSTERY,
    false,
  );

  // -------------------------------------------------------------
  // DERIVED STATE (all of it comes from the backend's answers)
  // -------------------------------------------------------------
  const cart = (backendCart?.items ?? []).map(toCartItem);
  const savedForLater = (backendCart?.savedForLater ?? []).map(toCartItem);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = backendCart?.priceBreakup?.subtotal ?? 0;
  const discount = backendCart?.priceBreakup?.discount ?? 0;
  const shipping = backendCart?.priceBreakup?.shipping ?? 0;
  const tax = backendCart?.priceBreakup?.tax ?? 0;
  const total = backendCart?.priceBreakup?.total ?? 0;

  const promoCode = backendCart?.couponCode ?? "";
  const promoDescription = backendCart?.appliedCoupon?.description ?? "";
  const isPromoApplied = Boolean(promoCode);

  const wishlistEntries = backendWishlist?.wishlist ?? [];
  const wishlist: string[] = wishlistEntries
    .map((entry) => (typeof entry === "string" ? entry : entry._id))
    .filter(Boolean);
  const wishlistProducts: Product[] = wishlistEntries.filter(
    (entry): entry is Product => typeof entry === "object" && entry !== null,
  );

  const orders: PlacedOrder[] = (backendOrders?.orders ?? []).map(toPlacedOrder);

  // -------------------------------------------------------------
  // CART ACTIONS
  // -------------------------------------------------------------
  /** Runs a cart request, shows its error if it fails, and keeps the cache honest either way. */
  async function cartAction(request: () => Promise<Cart>, failure: string) {
    try {
      const updated = await request();
      await mutateCart(updated, false);
      return true;
    } catch (error) {
      toast.error(messageOf(error, failure));
      await mutateCart(); // re-sync with whatever the backend really holds
      return false;
    }
  }

  async function addToCart(product: AddableProduct, variantId?: string, quantity = 1) {
    const added = await cartAction(
      () =>
        api<Cart>("cart/add", {
          method: "POST",
          // Without a variant the backend uses the product's first one.
          body: { variantId: variantId || product._id, name: product.name, quantity },
        }),
      "Couldn't add that to your cart.",
    );
    if (added) {
      toast.success(`Added ${product.name} to cart.`, {
        description: "You have made a decision.",
      });
    }
    return added;
  }

  async function updateQuantity(variantId: string, quantity: number) {
    if (quantity <= 0) return removeFromCart(variantId);
    await cartAction(
      () => api<Cart>(`cart/items/${variantId}`, { method: "PATCH", body: { quantity } }),
      "Couldn't change the quantity.",
    );
  }

  async function removeFromCart(variantId: string) {
    const removed = await cartAction(
      () => api<Cart>(`cart/items/${variantId}`, { method: "DELETE" }),
      "Couldn't remove that item.",
    );
    if (removed) toast.message("Item removed from cart.");
  }

  async function saveForLater(variantId: string) {
    const item = cart.find((i) => i.variantId === variantId);
    const saved = await cartAction(
      () => api<Cart>(`cart/save-for-later/${variantId}`, { method: "POST" }),
      "Couldn't save that for later.",
    );
    if (saved && item) toast.message(`Saved "${item.name}" for later consideration.`);
  }

  async function moveToCartFromSaved(variantId: string) {
    const item = savedForLater.find((i) => i.variantId === variantId);
    const moved = await cartAction(
      () => api<Cart>(`cart/move-to-cart/${variantId}`, { method: "POST" }),
      "Couldn't move that to your cart.",
    );
    if (moved && item) toast.success(`Moved "${item.name}" to cart.`);
  }

  async function applyPromo(code: string): Promise<boolean> {
    const clean = code.trim().toUpperCase();
    const applied = await cartAction(
      () => api<Cart>("cart/coupon", { method: "POST", body: { code: clean } }),
      "Couldn't apply that promo code.",
    );
    if (applied) toast.success(`Promo code "${clean}" applied!`);
    return applied;
  }

  async function removePromo() {
    const removed = await cartAction(
      () => api<Cart>("cart/coupon", { method: "DELETE" }),
      "Couldn't remove the promo code.",
    );
    if (removed) toast.message("Promo code removed.");
  }

  // -------------------------------------------------------------
  // WISHLIST ACTIONS
  // -------------------------------------------------------------
  function askToSignIn(reason: string) {
    toast.message(`Sign in to ${reason}.`, {
      action: {
        label: "Sign in",
        onClick: () =>
          router.push(
            `/signin?next=${encodeURIComponent(window.location.pathname + window.location.search)}`,
          ),
      },
    });
  }

  async function changeWishlist(productId: string, method: "POST" | "DELETE") {
    try {
      const updated = await api<WishlistResponse>(`users/wishlist/${productId}`, { method });
      await mutateWishlist(updated, false);
      return true;
    } catch (error) {
      toast.error(messageOf(error, "Couldn't update your wishlist."));
      await mutateWishlist();
      return false;
    }
  }

  async function toggleWishlist(productId: string) {
    if (!signedIn) return askToSignIn("save items to your wishlist");
    if (wishlist.includes(productId)) {
      if (await changeWishlist(productId, "DELETE")) toast.message("Removed from wishlist.");
    } else if (await changeWishlist(productId, "POST")) {
      toast.success("Added to wishlist.", {
        description: "Saved for unnecessary contemplation.",
      });
    }
  }

  async function removeFromWishlist(productId: string) {
    if (!signedIn) return askToSignIn("manage your wishlist");
    await changeWishlist(productId, "DELETE");
  }

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // -------------------------------------------------------------
  // RECENTLY VIEWED (per-browser; stable so effects can depend on it)
  // -------------------------------------------------------------
  const recordView = useCallback(
    (productId: string, productObj?: Product) => {
      setRecentlyViewed((prev) =>
        [productId, ...prev.filter((id) => id !== productId)].slice(0, 8),
      );
      if (productObj) {
        setRecentlyViewedProducts((prev) =>
          [
            productObj,
            ...prev.filter(
              (p) =>
                p._id !== productObj._id &&
                (!productObj.slug || p.slug !== productObj.slug),
            ),
          ].slice(0, 8),
        );
      }
    },
    [setRecentlyViewed, setRecentlyViewedProducts],
  );

  // -------------------------------------------------------------
  // ORDERS
  // -------------------------------------------------------------
  async function placeOrder(details: {
    address: PlacedOrder["deliveryAddress"];
    deliveryOption: PlacedOrder["deliveryOption"];
    paymentMethod: PaymentMethod;
  }): Promise<PlacedOrder> {
    // Throws the backend's own message (out of stock, not signed in, ...).
    const created = await api<{ order: Order }>("orders", {
      method: "POST",
      body: {
        deliveryAddress: details.address,
        deliveryOption: details.deliveryOption,
        paymentMethod: details.paymentMethod,
      },
    });
    const pending = created.order;

    let confirmed: Order;
    try {
      const result = await api<{ order: Order }>("orders/confirm-payment", {
        method: "POST",
        body: { orderId: pending._id },
      });
      confirmed = result.order;
    } catch (error) {
      await mutateCart(); // the cart was already moved into the pending order
      throw new PaymentPendingError(
        messageOf(error, "Payment didn't go through."),
        pending._id,
      );
    }

    await Promise.all([
      mutateCart(),
      mutateOrders(
        (previous) => ({
          orders: [
            confirmed,
            ...(previous?.orders ?? []).filter((o) => o._id !== confirmed._id),
          ],
        }),
        false,
      ),
    ]);
    return toPlacedOrder(confirmed);
  }

  function getOrder(id: string): PlacedOrder | undefined {
    const needle = id.toLowerCase();
    return orders.find(
      (o) => o.id.toLowerCase() === needle || o.orderNumber.toLowerCase() === needle,
    );
  }

  // -------------------------------------------------------------
  // MYSTERY DROP
  // -------------------------------------------------------------
  function revealMysteryDrop() {
    setIsMysteryRevealed(true);
    toast.success("Mystery Drop Revealed!", {
      description: "Anomaly Drop #88: Anti-Gravity Ceramic Vessel.",
    });
  }

  async function subscribeMysteryNotification(email: string) {
    try {
      await api("newsletter/subscribe", { method: "POST", body: { email } });
      toast.success(`Notification set for ${email}.`, {
        description: "We will alert you when reality bends.",
      });
    } catch (error) {
      toast.error(messageOf(error, "Couldn't set that notification."));
    }
  }

  return (
    <StoreContext.Provider
      value={{
        signedIn,
        cart,
        savedForLater,
        isCartLoading,
        cartCount,
        subtotal,
        discount,
        shipping,
        tax,
        total,
        promoCode,
        promoDescription,
        isPromoApplied,
        applyPromo,
        removePromo,
        addToCart,
        updateQuantity,
        removeFromCart,
        saveForLater,
        moveToCartFromSaved,
        wishlist,
        wishlistProducts,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        orders,
        placeOrder,
        getOrder,
        recentlyViewed,
        recentlyViewedProducts,
        recordView,
        isMysteryRevealed,
        revealMysteryDrop,
        subscribeMysteryNotification,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used inside <StoreProvider>");
  }
  return context;
}
