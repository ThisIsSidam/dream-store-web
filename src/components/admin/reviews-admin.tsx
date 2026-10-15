"use client";

import { deleteReviewAction } from "@/app/actions/admin";
import { AdminCard, DataTable, EmptyRow, Td, Th, Tr } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/dialog";
import { Pagination } from "@/components/ui/pagination";
import type { Pagination as PaginationType, Review } from "@/lib/api/types";
import { formatDateTime, pageHref } from "@/lib/utils";
import { CheckCircle2, MessageSquare, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export function ReviewsAdminTable({
  reviews,
  pagination,
}: {
  reviews: Review[];
  pagination?: PaginationType;
}) {
  const [toDelete, setToDelete] = useState<Review | null>(null);
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!toDelete) return;
    startTransition(async () => {
      const res = await deleteReviewAction(toDelete._id);
      if (res.ok) {
        toast.success("Review deleted and product ratings recalculated.");
        setToDelete(null);
      } else {
        toast.error(res.error || "Failed to delete review");
      }
    });
  }

  return (
    <>
      <AdminCard className="overflow-hidden">
        <DataTable>
          <thead>
            <tr>
              <Th>Product</Th>
              <Th>Author</Th>
              <Th>Rating</Th>
              <Th>Review</Th>
              <Th>Helpful</Th>
              <Th>Date</Th>
              <Th className="w-16">
                <span className="sr-only">Actions</span>
              </Th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 && (
              <EmptyRow colSpan={7}>
                No customer reviews found.
              </EmptyRow>
            )}
            {reviews.map((rev) => {
              const productObj =
                typeof rev.productId === "object" ? rev.productId : null;
              const productName = productObj?.name || "Imaginary Product";
              const productSlug = productObj?.slug || productObj?._id || "";

              return (
                <Tr key={rev._id}>
                  <Td className="max-w-44">
                    {productObj ? (
                      <Link
                        href={`/admin/products/${productObj._id}`}
                        className="font-bold text-xs text-primary hover:underline block truncate"
                      >
                        {productName}
                      </Link>
                    ) : (
                      <span className="font-medium text-xs text-on-surface-variant">
                        {String(rev.productId)}
                      </span>
                    )}
                  </Td>
                  <Td>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs text-neutral-900">
                        {rev.authorName}
                      </span>
                      {rev.isVerifiedPurchase && (
                        <span title="Verified Purchaser">
                          <CheckCircle2 className="size-3.5 text-emerald-600" />
                        </span>
                      )}
                    </div>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                      <Star className="size-3.5 fill-amber-400 text-amber-500" />
                      <span>{rev.rating}</span>
                    </div>
                  </Td>
                  <Td className="max-w-xs">
                    <p className="font-semibold text-xs text-neutral-900 truncate">
                      {rev.title}
                    </p>
                    <p className="text-[11px] text-on-surface-variant line-clamp-2 mt-0.5">
                      {rev.comment}
                    </p>
                  </Td>
                  <Td className="text-xs text-on-surface-variant font-mono">
                    {rev.helpfulCount}
                  </Td>
                  <Td className="text-xs text-on-surface-variant whitespace-nowrap">
                    {formatDateTime(rev.createdAt)}
                  </Td>
                  <Td>
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label="Delete review"
                      onClick={() => setToDelete(rev)}
                      className="text-error hover:bg-error/10 h-8 w-8 p-0"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </Td>
                </Tr>
              );
            })}
          </tbody>
        </DataTable>
        {pagination && pagination.totalPages > 1 && (
          <div className="border-t border-outline-variant/30 p-3">
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              hrefFor={(page) => pageHref("/admin/reviews", { page })}
            />
          </div>
        )}
      </AdminCard>

      <ConfirmDialog
        open={toDelete !== null}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        loading={pending}
        title="Delete customer review"
        message={`Delete review "${toDelete?.title}" by ${toDelete?.authorName}? Product ratings will be recomputed automatically.`}
        confirmLabel="Delete Review"
        destructive
      />
    </>
  );
}
