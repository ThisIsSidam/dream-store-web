import "server-only";
import { backend } from "./server";
import type {
  Banner,
  Category,
  Paginated,
  Product,
  ProductDetail,
  Section,
} from "./types";

const REVALIDATE = 60;
const PAGE_SIZE = 100;

const FALLBACK_CATEGORIES: Category[] = [
  { _id: "cat_all", name: "All", imageUrl: "", path: "/products" },
  {
    _id: "cat_new",
    name: "New Arrivals",
    imageUrl: "",
    path: "/products?filter=new",
  },
  {
    _id: "cat_weird",
    name: "Weird Stuff",
    imageUrl: "",
    path: "/products?category=Weird+Stuff",
  },
  {
    _id: "cat_home",
    name: "Home",
    imageUrl: "",
    path: "/products?category=Home",
  },
  {
    _id: "cat_science",
    name: "Science",
    imageUrl: "",
    path: "/products?category=Science",
  },
  {
    _id: "cat_collectibles",
    name: "Collectibles",
    imageUrl: "",
    path: "/products?category=Collectibles",
  },
  {
    _id: "cat_everyday",
    name: "Everyday Things",
    imageUrl: "",
    path: "/products?category=Everyday+Things",
  },
  {
    _id: "cat_objects",
    name: "Objects",
    imageUrl: "",
    path: "/products?category=Objects",
  },
  {
    _id: "cat_unnecessary",
    name: "Things You Didn't Need",
    imageUrl: "",
    path: "/products?category=Things+You+Didn%27t+Need",
  },
  {
    _id: "cat_limited",
    name: "Limited",
    imageUrl: "",
    path: "/products?filter=limited",
  },
  {
    _id: "cat_mysterious",
    name: "Mysterious",
    imageUrl: "",
    path: "/products?category=Mysterious",
  },
];

const FALLBACK_BANNERS: Banner[] = [
  {
    _id: "ban_1",
    title: "Things you didn't know you needed.",
    description:
      "A marketplace for objects, ideas, and other questionable necessities.",
    imageUrl: "/mock/hero-banner.png",
    link: "/products",
  },
];

export async function getBanners(): Promise<Banner[]> {
  try {
    const banners = await backend<Banner[]>("/home/banners", {
      auth: "none",
      revalidate: REVALIDATE,
      tags: ["home"],
    });
    return banners && banners.length > 0 ? banners : FALLBACK_BANNERS;
  } catch (err) {
    console.warn("Backend /home/banners unreachable:", err);
    return FALLBACK_BANNERS;
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await backend<Category[]>("/home/categories", {
      auth: "none",
      revalidate: REVALIDATE,
      tags: ["home"],
    });
    return categories && categories.length > 0
      ? categories
      : FALLBACK_CATEGORIES;
  } catch (err) {
    console.warn("Backend /home/categories unreachable:", err);
    return FALLBACK_CATEGORIES;
  }
}

export async function getSections(): Promise<Section[]> {
  try {
    const sections = await backend<Section[]>("/home/sections", {
      auth: "none",
      revalidate: REVALIDATE,
      tags: ["home"],
    });
    if (sections && sections.length > 0) {
      return sections.map((sec) => ({
        ...sec,
        items: (sec.items || [])
          .filter((i) => i.productId && (i.productId as any)._id)
          .sort((a, b) => a.order - b.order),
      }));
    }
  } catch (err) {
    console.warn("Backend /home/sections unreachable:", err);
  }

  return [];
}

export async function getSection(id: string): Promise<Section | null> {
  try {
    const section = await backend<Section>(`/home/sections/${encodeURIComponent(id)}`, {
      auth: "none",
      revalidate: REVALIDATE,
      tags: ["home", `section:${id}`],
    });
    if (section && section._id) {
      return {
        ...section,
        items: (section.items || [])
          .filter((i) => i.productId && (i.productId as any)._id)
          .sort((a, b) => a.order - b.order),
      };
    }
  } catch {
    const sections = await getSections();
    return sections.find((s) => s._id === id) ?? null;
  }
  return null;
}

export async function getProduct(
  idOrSlug: string,
): Promise<ProductDetail | null> {
  try {
    const detail = await backend<ProductDetail | null>(
      `/products/${encodeURIComponent(idOrSlug)}`,
      {
        auth: "none",
        revalidate: REVALIDATE,
        tags: ["products", `product:${idOrSlug}`],
      },
    );
    if (detail && detail.product) {
      return detail;
    }
  } catch (err) {
    console.warn(`Backend /products/${idOrSlug} unreachable or not found:`, err);
  }

  return null;
}

export async function getProductsByCategory(
  category: string,
): Promise<Product[]> {
  try {
    const data = await backend<Paginated<"products", Product>>("/products", {
      auth: "none",
      revalidate: REVALIDATE,
      tags: ["products"],
      query: { category: category.toLowerCase().trim(), limit: 100 },
    });
    if (data.products && data.products.length > 0) {
      return data.products;
    }
  } catch (err) {
    console.warn(`Backend /products?category=${category} unreachable:`, err);
  }

  return [];
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const data = await backend<Paginated<"products", Product>>("/products", {
      auth: "none",
      tags: ["products"],
      query: { page: 1, limit: PAGE_SIZE },
    });
    if (data.products && data.products.length > 0) {
      return data.products;
    }
  } catch (err) {
    console.warn("Backend /products unreachable:", err);
  }

  return [];
}

export async function searchProducts(
  query: string,
  page = 1,
  limit = 100,
): Promise<Product[]> {
  try {
    const data = await backend<Paginated<"products", Product>>(
      "/products/search",
      {
        auth: "none",
        revalidate: 30,
        tags: ["products"],
        query: { query, page, limit },
      },
    );
    if (data.products && data.products.length > 0) {
      return data.products;
    }
  } catch (err) {
    console.warn(`Backend /products/search?query=${query} unreachable:`, err);
  }

  return [];
}
