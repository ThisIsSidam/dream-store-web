import type { PriceBreakup } from "@/lib/api/types";
import { cn, formatMoney } from "@/lib/utils";

function Row({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

/** Price breakdown shared by the cart, checkout and order pages. */
export function PriceDetails({
  priceBreakup,
  itemCount,
  children,
  className,
}: {
  priceBreakup: PriceBreakup;
  itemCount: number;
  children?: React.ReactNode;
  className?: string;
}) {
  const { subtotal, tax, discount, shipping, total } = priceBreakup;

  return (
    <aside className={cn("bg-white shadow-soft", className)}>
      <h2 className="border-b border-outline-variant/40 px-5 py-3 text-sm font-bold uppercase tracking-wide text-on-surface-variant">
        Price details
      </h2>
      <dl className="flex flex-col gap-4 p-5 text-[15px]">
        <Row label={`Price (${itemCount} ${itemCount === 1 ? "item" : "items"})`}>{formatMoney(subtotal)}</Row>
        {discount > 0 && (
          <Row label="Discount">
            <span className="text-success">−{formatMoney(discount)}</span>
          </Row>
        )}
        {tax > 0 && <Row label="Tax">{formatMoney(tax)}</Row>}
        <Row label="Delivery charges">
          {shipping > 0 ? formatMoney(shipping) : <span className="text-success">Free</span>}
        </Row>
        <Row label="Total amount" className="border-t border-dashed border-outline-variant pt-4 text-lg font-semibold">
          {formatMoney(total)}
        </Row>
      </dl>
      {children}
    </aside>
  );
}
