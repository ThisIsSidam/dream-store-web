import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { AccountMenu } from "./account-menu";
import { BrandLogo } from "./brand";
import { CartBadge } from "./cart-badge";
import { SearchBox } from "./search-box";

export async function SiteHeader() {
  const user = await getSession();

  return (
    <header className="sticky top-0 z-40 bg-primary shadow-soft">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-2.5 px-4 py-2.5 xs:flex-row xs:items-center xs:gap-6 md:gap-10">
        <BrandLogo tone="light" />
        <SearchBox className="min-w-0 xs:max-w-[560px] xs:flex-1" />
        <nav aria-label="Account and cart" className="hidden items-center gap-3 xs:ml-auto xs:flex md:gap-6">
          <AccountMenu user={user} />
          <Link
            href="/cart"
            className="relative flex h-9 items-center gap-2 rounded-sm px-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            <span className="relative">
              <ShoppingCart className="size-5" aria-hidden />
              <CartBadge className="-right-2.5 -top-2.5" />
            </span>
            Cart
          </Link>
        </nav>
      </div>
    </header>
  );
}
