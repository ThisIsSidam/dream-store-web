import { getSession } from "@/lib/auth/session";
import { AccountMenu } from "./account-menu";
import { BrandLogo } from "./brand";
import { HeaderNavItems } from "./header-nav-items";
import { SearchBox } from "./search-box";

export async function SiteHeader() {
  const user = await getSession();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200/80 shadow-xs">
      {/* Micro ticker / catalog status bar */}
      <div className="border-b border-neutral-100 bg-neutral-50 px-4 py-1 text-xs text-neutral-500">
        <div className="mx-auto flex max-w-[1360px] items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-neutral-600">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Catalog integrity: 97.4%
            </span>
            <span className="hidden md:inline text-neutral-300">|</span>
            <span className="hidden md:inline">
              6,842 questionable products listed
            </span>
            <span className="hidden lg:inline text-neutral-300">|</span>
            <span className="hidden lg:inline">
              Discreet, bewildered packaging
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-medium text-neutral-600">
              Free shipping on orders over $500
            </span>
          </div>
        </div>
      </div>

      {/* Main compact marketplace header */}
      <div className="mx-auto flex w-full max-w-[1360px] items-center gap-3 px-4 py-2.5 sm:gap-6">
        <BrandLogo tone="dark" />
        <div className="flex-1 max-w-2xl mx-auto">
          <SearchBox className="w-full" />
        </div>
        <nav
          aria-label="Account, wishlist, and cart"
          className="flex items-center gap-2 sm:gap-3"
        >
          <AccountMenu user={user} />
          <HeaderNavItems />
        </nav>
      </div>
    </header>
  );
}
