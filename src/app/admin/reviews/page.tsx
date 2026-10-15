import type { Metadata } from "next";
import { PageHeading } from "@/components/admin/ui";
import { ReviewsAdminTable } from "@/components/admin/reviews-admin";
import { listReviews } from "@/lib/api/admin";
import { parsePage } from "@/lib/products";

export const metadata: Metadata = { title: "Customer Reviews" };

export default async function AdminReviews({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = parsePage(sp.page);
  const { reviews, pagination } = await listReviews({ page });

  return (
    <>
      <PageHeading title="Customer Reviews" />
      <ReviewsAdminTable reviews={reviews} pagination={pagination} />
    </>
  );
}

