/**
 * Everything that names the brand lives here, so renaming the store
 * (Dream Store / Imagination Store / ...) is a one-file change.
 */
export const siteConfig = {
  /** Shown in the header, page titles and the admin sidebar. */
  name: "Dream Store",
  /** Shown in the footer and on the auth pages. */
  companyName: "Impossible Co.",
  tagline: "Own What Shouldn't Be Owned.",
  description:
    "Premium bottled experiences, certified feelings, and other essentials for the discerning absurd-ist.",
  /**
   * Where customers can reach you. Leave empty until you have one; the support
   * page shows a "stand-in" notice while this is unset.
   */
  supportEmail: "" as string,
  currency: "USD",
  locale: "en-US",
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/categories", label: "Categories" },
  { href: "/account", label: "Account" },
  { href: "/cart", label: "Cart" },
] as const;
