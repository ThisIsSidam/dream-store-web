"use client";

import { useActionState } from "react";
import { createProduct } from "@/app/actions/admin";
import { AdminField } from "@/components/admin/form";
import { Button } from "@/components/ui/button";

export function NewProductForm() {
  const [state, action, pending] = useActionState(createProduct, undefined);

  return (
    <form action={action} className="flex flex-col gap-6">
      {state?.error && (
        <p role="alert" className="rounded-lg border border-error/25 bg-error/8 p-3 text-sm text-error">
          {state.error}
        </p>
      )}
      <AdminField label="Product name" name="name" placeholder="e.g. Freshly Baked Wi-Fi" required />
      <AdminField label="Category" name="category" placeholder="e.g. Technology" required />
      <AdminField label="Description" name="description" multiline placeholder="Describe your product..." />
      <div className="grid gap-6 border-t border-outline-variant/30 pt-6 sm:grid-cols-2">
        <AdminField
          label="Initial price (USD)"
          name="price"
          type="number"
          min="0"
          step="0.01"
          inputMode="decimal"
          hint="Leave price and stock empty to add variants yourself afterwards."
        />
        <AdminField label="Initial stock" name="stock" type="number" min="0" step="1" inputMode="numeric" hint="Creates a default variant." />
      </div>
      <Button type="submit" size="lg" className="w-full" loading={pending}>
        Create product
      </Button>
    </form>
  );
}
