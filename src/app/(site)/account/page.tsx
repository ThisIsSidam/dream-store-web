import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, LayoutDashboard, LifeBuoy, LogOut, Package, ShieldAlert, type LucideIcon } from "lucide-react";
import { signOut } from "@/app/actions/auth";
import { PageShell } from "@/components/site/page-shell";
import { Button, LinkButton } from "@/components/ui/button";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Account" };

function AccountLink({
  href,
  icon: Icon,
  title,
  subtitle,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 border-b border-outline-variant/40 px-5 py-4 last:border-b-0 hover:bg-surface-container-low"
    >
      <Icon className="size-6 shrink-0 text-primary" aria-hidden />
      <span className="min-w-0 flex-1">
        <span className="block font-medium">{title}</span>
        <span className="block text-sm text-on-surface-variant">{subtitle}</span>
      </span>
      <ChevronRight className="size-5 text-on-surface-variant" aria-hidden />
    </Link>
  );
}

export default async function AccountPage({ searchParams }: PageProps<"/account">) {
  const [user, sp] = await Promise.all([getSession(), searchParams]);

  return (
    <PageShell width="max-w-3xl">
      {sp.denied === "admin" && (
        <p
          role="alert"
          className="mb-3 flex items-center gap-3 border border-error/30 bg-white p-4 text-sm text-error shadow-soft"
        >
          <ShieldAlert className="size-5 shrink-0" aria-hidden />
          The dashboard is for admins only. Sign in with an admin account to continue.
        </p>
      )}

      <section className="flex items-center gap-4 bg-white p-5 shadow-soft">
        <span className="grid size-14 shrink-0 place-items-center rounded-full bg-primary text-xl font-bold text-white">
          {user ? user.name[0]?.toUpperCase() : "?"}
        </span>
        <div className="min-w-0">
          <h1 className="break-words font-display text-lg font-bold">{user ? user.name : "Guest"}</h1>
          <p className="break-words text-sm text-on-surface-variant">
            {user ? user.email : "Sign in to see your orders and save your cart."}
          </p>
        </div>
      </section>

      <nav aria-label="Account" className="mt-3 bg-white shadow-soft">
        <AccountLink href="/orders" icon={Package} title="My orders" subtitle="Track, review and pay for orders" />
        <AccountLink href="/support" icon={LifeBuoy} title="Help & support" subtitle="Questions about an order?" />
        {user?.role === "admin" && (
          <AccountLink
            href="/admin"
            icon={LayoutDashboard}
            title="Admin dashboard"
            subtitle="Products, orders, users and the home page"
          />
        )}
      </nav>

      <div className="mt-3">
        {user ? (
          <form action={signOut}>
            <Button type="submit" variant="outline" size="lg" className="w-full">
              <LogOut className="size-5" aria-hidden /> Logout
            </Button>
          </form>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <LinkButton href="/signin" variant="buy" size="lg">
              Login
            </LinkButton>
            <LinkButton href="/signup" variant="outline" size="lg">
              Create account
            </LinkButton>
          </div>
        )}
      </div>
    </PageShell>
  );
}
