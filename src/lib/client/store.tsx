"use client";

import type { Cart, Order, Product } from "@/lib/api/types";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { api, swrFetcher } from "./api";

export interface CartItem {
  variantId: string;
  productId: string;
  name: string;
  variantName?: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  visualId: string;
  category: string;
  stock: number;
}

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
  paymentMethod: "upi" | "card" | "netbanking" | "wallet" | "cod";
  status: "Ordered" | "Packed" | "Shipped" | "Out for Delivery" | "Delivered";
  statusDescription: string;
  estimatedDelivery: string;
}

interface StoreContextType {
  // Cart
  cart: CartItem[];
  savedForLater: CartItem[];
  cartCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  promoCode: string;
  isPromoApplied: boolean;
  applyPromo: (code: string) => Promise<boolean> | boolean;
  removePromo: () => Promise<void> | void;
  addToCart: (
    product: Product,
    variantId?: string,
    quantity?: number,
  ) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeFromCart: (variantId: string) => void;
  saveForLater: (variantId: string) => void;
  moveToCartFromSaved: (variantId: string) => void;
  clearCart: () => void;

  // Wishlist
  wishlist: string[];
  wishlistProducts: Product[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;

  // Orders
  orders: PlacedOrder[];
  placeOrder: (details: {
    address: PlacedOrder["deliveryAddress"];
    deliveryOption: PlacedOrder["deliveryOption"];
    paymentMethod: PlacedOrder["paymentMethod"];
  }) => Promise<PlacedOrder> | PlacedOrder;
  getOrder: (id: string) => PlacedOrder | undefined;

  // Recently Viewed
  recentlyViewed: string[];
  recentlyViewedProducts: Product[];
  recordView: (productId: string, productObj?: Product) => void;

  // Mystery Drop
  isMysteryRevealed: boolean;
  revealMysteryDrop: () => void;
  subscribeMysteryNotification: (email: string) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

const STORAGE_KEYS = {
  CART: "dream_store_cart_v2",
  SAVED: "dream_store_saved_v2",
  WISHLIST: "dream_store_wishlist_v2",
  ORDERS: "dream_store_orders_v2",
  RECENT: "dream_store_recent_v2",
  RECENT_ITEMS: "dream_store_recent_items_v2",
  PROMO: "dream_store_promo_v2",
  MYSTERY: "dream_store_mystery_v2",
};

const INITIAL_ORDERS: PlacedOrder[] = [];

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // 1. SWR Hooks for live backend state
  const { data: backendCart, mutate: mutateCart } = useSWR<Cart>(
    "cart",
    swrFetcher,
    {
      revalidateOnFocus: true,
      shouldRetryOnError: false,
    },
  );

  const { data: backendWishlist, mutate: mutateWishlist } = useSWR<{
    wishlist: (string | Product)[];
  }>("users/wishlist", swrFetcher, {
    shouldRetryOnError: false,
  });

  const { data: backendOrders, mutate: mutateOrders } = useSWR<{
    orders: Order[];
  }>("orders", swrFetcher, {
    shouldRetryOnError: false,
  });

  // 2. Local state for hydration & offline/fallback
  const [localCart, setLocalCart] = useState<CartItem[]>([]);
  const [localSavedForLater, setLocalSavedForLater] = useState<CartItem[]>([]);
  const [localWishlist, setLocalWishlist] = useState<string[]>([]);
  const [localOrders, setLocalOrders] = useState<PlacedOrder[]>(INITIAL_ORDERS);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState<Product[]>([]);
  const [localPromo, setLocalPromo] = useState<string>("");
  const [isMysteryRevealed, setIsMysteryRevealed] = useState<boolean>(false);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      // Purge legacy mock data
      try {
        localStorage.removeItem("yc_store_orders_v1");
        localStorage.removeItem("yc_store_wishlist_v1");
        localStorage.removeItem("yc_store_recent_v1");
        localStorage.removeItem("yc_store_recent_items_v1");
        localStorage.removeItem("yc_store_cart_v1");
        localStorage.removeItem("yc_store_saved_v1");
      } catch {}
      const storedCart = localStorage.getItem(STORAGE_KEYS.CART);
      if (storedCart) setLocalCart(JSON.parse(storedCart));

      const storedSaved = localStorage.getItem(STORAGE_KEYS.SAVED);
      if (storedSaved) setLocalSavedForLater(JSON.parse(storedSaved));

      const storedWish = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      if (storedWish) setLocalWishlist(JSON.parse(storedWish));

      const storedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (storedOrders) {
        const parsed = JSON.parse(storedOrders);
        if (Array.isArray(parsed) && parsed.length > 0) setLocalOrders(parsed);
      }

      const storedRecent = localStorage.getItem(STORAGE_KEYS.RECENT);
      if (storedRecent) setRecentlyViewed(JSON.parse(storedRecent));

      const storedRecentItems = localStorage.getItem(STORAGE_KEYS.RECENT_ITEMS);
      if (storedRecentItems) {
        try {
          const parsed = JSON.parse(storedRecentItems);
          if (Array.isArray(parsed)) setRecentlyViewedProducts(parsed);
        } catch {}
      }

      const storedPromo = localStorage.getItem(STORAGE_KEYS.PROMO);
      if (storedPromo) setLocalPromo(storedPromo);

      const storedMystery = localStorage.getItem(STORAGE_KEYS.MYSTERY);
      if (storedMystery === "true") setIsMysteryRevealed(true);
    } catch {
      // Storage unavailable
    } finally {
      setHydrated(true);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.RECENT, JSON.stringify(recentlyViewed));
      localStorage.setItem(
        STORAGE_KEYS.RECENT_ITEMS,
        JSON.stringify(recentlyViewedProducts),
      );
    } catch {}
  }, [recentlyViewed, recentlyViewedProducts, hydrated]);

  // Map backend cart items to CartItem format
  const cart: CartItem[] =
    backendCart && backendCart.items
      ? backendCart.items.map((item) => ({
          variantId: item.variantId,
          productId: item.productId,
          name: item.name,
          variantName: item.variantName,
          price: item.price,
          quantity: item.quantity,
          visualId:
            item.productImage ||
            (typeof item.productId === "string" ? item.productId : "unknown"),
          category: "",
          stock: 100,
        }))
      : localCart;

  const savedForLater: CartItem[] =
    backendCart && backendCart.savedForLater
      ? backendCart.savedForLater.map((s) => ({
          variantId: s.variantId,
          productId: s.variantId,
          name: s.name || "Artifact",
          price: 0,
          quantity: s.quantity,
          visualId: s.variantId,
          category: "",
          stock: 100,
        }))
      : localSavedForLater;

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Price calculations: prioritize backend priceBreakup, else local math
  const subtotal =
    backendCart?.priceBreakup?.subtotal ??
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const discount =
    backendCart?.priceBreakup?.discount ??
    (localPromo ? Math.round(subtotal * 0.1 * 100) / 100 : 0);

  const shipping =
    backendCart?.priceBreakup?.shipping ??
    (subtotal > 500 || subtotal === 0 ? 0 : 40);

  const tax =
    backendCart?.priceBreakup?.tax ??
    Math.round((subtotal - discount) * 0.05 * 100) / 100;

  const total =
    backendCart?.priceBreakup?.total ??
    Math.max(0, Math.round((subtotal - discount + shipping + tax) * 100) / 100);

  const promoCode = backendCart?.couponCode || localPromo;
  const isPromoApplied = Boolean(promoCode);

  // Wishlist: map from backend wishlist items
  const wishlist: string[] =
    backendWishlist && Array.isArray(backendWishlist.wishlist)
      ? backendWishlist.wishlist
          .map((item) =>
            typeof item === "string" ? item : item._id || item.slug || "",
          )
          .filter(Boolean)
      : localWishlist;

  const wishlistProducts: Product[] =
    backendWishlist && Array.isArray(backendWishlist.wishlist)
      ? backendWishlist.wishlist.filter(
          (item): item is Product => typeof item === "object" && item !== null,
        )
      : [];

  // Orders: map from backend orders
  const orders: PlacedOrder[] =
    backendOrders &&
    Array.isArray(backendOrders.orders) &&
    backendOrders.orders.length > 0
      ? backendOrders.orders.map((o) => ({
          id: o._id,
          orderNumber: o.orderNumber || `DRM-${o._id.slice(-4).toUpperCase()}`,
          date: new Date(o.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
          items: o.items.map((i) => ({
            variantId: i.variantId,
            productId: i.productId,
            name: i.name,
            variantName: i.variantName,
            price: i.price,
            quantity: i.quantity,
            visualId: i.productImage || i.productId,
            category: "",
            stock: 100,
          })),
          subtotal: o.priceBreakup?.subtotal || 0,
          discount: o.priceBreakup?.discount || 0,
          shipping: o.priceBreakup?.shipping || 0,
          tax: o.priceBreakup?.tax || 0,
          total: o.priceBreakup?.total || 0,
          deliveryOption:
            (o.deliveryOption as PlacedOrder["deliveryOption"]) || "standard",
          deliveryAddress: o.deliveryAddress || {
            fullName: "Recipient",
            phone: "",
            address: "Local Sector",
            city: "Home",
            state: "Primary Timeline",
            pin: "00000",
            addressType: "Home",
          },
          paymentMethod:
            (o.paymentMethod as PlacedOrder["paymentMethod"]) || "card",
          status: o.trackingStatus || "Ordered",
          statusDescription:
            o.trackingTimeline?.[o.trackingTimeline.length - 1]?.desc ||
            "Order confirmed and logged.",
          estimatedDelivery: o.estimatedDelivery || "In 3-5 business days",
        }))
      : localOrders;

  // -------------------------------------------------------------
  // CART ACTIONS
  // -------------------------------------------------------------
  async function addToCart(
    product: Product,
    variantId?: string,
    quantity = 1,
  ) {
    const pSlug: string = product.slug || product._id;
    const targetVariantId: string = variantId || product._id || pSlug;
    const visualId: string = product.visualId || pSlug || "generic";

    // 1. Optimistic local update
    setLocalCart((prev) => {
      const existing = prev.find((item) => item.variantId === targetVariantId);
      if (existing) {
        return prev.map((item) =>
          item.variantId === targetVariantId
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      const newItem: CartItem = {
        variantId: targetVariantId,
        productId: product._id || pSlug,
        name: product.name,
        price: product.minPrice || 199,
        quantity,
        visualId,
        category: product.category,
        stock: product.totalStock || 100,
      };
      return [...prev, newItem];
    });

    toast.success(`Added ${product.name} to cart.`, {
      description: "You have made a decision.",
    });

    // 2. Synchronize with backend
    try {
      await api("cart/add", {
        method: "POST",
        body: {
          variantId: targetVariantId,
          name: product.name,
          quantity,
        },
      });
      await mutateCart();
    } catch {
      // Offline fallback: keep local
    }
  }

  async function updateQuantity(variantId: string, quantity: number) {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }

    setLocalCart((prev) =>
      prev.map((item) =>
        item.variantId === variantId ? { ...item, quantity } : item,
      ),
    );

    try {
      await api(`cart/items/${variantId}`, {
        method: "PATCH",
        body: { quantity },
      });
      await mutateCart();
    } catch {
      // Local state already updated
    }
  }

  async function removeFromCart(variantId: string) {
    setLocalCart((prev) => prev.filter((item) => item.variantId !== variantId));
    toast.message("Item removed from cart.");

    try {
      await api(`cart/items/${variantId}`, { method: "DELETE" });
      await mutateCart();
    } catch {
      // Local state updated
    }
  }

  async function saveForLater(variantId: string) {
    const item = cart.find((i) => i.variantId === variantId);
    if (!item) return;

    setLocalCart((prev) => prev.filter((i) => i.variantId !== variantId));
    setLocalSavedForLater((prev) => [
      ...prev.filter((i) => i.variantId !== variantId),
      item,
    ]);
    toast.message(`Saved "${item.name}" for later consideration.`);

    try {
      await api(`cart/save-for-later/${variantId}`, { method: "POST" });
      await mutateCart();
    } catch {}
  }

  async function moveToCartFromSaved(variantId: string) {
    const item = savedForLater.find((i) => i.variantId === variantId);
    if (!item) return;

    setLocalSavedForLater((prev) =>
      prev.filter((i) => i.variantId !== variantId),
    );
    setLocalCart((prev) => [...prev, item]);
    toast.success(`Moved "${item.name}" to cart.`);

    try {
      await api(`cart/move-to-cart/${variantId}`, { method: "POST" });
      await mutateCart();
    } catch {}
  }

  function clearCart() {
    setLocalCart([]);
    mutateCart(undefined, false);
  }

  async function applyPromo(code: string): Promise<boolean> {
    const clean = code.trim().toUpperCase();
    try {
      await api("cart/coupon", {
        method: "POST",
        body: { couponCode: clean },
      });
      await mutateCart();
      setLocalPromo(clean);
      toast.success(`Promo code "${clean}" applied!`);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid promo code.";
      toast.error(msg);
      return false;
    }
  }

  async function removePromo() {
    setLocalPromo("");
    try {
      await api("cart/coupon", { method: "DELETE" });
      await mutateCart();
    } catch {}
    toast.message("Promo code removed.");
  }

  // -------------------------------------------------------------
  // WISHLIST ACTIONS
  // -------------------------------------------------------------
  async function toggleWishlist(productId: string) {
    const isPresent = wishlist.includes(productId);

    if (isPresent) {
      setLocalWishlist((prev) => prev.filter((id) => id !== productId));
      toast.message("Removed from wishlist.");
      try {
        await api(`users/wishlist/${productId}`, { method: "DELETE" });
        await mutateWishlist();
      } catch {}
    } else {
      setLocalWishlist((prev) => [...prev, productId]);
      toast.success("Added to wishlist.", {
        description: "Saved for unnecessary contemplation.",
      });
      try {
        await api(`users/wishlist/${productId}`, { method: "POST" });
        await mutateWishlist();
      } catch {}
    }
  }

  function isInWishlist(productId: string) {
    return wishlist.includes(productId);
  }

  async function removeFromWishlist(productId: string) {
    setLocalWishlist((prev) => prev.filter((id) => id !== productId));
    try {
      await api(`users/wishlist/${productId}`, { method: "DELETE" });
      await mutateWishlist();
    } catch {}
  }

  function recordView(productId: string, productObj?: Product) {
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
  }

  // -------------------------------------------------------------
  // ORDER ACTIONS
  // -------------------------------------------------------------
  async function placeOrder(details: {
    address: PlacedOrder["deliveryAddress"];
    deliveryOption: PlacedOrder["deliveryOption"];
    paymentMethod: PlacedOrder["paymentMethod"];
  }): Promise<PlacedOrder> {
    // 1. Try backend order placement
    try {
      const created = await api<{ order: Order }>("orders", {
        method: "POST",
        body: {
          deliveryAddress: details.address,
          deliveryOption: details.deliveryOption,
          paymentMethod: details.paymentMethod,
        },
      });

      const orderDoc = created.order || created;

      // 2. Confirm payment to advance order status and schedule tracking
      await api("orders/confirm-payment", {
        method: "POST",
        body: { orderId: orderDoc._id },
      });

      clearCart();
      await mutateCart();
      await mutateOrders();

      const confirmedOrder: PlacedOrder = {
        id: orderDoc._id,
        orderNumber:
          orderDoc.orderNumber || `DRM-${orderDoc._id.slice(-4).toUpperCase()}`,
        date: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        items: [...cart],
        subtotal,
        discount,
        shipping,
        tax,
        total,
        deliveryOption: details.deliveryOption,
        deliveryAddress: details.address,
        paymentMethod: details.paymentMethod,
        status: "Ordered",
        statusDescription: "Transaction recorded in the great ledger.",
        estimatedDelivery: orderDoc.estimatedDelivery || "In 3-5 business days",
      };

      setLocalOrders((prev) => [confirmedOrder, ...prev]);
      return confirmedOrder;
    } catch (err) {
      console.warn(
        "Backend order creation failed, generating local confirmed order:",
        err,
      );
      // Fallback local order creation
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const orderNumber = `YC-${randomNum}`;
      const id = `yc-order-${randomNum}`;

      const fallbackOrder: PlacedOrder = {
        id,
        orderNumber,
        date: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        items: [...cart],
        subtotal,
        discount,
        shipping,
        tax,
        total,
        deliveryOption: details.deliveryOption,
        deliveryAddress: details.address,
        paymentMethod: details.paymentMethod,
        status: "Ordered",
        statusDescription: "Transaction recorded in the great ledger.",
        estimatedDelivery:
          details.deliveryOption === "temporal"
            ? "Arrived Yesterday (check temporal buffer)"
            : details.deliveryOption === "express"
              ? "Tomorrow by 5:00 PM"
              : "In 3-5 business days",
      };

      setLocalOrders((prev) => [fallbackOrder, ...prev]);
      clearCart();
      return fallbackOrder;
    }
  }

  function getOrder(id: string): PlacedOrder | undefined {
    return orders.find(
      (o) =>
        o.id === id ||
        o.orderNumber.toLowerCase() === id.toLowerCase() ||
        o.id.toLowerCase() === id.toLowerCase(),
    );
  }

  function revealMysteryDrop() {
    setIsMysteryRevealed(true);
    try {
      localStorage.setItem(STORAGE_KEYS.MYSTERY, "true");
    } catch {}
    toast.success("Mystery Drop Revealed!", {
      description: "Anomaly Drop #88: Anti-Gravity Ceramic Vessel.",
    });
  }

  async function subscribeMysteryNotification(email: string) {
    try {
      await api("newsletter/subscribe", {
        method: "POST",
        body: { email },
      });
    } catch {
      // Ignore if already subscribed or offline
    }
    toast.success(`Notification set for ${email}.`, {
      description: "We will alert you when reality bends.",
    });
  }

  return (
    <StoreContext.Provider
      value={{
        cart,
        savedForLater,
        cartCount,
        subtotal,
        discount,
        shipping,
        tax,
        total,
        promoCode,
        isPromoApplied,
        applyPromo,
        removePromo,
        addToCart,
        updateQuantity,
        removeFromCart,
        saveForLater,
        moveToCartFromSaved,
        clearCart,
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
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
