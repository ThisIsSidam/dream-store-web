import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { CheckoutPanel } from "@/components/orders/checkout-panel";
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
    <PageShell>
      <div className="grid items-start gap-3 lg:grid-cols-[1fr_380px]">
        <section className="bg-white shadow-soft">
          <h1 className="border-b border-outline-variant/40 px-4 py-4 font-display text-lg font-bold sm:px-6">
            Order summary
          </h1>
          <ul>
            {order.items.map((item) => (
              <OrderItemCard key={item.variantId} item={item} />
            ))}
          </ul>
        </section>
        <CheckoutPanel order={order} />
      </div>
    </PageShell>
  );
}
