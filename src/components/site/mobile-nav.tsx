"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CartBadge } from "./cart-badge";
import { navItems } from "./nav-config";
import { cn } from "@/lib/utils";

/** Bottom tab bar, shown below the 620px breakpoint (like the Flutter NavigationBar). */
export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-outline-variant/40 bg-surface pb-[env(safe-area-inset-bottom)] xs:hidden"
    >
      <ul className="grid h-[72px] grid-cols-4">
        {navItems.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className="flex h-full flex-col items-center justify-center gap-1"
              >
                <span
                  className={cn(
                    "relative grid h-8 w-16 place-items-center rounded-full transition-colors",
                    active ? "bg-primary-container/36 text-on-surface" : "text-on-surface-variant",
                  )}
                >
                  <Icon className="size-6" aria-hidden />
                  {href === "/cart" && <CartBadge className="right-2.5 top-0" />}
                </span>
                <span className={cn("text-xs", active ? "font-bold text-on-surface" : "text-on-surface-variant")}>
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
