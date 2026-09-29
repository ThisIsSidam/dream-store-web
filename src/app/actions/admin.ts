"use server";

import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { ApiError } from "@/lib/api/errors";
import { backend } from "@/lib/api/server";
import type { Banner, Category, Product, Section, Variant } from "@/lib/api/types";
import { requireAdmin } from "@/lib/auth/session";

export type ActionResult = { ok: true } | { ok: false; error: string };

const ok: ActionResult = { ok: true };

/** Runs an admin mutation: authorises, converts backend errors into a result. */
async function run(work: () => Promise<unknown>): Promise<ActionResult> {
  await requireAdmin();
  try {
    await work();
    return ok;
  } catch (error) {
    return {
      ok: false,
      error: error instanceof ApiError ? error.message : "Something went wrong.",
    };
  }
}

/** Public catalogue pages cache for 60s - expire them right after an edit. */
function refreshCatalog(productId?: string) {
  updateTag("products");
  updateTag("home");
  if (productId) updateTag(`product:${productId}`);
}

const number = (label: string) =>
  z.coerce.number({ error: `${label} must be a number` });

const optionalNumber = (label: string) =>
  z.preprocess((v) => (v === "" || v == null ? undefined : v), number(label).optional());

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

const productFields = z.object({
  name: z.string().trim().min(1, "Name is required"),
  category: z.string().trim().min(1, "Category is required"),
  description: z.string().trim().default(""),
});

const createProductSchema = productFields.extend({
  price: optionalNumber("Price").pipe(z.number().min(0).optional()),
  stock: optionalNumber("Stock").pipe(z.number().int().min(0).optional()),
});

export type CreateProductState = { error?: string } | undefined;

export async function createProduct(_prev: CreateProductState, formData: FormData): Promise<CreateProductState> {
  await requireAdmin();
  const parsed = createProductSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  let created: Product;
  try {
    // Sending price/stock makes the backend create a default variant.
    created = await backend<Product>("/products/add", { method: "POST", body: parsed.data });
  } catch (error) {
    return { error: error instanceof ApiError ? error.message : "Could not create the product." };
  }
  refreshCatalog();
  revalidatePath("/admin/products");
  redirect(`/admin/products/${created._id}`);
}

export async function updateProduct(id: string, input: { name: string; category: string; description: string }) {
  const parsed = productFields.safeParse(input);
  if (!parsed.success) {
    await requireAdmin();
    return { ok: false, error: parsed.error.issues[0].message } as const;
  }
  const result = await run(() => backend(`/products/${id}`, { method: "PUT", body: parsed.data }));
  if (result.ok) {
    refreshCatalog(id);
    revalidatePath(`/admin/products/${id}`);
    revalidatePath("/admin/products");
  }
  return result;
}

export async function deleteProduct(id: string) {
  const result = await run(() => backend(`/products/${id}`, { method: "DELETE" }));
  if (!result.ok) return result;
  refreshCatalog(id);
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProductImage(productId: string, imageId: string) {
  const result = await run(() =>
    backend(`/products/media/${productId}`, { method: "DELETE", query: { imageId } }),
  );
  if (result.ok) {
    refreshCatalog(productId);
    revalidatePath(`/admin/products/${productId}`);
  }
  return result;
}

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const variantSchema = z.object({
  price: number("Price").pipe(z.number().positive("Price must be greater than 0")),
  stock: number("Stock").pipe(z.number().int("Stock must be a whole number").min(0)),
  sku: z.string().trim().optional(),
  attributes: z.record(z.string(), z.string()),
});

export type VariantInput = z.input<typeof variantSchema>;

export async function saveVariant(productId: string, variantId: string | null, input: VariantInput) {
  const parsed = variantSchema.safeParse(input);
  if (!parsed.success) {
    await requireAdmin();
    return { ok: false, error: parsed.error.issues[0].message } as const;
  }
  // An empty SKU is stored as null by the backend, which also lets edits clear it.
  const body = { ...parsed.data, sku: parsed.data.sku ?? "" };

  const result = await run(() =>
    variantId
      ? backend<Variant>(`/variants/${variantId}`, { method: "PATCH", body })
      : backend<Variant>(`/products/${productId}/variants`, { method: "POST", body }),
  );
  if (result.ok) {
    refreshCatalog(productId);
    revalidatePath(`/admin/products/${productId}`);
    revalidatePath("/admin/products");
  }
  return result;
}

export async function deleteVariant(productId: string, variantId: string) {
  const result = await run(() => backend(`/variants/${variantId}`, { method: "DELETE" }));
  if (result.ok) {
    refreshCatalog(productId);
    revalidatePath(`/admin/products/${productId}`);
    revalidatePath("/admin/products");
  }
  return result;
}

// ---------------------------------------------------------------------------
// Home page content
// ---------------------------------------------------------------------------

const url = z.url("Enter a valid image URL (https://...)");

const bannerSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  imageUrl: url,
  link: z.union([z.literal(""), z.url("Link must be a full URL (https://...)")]).optional(),
});

export async function createBanner(input: z.input<typeof bannerSchema>) {
  const parsed = bannerSchema.safeParse(input);
  if (!parsed.success) {
    await requireAdmin();
    return { ok: false, error: parsed.error.issues[0].message } as const;
  }
  const result = await run(() =>
    backend<Banner>("/home/banners", {
      method: "POST",
      body: { ...parsed.data, link: parsed.data.link || undefined },
    }),
  );
  if (result.ok) {
    updateTag("home");
    revalidatePath("/admin/home");
  }
  return result;
}

const categorySchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  imageUrl: url,
  path: z.string().trim().min(1, "Path is required"),
});

export async function createCategory(input: z.input<typeof categorySchema>) {
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    await requireAdmin();
    return { ok: false, error: parsed.error.issues[0].message } as const;
  }
  const result = await run(() => backend<Category>("/home/categories", { method: "POST", body: parsed.data }));
  if (result.ok) {
    updateTag("home");
    revalidatePath("/admin/home");
  }
  return result;
}

const sectionSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  order: number("Order").pipe(z.number().int()).default(0),
  items: z.array(z.object({ productId: z.string() })).default([]),
});

export async function createSection(input: z.input<typeof sectionSchema>) {
  const parsed = sectionSchema.safeParse(input);
  if (!parsed.success) {
    await requireAdmin();
    return { ok: false, error: parsed.error.issues[0].message } as const;
  }
  const result = await run(() => backend<Section>("/home/sections", { method: "POST", body: parsed.data }));
  if (result.ok) {
    updateTag("home");
    revalidatePath("/admin/home");
  }
  return result;
}

/** Replaces a section's products; the array order becomes the display order. */
export async function saveSectionItems(sectionId: string, title: string, order: number, productIds: string[]) {
  const result = await run(() =>
    backend<Section>(`/home/sections/${sectionId}`, {
      method: "PUT",
      body: {
        title,
        order,
        items: productIds.map((productId, index) => ({ productId, order: index })),
      },
    }),
  );
  if (result.ok) {
    updateTag("home");
    revalidatePath(`/admin/home/sections/${sectionId}`);
    revalidatePath("/admin/home");
  }
  return result;
}

// ---------------------------------------------------------------------------
// Newsletter
// ---------------------------------------------------------------------------

/** Form action: `<form action={removeSubscriber.bind(null, id)}>`. */
export async function removeSubscriber(id: string) {
  const result = await run(() => backend(`/newsletter/${id}`, { method: "DELETE" }));
  if (!result.ok) throw new Error(result.error);
  revalidatePath("/admin/newsletter");
}
