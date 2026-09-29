import Link from "next/link";
import { Box, ShoppingBag, ShoppingCart, Users } from "lucide-react";
import { AdminCard, DataTable, EmptyRow, IdTag, PageHeading, RowLink, Stat, Td, Th, Tr } from "@/components/admin/ui";
import { StatusBadge } from "@/components/orders/status-badge";
import { listCarts, listOrders, listProducts, listUsers } from "@/lib/api/admin";
import { formatDateTime, formatMoney, shortId } from "@/lib/utils";

export default async function AdminOverview() {
  const [products, users, orders, carts] = await Promise.all([
    listProducts({ limit: 1 }),
    listUsers({ limit: 1 }),
    listOrders({ limit: 5 }),
    listCarts({ limit: 1 }),
  ]);

  return (
    <>
      <PageHeading title="Overview" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Products" value={products.pagination.total} href="/admin/products" icon={Box} />
        <Stat label="Users" value={users.pagination.total} href="/admin/users" icon={Users} />
        <Stat label="Orders" value={orders.pagination.total} href="/admin/orders" icon={ShoppingBag} />
        <Stat label="Carts" value={carts.pagination.total} href="/admin/carts" icon={ShoppingCart} />
      </div>

      <AdminCard className="mt-8 overflow-hidden">
        <div className="flex items-center justify-between p-6">
          <h2 className="text-lg font-bold">Latest orders</h2>
          <Link href="/admin/orders" className="text-sm font-bold text-primary hover:underline">
            View all
          </Link>
        </div>
        <DataTable>
          <thead>
            <tr>
              <Th>Order</Th>
              <Th>Customer</Th>
              <Th>Date</Th>
              <Th>Total</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {orders.orders.length === 0 && <EmptyRow colSpan={5}>No orders yet.</EmptyRow>}
            {orders.orders.map((order) => (
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
              </Tr>
            ))}
          </tbody>
        </DataTable>
      </AdminCard>
    </>
  );
}
