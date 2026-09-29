import { Heart, Home, LayoutGrid, Search, User } from "lucide-react";

export const navItems = [
  { href: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
  {
    href: "/categories",
    label: "Categories",
    icon: LayoutGrid,
    match: (p: string) =>
      p.startsWith("/categories") || p.startsWith("/products"),
  },
  {
    href: "/search",
    label: "Search",
    icon: Search,
    match: (p: string) => p.startsWith("/search"),
  },
  {
    href: "/wishlist",
    label: "Wishlist",
    icon: Heart,
    match: (p: string) => p.startsWith("/wishlist"),
  },
  {
    href: "/account",
    label: "Account",
    icon: User,
    match: (p: string) => p.startsWith("/account") || p.startsWith("/orders"),
  },
] as const;
