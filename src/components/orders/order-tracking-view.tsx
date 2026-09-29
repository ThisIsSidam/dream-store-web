"use client";

import { ProductVisual } from "@/components/ui/product-visual";
import { useStore } from "@/lib/client/store";
import { cn, formatPrice } from "@/lib/utils";
import {
    ArrowLeft,
    Box,
    Check,
    CheckCircle2,
    Clock,
    Download,
    MapPin,
    Package,
    Truck,
    UserCheck
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const TRACKING_STEPS = [
  {
    status: "Ordered",
    label: "Ordered",
    desc: "Your transaction was recorded in our ledger with minimal celebration.",
    icon: CheckCircle2,
  },
  {
    status: "Packed",
    label: "Packed",
    desc: "Someone has carefully placed it inside a box.",
    icon: Box,
  },
  {
    status: "Shipped",
    label: "Shipped",
    desc: "It has left our possession.",
    icon: Truck,
  },
  {
    status: "Out for Delivery",
    label: "Out for Delivery",
    desc: "It is now someone else's problem.",
    icon: Package,
  },
  {
    status: "Delivered",
    label: "Delivered",
    desc: "You now own this. There is no going back.",
    icon: UserCheck,
  },
];

const STATUS_INDEX: Record<string, number> = {
  Ordered: 0,
  Packed: 1,
  Shipped: 2,
  "Out for Delivery": 3,
  Delivered: 4,
};

export function OrderTrackingView({ orderId }: { orderId: string }) {
  const { getOrder, orders } = useStore();

  const order =
    getOrder(orderId) ||
    orders.find((o) => o.id === orderId || o.orderNumber === orderId) ||
    orders[0];

  if (!order) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-xl font-bold">Order not found</h2>
        <p className="mt-1 text-xs text-neutral-500">
          Perhaps it was delivered to a parallel timeline.
        </p>
        <Link
          href="/orders"
          className="mt-4 inline-block text-xs font-semibold text-indigo-600"
        >
          View all orders
        </Link>
      </div>
    );
  }

  const currentStepIdx = STATUS_INDEX[order.status] ?? 3;

  function handleDownloadReceipt() {
    toast.success("Receipt Generated", {
      description: "An unnecessary certificate of purchase has been drafted.",
    });
  }

  return (
    <div className="mx-auto max-w-4xl py-4 space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to All Orders</span>
        </Link>
      </div>

      {/* Main Order Card */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-5">
          <div>
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-indigo-600">
              Verified Marketplace Order
            </span>
            <h1 className="font-sans text-2xl font-bold text-neutral-950 mt-0.5">
              Order #{order.orderNumber}
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Placed on {order.date} • Paid via{" "}
              {order.paymentMethod.toUpperCase()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDownloadReceipt}
              className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 shadow-2xs"
            >
              <Download className="size-3.5 text-neutral-500" />
              <span>Download Invoice</span>
            </button>
          </div>
        </div>

        {/* Professional Visual Stepper (Section 23: Ordered → Packed → Shipped → Out for Delivery → Delivered) */}
        <div className="my-8 rounded-lg bg-neutral-50/70 p-6 border border-neutral-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
              <Clock className="size-4 text-indigo-600" />
              <span>Logistics Timeline</span>
            </h3>
            <span className="text-xs font-semibold text-indigo-600">
              Estimated Delivery: {order.estimatedDelivery}
            </span>
          </div>

          {/* Stepper bar */}
          <div className="relative mt-8 mb-6">
            <div className="hidden sm:block absolute top-4 left-6 right-6 h-0.5 bg-neutral-200" />
            <div
              className="hidden sm:block absolute top-4 left-6 h-0.5 bg-indigo-600 transition-all duration-500"
              style={{
                width: `${(currentStepIdx / (TRACKING_STEPS.length - 1)) * 88}%`,
              }}
            />

            <div className="relative grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2">
              {TRACKING_STEPS.map((st, idx) => {
                const isPast = idx < currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                const Icon = st.icon;

                return (
                  <div
                    key={st.status}
                    className="flex sm:flex-col items-start sm:items-center text-left sm:text-center gap-3 sm:gap-2"
                  >
                    <div
                      className={cn(
                        "relative z-10 grid size-8 sm:size-9 place-items-center rounded-full text-xs font-bold transition-all shrink-0",
                        isPast
                          ? "bg-indigo-600 text-white"
                          : isCurrent
                            ? "bg-neutral-900 text-white ring-4 ring-indigo-100"
                            : "bg-white border-2 border-neutral-300 text-neutral-400",
                      )}
                    >
                      {isPast ? (
                        <Check className="size-4" />
                      ) : (
                        <Icon className="size-4" />
                      )}
                    </div>

                    <div>
                      <p
                        className={cn(
                          "text-xs font-bold",
                          isCurrent
                            ? "text-indigo-600"
                            : isPast
                              ? "text-neutral-900"
                              : "text-neutral-400",
                        )}
                      >
                        {st.label}
                      </p>
                      <p className="text-[11px] text-neutral-500 italic mt-0.5 max-w-36 leading-tight">
                        &ldquo;{st.desc}&rdquo;
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="mt-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3">
            Items in this Manifestation
          </h3>
          <ul className="divide-y divide-neutral-100 rounded-lg border border-neutral-200">
            {order.items.map((item) => (
              <li
                key={item.variantId}
                className="flex items-center gap-4 p-4 text-xs sm:text-sm"
              >
                <div className="size-16 rounded-lg border border-neutral-200 bg-neutral-50 overflow-hidden shrink-0">
                  <ProductVisual
                    visualId={item.visualId}
                    name={item.name}
                    showStudioLighting={false}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-neutral-900 truncate">
                    {item.name}
                  </h4>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {item.variantName || "Standard Edition"} • Qty:{" "}
                    {item.quantity}
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Category: {item.category}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-neutral-950 font-mono text-sm">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                  {item.quantity > 1 && (
                    <span className="block text-[11px] text-neutral-400">
                      {formatPrice(item.price)} each
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Address and Financial Breakdown */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-neutral-100 pt-6 text-xs">
          <div>
            <h4 className="font-bold text-neutral-900 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <MapPin className="size-3.5 text-indigo-600" />
              <span>Delivery Address</span>
            </h4>
            <div className="text-neutral-600 leading-relaxed bg-neutral-50 p-3.5 rounded-lg border border-neutral-200/60">
              <p className="font-semibold text-neutral-900">
                {order.deliveryAddress.fullName}
              </p>
              <p>{order.deliveryAddress.address}</p>
              <p>
                {order.deliveryAddress.city}, {order.deliveryAddress.state} —{" "}
                {order.deliveryAddress.pin}
              </p>
              <p className="mt-1 text-neutral-400">
                Phone: {order.deliveryAddress.phone}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-neutral-900 uppercase tracking-wide mb-2">
              Payment Summary
            </h4>
            <div className="space-y-1.5 bg-neutral-50 p-3.5 rounded-lg border border-neutral-200/60">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="font-medium text-neutral-900">
                  {formatPrice(order.subtotal)}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span>
                <span>
                  {order.shipping === 0 ? "FREE" : formatPrice(order.shipping)}
                </span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Taxes</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-neutral-950 pt-2 border-t border-neutral-200 text-sm">
                <span>Total Paid</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
