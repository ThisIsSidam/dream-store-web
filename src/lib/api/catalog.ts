import {
  YC_PRODUCTS,
  getProductBySlugOrId,
  searchCatalog,
  type CatalogProduct,
} from "@/lib/data/products";
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

export function toStoreProduct(p: CatalogProduct): Product {
  return {
    _id: p._id,
    name: p.name,
    category: p.category,
    description: p.description,
    shortDescription: p.shortDescription,
    images: p.images,
    minPrice: p.minPrice,
    maxPrice: p.maxPrice,
    totalStock: p.totalStock,
    slug: p.slug,
    rating: p.rating,
    reviewCount: p.reviewCount,
    badge: p.badge,
    oddness: p.oddness,
    visualId: p.visualId,
    originalPrice: p.originalPrice,
    isLimited: p.isLimited,
    scarcityNote: p.scarcityNote,
    specifications: p.specifications,
    whatsIncluded: p.whatsIncluded,
    frequentlyBoughtTogether: p.frequentlyBoughtTogether,
  };
}

export function toStoreProductDetail(p: CatalogProduct): ProductDetail {
  return {
    product: toStoreProduct(p),
    variants: p.variants.map((v) => ({
      _id: v.id,
      productId: p._id,
      attributes: { option: v.name },
      name: v.name,
      price: v.price,
      stock: v.stock,
      sku: v.sku,
    })),
  };
}

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
  } catch {
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
  } catch {
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
        items: sec.items
          .filter((i) => i.productId)
          .sort((a, b) => a.order - b.order),
      }));
    }
  } catch {
    // fallback below
  }

  // Construct default sections from YC_PRODUCTS
  return [
    {
      _id: "sec_trending",
      title: "Trending Now",
      order: 1,
      items: YC_PRODUCTS.slice(0, 8).map((p, idx) => ({
        productId: toStoreProduct(p),
        order: idx,
      })),
    },
    {
      _id: "sec_limited",
      title: "The Unnecessarily Limited",
      order: 2,
      items: YC_PRODUCTS.filter((p) => p.isLimited || p.totalStock < 100).map(
        (p, idx) => ({
          productId: toStoreProduct(p),
          order: idx,
        }),
      ),
    },
  ];
}

export async function getSection(id: string): Promise<Section | null> {
  const sections = await getSections();
  return sections.find((s) => s._id === id) ?? null;
}

export async function getProduct(
  idOrSlug: string,
): Promise<ProductDetail | null> {
  // First check local catalog by slug, id, or _id
  const localMatch = getProductBySlugOrId(idOrSlug);
  if (localMatch) {
    return toStoreProductDetail(localMatch);
  }

  // Fallback to backend
  try {
    const detail = await backend<ProductDetail | null>(
      `/products/${idOrSlug}`,
      {
        auth: "none",
        revalidate: REVALIDATE,
        tags: ["products", `product:${idOrSlug}`],
      },
    );
    return detail ?? null;
  } catch {
    return null;
  }
}

export async function getProductsByCategory(
  category: string,
): Promise<Product[]> {
  const normalized = category.toLowerCase().trim();
  const matched = YC_PRODUCTS.filter(
    (p) => p.category.toLowerCase() === normalized,
  );
  if (matched.length > 0) {
    return matched.map(toStoreProduct);
  }

  try {
    const { products } = await backend<{ products: Product[] }>(
      `/products/category/${encodeURIComponent(category)}`,
      { auth: "none", revalidate: REVALIDATE, tags: ["products"] },
    );
    return products;
  } catch {
    return matched.map(toStoreProduct);
  }
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
  } catch {
    // fallback
  }

  return YC_PRODUCTS.map(toStoreProduct);
}

export async function searchProducts(
  query: string,
  page = 1,
  limit = 100,
): Promise<Product[]> {
  const local = searchCatalog(query);
  if (local.length > 0) {
    return local.map(toStoreProduct);
  }

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
    return data.products;
  } catch {
    return local.map(toStoreProduct);
  }
}
