"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { PriceDetails } from "@/components/orders/price-details";
import { Skeleton } from "@/components/site/loading";
import { Button, LinkButton } from "@/components/ui/button";
import { RemoteImage } from "@/components/ui/remote-image";
import { EmptyState, ErrorState } from "@/components/ui/state";
import { ApiError } from "@/lib/api/errors";
import type { CartLine, Order } from "@/lib/api/types";
import { api } from "@/lib/client/api";
import { useCart } from "@/lib/client/use-cart";
import { formatMoney } from "@/lib/utils";

function CartLineCard({ line }: { line: CartLine }) {
  const { changeQuantity, removeLine } = useCart();
  const [pending, setPending] = useState(false);

  async function run(action: () => Promise<void>) {
    setPending(true);
    try {
      await action();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Could not update your cart.");
    } finally {
      setPending(false);
    }
  }

  const change = (delta: number) => run(() => changeQuantity(line.variantId, line.name, delta));
  const remove = () => run(() => removeLine(line.variantId));

  const stepper =
    "grid size-8 place-items-center rounded-full border border-outline-variant bg-white hover:bg-surface-container-low disabled:opacity-40";

  return (
    <li className="flex gap-4 border-b border-outline-variant/40 p-4 sm:gap-6 sm:p-6">
      <div className="flex shrink-0 flex-col items-center gap-4">
        <Link href={`/product/${line.productId}`}>
          <RemoteImage
            src={line.productImage}
            alt=""
            width={300}
            sizes="112px"
            className="size-24 bg-white sm:size-28"
            imgClassName="object-contain"
            fallback={<ShoppingBag className="size-9 text-outline" aria-hidden />}
          />
        </Link>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label={`Decrease quantity of ${line.name}`}
            disabled={pending || line.quantity <= 1}
            onClick={() => change(-1)}
            className={stepper}
          >
            <Minus className="size-4" />
          </button>
          <output aria-live="polite" className="grid h-8 w-11 place-items-center border border-outline-variant text-sm font-semibold">
            {line.quantity}
          </output>
          <button
            type="button"
            aria-label={`Increase quantity of ${line.name}`}
            disabled={pending}
            onClick={() => change(1)}
            className={stepper}
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <Link href={`/product/${line.productId}`} className="line-clamp-2 font-medium hover:text-primary">
          {line.name}
        </Link>
        <p className="mt-2 text-lg font-semibold">{formatMoney(line.subtotal)}</p>
        {line.quantity > 1 && (
          <p className="text-sm text-on-surface-variant">
            {line.quantity} × {formatMoney(line.price)}
          </p>
        )}
        <button
          type="button"
          aria-label={`Remove ${line.name} from cart`}
          disabled={pending}
          onClick={remove}
          className="mt-auto self-start pt-3 text-sm font-bold uppercase tracking-wide hover:text-primary disabled:opacity-40"
        >
          Remove
        </button>
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
      <div className="grid gap-3 lg:grid-cols-[1fr_380px]" aria-busy>
        <Skeleton className="h-72" />
        <Skeleton className="h-64" />
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
      <div className="bg-white shadow-soft">
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty!"
          message="Add items to it now."
          action={<LinkButton href="/products">Shop now</LinkButton>}
        />
      </div>
    );
  }

  const itemCount = cart.items.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <div className="grid items-start gap-3 lg:grid-cols-[1fr_380px]">
      <section className="bg-white shadow-soft">
        <h1 className="border-b border-outline-variant/40 px-4 py-4 font-display text-lg font-bold sm:px-6">
          My cart ({cart.items.length})
        </h1>
        <ul>
          {cart.items.map((line) => (
            <CartLineCard key={line.variantId} line={line} />
          ))}
        </ul>
        <div className="sticky bottom-0 flex items-center justify-between gap-4 bg-white p-4 shadow-[0_-2px_10px_rgb(0_0_0/0.1)] max-xs:bottom-14 sm:px-6">
          <p className="text-lg font-semibold lg:hidden">{formatMoney(cart.priceBreakup.total)}</p>
          <Button variant="buy" size="xl" className="ml-auto max-lg:flex-1 lg:min-w-64" loading={checkingOut} onClick={checkout}>
            Place order
          </Button>
        </div>
      </section>
      <PriceDetails priceBreakup={cart.priceBreakup} itemCount={itemCount} className="lg:sticky lg:top-16" />
    </div>
  );
}
