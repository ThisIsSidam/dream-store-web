import type { Metadata } from "next";
import Link from "next/link";
import { Receipt } from "lucide-react";
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
      className="flex items-center gap-4 rounded-[30px] border border-outline-variant/30 bg-surface/90 p-4 shadow-[0_14px_24px_color-mix(in_srgb,var(--color-primary)_6%,transparent)] transition-transform hover:-translate-y-0.5 sm:gap-6 sm:p-5"
    >
      <RemoteImage
        src={first?.productImage}
        alt=""
        width={300}
        sizes="120px"
        className="size-20 shrink-0 rounded-3xl bg-surface-container-highest/45 sm:size-[120px]"
      />
      <div className="min-w-0 flex-1">
        <p className="t-caption tracking-[1.2px] text-on-surface-variant">ORDER #{shortId(order._id)}</p>
        <p className="t-headline mt-2 truncate !text-xl font-extrabold sm:!text-2xl">
          {first?.name ?? "Empty order"}
        </p>
        {more > 0 && <p className="t-caption mt-1 text-on-surface-variant">+ {more} more</p>}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2 text-right">
        <p className="t-body-md font-extrabold text-primary">{formatMoney(order.priceBreakup.total)}</p>
        <StatusBadge status={order.status} />
        <p className="text-[13px] text-on-surface-variant">{formatDate(order.createdAt, "short")}</p>
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
      <PageShell title="Orders">
        <EmptyState
          icon={Receipt}
          title="No orders yet"
          message="Your future receipts will appear here."
          action={<LinkButton href="/categories">Start shopping</LinkButton>}
        />
      </PageShell>
    );
  }

  return (
    <PageShell title="Orders">
      <div className="grid items-start gap-8 lg:grid-cols-[280px_1fr]">
        <OrdersFilters />
        <div>
          {orders.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="Sorry, no orders found"
              message="Try loosening the filters."
              action={
                <LinkButton href="/orders" variant="soft">
                  Show all orders
                </LinkButton>
              }
            />
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
            className="mt-10"
          />
        </div>
      </div>
    </PageShell>
  );
}
