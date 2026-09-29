import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { OrderItemCard } from "@/components/orders/order-item-card";
import { PriceDetails } from "@/components/orders/price-details";
import { StatusBadge } from "@/components/orders/status-badge";
import { PageShell } from "@/components/site/page-shell";
import { LinkButton } from "@/components/ui/button";
import { getMyOrder } from "@/lib/api/shop";
import { requireUser } from "@/lib/auth/session";
import { formatDateTime, shortId } from "@/lib/utils";

export const metadata: Metadata = { title: "Order details" };

export default async function OrderPage({ params }: PageProps<"/orders/[id]">) {
  const { id } = await params;
  await requireUser(`/orders/${id}`);
  const order = await getMyOrder(id);
  if (!order) notFound();
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <PageShell>
      <Link
        href="/orders"
        className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-on-surface-variant hover:text-primary"
      >
        <ChevronLeft className="size-4" aria-hidden /> My orders
      </Link>

      <div className="grid items-start gap-3 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-3">
          <section className="flex flex-wrap items-start justify-between gap-4 bg-white p-4 shadow-soft sm:p-6">
            <div>
              <h1 className="font-display text-lg font-bold">Order #{shortId(order._id, 8)}</h1>
              <p className="mt-1 text-sm text-on-surface-variant">Placed on {formatDateTime(order.createdAt)}</p>
              <p className="mt-1 text-sm capitalize text-on-surface-variant">Payment: {order.paymentStatus}</p>
            </div>
            <StatusBadge status={order.status} />
          </section>

          <section className="bg-white shadow-soft">
            <h2 className="border-b border-outline-variant/40 px-4 py-3 text-sm font-bold uppercase tracking-wide text-on-surface-variant sm:px-6">
              Items
            </h2>
            <ul>
              {order.items.map((item) => (
                <OrderItemCard key={item.variantId} item={item} />
              ))}
            </ul>
          </section>
        </div>

        <PriceDetails priceBreakup={order.priceBreakup} itemCount={itemCount}>
          {order.status === "pending" && (
            <div className="border-t border-outline-variant/40 p-5">
              <LinkButton href={`/checkout/${order._id}`} variant="buy" size="lg" className="w-full">
                Complete payment
              </LinkButton>
            </div>
          )}
        </PriceDetails>
      </div>
    </PageShell>
  );
}
