"use client";

import useSWR from "swr";
import { api, swrFetcher } from "./api";
import type { Cart } from "@/lib/api/types";

export const CART_KEY = "cart";

export function useCart() {
  const { data, error, isLoading, mutate } = useSWR<Cart>(CART_KEY, swrFetcher<Cart>, {
    revalidateOnFocus: true,
    shouldRetryOnError: false,
  });

  const itemCount = data?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  /** `quantity` may be negative: the backend adds it to the existing line. */
  async function changeQuantity(variantId: string, name: string, quantity: number) {
    await api("cart/add", { method: "POST", body: { variantId, name, quantity } });
    await mutate();
  }

  return { cart: data, itemCount, error, isLoading, changeQuantity, refresh: mutate };
}
