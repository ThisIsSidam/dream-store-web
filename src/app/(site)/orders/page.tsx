import type { Metadata } from "next";
import Link from "next/link";
import { Package } from "lucide-react";
import { OrdersFilters } from "@/components/orders/orders-filters";
import { StatusBadge } from "@/components/orders/status-badge";
import { PageShell } from "@/components/site/page-shell";
import { LinkButton } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { RemoteImage } from "@/components/ui/remote-image";
import { EmptyState } from "@/components/ui/state";
import { getMyOrders } from "@/lib/api/shop";
import type { Order } from "@/lib/api/types";
import { requireUser } from "@/lib/auth/session";
import { parseRanges, parseStatuses, rangesToWindow } from "@/lib/orders";
import { parsePage } from "@/lib/products";
import { formatDate, formatMoney, shortId } from "@/lib/utils";

export const metadata: Metadata = { title: "Your orders" };

function OrderCard({ order }: { order: Order }) {
  const first = order.items[0];
  const more = order.items.length - 1;

  return (
    <Link
      href={`/orders/${order._id}`}
      className="flex items-center gap-4 bg-white p-4 shadow-soft transition-shadow hover:shadow-float sm:gap-6 sm:p-5"
    >
      <RemoteImage
        src={first?.productImage}
        alt=""
        width={300}
        sizes="80px"
        className="size-16 shrink-0 bg-white sm:size-20"
        imgClassName="object-contain"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{first?.name ?? "Empty order"}</p>
        <p className="mt-1 text-sm text-on-surface-variant">
          Order #{shortId(order._id)}
          {more > 0 && ` · +${more} more`}
        </p>
      </div>
      <p className="hidden font-semibold sm:block">{formatMoney(order.priceBreakup.total)}</p>
      <div className="flex shrink-0 flex-col items-end gap-1.5 text-right sm:w-36">
        <StatusBadge status={order.status} />
        <p className="text-xs text-on-surface-variant">{formatDate(order.createdAt, "short")}</p>
        <p className="text-sm font-semibold sm:hidden">{formatMoney(order.priceBreakup.total)}</p>
      </div>
    </Link>
  );
}

export default async function OrdersPage({ searchParams }: PageProps<"/orders">) {
  await requireUser("/orders");
  const sp = await searchParams;
  const statuses = parseStatuses(sp.status);
  const ranges = parseRanges(sp.range);
  const page = parsePage(sp.page);
  const hasFilters = statuses.length + ranges.length > 0;

  const { orders, pagination } = await getMyOrders({ page, statuses, ...rangesToWindow(ranges) });

  const hrefFor = (target: number) => {
    const params = new URLSearchParams();
    if (statuses.length) params.set("status", statuses.join(","));
    if (ranges.length) params.set("range", ranges.join(","));
    if (target > 1) params.set("page", String(target));
    const qs = params.toString();
    return qs ? `/orders?${qs}` : "/orders";
  };

  if (orders.length === 0 && !hasFilters) {
    return (
      <PageShell>
        <div className="bg-white shadow-soft">
          <EmptyState
            icon={Package}
            title="You have no orders yet"
            message="When you place an order it will show up here."
            action={<LinkButton href="/products">Start shopping</LinkButton>}
          />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="grid items-start gap-3 lg:grid-cols-[260px_1fr]">
        <OrdersFilters />
        <div>
          <h1 className="mb-3 font-display text-lg font-bold">My orders</h1>
          {orders.length === 0 ? (
            <div className="bg-white shadow-soft">
              <EmptyState
                icon={Package}
                title="No orders match your filters"
                message="Try loosening the filters."
                action={
                  <LinkButton href="/orders" variant="outline">
                    Show all orders
                  </LinkButton>
                }
              />
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {orders.map((order) => (
                <li key={order._id}>
                  <OrderCard order={order} />
                </li>
              ))}
            </ul>
          )}
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            hrefFor={hrefFor}
            className="mt-8"
          />
        </div>
      </div>
    </PageShell>
  );
}
