import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminCard, DataTable, EmptyRow, PageHeading, RowLink, Td, Th, Tr } from "@/components/admin/ui";
import { StatusBadge } from "@/components/orders/status-badge";
import { Pagination } from "@/components/ui/pagination";
import { isGuestId, listOrdersOfUser } from "@/lib/api/admin";
import { parsePage } from "@/lib/products";
import { formatDateTime, formatMoney, pageHref, shortId } from "@/lib/utils";

export const metadata: Metadata = { title: "User orders" };

export default async function AdminUserOrders({ params, searchParams }: PageProps<"/admin/users/[id]/orders">) {
  const { id } = await params;
  if (isGuestId(id)) notFound();
  const sp = await searchParams;
  const { orders, pagination } = await listOrdersOfUser(id, parsePage(sp.page), 15);

  return (
    <>
      <PageHeading title="User orders" back={`/admin/users/${id}`} />
      <AdminCard className="overflow-hidden">
        <DataTable>
          <thead>
            <tr>
              <Th>Order</Th>
              <Th>Date</Th>
              <Th>Total</Th>
              <Th>Status</Th>
              <Th>Items</Th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && <EmptyRow colSpan={5}>No orders found for this user.</EmptyRow>}
            {orders.map((order) => (
              <Tr key={order._id}>
                <Td>
                  <RowLink href={`/admin/orders/${order._id}`} className="font-mono text-xs text-on-surface-variant">
                    #{shortId(order._id, 8)}
                  </RowLink>
                </Td>
                <Td className="text-on-surface-variant">{formatDateTime(order.createdAt)}</Td>
                <Td className="font-bold">{formatMoney(order.priceBreakup.total)}</Td>
                <Td>
                  <StatusBadge status={order.status} />
                </Td>
                <Td>{order.items.length} product(s)</Td>
              </Tr>
            ))}
          </tbody>
        </DataTable>
        <div className="border-t border-outline-variant/30 p-3">
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            hrefFor={(page) => pageHref(`/admin/users/${id}/orders`, { page })}
          />
        </div>
      </AdminCard>
    </>
  );
}
