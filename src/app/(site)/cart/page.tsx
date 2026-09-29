import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";
import { PageShell } from "@/components/site/page-shell";

export const metadata: Metadata = { title: "Your cart" };

export default function CartPage() {
  return (
    <PageShell>
      <CartView />
    </PageShell>
  );
}
