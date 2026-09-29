import "server-only";
import { ApiError } from "./errors";
import { backend } from "./server";
import type {
  Banner,
  Category,
  Paginated,
  Product,
  ProductDetail,
  Section,
} from "./types";

/** Public catalogue data is cached briefly and refreshed on admin edits. */
const REVALIDATE = 60;
const PAGE_SIZE = 100;

const isObjectId = (id: string) => /^[0-9a-f]{24}$/i.test(id);

const publicFetch = { auth: "none", revalidate: REVALIDATE } as const;

export const getBanners = () =>
  backend<Banner[]>("/home/banners", { ...publicFetch, tags: ["home"] });

export const getCategories = () =>
  backend<Category[]>("/home/categories", { ...publicFetch, tags: ["home"] });

/** Sections in display order, with deleted products filtered out. */
export async function getSections() {
  const sections = await backend<Section[]>("/home/sections", {
    ...publicFetch,
    tags: ["home"],
  });
  return sections.map(cleanSection);
}

export async function getSection(id: string) {
  if (!isObjectId(id)) return null;
  try {
    const section = await backend<Section>(`/home/sections/${id}`, {
      ...publicFetch,
      tags: ["home"],
    });
    return cleanSection(section);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

function cleanSection(section: Section): Section {
  return {
    ...section,
    items: section.items
      .filter((item) => item.productId)
      .sort((a, b) => a.order - b.order),
  };
}

export async function getProduct(id: string): Promise<ProductDetail | null> {
  if (!isObjectId(id)) return null;
  const detail = await backend<ProductDetail | null>(`/products/${id}`, {
    ...publicFetch,
    tags: ["products", `product:${id}`],
  });
  return detail ?? null;
}

export async function getProductsByCategory(category: string) {
  const { products } = await backend<{ products: Product[] }>(
    `/products/category/${encodeURIComponent(category)}`,
    { ...publicFetch, tags: ["products"] },
  );
  return products;
}

/** Walks every page of the catalogue (the backend has no "all" endpoint). */
export async function getAllProducts() {
  const products: Product[] = [];
  for (let page = 1; page <= 20; page++) {
    const data = await backend<Paginated<"products", Product>>("/products", {
      ...publicFetch,
      tags: ["products"],
      query: { page, limit: PAGE_SIZE },
    });
    products.push(...data.products);
    if (page >= data.pagination.totalPages) break;
  }
  return products;
}

export async function searchProducts(query: string, page = 1, limit = 100) {
  const q = query.trim();
  if (!q) return [];
  const data = await backend<Paginated<"products", Product>>("/products/search", {
    auth: "none",
    revalidate: 30,
    tags: ["products"],
    query: { query: q, page, limit },
  });
  return data.products;
}
