"use client";

import { YC_PRODUCTS, type CatalogProduct } from "@/lib/data/products";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

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
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
  addToCart: (
    product: CatalogProduct,
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
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;

  // Orders
  orders: PlacedOrder[];
  placeOrder: (details: {
    address: PlacedOrder["deliveryAddress"];
    deliveryOption: PlacedOrder["deliveryOption"];
    paymentMethod: PlacedOrder["paymentMethod"];
  }) => PlacedOrder;
  getOrder: (id: string) => PlacedOrder | undefined;

  // Recently Viewed
  recentlyViewed: string[];
  recordView: (productId: string) => void;

  // Mystery Drop
  isMysteryRevealed: boolean;
  revealMysteryDrop: () => void;
  subscribeMysteryNotification: (email: string) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

const STORAGE_KEYS = {
  CART: "yc_store_cart_v1",
  SAVED: "yc_store_saved_v1",
  WISHLIST: "yc_store_wishlist_v1",
  ORDERS: "yc_store_orders_v1",
  RECENT: "yc_store_recent_v1",
  PROMO: "yc_store_promo_v1",
  MYSTERY: "yc_store_mystery_v1",
};

// Default seed orders so the orders tracking screen is alive and believable right away!
const INITIAL_ORDERS: PlacedOrder[] = [
  {
    id: "yc-order-5956",
    orderNumber: "YC-5956",
    date: "October 3, 2026",
    items: [
      {
        variantId: "var_echo_std",
        productId: "bottled-echoes",
        name: "Bottled Echoes",
        variantName: "Standard Resonance (440Hz)",
        price: 399,
        originalPrice: 450,
        quantity: 1,
        visualId: "bottled-echoes",
        category: "Collectibles",
        stock: 1220,
      },
    ],
    subtotal: 399,
    discount: 0,
    shipping: 0,
    tax: 31.92,
    total: 430.92,
    deliveryOption: "standard",
    deliveryAddress: {
      fullName: "Arthur Dent",
      phone: "+1 (555) 019-2834",
      address: "42 Sub-Etha Expressway, Apt 7B",
      city: "Islington",
      state: "London",
      pin: "WC1N 3AX",
      addressType: "Home",
    },
    paymentMethod: "card",
    status: "Out for Delivery",
    statusDescription: "It is now someone else's problem.",
    estimatedDelivery: "Tomorrow by 8:00 PM",
  },
  {
    id: "yc-order-4102",
    orderNumber: "YC-4102",
    date: "September 24, 2026",
    items: [
      {
        variantId: "var_brk_std",
        productId: "emotional-support-brick",
        name: "Emotional Support Brick",
        variantName: "Classic Terracotta Red",
        price: 65,
        quantity: 1,
        visualId: "emotional-support-brick",
        category: "Home",
        stock: 4110,
      },
      {
        variantId: "var_box_std",
        productId: "certified-unnecessary-box",
        name: "Certified Unnecessary Box",
        variantName: "Space Grey Anodized",
        price: 110,
        quantity: 1,
        visualId: "certified-unnecessary-box",
        category: "Things You Didn't Need",
        stock: 3420,
      },
    ],
    subtotal: 175,
    discount: 17.5,
    shipping: 0,
    tax: 14.0,
    total: 171.5,
    deliveryOption: "standard",
    deliveryAddress: {
      fullName: "Arthur Dent",
      phone: "+1 (555) 019-2834",
      address: "42 Sub-Etha Expressway, Apt 7B",
      city: "Islington",
      state: "London",
      pin: "WC1N 3AX",
      addressType: "Home",
    },
    paymentMethod: "upi",
    status: "Delivered",
    statusDescription: "You now own this. There is no going back.",
    estimatedDelivery: "Delivered on September 28, 2026",
  },
];

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [savedForLater, setSavedForLater] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([
    "luxury-cardboard",
    "extra-tuesday",
  ]);
  const [orders, setOrders] = useState<PlacedOrder[]>(INITIAL_ORDERS);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([
    "bottled-echoes",
    "diy-black-hole-kit",
    "emergency-backup-moon",
  ]);
  const [promoCode, setPromoCode] = useState<string>("");
  const [isPromoApplied, setIsPromoApplied] = useState<boolean>(false);
  const [isMysteryRevealed, setIsMysteryRevealed] = useState<boolean>(false);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(STORAGE_KEYS.CART);
      if (storedCart) setCart(JSON.parse(storedCart));

      const storedSaved = localStorage.getItem(STORAGE_KEYS.SAVED);
      if (storedSaved) setSavedForLater(JSON.parse(storedSaved));

      const storedWish = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      if (storedWish) setWishlist(JSON.parse(storedWish));

      const storedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (storedOrders) {
        const parsed = JSON.parse(storedOrders);
        if (Array.isArray(parsed) && parsed.length > 0) setOrders(parsed);
      }

      const storedRecent = localStorage.getItem(STORAGE_KEYS.RECENT);
      if (storedRecent) setRecentlyViewed(JSON.parse(storedRecent));

      const storedPromo = localStorage.getItem(STORAGE_KEYS.PROMO);
      if (storedPromo === "QUESTIONABLE10") {
        setPromoCode("QUESTIONABLE10");
        setIsPromoApplied(true);
      }

      const storedMystery = localStorage.getItem(STORAGE_KEYS.MYSTERY);
      if (storedMystery === "true") setIsMysteryRevealed(true);
    } catch {
      // Storage unavailable or disabled
    } finally {
      setHydrated(true);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch {}
  }, [cart, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(savedForLater));
    } catch {}
  }, [savedForLater, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    } catch {}
  }, [wishlist, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch {}
  }, [orders, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.RECENT, JSON.stringify(recentlyViewed));
    } catch {}
  }, [recentlyViewed, hydrated]);

  // Calculations
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discount = isPromoApplied ? Math.round(subtotal * 0.1 * 100) / 100 : 0;
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 25;
  const tax = Math.round((subtotal - discount) * 0.08 * 100) / 100;
  const total = Math.max(
    0,
    Math.round((subtotal - discount + shipping + tax) * 100) / 100,
  );

  function addToCart(
    product: CatalogProduct,
    variantId?: string,
    quantity = 1,
  ) {
    const chosenVariant = variantId
      ? product.variants.find((v) => v.id === variantId)
      : product.variants[0];

    const targetVariantId = chosenVariant?.id || `var_${product.id}_def`;
    const price = chosenVariant ? chosenVariant.price : product.price;
    const variantName = chosenVariant ? chosenVariant.name : undefined;

    setCart((prev) => {
      const existing = prev.find((item) => item.variantId === targetVariantId);
      if (existing) {
        return prev.map((item) =>
          item.variantId === targetVariantId
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [
        ...prev,
        {
          variantId: targetVariantId,
          productId: product.id,
          name: product.name,
          variantName,
          price,
          originalPrice: product.originalPrice,
          quantity,
          visualId: product.visualId,
          category: product.category,
          stock: chosenVariant ? chosenVariant.stock : product.totalStock,
        },
      ];
    });

    toast.success(`Added ${product.name} to cart.`, {
      description: "You have made a decision.",
    });
  }

  function updateQuantity(variantId: string, quantity: number) {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.variantId === variantId ? { ...item, quantity } : item,
      ),
    );
  }

  function removeFromCart(variantId: string) {
    setCart((prev) => prev.filter((item) => item.variantId !== variantId));
    toast.message("Item removed from cart.");
  }

  function saveForLater(variantId: string) {
    const item = cart.find((i) => i.variantId === variantId);
    if (!item) return;

    setCart((prev) => prev.filter((i) => i.variantId !== variantId));
    setSavedForLater((prev) => [
      ...prev.filter((i) => i.variantId !== variantId),
      item,
    ]);
    toast.message(`Saved "${item.name}" for later consideration.`);
  }

  function moveToCartFromSaved(variantId: string) {
    const item = savedForLater.find((i) => i.variantId === variantId);
    if (!item) return;

    setSavedForLater((prev) => prev.filter((i) => i.variantId !== variantId));
    setCart((prev) => [...prev, item]);
    toast.success(`Moved "${item.name}" to cart.`);
  }

  function clearCart() {
    setCart([]);
  }

  function applyPromo(code: string): boolean {
    const clean = code.trim().toUpperCase();
    if (clean === "QUESTIONABLE10") {
      setPromoCode("QUESTIONABLE10");
      setIsPromoApplied(true);
      try {
        localStorage.setItem(STORAGE_KEYS.PROMO, "QUESTIONABLE10");
      } catch {}
      toast.success("Promo code applied! 10% Questionable Discount granted.");
      return true;
    }
    toast.error("Invalid promo code. Did you invent this code?");
    return false;
  }

  function removePromo() {
    setPromoCode("");
    setIsPromoApplied(false);
    try {
      localStorage.removeItem(STORAGE_KEYS.PROMO);
    } catch {}
    toast.message("Promo code removed.");
  }

  function toggleWishlist(productId: string) {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const target = YC_PRODUCTS.find((p) => p.id === productId);
      if (exists) {
        toast.message(`Removed "${target?.name || productId}" from wishlist.`);
        return prev.filter((id) => id !== productId);
      } else {
        toast.success(`Added "${target?.name || productId}" to wishlist.`, {
          description: "Saved for unnecessary contemplation.",
        });
        return [...prev, productId];
      }
    });
  }

  function isInWishlist(productId: string) {
    return wishlist.includes(productId);
  }

  function removeFromWishlist(productId: string) {
    setWishlist((prev) => prev.filter((id) => id !== productId));
  }

  function recordView(productId: string) {
    setRecentlyViewed((prev) =>
      [productId, ...prev.filter((id) => id !== productId)].slice(0, 8),
    );
  }

  function placeOrder(details: {
    address: PlacedOrder["deliveryAddress"];
    deliveryOption: PlacedOrder["deliveryOption"];
    paymentMethod: PlacedOrder["paymentMethod"];
  }): PlacedOrder {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `YC-${randomNum}`;
    const id = `yc-order-${randomNum}`;

    const newOrder: PlacedOrder = {
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
      statusDescription: "Someone has carefully placed it inside a box.",
      estimatedDelivery:
        details.deliveryOption === "temporal"
          ? "Arrived Yesterday (check temporal buffer)"
          : details.deliveryOption === "express"
            ? "Tomorrow by 5:00 PM"
            : "In 3-5 business days",
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    return newOrder;
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

  function subscribeMysteryNotification(email: string) {
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
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        orders,
        placeOrder,
        getOrder,
        recentlyViewed,
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
