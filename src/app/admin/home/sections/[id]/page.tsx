import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionEditor } from "@/components/admin/home-admin";
import { PageHeading } from "@/components/admin/ui";
import { getSectionRecord } from "@/lib/api/admin";
import { formatPriceRange } from "@/lib/utils";

export const metadata: Metadata = { title: "Section" };

export default async function AdminSectionPage({ params }: PageProps<"/admin/home/sections/[id]">) {
  const { id } = await params;
  const section = await getSectionRecord(id);
  if (!section) notFound();

  const entries = section.items
    .filter((item) => item.productId)
    .sort((a, b) => a.order - b.order)
    .map((item) => {
      const product = item.productId!;
      return {
        id: product._id,
        name: product.name,
        image: product.images[0]?.url,
        price: formatPriceRange(product.minPrice, product.maxPrice),
      };
    });

  return (
    <>
      <PageHeading title={section.title} back="/admin/home?tab=sections" />
      <SectionEditor
        key={section.items.map((i) => i.productId?._id).join()}
        sectionId={section._id}
        title={section.title}
        order={section.order}
        initial={entries}
      />
    </>
  );
}
