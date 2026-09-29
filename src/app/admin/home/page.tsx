import type { Metadata } from "next";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import { AddBannerButton, AddCategoryButton, AddSectionButton } from "@/components/admin/home-admin";
import { AdminCard, DataTable, EmptyRow, PageHeading, RowLink, Td, Th, Tr } from "@/components/admin/ui";
import { RemoteImage } from "@/components/ui/remote-image";
import { getHomeContent } from "@/lib/api/admin";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Home page" };

const tabs = [
  { id: "banners", label: "Banners" },
  { id: "categories", label: "Categories" },
  { id: "sections", label: "Sections" },
] as const;

export default async function AdminHome({ searchParams }: PageProps<"/admin/home">) {
  const sp = await searchParams;
  const tab = tabs.find((t) => t.id === sp.tab)?.id ?? "banners";
  const { banners, categories, sections } = await getHomeContent();
  const thumb = "size-10 shrink-0 bg-surface-container-low";

  return (
    <>
      <PageHeading
        title="Home management"
        actions={
          tab === "banners" ? <AddBannerButton /> : tab === "categories" ? <AddCategoryButton /> : <AddSectionButton />
        }
      />

      <div role="tablist" aria-label="Home page content" className="mb-4 flex gap-1 border-b border-outline-variant/40">
        {tabs.map((t) => (
          <Link
            key={t.id}
            role="tab"
            aria-selected={t.id === tab}
            href={t.id === "banners" ? "/admin/home" : `/admin/home?tab=${t.id}`}
            className={cn(
              "-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors",
              t.id === tab
                ? "border-primary text-primary"
                : "border-transparent text-on-surface-variant hover:text-on-surface",
            )}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <AdminCard className="overflow-hidden">
        {tab === "banners" && (
          <DataTable>
            <thead>
              <tr>
                <Th>Image</Th>
                <Th>Title</Th>
                <Th>Description</Th>
                <Th>Link</Th>
              </tr>
            </thead>
            <tbody>
              {banners.length === 0 && <EmptyRow colSpan={4}>No banners yet.</EmptyRow>}
              {banners.map((banner) => (
                <Tr key={banner._id}>
                  <Td>
                    <RemoteImage src={banner.imageUrl} alt="" width={200} sizes="64px" className="h-10 w-16 rounded bg-surface-container-low" fallback={<ImageOff className="size-4" />} />
                  </Td>
                  <Td className="font-medium">{banner.title}</Td>
                  <Td className="max-w-sm truncate text-on-surface-variant">{banner.description}</Td>
                  <Td className="max-w-48 truncate text-xs text-on-surface-variant">{banner.link || "—"}</Td>
                </Tr>
              ))}
            </tbody>
          </DataTable>
        )}

        {tab === "categories" && (
          <DataTable>
            <thead>
              <tr>
                <Th>Image</Th>
                <Th>Name</Th>
                <Th>Path</Th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 && <EmptyRow colSpan={3}>No categories yet.</EmptyRow>}
              {categories.map((category) => (
                <Tr key={category._id}>
                  <Td>
                    <RemoteImage src={category.imageUrl} alt="" width={100} sizes="40px" className={cn(thumb, "rounded-full")} fallback={<ImageOff className="size-4" />} />
                  </Td>
                  <Td className="font-medium capitalize">{category.name}</Td>
                  <Td className="font-mono text-xs text-on-surface-variant">{category.path}</Td>
                </Tr>
              ))}
            </tbody>
          </DataTable>
        )}

        {tab === "sections" && (
          <DataTable>
            <thead>
              <tr>
                <Th>Title</Th>
                <Th>Order</Th>
                <Th>Products</Th>
              </tr>
            </thead>
            <tbody>
              {sections.length === 0 && <EmptyRow colSpan={3}>No sections yet.</EmptyRow>}
              {sections.map((section) => (
                <Tr key={section._id}>
                  <Td>
                    <RowLink href={`/admin/home/sections/${section._id}`} className="font-medium text-primary hover:underline">
                      {section.title}
                    </RowLink>
                  </Td>
                  <Td>{section.order}</Td>
                  <Td>{section.items?.length ?? 0} items</Td>
                </Tr>
              ))}
            </tbody>
          </DataTable>
        )}
      </AdminCard>
    </>
  );
}
