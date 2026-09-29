import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function WhyExists() {
  return (
    <section className="border-b border-neutral-900 bg-neutral-900 py-16 text-white sm:py-24">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">
          Manifesto / Clarification
        </span>

        <h2 className="mt-3 font-sans text-3xl sm:text-5xl font-bold tracking-tight text-white">
          Why does this exist?
        </h2>

        <div className="mt-8 space-y-4 font-serif text-lg sm:text-2xl italic text-neutral-300 leading-relaxed max-w-xl mx-auto">
          <p>We don&apos;t know.</p>
          <p className="text-neutral-400">Someone made it.</p>
          <p className="text-neutral-400">Someone listed it.</p>
          <p className="text-neutral-400">Someone is selling it.</p>
          <p className="not-italic font-sans text-base sm:text-lg font-semibold text-white pt-2">
            You are currently browsing it.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-xs sm:text-sm font-semibold text-neutral-950 transition-colors hover:bg-neutral-100"
          >
            <span>Read Our Questionable Origin</span>
            <ArrowRight className="size-4 text-neutral-600" />
          </Link>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-md border border-neutral-700 bg-neutral-800/80 px-6 py-3 text-xs sm:text-sm font-semibold text-neutral-200 transition-colors hover:bg-neutral-700"
          >
            <span>Browse Anyway</span>
          </Link>
        </div>

        <p className="mt-8 text-xs font-mono text-neutral-500">
          CATALOG DISCLAIMER: Y-COMBINONSENSE CORP DOES NOT ASSUME
          RESPONSIBILITY FOR PHYSICAL REALITY.
        </p>
      </div>
    </section>
  );
}
