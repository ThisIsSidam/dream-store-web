import Link from "next/link";
import { BrandMark } from "./brand";

const SHOP_LINKS = [
  { href: "/products", label: "All Products" },
  { href: "/products?filter=new", label: "New Arrivals" },
  { href: "/products?filter=bestseller", label: "Best Sellers" },
  { href: "/products?filter=limited", label: "Limited Drops" },
  { href: "/categories", label: "Categories" },
];

const HELP_LINKS = [
  { href: "/support", label: "Contact & FAQs" },
  { href: "/support#shipping", label: "Shipping Information" },
  { href: "/returns", label: "Returns Policy" },
  { href: "/orders", label: "Order Tracking" },
  { href: "/support#temporal", label: "Temporal Assistance" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/about#story", label: "Our Story" },
  { href: "/about#careers", label: "Careers (Theoretical)" },
  { href: "/about#press", label: "Press & Inquiries" },
];

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/returns#terms", label: "Terms of Service" },
  { href: "/returns", label: "Refund Policy" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-neutral-800 bg-neutral-950 text-neutral-400">
      <div className="mx-auto max-w-[1360px] px-4 py-14">
        {/* Top brand header in footer */}
        <div className="mb-12 pb-10 border-b border-neutral-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <BrandMark className="size-9" />
            <div>
              <p className="font-sans text-lg font-bold text-white tracking-tight">
                Y-Combinonsense
              </p>
              <p className="text-xs text-neutral-400">
                A marketplace for objects, ideas, and other questionable
                necessities.
              </p>
            </div>
          </div>
          <div className="rounded-lg border border-neutral-800 bg-neutral-900/60 px-4 py-2 text-xs font-mono text-neutral-400">
            CATALOG INTEGRITY:{" "}
            <span className="text-emerald-400 font-semibold">97.4%</span> •
            REALITY DRIFT:{" "}
            <span className="text-indigo-400 font-semibold">0.02s</span>
          </div>
        </div>

        {/* 4 Column Marketplace Directory */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Column 1: Shop */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
              Shop
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm">
              {SHOP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Help */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
              Help
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm">
              {HELP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
              Company
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
              Legal
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom copyright line and deadpan footnotes */}
        <div className="mt-14 pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div>
            <span>Y-Combinonsense © 2026.</span>{" "}
            <span className="italic text-neutral-400">
              Probably a real company.
            </span>
          </div>

          <div className="text-neutral-400 text-center sm:text-right text-[11px]">
            Some products may not be fully understood.
          </div>
        </div>
      </div>
    </footer>
  );
}
