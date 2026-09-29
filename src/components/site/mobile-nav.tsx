"use client";

import { useStore } from "@/lib/client/store";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "./nav-config";

export function MobileNav() {
  const pathname = usePathname();
  const { wishlist } = useStore();
  const wishCount = wishlist.length;

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)] sm:hidden shadow-lg"
    >
      <ul className="grid h-14 grid-cols-5">
        {navItems.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname);
          const isWishlist = href === "/wishlist";

          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-0.5 transition-colors",
                  active
                    ? "text-indigo-600 font-bold"
                    : "text-neutral-500 hover:text-neutral-900",
                )}
              >
                <span className="relative">
                  <Icon className="size-5" aria-hidden />
                  {isWishlist && wishCount > 0 && (
                    <span className="absolute -top-1 -right-2 grid min-h-3.5 min-w-3.5 place-items-center rounded-full bg-neutral-900 px-1 text-[9px] font-bold text-white">
                      {wishCount}
                    </span>
                  )}
                </span>
                <span className="text-[10px] tracking-tight">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
