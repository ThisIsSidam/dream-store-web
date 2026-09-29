"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { DispatchProtocols } from "@/components/orders/dispatch-protocols";
import { RealityReceipt } from "@/components/orders/receipt";
import { Skeleton } from "@/components/site/loading";
import { Button, LinkButton } from "@/components/ui/button";
import { RemoteImage } from "@/components/ui/remote-image";
import { EmptyState, ErrorState } from "@/components/ui/state";
import { ApiError } from "@/lib/api/errors";
import type { CartLine, Order } from "@/lib/api/types";
import { api } from "@/lib/client/api";
import { useCart } from "@/lib/client/use-cart";
import { blobFor, formatMoney } from "@/lib/utils";

function CartLineCard({ line }: { line: CartLine }) {
  const { changeQuantity } = useCart();
  const [pending, setPending] = useState(false);

  async function change(delta: number) {
    setPending(true);
    try {
      await changeQuantity(line.variantId, line.name, delta);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Could not update your cart.");
    } finally {
      setPending(false);
    }
  }

  const stepper = "grid size-11 place-items-center rounded-full transition-[filter] hover:brightness-95 disabled:opacity-40";

  return (
    <li className="flex flex-col items-center gap-5 rounded-[32px] bg-surface-container-low p-5 shadow-[0_8px_18px_rgb(0_0_0/0.03)] sm:flex-row sm:gap-8 sm:p-8">
      <RemoteImage
        src={line.productImage}
        alt=""
        width={300}
        sizes="128px"
        className={`size-28 shrink-0 bg-secondary-container/45 sm:size-32 ${blobFor(line.variantId)}`}
        fallback={<Sparkles className="size-9 text-secondary" aria-hidden />}
      />
      <div className="min-w-0 flex-1 text-center sm:text-left">
        <p className="t-body-lg break-words font-bold">{line.name}</p>
        <p className="t-body-md mt-1 text-on-surface-variant">Unexpired, 100% resolution rate.</p>
        <span className="t-caption mt-3 inline-block rounded-full bg-[#ffdf9b] px-3 py-1.5 text-[10px] uppercase tracking-wider text-on-tertiary-container">
          Actually Impossible
        </span>
      </div>
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center rounded-full bg-surface p-2 shadow-[0_2px_8px_rgb(0_0_0/0.06)]">
          <button
            type="button"
            aria-label={`Decrease quantity of ${line.name}`}
            disabled={pending || line.quantity <= 1}
            onClick={() => change(-1)}
            className={`${stepper} bg-secondary-container text-secondary`}
          >
            <Minus className="size-5" />
          </button>
          <output aria-live="polite" className="t-headline w-11 text-center !text-lg text-primary">
            {line.quantity}
          </output>
          <button
            type="button"
            aria-label={`Increase quantity of ${line.name}`}
            disabled={pending}
            onClick={() => change(1)}
            className={`${stepper} bg-primary-container text-on-primary-container`}
          >
            <Plus className="size-5" />
          </button>
        </div>
        <p className="t-label text-on-surface-variant">{formatMoney(line.price * line.quantity)}</p>
      </div>
    </li>
  );
}

export function CartView() {
  const router = useRouter();
  const { cart, error, isLoading, refresh } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);

  async function checkout() {
    setCheckingOut(true);
    try {
      const { order } = await api<{ order: Order }>("orders", { method: "POST" });
      // The backend empties the cart once the order exists.
      await refresh();
      router.push(`/checkout/${order._id}`);
    } catch (err) {
      if (err instanceof ApiError && err.isAuth) {
        toast.message("Sign in to check out");
        router.push("/signin?next=/cart");
        return;
      }
      toast.error(err instanceof ApiError ? err.message : "Could not start checkout.");
      setCheckingOut(false);
    }
  }

  if (isLoading) {
    return (
      <div className="grid gap-12 lg:grid-cols-3" aria-busy>
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Skeleton className="h-48 rounded-[32px]" />
          <Skeleton className="h-48 rounded-[32px]" />
        </div>
        <Skeleton className="h-[520px] rounded-[48px]" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        message={error.message}
        action={<Button onClick={() => refresh()}>Try again</Button>}
      />
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Your cart is empty"
        message="Nothing here yet - the void is waiting to be filled."
        action={<LinkButton href="/categories">Start browsing</LinkButton>}
      />
    );
  }

  return (
    <div className="grid items-start gap-12 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <ul className="flex flex-col gap-6">
          {cart.items.map((line) => (
            <CartLineCard key={line.variantId} line={line} />
          ))}
        </ul>
        <DispatchProtocols />
      </div>
      <RealityReceipt priceBreakup={cart.priceBreakup}>
        <Button
          variant="accent"
          size="xl"
          className="mt-11 w-full"
          loading={checkingOut}
          onClick={checkout}
        >
          Finalize Manifestation <Sparkles className="size-5" aria-hidden />
        </Button>
      </RealityReceipt>
    </div>
  );
}
