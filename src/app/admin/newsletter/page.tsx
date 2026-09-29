import type { Metadata } from "next";
import { Trash2 } from "lucide-react";
import { removeSubscriber } from "@/app/actions/admin";
import { AdminCard, DataTable, EmptyRow, PageHeading, Td, Th, Tr } from "@/components/admin/ui";
import { SearchInput } from "@/components/admin/search-input";
import { Pagination } from "@/components/ui/pagination";
import { listSubscribers } from "@/lib/api/admin";
import { parsePage } from "@/lib/products";
import { formatDateTime, pageHref } from "@/lib/utils";

export const metadata: Metadata = { title: "Newsletter" };

export default async function AdminNewsletter({ searchParams }: PageProps<"/admin/newsletter">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const { subscribers, pagination } = await listSubscribers({ page: parsePage(sp.page), query: q });

  return (
    <>
      <PageHeading
        title="Newsletter"
        actions={<SearchInput placeholder="Search by email..." />}
      />
      <AdminCard className="overflow-hidden">
        <DataTable>
          <thead>
            <tr>
              <Th>Email</Th>
              <Th>Subscribed</Th>
              <Th><span className="sr-only">Actions</span></Th>
            </tr>
          </thead>
          <tbody>
            {subscribers.length === 0 && <EmptyRow colSpan={3}>No subscribers yet.</EmptyRow>}
            {subscribers.map((subscriber) => (
              <Tr key={subscriber._id}>
                <Td className="font-medium">{subscriber.email}</Td>
                <Td className="text-on-surface-variant">{formatDateTime(subscriber.createdAt)}</Td>
                <Td className="text-right">
                  <form action={removeSubscriber.bind(null, subscriber._id)}>
                    <button
                      type="submit"
                      aria-label={`Remove ${subscriber.email}`}
                      className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-error/10 hover:text-error"
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </button>
                  </form>
                </Td>
              </Tr>
            ))}
          </tbody>
        </DataTable>
        <div className="flex items-center justify-between gap-4 border-t border-outline-variant/30 p-3">
          <p className="px-3 text-sm text-on-surface-variant">
            {pagination.total} {pagination.total === 1 ? "subscriber" : "subscribers"}
          </p>
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            hrefFor={(page) => pageHref("/admin/newsletter", { q, page })}
          />
        </div>
      </AdminCard>
    </>
  );
}
