import { Lock, Quote } from "lucide-react";
import type { Order } from "@/lib/api/types";

/**
 * What a paid order actually delivers: one line per unit. The lines stay sealed
 * until the order is Delivered, so the tracking timeline doubles as the
 * unwrapping ceremony. Nothing renders for orders that were never paid.
 */
export function OrderLines({ order }: { order: Order }) {
  if (order.status !== "confirmed") return null;
  const delivered = order.trackingStatus === "Delivered";

  return (
    <section aria-labelledby="order-lines-heading" className="mt-8">
      <h3
        id="order-lines-heading"
        className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-900"
      >
        <Quote className="size-4 text-indigo-600" aria-hidden />
        <span>What you actually bought</span>
      </h3>
      <p className="mb-3 text-xs text-neutral-500">
        {delivered
          ? "Delivered. These are yours now, and so is whatever you do with them."
          : "There is no box. Each unit arrives as a single line, written for the product. They stay sealed until this order is Delivered."}
      </p>

      <ul className="space-y-4">
        {order.items.map((item) => (
          <li key={item.variantId} className="rounded-lg border border-neutral-200 bg-white p-4">
            <p className="text-xs font-semibold text-neutral-900">
              {item.name}
              <span className="font-normal text-neutral-500">
                {item.variantName ? ` · ${item.variantName}` : ""} · {item.quantity} {item.quantity === 1 ? "line" : "lines"}
              </span>
            </p>

            <div className="mt-3 space-y-3">
              {delivered && item.lines && item.lines.length > 0
                ? item.lines.map((line, index) => (
                    <figure key={index} className="rounded-md border-l-4 border-indigo-500 bg-indigo-50/50 px-4 py-3">
                      <blockquote className="font-serif text-base leading-relaxed text-neutral-900">
                        &ldquo;{line.text}&rdquo;
                      </blockquote>
                      {line.attribution && (
                        <figcaption className="mt-1.5 text-xs text-neutral-500">— {line.attribution}</figcaption>
                      )}
                    </figure>
                  ))
                : Array.from({ length: item.quantity }, (_, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2.5 rounded-md border border-dashed border-neutral-300 bg-neutral-50 px-4 py-3 text-xs text-neutral-500"
                    >
                      <Lock className="size-4 shrink-0 text-neutral-400" aria-hidden />
                      <span>{delivered ? "Nothing to show." : "Sealed. Opens when this order is Delivered."}</span>
                    </div>
                  ))}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
