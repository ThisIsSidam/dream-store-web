"use client";

import { useState } from "react";
import { Brain, History, Zap, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const protocols: { icon: LucideIcon; title: string; subtitle: string; color: string }[] = [
  { icon: Zap, title: "Interdimensional Express", subtitle: "Instantaneous", color: "text-primary" },
  { icon: History, title: "Quantum Delivery", subtitle: "Arrives yesterday", color: "text-secondary" },
  { icon: Brain, title: "Telepathic Transfer", subtitle: "Deep meditation", color: "text-tertiary" },
];

/** Purely decorative for now - the backend has no shipping methods yet. */
export function DispatchProtocols() {
  const [selected, setSelected] = useState(0);

  return (
    <section className="mt-12">
      <h2 className="t-headline-md !text-xl text-on-surface-variant">Quantum Dispatch Protocols</h2>
      <div role="radiogroup" aria-label="Dispatch protocol" className="mt-6 grid gap-4 sm:grid-cols-3">
        {protocols.map(({ icon: Icon, title, subtitle, color }, index) => {
          const active = selected === index;
          return (
            <button
              key={title}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setSelected(index)}
              className={cn(
                "rounded-3xl border-2 p-6 text-left transition-colors",
                active
                  ? "border-primary bg-primary-container/15"
                  : "border-surface-container-highest bg-surface-container-lowest hover:border-outline-variant",
              )}
            >
              <Icon className={cn("size-[26px]", color)} aria-hidden />
              <p className="t-label mt-3">{title}</p>
              <p className="t-body-md mt-1 text-[13px] text-on-surface-variant">{subtitle}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
