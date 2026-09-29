import type { PriceBreakup } from "@/lib/api/types";
import { formatMoney } from "@/lib/utils";

function Row({
  label,
  value,
  subtitle,
  highlight,
}: {
  label: string;
  value: string;
  subtitle?: string;
  highlight?: boolean;
}) {
  return (
    <div className="border-b border-on-secondary-container/15 pb-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <dt className="t-body-md font-semibold text-on-secondary-container/80">{label}</dt>
          {subtitle && <p className="t-caption text-[10px] text-on-secondary-container/55">{subtitle}</p>}
        </div>
        <dd className={highlight ? "t-body-md font-extrabold text-primary" : "t-body-md font-semibold text-on-secondary-container"}>
          {value}
        </dd>
      </div>
    </div>
  );
}

/** "Reality Receipt": the price breakdown card shared by cart and checkout. */
export function RealityReceipt({
  priceBreakup,
  children,
}: {
  priceBreakup: PriceBreakup;
  children?: React.ReactNode;
}) {
  const { subtotal, tax, discount, shipping, total } = priceBreakup;

  return (
    <aside className="rounded-[48px] bg-secondary-container p-8 shadow-[0_20px_40px_color-mix(in_srgb,var(--color-secondary)_12%,transparent)] lg:sticky lg:top-28">
      <h2 className="t-body-md font-bold text-on-secondary-container">Reality Receipt</h2>
      <dl className="mt-8 flex flex-col gap-[18px]">
        <Row label="Subtotal" value={formatMoney(subtotal)} />
        <Row label="Dimensional Taxes" value={formatMoney(tax)} />
        {discount > 0 && <Row label="Paradox Discount" value={`-${formatMoney(discount)}`} highlight />}
        <Row
          label="Universal Shipping"
          value={shipping > 0 ? formatMoney(shipping) : "FREE"}
          subtitle="Arrives before you order"
          highlight
        />
      </dl>
      <div className="mt-7 flex items-start justify-between gap-4 border-t border-on-secondary-container/15 pt-7">
        <p className="t-headline-md font-extrabold text-on-secondary-container">
          Total
          <br />
          Reality
        </p>
        <p className="t-headline-md font-extrabold text-on-secondary-container">{formatMoney(total)}</p>
      </div>
      {children}
      <p className="t-caption mt-8 flex items-center justify-center gap-2.5 rounded-full bg-surface/50 px-4 py-3.5 text-center text-xs text-secondary">
        Secure Paradox Link Active
      </p>
      <blockquote className="t-body-md mt-8 rounded-[36px] border border-white/40 bg-white/30 p-6 italic text-on-secondary-container/80">
        “Physics is just a suggestion. Your cart is a gateway to the impossible.”
      </blockquote>
    </aside>
  );
}
