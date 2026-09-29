import { PageShell } from "@/components/site/page-shell";
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "The official origin, selection standards, and philosophy of Y-Combinonsense.",
};

export default function AboutPage() {
  return (
    <PageShell width="max-w-4xl">
      <div className="py-8 space-y-12">
        {/* Hero Headline (Section 24) */}
        <div className="border-b border-neutral-200 pb-10">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-indigo-600">
            About Y-Combinonsense
          </span>
          <h1 className="mt-2 font-sans text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-950">
            We sell things.
          </h1>

          <div className="mt-6 space-y-2 font-serif text-xl sm:text-2xl italic text-neutral-700 leading-relaxed">
            <p>Some useful.</p>
            <p>Some unnecessary.</p>
            <p>Some impossible.</p>
            <p className="not-italic font-sans text-base sm:text-lg font-semibold text-neutral-900 pt-2">
              We decided they all deserved a marketplace.
            </p>
          </div>
        </div>

        {/* Fictional Origin Story */}
        <section className="space-y-4 text-sm sm:text-base text-neutral-700 leading-relaxed">
          <h2 className="font-sans text-xl font-bold text-neutral-950">
            Our Origin
          </h2>
          <p>
            Y-Combinonsense was established in 2026 following an internal audit
            at an undisclosed scientific procurement warehouse. Auditors
            discovered several dozen boxes containing items that defied standard
            product categories—items such as preserved alpine echoes, redundant
            celestial bodies, and personal localized singularities.
          </p>
          <p>
            Rather than discarding these artifacts into municipal waste streams,
            our founding team asked a simple commercial question:{" "}
            <em>What if someone wants to buy this?</em>
          </p>
          <p>
            Within forty-eight hours, our first catalog went live. Within
            seventy-two hours, four customers had purchased Luxury Cardboard and
            one customer had successfully installed an Emergency Backup Moon. We
            have not looked back since.
          </p>
        </section>

        {/* Mission & Philosophy */}
        <section className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-6 sm:p-8 space-y-3">
          <h2 className="font-sans text-lg sm:text-xl font-bold text-neutral-950 flex items-center gap-2">
            <Compass className="size-5 text-indigo-600" />
            <span>Our Mission</span>
          </h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            To provide a legitimate, reliable, and rigorously maintained
            marketplace for goods that have no business existing in standard
            supply chains. We believe consumers have the sovereign right to
            spend hard-earned currency on structural cardboard, extra weekdays,
            and vacuum-sealed emptiness without facing patronizing smirk from
            checkout algorithms.
          </p>
        </section>

        {/* How Products Are Selected */}
        <section className="space-y-4 text-sm sm:text-base text-neutral-700 leading-relaxed">
          <h2 className="font-sans text-xl font-bold text-neutral-950">
            How Products Are Selected
          </h2>
          <p>
            Every artifact listed on Y-Combinonsense must pass our proprietary
            Three-Criterion Threshold:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="rounded-lg border border-neutral-200 bg-white p-4">
              <span className="font-mono text-sm font-bold text-indigo-600">
                01. Plausibility
              </span>
              <p className="mt-1 text-xs text-neutral-600 leading-relaxed">
                The product must look, feel, and function as if manufactured by
                an uncompromising industrial designer.
              </p>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-white p-4">
              <span className="font-mono text-sm font-bold text-indigo-600">
                02. Seriousness
              </span>
              <p className="mt-1 text-xs text-neutral-600 leading-relaxed">
                The packaging and documentation must never acknowledge that the
                product is absurd or questionable.
              </p>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-white p-4">
              <span className="font-mono text-sm font-bold text-indigo-600">
                03. Packaging
              </span>
              <p className="mt-1 text-xs text-neutral-600 leading-relaxed">
                Must survive standard courier handling without collapsing local
                space-time or leaking noise.
              </p>
            </div>
          </div>
        </section>

        {/* Quality Standards */}
        <section className="space-y-4 text-sm sm:text-base text-neutral-700 leading-relaxed">
          <h2 className="font-sans text-xl font-bold text-neutral-950 flex items-center gap-2">
            <ShieldCheck className="size-5 text-emerald-600" />
            <span>Quality Standards</span>
          </h2>
          <p>We take consumer protection with absolute gravity.</p>
          <ul className="space-y-2.5 text-sm text-neutral-700">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="size-4 text-emerald-600 mt-1 shrink-0" />
              <span>
                <strong>Audited Moles:</strong> Our &ldquo;Premium
                Nothing&rdquo; undergoes mass spectrometry to ensure zero rogue
                molecules reside within the enclosure.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="size-4 text-emerald-600 mt-1 shrink-0" />
              <span>
                <strong>Basalt Authenticity:</strong> Emergency Backup Moons are
                surfaced with genuine lunar-equivalent silicate to ensure
                authentic nighttime reflection.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="size-4 text-emerald-600 mt-1 shrink-0" />
              <span>
                <strong>Temporal Dilation Bounds:</strong> Extra Tuesdays are
                certified not to exceed 86,400 seconds, preventing unintentional
                calendar drift.
              </span>
            </li>
          </ul>
        </section>

        {/* Strange Facts Section */}
        <section className="rounded-xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="font-sans text-lg font-bold text-neutral-950 flex items-center gap-2">
            <Sparkles className="size-4 text-amber-500" />
            <span>Strange Facts About Y-Combinonsense</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-neutral-600">
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100">
              <p className="font-bold text-neutral-900 mb-1">
                Catalog Integrity: 97.4%
              </p>
              <p>
                The remaining 2.6% of listed items fluctuate between existence
                and theoretical listing status depending on weather.
              </p>
            </div>
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100">
              <p className="font-bold text-neutral-900 mb-1">
                Couriers are Not Briefed
              </p>
              <p>
                Delivery personnel are unaware of package contents to preserve
                their peace of mind and prevent roadside inspections.
              </p>
            </div>
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100">
              <p className="font-bold text-neutral-900 mb-1">
                Return Rate: 0.14%
              </p>
              <p>
                Most customers find that once an Emotional Support Brick is in
                their home, returning it feels emotionally inappropriate.
              </p>
            </div>
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100">
              <p className="font-bold text-neutral-900 mb-1">
                Zero Comedy Policy
              </p>
              <p>
                Our customer service representatives are contractually forbidden
                from making jokes about the Portable Hole.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works (Section 25) */}
        <section className="border-t border-neutral-200 pt-8">
          <h2 className="font-sans text-xl font-bold text-neutral-950 mb-6">
            The Three-Step Protocol
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-lg border border-neutral-200 p-5 bg-white">
              <span className="font-mono text-2xl font-bold text-indigo-600">
                01
              </span>
              <h3 className="font-bold text-neutral-900 mt-2">Discover</h3>
              <p className="mt-1 text-xs text-neutral-500">
                Find something you didn&apos;t know existed.
              </p>
            </div>
            <div className="rounded-lg border border-neutral-200 p-5 bg-white">
              <span className="font-mono text-2xl font-bold text-indigo-600">
                02
              </span>
              <h3 className="font-bold text-neutral-900 mt-2">
                Question Your Decision
              </h3>
              <p className="mt-1 text-xs text-neutral-500">
                Read the specifications with growing pause.
              </p>
            </div>
            <div className="rounded-lg border border-neutral-200 p-5 bg-white">
              <span className="font-mono text-2xl font-bold text-indigo-600">
                03
              </span>
              <h3 className="font-bold text-neutral-900 mt-2">Buy It Anyway</h3>
              <p className="mt-1 text-xs text-neutral-500">
                Proceed to checkout and wait for the courier.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="border-t border-neutral-200 pt-8 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-600"
          >
            <span>Explore the Questionable Catalog</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
