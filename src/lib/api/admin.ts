import "server-only";
import { ApiError } from "./errors";
import { backend } from "./server";
import type {
  Banner,
  CartRecord,
  Category,
  Order,
  Paginated,
  Product,
  ProductDetail,
  Section,
  UserRecord,
} from "./types";

export const ADMIN_PAGE_SIZE = 10;

type ListArgs = { page?: number; query?: string; limit?: number };

/** Every admin list shares one shape: `/<x>/all` or `/<x>/search?query=`. */
function list<K extends string, T>(base: string, args: ListArgs) {
  const { page = 1, query, limit = ADMIN_PAGE_SIZE } = args;
  const search = query?.trim();
  return backend<Paginated<K, T>>(search ? `${base}/search` : `${base}/all`, {
    query: { page, limit, query: search },
  });
}

export const listProducts = (args: ListArgs) => list<"products", Product>("/products", args);
export const listUsers = (args: ListArgs) => list<"users", UserRecord>("/users", args);
export const listOrders = (args: ListArgs) => list<"orders", Order>("/orders", args);
export const listCarts = (args: ListArgs) => list<"carts", CartRecord>("/cart", args);

export async function getProductDetail(id: string) {
  if (!/^[0-9a-f]{24}$/i.test(id)) return null;
  const detail = await backend<ProductDetail | null>(`/products/${id}`);
  return detail ?? null;
}

export async function getUserRecord(id: string) {
  if (!/^[0-9a-f]{24}$/i.test(id)) return null;
  try {
    return await backend<UserRecord>(`/users/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
}

/**
 * GET /orders/:id is owner-only, even for admins, so single orders are found
 * through the admin search endpoint (which matches on `_id`).
 */
export async function getOrderRecord(id: string) {
  if (!/^[0-9a-f]{24}$/i.test(id)) return null;
  const { orders } = await listOrders({ query: id, limit: 5 });
  return orders.find((order) => order._id === id) ?? null;
}

export async function listOrdersOfUser(userId: string, page = 1, limit = ADMIN_PAGE_SIZE) {
  const data = await listOrders({ query: userId, page, limit });
  return { ...data, orders: data.orders.filter((order) => order.userId === userId) };
}

export async function getCartOfUser(userId: string) {
  const { carts } = await listCarts({ query: userId, limit: 5 });
  return carts.find((cart) => cart.userId === userId) ?? null;
}

/** Guest ids are UUIDs, registered user ids are Mongo ObjectIds. */
export const isGuestId = (id: string) => id.includes("-");

/** Home-page content, uncached so edits show up straight away in the dashboard. */
export async function getHomeContent() {
  const [banners, categories, sections] = await Promise.all([
    backend<Banner[]>("/home/banners", { auth: "none" }),
    backend<Category[]>("/home/categories", { auth: "none" }),
    backend<Section[]>("/home/sections", { auth: "none" }),
  ]);
  return { banners, categories, sections };
}

export async function getSectionRecord(id: string) {
  if (!/^[0-9a-f]{24}$/i.test(id)) return null;
  try {
    return await backend<Section>(`/home/sections/${id}`, { auth: "none" });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}
