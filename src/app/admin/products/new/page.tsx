import type { Metadata } from "next";
import { NewProductForm } from "@/components/admin/new-product-form";
import { AdminCard, PageHeading } from "@/components/admin/ui";

export const metadata: Metadata = { title: "New product" };

export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeading title="Add new product" back="/admin/products" />
      <AdminCard className="p-6 sm:p-8">
        <NewProductForm />
      </AdminCard>
    </div>
  );
}
