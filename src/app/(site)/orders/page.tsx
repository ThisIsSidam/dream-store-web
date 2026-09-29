import { OrdersListView } from "@/components/orders/orders-list-view";
import { PageShell } from "@/components/site/page-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Orders",
  description: "Normal e-commerce order tracking for questionable shipments.",
};

export default function OrdersPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-4xl py-6">
        <div className="mb-6">
          <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
            Your Orders
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500">
            Official logistics tracking for objects currently in transit or
            permanent possession.
          </p>
        </div>
        <OrdersListView />
      </div>
    </PageShell>
  );
}
