"use client";

import { useState, useTransition } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteLine, saveLine } from "@/app/actions/admin";
import { AdminField, adminInputClass } from "@/components/admin/form";
import { AdminCard, DataTable, EmptyRow, Td, Th, Tr } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { ConfirmDialog, Dialog } from "@/components/ui/dialog";
import type { ProductLine, Variant } from "@/lib/api/types";

type Draft = { text: string; attribution: string; variantId: string };

const blankDraft: Draft = { text: "", attribution: "", variantId: "" };

const draftFrom = (line: ProductLine): Draft => ({
  text: line.text,
  attribution: line.attribution ?? "",
  variantId: line.variantId ?? "",
});

/**
 * The pool of quotes and lines a product's buyers receive. There are no physical
 * goods: each paid unit is delivered one line, drawn at random from this pool
 * (a variant's own lines when it has any, otherwise the shared ones).
 */
export function LinesCard({
  productId,
  variants,
  lines,
}: {
  productId: string;
  variants: Variant[];
  lines: ProductLine[];
}) {
  const [editing, setEditing] = useState<{ id: string | null; draft: Draft } | null>(null);
  const [deleting, setDeleting] = useState<ProductLine | null>(null);
  const [pending, startTransition] = useTransition();

  const variantName = (id: string | null) =>
    id === null ? "Any variant" : (variants.find((v) => v._id === id)?.name || "Standard");

  function save() {
    if (!editing) return;
    const { id, draft } = editing;
    startTransition(async () => {
      const result = await saveLine(productId, id, draft);
      if (result.ok) {
        toast.success(id ? "Line updated" : "Line added");
        setEditing(null);
      } else {
        toast.error(result.error);
      }
    });
  }

  function remove() {
    if (!deleting) return;
    startTransition(async () => {
      const result = await deleteLine(productId, deleting._id);
      if (result.ok) toast.success("Line removed");
      else toast.error(result.error);
      setDeleting(null);
    });
  }

  const setDraft = (patch: Partial<Draft>) =>
    setEditing((current) => (current ? { ...current, draft: { ...current.draft, ...patch } } : current));

  return (
    <AdminCard className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant/30 p-6">
        <div>
          <h2 className="text-lg font-bold">Quotes and lines</h2>
          <p className="mt-1 max-w-prose text-xs text-on-surface-variant">
            What buyers actually receive. Each paid unit is delivered one line from this pool, drawn at random and
            revealed when the order is Delivered. A variant with lines of its own draws only those.
          </p>
        </div>
        <Button size="sm" onClick={() => setEditing({ id: null, draft: blankDraft })}>
          <Plus className="size-4" aria-hidden /> Add line
        </Button>
      </div>
      <DataTable>
        <thead>
          <tr>
            <Th>Line</Th>
            <Th>Attribution</Th>
            <Th>For</Th>
            <Th className="w-24">
              <span className="sr-only">Actions</span>
            </Th>
          </tr>
        </thead>
        <tbody>
          {lines.length === 0 && (
            <EmptyRow colSpan={4}>
              No lines yet - buyers of this product will receive a placeholder until you write some.
            </EmptyRow>
          )}
          {lines.map((line) => (
            <Tr key={line._id}>
              <Td className="max-w-md text-sm italic text-neutral-900">&ldquo;{line.text}&rdquo;</Td>
              <Td className="text-xs text-on-surface-variant">{line.attribution || "-"}</Td>
              <Td className="text-xs font-semibold">{variantName(line.variantId)}</Td>
              <Td>
                <div className="flex gap-1">
                  <button
                    type="button"
                    aria-label="Edit line"
                    onClick={() => setEditing({ id: line._id, draft: draftFrom(line) })}
                    className="grid size-8 place-items-center rounded-full hover:bg-surface-container-high"
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Delete line"
                    onClick={() => setDeleting(line)}
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

      <Dialog
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing?.id ? "Edit line" : "Add line"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button onClick={save} loading={pending}>
              {editing?.id ? "Update line" : "Add line"}
            </Button>
          </>
        }
      >
        {editing && (
          <div className="flex flex-col gap-4">
            <AdminField
              label="Line"
              multiline
              rows={4}
              maxLength={600}
              placeholder="The quote or sentence the buyer receives"
              value={editing.draft.text}
              onChange={(e) => setDraft({ text: e.target.value })}
            />
            <AdminField
              label="Attribution"
              placeholder="Optional, e.g. a retired lighthouse keeper"
              maxLength={160}
              value={editing.draft.attribution}
              onChange={(e) => setDraft({ attribution: e.target.value })}
            />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="line-variant" className="text-sm font-semibold">
                Delivered with
              </label>
              <select
                id="line-variant"
                className={adminInputClass}
                value={editing.draft.variantId}
                onChange={(e) => setDraft({ variantId: e.target.value })}
              >
                <option value="">Any variant</option>
                {variants.map((variant) => (
                  <option key={variant._id} value={variant._id}>
                    {variant.name || "Standard"} only
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </Dialog>

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={remove}
        loading={pending}
        title="Delete line"
        message="Remove this line from the pool? Buyers who already received it keep it."
        confirmLabel="Delete"
        destructive
      />
    </AdminCard>
  );
}
