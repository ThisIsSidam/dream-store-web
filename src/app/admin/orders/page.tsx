import type { Metadata } from "next";
import { AdminCard, DataTable, EmptyRow, IdTag, PageHeading, RowLink, Td, Th, Tr } from "@/components/admin/ui";
import { SearchInput } from "@/components/admin/search-input";
import { StatusBadge } from "@/components/orders/status-badge";
import { Pagination } from "@/components/ui/pagination";
import { listOrders } from "@/lib/api/admin";
import { parsePage } from "@/lib/products";
import { formatDateTime, formatMoney, pageHref, shortId } from "@/lib/utils";

export const metadata: Metadata = { title: "Orders" };

export default async function AdminOrders({ searchParams }: PageProps<"/admin/orders">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const { orders, pagination } = await listOrders({ page: parsePage(sp.page), query: q });

  return (
    <>
      <PageHeading
        title="Orders"
        actions={<SearchInput placeholder="Search by order ID, user ID or status..." className="w-full sm:w-80" />}
      />
      <AdminCard className="overflow-hidden">
        <DataTable>
          <thead>
            <tr>
              <Th>Order</Th>
              <Th>User</Th>
              <Th>Date</Th>
              <Th>Total</Th>
              <Th>Status</Th>
              <Th>Items</Th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && <EmptyRow colSpan={6}>No orders found.</EmptyRow>}
            {orders.map((order) => (
              <Tr key={order._id}>
                <Td>
                  <RowLink href={`/admin/orders/${order._id}`} className="font-mono text-xs text-on-surface-variant">
                    #{shortId(order._id, 8)}
                  </RowLink>
                </Td>
                <Td>
                  <IdTag id={order.userId} kind="users" />
                </Td>
                <Td className="text-on-surface-variant">{formatDateTime(order.createdAt)}</Td>
                <Td className="font-bold">{formatMoney(order.priceBreakup.total)}</Td>
                <Td>
                  <StatusBadge status={order.status} />
                </Td>
                <Td className="text-xs font-medium">{order.items.length} product(s)</Td>
              </Tr>
            ))}
          </tbody>
        </DataTable>
        <div className="border-t border-outline-variant/30 p-3">
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            hrefFor={(page) => pageHref("/admin/orders", { q, page })}
          />
        </div>
      </AdminCard>
    </>
  );
}
