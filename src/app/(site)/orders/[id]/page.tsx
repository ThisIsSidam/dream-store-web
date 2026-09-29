import { OrderTrackingView } from "@/components/orders/order-tracking-view";
import { PageShell } from "@/components/site/page-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Tracking",
  description: "Live tracking for your questionable purchase.",
};

export default async function OrderDetailPage({
  params,
}: PageProps<"/orders/[id]">) {
  const { id } = await params;

  return (
    <PageShell>
      <OrderTrackingView orderId={id} />
    </PageShell>
  );
}
