"use client";

import { ProductVisual } from "@/components/ui/product-visual";
import { useStore } from "@/lib/client/store";
import { cn, formatPrice } from "@/lib/utils";
import {
    ArrowRight,
    Package
} from "lucide-react";
import Link from "next/link";

export function OrdersListView() {
  const { orders } = useStore();

  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-12 text-center shadow-xs">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-neutral-100 text-neutral-400 mb-4">
          <Package className="size-8" />
        </div>
        <h2 className="font-sans text-xl font-bold text-neutral-900">
          No questionable orders yet.
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto">
          When you place an order, our couriers will begin moving your artifact
          with minimal conversation.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-neutral-900 px-6 py-2.5 text-xs font-semibold text-white hover:bg-indigo-600 transition-colors"
        >
          <span>Explore Catalog</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const firstItem = order.items[0];
        const extraCount = order.items.length - 1;

        return (
          <div
            key={order.id}
            className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-xs transition-all hover:border-neutral-300 hover:shadow-sm"
          >
            {/* Header row */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-4 text-xs">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-neutral-400 uppercase tracking-wider text-[10px] block">
                    Order Placed
                  </span>
                  <span className="font-semibold text-neutral-900">
                    {order.date}
                  </span>
                </div>
                <div className="h-6 w-px bg-neutral-200" />
                <div>
                  <span className="text-neutral-400 uppercase tracking-wider text-[10px] block">
                    Order Reference
                  </span>
                  <span className="font-mono font-bold text-neutral-900">
                    {order.orderNumber}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-neutral-400 uppercase tracking-wider text-[10px] block">
                    Total
                  </span>
                  <span className="font-bold text-neutral-950">
                    {formatPrice(order.total)}
                  </span>
                </div>
                <Link
                  href={`/orders/${order.id}`}
                  className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 font-semibold text-neutral-800 hover:bg-neutral-50 hover:text-indigo-600 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>

            {/* Content Row */}
            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="size-16 sm:size-20 rounded-lg border border-neutral-200 bg-neutral-50 overflow-hidden shrink-0">
                  <ProductVisual
                    visualId={firstItem?.visualId || "generic"}
                    name={firstItem?.name}
                    showStudioLighting={false}
                  />
                </div>
                <div>
                  <Link
                    href={`/orders/${order.id}`}
                    className="font-sans text-base font-bold text-neutral-950 hover:text-indigo-600 transition-colors"
                  >
                    {firstItem?.name || "Order Artifact"}
                  </Link>
                  {extraCount > 0 && (
                    <p className="text-xs text-neutral-500 mt-0.5">
                      +{extraCount} additional questionable{" "}
                      {extraCount === 1 ? "item" : "items"}
                    </p>
                  )}
                  <p className="text-xs text-neutral-400 mt-1">
                    Destination: {order.deliveryAddress.city},{" "}
                    {order.deliveryAddress.state}
                  </p>
                </div>
              </div>

              {/* Status Badge & Deadpan status */}
              <div className="sm:text-right">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                    order.status === "Delivered" &&
                      "bg-emerald-100 text-emerald-900",
                    order.status === "Out for Delivery" &&
                      "bg-blue-100 text-blue-900",
                    order.status === "Shipped" &&
                      "bg-indigo-100 text-indigo-900",
                    order.status === "Packed" && "bg-amber-100 text-amber-900",
                    order.status === "Ordered" && "bg-slate-100 text-slate-800",
                  )}
                >
                  <span className="size-1.5 rounded-full bg-current" />
                  <span>{order.status}</span>
                </span>
                <p className="mt-1 text-xs text-neutral-500 italic max-w-xs">
                  &ldquo;{order.statusDescription}&rdquo;
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
