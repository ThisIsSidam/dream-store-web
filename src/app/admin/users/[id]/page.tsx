import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Info, ShoppingCart } from "lucide-react";
import { AdminCard, DataTable, EmptyRow, Overline, PageHeading, RowLink, Td, Th, Tr } from "@/components/admin/ui";
import { StatusBadge } from "@/components/orders/status-badge";
import { Badge } from "@/components/ui/badge";
import { getCartOfUser, getUserRecord, isGuestId, listOrdersOfUser } from "@/lib/api/admin";
import { formatDate, formatDateTime, formatMoney, shortId } from "@/lib/utils";

export const metadata: Metadata = { title: "User" };

export default async function AdminUserPage({ params }: PageProps<"/admin/users/[id]">) {
  const { id } = await params;
  const guest = isGuestId(id);

  const [user, cart, orders] = await Promise.all([
    guest ? null : getUserRecord(id),
    getCartOfUser(id),
    guest ? null : listOrdersOfUser(id, 1, 10),
  ]);
  if (!guest && !user) notFound();

  return (
    <>
      <PageHeading title={guest ? "Guest user" : user!.name} back="/admin/users" />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6">
          <AdminCard className="p-6">
            <div className="flex flex-col items-center text-center">
              <span className="mb-4 grid size-24 place-items-center rounded-full bg-primary/10 text-3xl font-bold text-primary">
                {guest ? "G" : (user!.name[0]?.toUpperCase() ?? "?")}
              </span>
              <h2 className="text-xl font-bold">{guest ? "Guest user" : user!.name}</h2>
              <p className="text-on-surface-variant">{guest ? "No email (anonymous session)" : user!.email}</p>
              <div className="mt-2">
                {guest ? (
                  <Badge tone="warning">Guest</Badge>
                ) : (
                  <Badge tone={user!.role === "admin" ? "danger" : "success"}>{user!.role}</Badge>
                )}
              </div>
            </div>
            <div className="mt-6 space-y-4 border-t border-outline-variant/30 pt-6">
              <div>
                <Overline>{guest ? "Guest session ID" : "Account ID"}</Overline>
                <p className="break-all font-mono text-sm text-on-surface-variant">{id}</p>
              </div>
              {user?.createdAt && (
                <div>
                  <Overline>Joined</Overline>
                  <p className="text-sm text-on-surface-variant">{formatDate(user.createdAt, "long")}</p>
                </div>
              )}
            </div>
          </AdminCard>

          <AdminCard className="p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <ShoppingCart className="size-5 text-primary" aria-hidden /> Cart
            </h2>
            {cart && cart.items.length > 0 ? (
              <>
                <ul className="space-y-3 text-sm">
                  {cart.items.map((item) => (
                    <li key={item.variantId} className="flex items-center justify-between gap-3">
                      <span className="truncate text-on-surface-variant">{item.name ?? "Item"}</span>
                      <span className="font-bold">x{item.quantity}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 border-t border-outline-variant/30 pt-4 text-xs text-on-surface-variant">
                  {cart.items.length} unique item{cart.items.length === 1 ? "" : "s"}
                  {cart.updatedAt && ` · updated ${formatDateTime(cart.updatedAt)}`}
                </p>
              </>
            ) : (
              <p className="text-sm italic text-on-surface-variant">No items in cart.</p>
            )}
          </AdminCard>
        </div>

        <div className="lg:col-span-2">
          {guest ? (
            <div className="rounded-2xl border border-sky-100 bg-sky-50 p-8 text-center text-sky-900">
              <Info className="mx-auto mb-4 size-10 text-sky-400" aria-hidden />
              <h2 className="mb-2 text-xl font-bold">Guest session</h2>
              <p className="mx-auto max-w-md text-sky-800">
                This cart belongs to an anonymous visitor. Guests have no profile or order history until they register.
              </p>
            </div>
          ) : (
            <AdminCard className="overflow-hidden">
              <div className="flex items-center justify-between border-b border-outline-variant/30 p-6">
                <h2 className="text-lg font-bold">Order history</h2>
                {orders && orders.pagination.total > 10 && (
                  <Link href={`/admin/users/${id}/orders`} className="text-sm font-bold text-primary hover:underline">
                    Show all ({orders.pagination.total})
                  </Link>
                )}
              </div>
              <DataTable>
                <thead>
                  <tr>
                    <Th>Order</Th>
                    <Th>Date</Th>
                    <Th>Total</Th>
                    <Th>Status</Th>
                  </tr>
                </thead>
                <tbody>
                  {orders?.orders.length === 0 && <EmptyRow colSpan={4}>No orders found for this user.</EmptyRow>}
                  {orders?.orders.map((order) => (
                    <Tr key={order._id}>
                      <Td>
                        <RowLink href={`/admin/orders/${order._id}`} className="font-mono text-xs text-on-surface-variant">
                          #{shortId(order._id, 8)}
                        </RowLink>
                      </Td>
                      <Td className="text-xs text-on-surface-variant">{formatDateTime(order.createdAt)}</Td>
                      <Td className="font-bold">{formatMoney(order.priceBreakup.total)}</Td>
                      <Td>
                        <StatusBadge status={order.status} />
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </DataTable>
            </AdminCard>
          )}
        </div>
      </div>
    </>
  );
}
