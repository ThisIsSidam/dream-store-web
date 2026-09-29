"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { ArrowDown, ArrowUp, ImageOff, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createBanner, createCategory, createSection, saveSectionItems, type ActionResult } from "@/app/actions/admin";
import { AdminField } from "@/components/admin/form";
import { AdminCard, DataTable, EmptyRow, Td, Th, Tr } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { RemoteImage } from "@/components/ui/remote-image";
import type { Paginated, Product } from "@/lib/api/types";
import { api } from "@/lib/client/api";
import { formatPriceRange } from "@/lib/utils";

/** A button that opens a dialog with a form and runs an action on save. */
function AddDialog<T extends Record<string, string>>({
  label,
  title,
  initial,
  action,
  children,
  successMessage,
}: {
  label: string;
  title: string;
  initial: T;
  action: (values: T) => Promise<ActionResult>;
  children: (values: T, set: (patch: Partial<T>) => void) => React.ReactNode;
  successMessage: string;
}) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(initial);
  const [pending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      const result = await action(values);
      if (result.ok) {
        toast.success(successMessage);
        setOpen(false);
        setValues(initial);
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="size-4" aria-hidden /> {label}
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save} loading={pending}>
              Save
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">{children(values, (patch) => setValues((v) => ({ ...v, ...patch })))}</div>
      </Dialog>
    </>
  );
}

export function AddBannerButton() {
  return (
    <AddDialog
      label="Add banner"
      title="Add banner"
      initial={{ title: "", description: "", imageUrl: "", link: "" }}
      action={createBanner}
      successMessage="Banner added"
    >
      {(v, set) => (
        <>
          <AdminField label="Title" value={v.title} onChange={(e) => set({ title: e.target.value })} />
          <AdminField label="Description" value={v.description} onChange={(e) => set({ description: e.target.value })} />
          <AdminField
            label="Image URL"
            type="url"
            placeholder="https://…"
            value={v.imageUrl}
            onChange={(e) => set({ imageUrl: e.target.value })}
          />
          <AdminField
            label="Link (optional)"
            type="url"
            placeholder="https://…"
            value={v.link}
            onChange={(e) => set({ link: e.target.value })}
          />
        </>
      )}
    </AddDialog>
  );
}

export function AddCategoryButton() {
  return (
    <AddDialog
      label="Add category"
      title="Add category"
      initial={{ name: "", imageUrl: "", path: "" }}
      action={createCategory}
      successMessage="Category added"
    >
      {(v, set) => (
        <>
          <AdminField
            label="Name"
            hint="Must match the category you give products - shoppers land on /products?category=name."
            value={v.name}
            onChange={(e) => set({ name: e.target.value })}
          />
          <AdminField
            label="Image URL"
            type="url"
            placeholder="https://…"
            value={v.imageUrl}
            onChange={(e) => set({ imageUrl: e.target.value })}
          />
          <AdminField
            label="Path"
            placeholder="/category/cars"
            hint="Stored for reference; the store links by category name."
            value={v.path}
            onChange={(e) => set({ path: e.target.value })}
          />
        </>
      )}
    </AddDialog>
  );
}

export function AddSectionButton() {
  return (
    <AddDialog
      label="Add section"
      title="Add section"
      initial={{ title: "", order: "0" }}
      action={(v) => createSection({ title: v.title, order: v.order, items: [] })}
      successMessage="Section added"
    >
      {(v, set) => (
        <>
          <AdminField label="Title" value={v.title} onChange={(e) => set({ title: e.target.value })} />
          <AdminField
            label="Order"
            type="number"
            step="1"
            hint="Sections appear on the home page from lowest to highest."
            value={v.order}
            onChange={(e) => set({ order: e.target.value })}
          />
        </>
      )}
    </AddDialog>
  );
}

// ---------------------------------------------------------------------------
// Section editor
// ---------------------------------------------------------------------------

type Entry = { id: string; name: string; image?: string; price: string };

function ProductPicker({ taken, onPick }: { taken: Set<string>; onPick: (product: Product) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (!open || q.length < 2) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await api<Paginated<"products", Product>>(
          `products/search?query=${encodeURIComponent(q)}&limit=12`,
        );
        if (!cancelled) setResults(data.products);
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, open]);

  const visible = query.trim().length >= 2 ? results : [];

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="size-4" aria-hidden /> Add product
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Add a product" className="w-[min(92vw,34rem)]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant" aria-hidden />
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            aria-label="Search products"
            className="h-10 w-full rounded-lg border border-outline-variant bg-surface-container-lowest pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <ul className="mt-4 max-h-80 divide-y divide-outline-variant/30 overflow-y-auto">
          {visible.map((product) => {
            const already = taken.has(product._id);
            return (
              <li key={product._id} className="flex items-center gap-3 py-2.5">
                <RemoteImage
                  src={product.images[0]?.url}
                  alt=""
                  width={100}
                  sizes="40px"
                  className="size-10 shrink-0 rounded bg-surface-container-low"
                  fallback={<ImageOff className="size-4" />}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{product.name}</span>
                  <span className="block text-xs text-on-surface-variant">
                    {formatPriceRange(product.minPrice, product.maxPrice)}
                  </span>
                </span>
                <Button size="sm" variant="soft" disabled={already} onClick={() => onPick(product)}>
                  {already ? "Added" : "Add"}
                </Button>
              </li>
            );
          })}
          {query.trim().length < 2 && (
            <li className="py-6 text-center text-sm text-on-surface-variant">Type at least 2 letters to search.</li>
          )}
          {query.trim().length >= 2 && !loading && visible.length === 0 && (
            <li className="py-6 text-center text-sm text-on-surface-variant">No products found.</li>
          )}
        </ul>
      </Dialog>
    </>
  );
}

export function SectionEditor({
  sectionId,
  title,
  order,
  initial,
}: {
  sectionId: string;
  title: string;
  order: number;
  initial: Entry[];
}) {
  const [entries, setEntries] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [pending, startTransition] = useTransition();
  const dirty = entries.map((e) => e.id).join() !== saved.map((e) => e.id).join();

  function move(index: number, delta: -1 | 1) {
    setEntries((list) => {
      const next = [...list];
      const target = index + delta;
      if (target < 0 || target >= next.length) return list;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function save() {
    startTransition(async () => {
      const result = await saveSectionItems(sectionId, title, order, entries.map((e) => e.id));
      if (result.ok) {
        toast.success("Section saved");
        setSaved(entries);
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <AdminCard className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant/30 p-6">
        <div>
          <h2 className="text-lg font-bold">Products in this section</h2>
          <p className="text-sm text-on-surface-variant">They appear on the home page in this order.</p>
        </div>
        <div className="flex items-center gap-3">
          <ProductPicker
            taken={new Set(entries.map((e) => e.id))}
            onPick={(product) =>
              setEntries((list) => [
                ...list,
                {
                  id: product._id,
                  name: product.name,
                  image: product.images[0]?.url,
                  price: formatPriceRange(product.minPrice, product.maxPrice),
                },
              ])
            }
          />
          <Button size="sm" variant="accent" onClick={save} loading={pending} disabled={!dirty}>
            Save changes
          </Button>
        </div>
      </div>
      <DataTable>
        <thead>
          <tr>
            <Th className="w-12">#</Th>
            <Th>Product</Th>
            <Th>Price</Th>
            <Th className="w-36">
              <span className="sr-only">Actions</span>
            </Th>
          </tr>
        </thead>
        <tbody>
          {entries.length === 0 && <EmptyRow colSpan={4}>No products in this section. Add one to get started.</EmptyRow>}
          {entries.map((entry, index) => (
            <Tr key={entry.id}>
              <Td className="text-on-surface-variant">{index + 1}</Td>
              <Td>
                <div className="flex items-center gap-3">
                  <RemoteImage
                    src={entry.image}
                    alt=""
                    width={100}
                    sizes="40px"
                    className="size-10 shrink-0 rounded bg-surface-container-low"
                    fallback={<ImageOff className="size-4" />}
                  />
                  <Link href={`/admin/products/${entry.id}`} className="font-medium hover:underline">
                    {entry.name}
                  </Link>
                </div>
              </Td>
              <Td className="text-on-surface-variant">{entry.price}</Td>
              <Td>
                <div className="flex gap-1">
                  <button
                    type="button"
                    aria-label={`Move ${entry.name} up`}
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                    className="grid size-8 place-items-center rounded-full hover:bg-surface-container-high disabled:opacity-30"
                  >
                    <ArrowUp className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Move ${entry.name} down`}
                    disabled={index === entries.length - 1}
                    onClick={() => move(index, 1)}
                    className="grid size-8 place-items-center rounded-full hover:bg-surface-container-high disabled:opacity-30"
                  >
                    <ArrowDown className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Remove ${entry.name}`}
                    onClick={() => setEntries((list) => list.filter((e) => e.id !== entry.id))}
                    className="grid size-8 place-items-center rounded-full text-error hover:bg-error/10"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </Td>
            </Tr>
          ))}
        </tbody>
      </DataTable>
    </AdminCard>
  );
}
