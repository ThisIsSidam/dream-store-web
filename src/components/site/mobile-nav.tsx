"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CartBadge } from "./cart-badge";
import { navItems } from "./nav-config";
import { cn } from "@/lib/utils";

/** Bottom tab bar, shown below the 620px breakpoint. */
export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-outline-variant/60 bg-white pb-[env(safe-area-inset-bottom)] xs:hidden"
    >
      <ul className="grid h-14 grid-cols-4">
        {navItems.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-0.5",
                  active ? "text-primary" : "text-on-surface-variant",
                )}
              >
                <span className="relative">
                  <Icon className="size-6" aria-hidden />
                  {href === "/cart" && <CartBadge className="-right-2 -top-1.5" />}
                </span>
                <span className={cn("text-[11px]", active && "font-bold")}>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
