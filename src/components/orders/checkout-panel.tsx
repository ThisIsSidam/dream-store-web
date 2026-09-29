"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock } from "lucide-react";
import { toast } from "sonner";
import { PriceDetails } from "@/components/orders/price-details";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/dialog";
import { ApiError } from "@/lib/api/errors";
import type { Order } from "@/lib/api/types";
import { api } from "@/lib/client/api";
import { formatMoney } from "@/lib/utils";

function useCountdown(expiresAt: string) {
  const [remaining, setRemaining] = useState(() => new Date(expiresAt).getTime() - Date.now());

  useEffect(() => {
    const tick = () => setRemaining(new Date(expiresAt).getTime() - Date.now());
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  return Math.max(0, remaining);
}

export function CheckoutPanel({ order }: { order: Order }) {
  const router = useRouter();
  const [busy, setBusy] = useState<"pay" | "cancel" | null>(null);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const remaining = useCountdown(order.expiresAt);
  const expired = remaining === 0;

  // Once the reservation lapses the backend cancels the order; re-check until it does.
  useEffect(() => {
    if (!expired) return;
    router.refresh();
    const timer = setInterval(() => router.refresh(), 5000);
    return () => clearInterval(timer);
  }, [expired, router]);

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  async function pay() {
    setBusy("pay");
    try {
      await api("orders/confirm-payment", { method: "POST", body: { orderId: order._id } });
      toast.success("Payment successful!");
      router.replace(`/orders/${order._id}`);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Payment failed.");
      setBusy(null);
    }
  }

  async function cancel() {
    setBusy("cancel");
    try {
      await api("orders/payment-failed", { method: "POST", body: { orderId: order._id } });
      toast.success("Order cancelled");
      router.replace("/orders");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Could not cancel the order.");
      setBusy(null);
      setConfirmingCancel(false);
    }
  }

  return (
    <PriceDetails priceBreakup={order.priceBreakup} itemCount={itemCount} className="lg:sticky lg:top-16">
      <div className="border-t border-outline-variant/40 p-5">
        <p className="flex items-center gap-2 text-sm font-semibold text-buy" role="timer">
          <Clock className="size-4" aria-hidden />
          {expired ? "Reservation expired" : `Items reserved for ${minutes}:${String(seconds).padStart(2, "0")}`}
        </p>
        <Button
          variant="buy"
          size="xl"
          className="mt-4 w-full"
          loading={busy === "pay"}
          disabled={expired || busy === "cancel"}
          onClick={pay}
        >
          Pay {formatMoney(order.priceBreakup.total)}
        </Button>
        <button
          type="button"
          onClick={() => setConfirmingCancel(true)}
          disabled={busy !== null}
          className="mt-3 w-full py-2 text-sm font-semibold text-on-surface-variant hover:text-primary disabled:opacity-50"
        >
          Cancel this order
        </button>
      </div>
      <ConfirmDialog
        open={confirmingCancel}
        onClose={() => setConfirmingCancel(false)}
        onConfirm={cancel}
        loading={busy === "cancel"}
        title="Cancel order"
        message="Are you sure you want to cancel this order? Your items will be released."
        confirmLabel="Yes, cancel it"
        cancelLabel="Keep order"
        destructive
      />
    </PriceDetails>
  );
}
