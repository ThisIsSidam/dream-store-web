import { Sparkles } from "lucide-react";
import { RemoteImage } from "@/components/ui/remote-image";
import type { OrderItem } from "@/lib/api/types";
import { blobFor, formatMoney } from "@/lib/utils";

export function OrderItemCard({ item }: { item: OrderItem }) {
  return (
    <li className="flex items-center gap-4 rounded-2xl bg-surface-container-low p-4 shadow-soft sm:gap-5 sm:p-6">
      <RemoteImage
        src={item.productImage}
        alt=""
        width={300}
        sizes="100px"
        className={`size-20 shrink-0 bg-secondary-container/30 sm:size-[100px] ${blobFor(item.variantId)}`}
        fallback={<Sparkles className="size-8 text-outline" aria-hidden />}
      />
      <div className="min-w-0 flex-1">
        <p className="t-body-md break-words font-bold">{item.name}</p>
        <p className="t-caption mt-1 text-on-surface-variant">Vintage Batch. Rare authenticity.</p>
        <span className="t-caption mt-2 inline-block rounded-xl bg-tertiary-container/30 px-2 py-1 text-[10px] uppercase text-on-tertiary-container">
          Actually Impossible
        </span>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <span className="t-caption flex items-center gap-1.5 rounded-full border border-outline-variant/30 bg-surface px-3 py-1.5 shadow-[0_2px_4px_rgb(0_0_0/0.03)]">
          <span className="text-on-surface-variant">Qty</span>
          <span className="text-sm text-primary">{item.quantity}</span>
        </span>
        <p className="t-body-md font-bold">{formatMoney(item.subtotal)}</p>
      </div>
    </li>
  );
}
