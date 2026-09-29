/**
 * Y-Combinonsense brand configuration.
 * A marketplace for objects, ideas, and other questionable necessities.
 */
export const siteConfig = {
  /** Shown in the header, page titles and meta. */
  name: "Y-Combinonsense",
  /** Shown in the footer and official invoices. */
  companyName: "Y-Combinonsense Marketplace Corp.",
  tagline: "Things you didn't know you needed.",
  description:
    "A marketplace for objects, ideas, and other questionable necessities. Completely serious e-commerce for impossible products.",
  supportEmail: "inquiries@y-combinonsense.com",
  currency: "USD",
  locale: "en-US",
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Catalog" },
  { href: "/categories", label: "Categories" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/orders", label: "Orders" },
  { href: "/account", label: "Account" },
  { href: "/cart", label: "Cart" },
] as const;
