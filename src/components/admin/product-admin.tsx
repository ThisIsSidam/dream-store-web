"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { CloudUpload, ImageOff, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  deleteProduct,
  deleteProductImage,
  deleteVariant,
  saveVariant,
  updateProduct,
} from "@/app/actions/admin";
import { AdminCard, DataTable, EmptyRow, Td, Th, Tr } from "@/components/admin/ui";
import { AdminField, adminInputClass } from "@/components/admin/form";
import { Button } from "@/components/ui/button";
import { ConfirmDialog, Dialog } from "@/components/ui/dialog";
import type { Product, ProductImage, Variant } from "@/lib/api/types";
import { cn, formatMoney, optimizeImage } from "@/lib/utils";

const MAX_FILES = 10;
const MAX_FILE_BYTES = 10 * 1024 * 1024;

// ---------------------------------------------------------------------------
// Edit / delete product
// ---------------------------------------------------------------------------

export function ProductActions({ product }: { product: Product }) {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [pending, startTransition] = useTransition();
  const [values, setValues] = useState({
    name: product.name,
    category: product.category,
    description: product.description,
  });

  function save() {
    startTransition(async () => {
      const result = await updateProduct(product._id, values);
      if (result.ok) {
        toast.success("Product updated");
        setEditing(false);
      } else {
        toast.error(result.error);
      }
    });
  }

  function remove() {
    startTransition(async () => {
      const result = await deleteProduct(product._id);
      // On success the action redirects, so we only get here on failure.
      if (result && !result.ok) {
        toast.error(result.error);
        setDeleting(false);
      }
    });
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
        <Pencil className="size-4" aria-hidden /> Edit
      </Button>
      <Button variant="danger" size="sm" onClick={() => setDeleting(true)}>
        <Trash2 className="size-4" aria-hidden /> Delete
      </Button>

      <Dialog
        open={editing}
        onClose={() => setEditing(false)}
        title="Edit product"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button onClick={save} loading={pending}>
              Save changes
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <AdminField label="Name" value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} />
          <AdminField
            label="Category"
            value={values.category}
            onChange={(e) => setValues({ ...values, category: e.target.value })}
          />
          <AdminField
            label="Description"
            multiline
            value={values.description}
            onChange={(e) => setValues({ ...values, description: e.target.value })}
          />
        </div>
      </Dialog>

      <ConfirmDialog
        open={deleting}
        onClose={() => setDeleting(false)}
        onConfirm={remove}
        loading={pending}
        title="Delete product"
        message="Delete this product and all of its variants? This can't be undone."
        confirmLabel="Delete"
        destructive
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Images
// ---------------------------------------------------------------------------

export function ImageManager({ product }: { product: Product }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [toDelete, setToDelete] = useState<ProductImage | null>(null);
  const [pending, startTransition] = useTransition();

  async function upload(files: File[]) {
    if (files.length === 0) return;
    if (files.length > MAX_FILES) return toast.error(`Choose up to ${MAX_FILES} images at a time.`);
    const tooBig = files.find((f) => f.size > MAX_FILE_BYTES);
    if (tooBig) return toast.error(`${tooBig.name} is larger than 10MB.`);

    const body = new FormData();
    body.append("productId", product._id);
    files.forEach((file) => body.append("images", file));

    setUploading(true);
    try {
      const response = await fetch("/api/admin/upload", { method: "POST", body });
      const json = await response.json().catch(() => null);
      if (!response.ok) throw new Error(json?.message ?? "Upload failed.");
      toast.success(`${files.length} image${files.length === 1 ? "" : "s"} uploaded`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove() {
    if (!toDelete) return;
    startTransition(async () => {
      const result = await deleteProductImage(product._id, toDelete.id);
      if (result.ok) toast.success("Image removed");
      else toast.error(result.error);
      setToDelete(null);
    });
  }

  return (
    <AdminCard className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Product images</h2>
        <span className="text-xs font-medium text-on-surface-variant">{product.images.length} images</span>
      </div>

      {product.images.length > 0 ? (
        <ul className="mt-4 grid grid-cols-3 gap-2">
          {product.images.map((image) => (
            <li
              key={image.id}
              className="group relative aspect-square overflow-hidden rounded-lg border border-outline-variant/40 bg-surface-container-low"
            >
              <Image
                src={optimizeImage(image.url, 300) ?? image.url}
                alt=""
                fill
                unoptimized
                sizes="120px"
                className="object-cover transition-transform duration-200 group-hover:scale-105"
              />
              <button
                type="button"
                onClick={() => setToDelete(image)}
                aria-label="Delete image"
                className="absolute inset-0 grid place-items-center bg-black/40 opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
              >
                <span className="grid size-8 place-items-center rounded-full bg-error text-on-error">
                  <Trash2 className="size-4" />
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4 rounded-lg border border-dashed border-outline-variant py-6 text-center text-sm text-on-surface-variant">
          <ImageOff className="mx-auto mb-2 size-8 text-outline" aria-hidden />
          No images uploaded yet
        </div>
      )}

      <div className="mt-4 border-t border-outline-variant/30 pt-4">
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="sr-only"
          id="product-images"
          onChange={(e) => upload(Array.from(e.target.files ?? []))}
        />
        <label
          htmlFor="product-images"
          className={cn(
            "flex cursor-pointer flex-col items-center gap-1 rounded-xl border-2 border-dashed border-outline-variant p-4 text-center transition-colors hover:border-primary/50",
            uploading && "pointer-events-none opacity-60",
          )}
        >
          <CloudUpload className="size-6 text-primary" aria-hidden />
          <span className="text-xs font-semibold">{uploading ? "Uploading…" : "Click to upload images"}</span>
          <span className="text-[10px] text-on-surface-variant">Up to {MAX_FILES} files, 10MB each</span>
        </label>
      </div>

      <ConfirmDialog
        open={toDelete !== null}
        onClose={() => setToDelete(null)}
        onConfirm={remove}
        loading={pending}
        title="Delete image"
        message="Remove this image from the product?"
        confirmLabel="Delete"
        destructive
      />
    </AdminCard>
  );
}

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

type Draft = { price: string; stock: string; sku: string; attrs: { key: string; value: string }[] };

const blankDraft: Draft = { price: "", stock: "0", sku: "", attrs: [] };

function draftFrom(variant: Variant): Draft {
  return {
    price: String(variant.price),
    stock: String(variant.stock),
    sku: variant.sku ?? "",
    attrs: Object.entries(variant.attributes ?? {}).map(([key, value]) => ({ key, value: String(value) })),
  };
}

export function VariantsCard({ productId, variants }: { productId: string; variants: Variant[] }) {
  const [editing, setEditing] = useState<{ id: string | null; draft: Draft } | null>(null);
  const [deleting, setDeleting] = useState<Variant | null>(null);
  const [pending, startTransition] = useTransition();

  function save() {
    if (!editing) return;
    const { id, draft } = editing;
    const attributes = Object.fromEntries(
      draft.attrs.filter((a) => a.key.trim()).map((a) => [a.key.trim(), a.value]),
    );
    startTransition(async () => {
      const result = await saveVariant(productId, id, {
        price: draft.price,
        stock: draft.stock,
        sku: draft.sku,
        attributes,
      });
      if (result.ok) {
        toast.success(id ? "Variant updated" : "Variant added");
        setEditing(null);
      } else {
        toast.error(result.error);
      }
    });
  }

  function remove() {
    if (!deleting) return;
    startTransition(async () => {
      const result = await deleteVariant(productId, deleting._id);
      if (result.ok) toast.success("Variant removed");
      else toast.error(result.error);
      setDeleting(null);
    });
  }

  const setDraft = (patch: Partial<Draft>) =>
    setEditing((current) => (current ? { ...current, draft: { ...current.draft, ...patch } } : current));

  return (
    <AdminCard className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-outline-variant/30 p-6">
        <h2 className="text-lg font-bold">Product variants</h2>
        <Button size="sm" onClick={() => setEditing({ id: null, draft: blankDraft })}>
          <Plus className="size-4" aria-hidden /> Add variant
        </Button>
      </div>
      <DataTable>
        <thead>
          <tr>
            <Th>Attributes</Th>
            <Th>SKU</Th>
            <Th>Price</Th>
            <Th>Stock</Th>
            <Th className="w-24">
              <span className="sr-only">Actions</span>
            </Th>
          </tr>
        </thead>
        <tbody>
          {variants.length === 0 && (
            <EmptyRow colSpan={5}>No variants yet - a product can&apos;t be bought until it has one.</EmptyRow>
          )}
          {variants.map((variant) => {
            const attrs = Object.entries(variant.attributes ?? {});
            return (
              <Tr key={variant._id}>
                <Td>
                  <div className="flex flex-wrap gap-1">
                    {attrs.map(([key, value]) => (
                      <span
                        key={key}
                        className="rounded bg-surface-container-highest px-2 py-0.5 text-[10px] font-bold uppercase text-on-surface-variant"
                      >
                        {key}: {value}
                      </span>
                    ))}
                    {attrs.length === 0 && <span className="text-xs italic text-on-surface-variant">Default</span>}
                  </div>
                </Td>
                <Td className="font-mono text-xs text-on-surface-variant">{variant.sku || "N/A"}</Td>
                <Td className="font-bold text-primary">{formatMoney(variant.price)}</Td>
                <Td className={cn("font-medium", variant.stock > 5 ? "text-emerald-700" : "text-error")}>
                  {variant.stock} units
                </Td>
                <Td>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      aria-label="Edit variant"
                      onClick={() => setEditing({ id: variant._id, draft: draftFrom(variant) })}
                      className="grid size-8 place-items-center rounded-full hover:bg-surface-container-high"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Delete variant"
                      onClick={() => setDeleting(variant)}
                      className="grid size-8 place-items-center rounded-full text-error hover:bg-error/10"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </Td>
              </Tr>
            );
          })}
        </tbody>
      </DataTable>

      <Dialog
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing?.id ? "Edit variant" : "Add variant"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button onClick={save} loading={pending}>
              {editing?.id ? "Update variant" : "Add variant"}
            </Button>
          </>
        }
      >
        {editing && (
          <div className="flex flex-col gap-4">
            <AdminField label="SKU" placeholder="Optional" value={editing.draft.sku} onChange={(e) => setDraft({ sku: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <AdminField
                label="Price (USD)"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={editing.draft.price}
                onChange={(e) => setDraft({ price: e.target.value })}
              />
              <AdminField
                label="Stock"
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                value={editing.draft.stock}
                onChange={(e) => setDraft({ stock: e.target.value })}
              />
            </div>
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-1 flex w-full items-center justify-between text-sm font-semibold">
                Attributes
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDraft({ attrs: [...editing.draft.attrs, { key: "", value: "" }] })}
                >
                  <Plus className="size-4" aria-hidden /> Add
                </Button>
              </legend>
              {editing.draft.attrs.map((attr, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    aria-label="Attribute name"
                    className={adminInputClass}
                    placeholder="e.g. Size"
                    value={attr.key}
                    onChange={(e) =>
                      setDraft({
                        attrs: editing.draft.attrs.map((a, i) => (i === index ? { ...a, key: e.target.value } : a)),
                      })
                    }
                  />
                  <input
                    aria-label="Attribute value"
                    className={adminInputClass}
                    placeholder="e.g. Large"
                    value={attr.value}
                    onChange={(e) =>
                      setDraft({
                        attrs: editing.draft.attrs.map((a, i) => (i === index ? { ...a, value: e.target.value } : a)),
                      })
                    }
                  />
                  <button
                    type="button"
                    aria-label="Remove attribute"
                    onClick={() => setDraft({ attrs: editing.draft.attrs.filter((_, i) => i !== index) })}
                    className="grid size-10 shrink-0 place-items-center rounded-lg text-error hover:bg-error/10"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
              {editing.draft.attrs.length === 0 && (
                <p className="text-xs italic text-on-surface-variant">No attributes added.</p>
              )}
            </fieldset>
          </div>
        )}
      </Dialog>

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={remove}
        loading={pending}
        title="Delete variant"
        message="Delete this variant? Carts that contain it will stop loading until it is removed."
        confirmLabel="Delete"
        destructive
      />
    </AdminCard>
  );
}
