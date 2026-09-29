import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Box } from "lucide-react";
import { AdminCard, IdTag, Overline, PageHeading } from "@/components/admin/ui";
import { StatusBadge } from "@/components/orders/status-badge";
import { RemoteImage } from "@/components/ui/remote-image";
import { getOrderRecord } from "@/lib/api/admin";
import { formatDateTime, formatMoney, shortId } from "@/lib/utils";

export const metadata: Metadata = { title: "Order" };

export default async function AdminOrderPage({ params }: PageProps<"/admin/orders/[id]">) {
  const { id } = await params;
  const order = await getOrderRecord(id);
  if (!order) notFound();
  const { subtotal, tax, discount, shipping, total } = order.priceBreakup;

  return (
    <>
      <PageHeading title={`Order #${shortId(order._id, 8)}`} back="/admin/orders" />
      <div className="grid gap-8 lg:grid-cols-3">
        <AdminCard className="overflow-hidden lg:col-span-2">
          <h2 className="border-b border-outline-variant/30 p-6 text-lg font-bold">Order items</h2>
          <ul className="divide-y divide-outline-variant/30">
            {order.items.map((item) => (
              <li key={item.variantId} className="flex items-center justify-between gap-4 p-6">
                <div className="flex min-w-0 items-center gap-4">
                  <RemoteImage
                    src={item.productImage}
                    alt=""
                    width={200}
                    sizes="64px"
                    className="size-16 shrink-0 rounded-lg bg-surface-container-low"
                    fallback={<Box className="size-5" aria-hidden />}
                  />
                  <div className="min-w-0">
                    <p className="truncate font-bold">{item.name}</p>
                    <p className="text-sm text-on-surface-variant">Qty: {item.quantity}</p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-bold">{formatMoney(item.price)}</p>
                  <p className="text-xs text-on-surface-variant">Total: {formatMoney(item.subtotal)}</p>
                </div>
              </li>
            ))}
          </ul>
        </AdminCard>

        <AdminCard className="space-y-6 p-6">
          <div>
            <Overline>Status</Overline>
            <StatusBadge status={order.status} />
          </div>
          <div>
            <Overline>Payment</Overline>
            <p className="text-sm font-medium capitalize">{order.paymentStatus}</p>
          </div>
          <div>
            <Overline>Customer</Overline>
            <IdTag id={order.userId} kind="users" />
          </div>
          <div>
            <Overline>Placed</Overline>
            <p className="text-sm font-medium">{formatDateTime(order.createdAt)}</p>
          </div>
          <dl className="space-y-2 border-t border-outline-variant/30 pt-6 text-sm">
            <div className="flex justify-between">
              <dt className="text-on-surface-variant">Subtotal</dt>
              <dd className="font-medium">{formatMoney(subtotal)}</dd>
            </div>
            {tax > 0 && (
              <div className="flex justify-between">
                <dt className="text-on-surface-variant">Tax</dt>
                <dd className="font-medium">{formatMoney(tax)}</dd>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between">
                <dt className="text-on-surface-variant">Discount</dt>
                <dd className="font-medium text-emerald-700">-{formatMoney(discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-on-surface-variant">Shipping</dt>
              <dd className="font-medium text-emerald-700">{shipping > 0 ? formatMoney(shipping) : "Free"}</dd>
            </div>
            <div className="flex justify-between border-t border-outline-variant/30 pt-4 text-lg font-bold">
              <dt>Total</dt>
              <dd className="text-primary">{formatMoney(total)}</dd>
            </div>
          </dl>
        </AdminCard>
      </div>
    </>
  );
}
