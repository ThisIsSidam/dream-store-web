"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, Home, LogOut, ShoppingBag, ShoppingCart, Sparkles, Users, LayoutDashboard, ExternalLink } from "lucide-react";
import { signOut } from "@/app/actions/auth";
import { siteConfig } from "@/config/site";
import type { User } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true, title: "Dashboard" },
  { href: "/admin/products", label: "Products", icon: Box, title: "Product Management" },
  { href: "/admin/users", label: "Users", icon: Users, title: "User Management" },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag, title: "Order Management" },
  { href: "/admin/carts", label: "Carts", icon: ShoppingCart, title: "Active Carts" },
  { href: "/admin/home", label: "Home page", icon: Home, title: "Home Management" },
] as const;

function isActive(pathname: string, item: (typeof nav)[number]) {
  return "exact" in item && item.exact ? pathname === item.href : pathname.startsWith(item.href);
}

export function AdminShell({ user, children }: { user: User; children: React.ReactNode }) {
  const pathname = usePathname();
  const current = nav.find((item) => isActive(pathname, item));

  return (
    <div className="min-h-dvh bg-surface-container-low lg:flex">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-outline-variant/40 bg-surface-container-lowest lg:flex lg:h-dvh lg:sticky lg:top-0">
        <div className="p-6">
          <Link href="/admin" className="flex items-center gap-2 font-display text-2xl font-bold text-primary">
            <Sparkles className="size-6" aria-hidden /> {siteConfig.name}
          </Link>
          <p className="t-caption mt-1 uppercase tracking-widest text-on-surface-variant">Dashboard</p>
        </div>

        <nav aria-label="Dashboard" className="flex-1 space-y-1 px-4">
          {nav.map((item) => {
            const active = isActive(pathname, item);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-on-surface-variant hover:bg-surface-container-high",
                )}
              >
                <item.icon className="size-5" aria-hidden />
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-on-surface-variant hover:bg-surface-container-high"
          >
            <ExternalLink className="size-5" aria-hidden />
            View store
          </Link>
        </nav>

        <div className="border-t border-outline-variant/40 p-4">
          <div className="mb-4 flex items-center gap-3 p-2">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 font-bold text-primary">
              {user.name[0]?.toUpperCase() ?? "A"}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-on-surface-variant">{user.email}</p>
            </div>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-error/10 px-4 py-2 text-sm font-medium text-error transition-colors hover:bg-error/15"
            >
              <LogOut className="size-4" aria-hidden /> Logout
            </button>
          </form>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 border-b border-outline-variant/40 bg-surface-container-lowest">
          <div className="flex h-16 items-center px-4 sm:px-8">
            <h2 className="text-lg font-semibold">{current?.title ?? "Dashboard"}</h2>
          </div>
          <nav
            aria-label="Dashboard"
            className="scrollbar-none flex gap-1 overflow-x-auto border-t border-outline-variant/30 px-3 py-2 lg:hidden"
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(pathname, item) ? "page" : undefined}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium",
                  isActive(pathname, item) ? "bg-primary/10 text-primary" : "text-on-surface-variant",
                )}
              >
                <item.icon className="size-4" aria-hidden /> {item.label}
              </Link>
            ))}
            <Link href="/" className="flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium text-on-surface-variant">
              <ExternalLink className="size-4" aria-hidden /> Store
            </Link>
          </nav>
        </header>
        <main className="p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
