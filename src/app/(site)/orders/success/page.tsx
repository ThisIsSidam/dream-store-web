"use client";

import { ProductVisual } from "@/components/ui/product-visual";
import { useStore } from "@/lib/client/store";
import { formatPrice } from "@/lib/utils";
import {
    ArrowRight,
    CheckCircle,
    Package
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { getOrder, orders } = useStore();

  const order = (orderId ? getOrder(orderId) : undefined) || orders[0];

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:py-24 text-center">
      {/* Success Badge */}
      <div className="mx-auto grid size-20 place-items-center rounded-full bg-emerald-100 text-emerald-600 mb-6 ring-8 ring-emerald-50">
        <CheckCircle className="size-10" />
      </div>

      <span className="text-xs font-mono font-semibold uppercase tracking-widest text-indigo-600">
        Confirmation #{order?.orderNumber || "YC-5956"}
      </span>

      <h1 className="mt-2 font-sans text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-950">
        Order Confirmed.
      </h1>

      <p className="mt-3 text-base text-neutral-600 max-w-md mx-auto leading-relaxed">
        Your questionable purchase is now officially on its way.
      </p>

      {/* Deadpan secondary line */}
      <p className="mt-2 text-xs italic text-neutral-400">
        &ldquo;You have made a decision.&rdquo;
      </p>

      {/* Order Details Card */}
      {order && (
        <div className="mt-10 rounded-xl border border-neutral-200 bg-white p-6 sm:p-8 text-left shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Order Reference
              </p>
              <p className="font-mono text-base font-bold text-neutral-950">
                {order.orderNumber}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Estimated Delivery
              </p>
              <p className="text-sm font-semibold text-neutral-900">
                {order.estimatedDelivery}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Total Paid
              </p>
              <p className="text-base font-extrabold text-neutral-950">
                {formatPrice(order.total)}
              </p>
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="mt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
              Registered Artifacts ({order.items.length})
            </h3>
            <ul className="divide-y divide-neutral-100">
              {order.items.map((item) => (
                <li
                  key={item.variantId}
                  className="flex items-center gap-3.5 py-3"
                >
                  <div className="size-12 rounded border border-neutral-200 bg-neutral-50 overflow-hidden shrink-0">
                    <ProductVisual
                      visualId={item.visualId}
                      name={item.name}
                      showStudioLighting={false}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-neutral-900 text-xs sm:text-sm truncate">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      Qty: {item.quantity} • {item.variantName || "Standard"}
                    </p>
                  </div>
                  <span className="font-mono text-xs sm:text-sm font-bold text-neutral-900">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Delivery destination */}
          <div className="mt-6 rounded-lg bg-neutral-50 p-4 border border-neutral-100 text-xs text-neutral-600">
            <p className="font-bold text-neutral-900 mb-0.5">
              Shipping Destination:
            </p>
            <p>
              {order.deliveryAddress.fullName} • {order.deliveryAddress.address}
              , {order.deliveryAddress.city}, {order.deliveryAddress.state} —{" "}
              {order.deliveryAddress.pin}
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href={`/orders/${order?.id || "yc-order-5956"}`}
          className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-6 py-3 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-indigo-600"
        >
          <Package className="size-4" />
          <span>Track Order</span>
        </Link>

        <Link
          href="/products"
          className="inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-6 py-3 text-xs sm:text-sm font-semibold text-neutral-800 transition-colors hover:bg-neutral-50"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
