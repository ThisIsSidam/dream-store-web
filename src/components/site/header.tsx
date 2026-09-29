"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "./brand";
import { CartBadge } from "./cart-badge";
import { navItems } from "./nav-config";
import { SearchBox } from "./search-box";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-surface/86 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-2.5 px-6 py-2.5 xs:flex-row xs:items-center xs:gap-7">
        <BrandLogo />
        <SearchBox className="min-w-0 xs:max-w-[540px] xs:flex-1" />
        <nav aria-label="Main" className="hidden items-center gap-2 xs:ml-auto xs:flex">
          {navItems.map(({ href, label, icon: Icon, match }) => {
            const active = match(pathname);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "t-label relative flex items-center gap-2 rounded-full px-3.5 py-3 text-[13px] transition-colors",
                  active
                    ? "bg-primary-container/22 text-primary"
                    : "text-on-surface-variant hover:bg-surface-container-high",
                )}
              >
                <span className="relative">
                  <Icon className="size-5" aria-hidden />
                  {href === "/cart" && <CartBadge className="-right-2.5 -top-2.5" />}
                </span>
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
