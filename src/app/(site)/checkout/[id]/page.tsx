import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { CheckoutPanel } from "@/components/orders/checkout-panel";
import { DispatchProtocols } from "@/components/orders/dispatch-protocols";
import { OrderItemCard } from "@/components/orders/order-item-card";
import { PageShell } from "@/components/site/page-shell";
import { getMyOrder } from "@/lib/api/shop";
import { requireUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage({ params }: PageProps<"/checkout/[id]">) {
  const { id } = await params;
  await requireUser(`/checkout/${id}`);

  const order = await getMyOrder(id);
  if (!order) notFound();
  if (order.status !== "pending") redirect(`/orders/${order._id}`);

  return (
    <PageShell title="Manifesting Soon" width="max-w-[1280px]">
      <div className="grid items-start gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ul className="flex flex-col gap-4">
            {order.items.map((item) => (
              <OrderItemCard key={item.variantId} item={item} />
            ))}
          </ul>
          <DispatchProtocols />
        </div>
        <CheckoutPanel order={order} />
      </div>
    </PageShell>
  );
}
