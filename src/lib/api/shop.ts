import "server-only";
import { ApiError } from "./errors";
import { backend } from "./server";
import type { Order, OrderStatus, Paginated } from "./types";

export type OrderFilters = {
  page?: number;
  limit?: number;
  statuses?: OrderStatus[];
  from?: string;
  to?: string;
};

export function getMyOrders(filters: OrderFilters = {}) {
  const { page = 1, limit = 10, statuses = [], from, to } = filters;
  return backend<Paginated<"orders", Order>>("/orders", {
    query: { page, limit, statuses, from, to },
  });
}

export async function getMyOrder(id: string): Promise<Order | null> {
  if (!/^[0-9a-f]{24}$/i.test(id)) return null;
  try {
    const data = await backend<{ order: Order | null }>(`/orders/${id}`);
    return data.order ?? null;
  } catch (error) {
    // The backend answers 401 for someone else's order and 500 for an unknown one.
    if (error instanceof ApiError && (error.status === 401 || error.status === 500)) {
      return null;
    }
    throw error;
  }
}
