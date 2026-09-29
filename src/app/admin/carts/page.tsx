import type { Metadata } from "next";
import { AdminCard, DataTable, EmptyRow, IdTag, PageHeading, RowLink, Td, Th, Tr } from "@/components/admin/ui";
import { SearchInput } from "@/components/admin/search-input";
import { Pagination } from "@/components/ui/pagination";
import { listCarts } from "@/lib/api/admin";
import { parsePage } from "@/lib/products";
import { formatDateTime, pageHref } from "@/lib/utils";

export const metadata: Metadata = { title: "Carts" };

export default async function AdminCarts({ searchParams }: PageProps<"/admin/carts">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const { carts, pagination } = await listCarts({ page: parsePage(sp.page), query: q });

  return (
    <>
      <PageHeading title="Carts" actions={<SearchInput placeholder="Search by user ID..." />} />
      <AdminCard className="overflow-hidden">
        <DataTable>
          <thead>
            <tr>
              <Th>User</Th>
              <Th>Unique items</Th>
              <Th>Last activity</Th>
              <Th>Contents</Th>
            </tr>
          </thead>
          <tbody>
            {carts.length === 0 && <EmptyRow colSpan={4}>No carts found.</EmptyRow>}
            {carts.map((cart) => {
              const summary = cart.items.map((i) => `${i.name ?? "Item"} (x${i.quantity})`).join(", ");
              return (
                <Tr key={cart._id} className={cart.items.length === 0 ? "opacity-60" : undefined}>
                  <Td>
                    <RowLink href={`/admin/users/${cart.userId}`} className="inline-block">
                      <IdTag id={cart.userId} kind="users" plain />
                    </RowLink>
                  </Td>
                  <Td>
                    <span className="rounded-full bg-surface-container-highest px-2.5 py-0.5 text-xs font-bold">
                      {cart.items.length} items
                    </span>
                  </Td>
                  <Td className="text-on-surface-variant">{cart.updatedAt ? formatDateTime(cart.updatedAt) : "-"}</Td>
                  <Td>
                    <span className="block max-w-xs truncate text-xs font-medium" title={summary}>
                      {summary || "Empty"}
                    </span>
                  </Td>
                </Tr>
              );
            })}
          </tbody>
        </DataTable>
        <div className="border-t border-outline-variant/30 p-3">
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            hrefFor={(page) => pageHref("/admin/carts", { q, page })}
          />
        </div>
      </AdminCard>
    </>
  );
}
