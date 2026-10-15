"use client";

import { useActionState } from "react";
import { createProduct } from "@/app/actions/admin";
import { AdminField, adminInputClass } from "@/components/admin/form";
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
      
      <div className="grid gap-6 sm:grid-cols-2">
        <AdminField label="Category" name="category" placeholder="e.g. Technology" required />
        <AdminField label="URL Slug" name="slug" placeholder="e.g. fresh-wifi" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <AdminField
          label="Visual Style ID"
          name="visualId"
          placeholder="e.g. fresh-wifi, backup-gravity"
          hint="References procedural SVG graphics"
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold">Oddness Level</label>
          <select name="oddness" className={adminInputClass} defaultValue="Completely Normal">
            <option value="Completely Normal">Completely Normal</option>
            <option value="Slightly Strange">Slightly Strange</option>
            <option value="Very Strange">Very Strange</option>
            <option value="We Should Probably Investigate">We Should Probably Investigate</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold">Product Badge</label>
          <select name="badge" className={adminInputClass} defaultValue="">
            <option value="">No Badge</option>
            <option value="Bestseller">Bestseller</option>
            <option value="New">New</option>
            <option value="Limited">Limited</option>
            <option value="Almost Gone">Almost Gone</option>
            <option value="Questionable">Questionable</option>
            <option value="Staff Pick">Staff Pick</option>
            <option value="Verified Somehow">Verified Somehow</option>
            <option value="Somehow Popular">Somehow Popular</option>
          </select>
        </div>
        <AdminField label="Scarcity Note" name="scarcityNote" placeholder="e.g. Only 3 left in this timeline" />
      </div>

      <AdminField label="Short punchy summary" name="shortDescription" placeholder="1-2 sentences shown on catalog cards" />
      <AdminField label="Full description" name="description" multiline placeholder="Full humorous catalog description..." />

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
