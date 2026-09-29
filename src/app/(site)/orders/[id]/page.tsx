import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { OrderItemCard } from "@/components/orders/order-item-card";
import { StatusBadge } from "@/components/orders/status-badge";
import { PageShell } from "@/components/site/page-shell";
import { LinkButton } from "@/components/ui/button";
import { getMyOrder } from "@/lib/api/shop";
import { requireUser } from "@/lib/auth/session";
import { formatDateTime, formatMoney, shortId } from "@/lib/utils";

export const metadata: Metadata = { title: "Order details" };

function PriceRow({ label, value, discount }: { label: string; value: number; discount?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2">
      <dt className="text-on-surface-variant">{label}</dt>
      <dd className={discount ? "font-bold text-emerald-700" : "font-bold"}>
        {discount ? "-" : ""}
        {formatMoney(Math.abs(value))}
      </dd>
    </div>
  );
}

export default async function OrderPage({ params }: PageProps<"/orders/[id]">) {
  const { id } = await params;
  await requireUser(`/orders/${id}`);
  const order = await getMyOrder(id);
  if (!order) notFound();
  const { subtotal, tax, discount, shipping, total } = order.priceBreakup;

  return (
    <PageShell width="max-w-[800px]">
      <Link
        href="/orders"
        className="t-label mb-6 inline-flex items-center gap-2 text-on-surface-variant hover:text-primary"
      >
        <ArrowLeft className="size-4" aria-hidden /> All orders
      </Link>

      <section className="rounded-2xl bg-surface-container-low p-6 shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="t-headline-md !text-[1.75rem]">Order {shortId(order._id, 8)}</h1>
            <p className="t-body-md mt-2 text-on-surface-variant">{formatDateTime(order.createdAt)}</p>
          </div>
          <StatusBadge status={order.status} />
        </div>
        <p className="t-body-md mt-4 capitalize text-on-surface-variant">Payment: {order.paymentStatus}</p>
      </section>

      <h2 className="t-headline-md mb-4 mt-8 !text-[1.75rem]">Order Items</h2>
      <ul className="flex flex-col gap-3">
        {order.items.map((item) => (
          <OrderItemCard key={item.variantId} item={item} />
        ))}
      </ul>

      <section className="mt-8 rounded-2xl bg-surface-container-low p-6 shadow-soft">
        <h2 className="t-headline-md !text-[1.75rem]">Price Breakdown</h2>
        <dl className="mt-4">
          <PriceRow label="Subtotal" value={subtotal} />
          {tax > 0 && <PriceRow label="Tax" value={tax} />}
          {discount > 0 && <PriceRow label="Discount" value={discount} discount />}
          {shipping > 0 && <PriceRow label="Shipping" value={shipping} />}
        </dl>
        <div className="mt-4 flex items-center justify-between border-t border-outline-variant/30 pt-4">
          <p className="t-headline-md !text-[1.75rem]">Total</p>
          <p className="t-headline-md !text-[1.75rem] text-primary">{formatMoney(total)}</p>
        </div>
      </section>

      {order.status === "pending" && (
        <LinkButton href={`/checkout/${order._id}`} size="lg" className="mt-8 w-full">
          Complete Payment
        </LinkButton>
      )}
    </PageShell>
  );
}
