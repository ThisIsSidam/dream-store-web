import type { Metadata } from "next";
import { AdminCard, DataTable, EmptyRow, IdTag, PageHeading, RowLink, Td, Th, Tr } from "@/components/admin/ui";
import { SearchInput } from "@/components/admin/search-input";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { listUsers } from "@/lib/api/admin";
import { parsePage } from "@/lib/products";
import { formatDate, pageHref } from "@/lib/utils";

export const metadata: Metadata = { title: "Users" };

export default async function AdminUsers({ searchParams }: PageProps<"/admin/users">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const { users, pagination } = await listUsers({ page: parsePage(sp.page), query: q });

  return (
    <>
      <PageHeading title="Users" actions={<SearchInput placeholder="Search by name or email..." />} />
      <AdminCard className="overflow-hidden">
        <DataTable>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Joined</Th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && <EmptyRow colSpan={5}>No users found.</EmptyRow>}
            {users.map((user) => (
              <Tr key={user._id}>
                <Td>
                  <IdTag id={user._id} kind="users" />
                </Td>
                <Td>
                  <RowLink href={`/admin/users/${user._id}`} className="block max-w-52 truncate font-medium">
                    {user.name}
                  </RowLink>
                </Td>
                <Td>
                  <span className="block max-w-64 truncate">{user.email}</span>
                </Td>
                <Td>
                  <Badge tone={user.role === "admin" ? "danger" : "success"} className="!py-1 text-[10px]">
                    {user.role}
                  </Badge>
                </Td>
                <Td className="text-on-surface-variant">{user.createdAt ? formatDate(user.createdAt) : "-"}</Td>
              </Tr>
            ))}
          </tbody>
        </DataTable>
        <div className="border-t border-outline-variant/30 p-3">
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            hrefFor={(page) => pageHref("/admin/users", { q, page })}
          />
        </div>
      </AdminCard>
    </>
  );
}
