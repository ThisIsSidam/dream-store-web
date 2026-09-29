import Link from "next/link";
import { siteConfig } from "@/config/site";

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/products", label: "All products" },
      { href: "/categories", label: "Categories" },
      { href: "/cart", label: "Cart" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/orders", label: "Your orders" },
      { href: "/support", label: "Support" },
      { href: "/returns", label: "Returns" },
    ],
  },
  {
    title: "About",
    links: [
      { href: "/about", label: "About us" },
      { href: "/privacy", label: "Privacy" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-footer text-white/80 max-xs:pb-14">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 py-10 sm:grid-cols-2 md:grid-cols-[repeat(3,1fr)_1.6fr]">
        {columns.map(({ title, links }) => (
          <div key={title}>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white/50">{title}</h2>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="sm:col-span-2 md:col-span-1 md:border-l md:border-white/15 md:pl-10">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-white/50">Contact</h2>
          <p className="mt-4 text-sm font-semibold text-white">{siteConfig.companyName}</p>
          <p className="mt-2 text-sm">{siteConfig.description}</p>
          {siteConfig.supportEmail && (
            <a href={`mailto:${siteConfig.supportEmail}`} className="mt-3 inline-block text-sm text-white hover:underline">
              {siteConfig.supportEmail}
            </a>
          )}
        </div>
      </div>
      <div className="border-t border-white/15">
        <p className="mx-auto max-w-[1280px] px-4 py-4 text-xs text-white/60">
          © {new Date().getFullYear()} {siteConfig.companyName} All rights reserved.
        </p>
      </div>
    </footer>
  );
}
