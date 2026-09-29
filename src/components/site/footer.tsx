import Link from "next/link";
import { siteConfig } from "@/config/site";

const explore = [
  { href: "/about", label: "Our Process (How We Capture Feelings)" },
  { href: "/about#reality-loop", label: "The Reality Loop" },
  { href: "/returns", label: "Impossible Returns" },
];
const support = [
  { href: "/support", label: "Existential Support" },
  { href: "/privacy", label: "Privacy Void" },
];

function FooterLinks({ links }: { links: { href: string; label: string }[] }) {
  return (
    <ul className="flex flex-col gap-4">
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className="t-body-md text-on-secondary-container hover:underline">
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto rounded-t-[48px] bg-secondary-container px-8 py-20 shadow-[0_-10px_40px_color-mix(in_srgb,var(--color-secondary)_10%,transparent)] max-xs:pb-32">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-3 md:gap-16">
        <div>
          <p className="t-headline-lg text-secondary">{siteConfig.companyName}</p>
          <p className="t-body-md mt-6 text-on-secondary-container">
            Packaging the unpackageable since the beginning of time (and slightly before that).
          </p>
        </div>
        <div>
          <h2 className="t-label mb-6 uppercase text-secondary">Explore the Void</h2>
          <FooterLinks links={explore} />
        </div>
        <div>
          <h2 className="t-label mb-6 uppercase text-secondary">Support</h2>
          <FooterLinks links={support} />
          <p className="mt-8 text-sm text-on-secondary-container/60">
            © {new Date().getFullYear()} The Reality Loop. No physics were harmed.
          </p>
        </div>
      </div>
    </footer>
  );
}
