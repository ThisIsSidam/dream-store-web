import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { RemoteImage } from "@/components/ui/remote-image";
import type { OrderItem } from "@/lib/api/types";
import { formatMoney } from "@/lib/utils";

export function OrderItemCard({ item }: { item: OrderItem }) {
  return (
    <li className="flex items-start gap-4 border-b border-outline-variant/40 p-4 last:border-b-0 sm:p-6">
      <RemoteImage
        src={item.productImage}
        alt=""
        width={300}
        sizes="96px"
        className="size-20 shrink-0 bg-white sm:size-24"
        imgClassName="object-contain"
        fallback={<ShoppingBag className="size-8 text-outline" aria-hidden />}
      />
      <div className="min-w-0 flex-1">
        {item.productId ? (
          <Link href={`/product/${item.productId}`} className="line-clamp-2 font-medium hover:text-primary">
            {item.name}
          </Link>
        ) : (
          <p className="line-clamp-2 font-medium">{item.name}</p>
        )}
        <p className="mt-1 text-sm text-on-surface-variant">
          Qty: {item.quantity} × {formatMoney(item.price)}
        </p>
      </div>
      <p className="shrink-0 text-base font-semibold">{formatMoney(item.subtotal)}</p>
    </li>
  );
}
