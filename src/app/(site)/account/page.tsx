import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, History, LayoutDashboard, LifeBuoy, LogOut, ShieldAlert, User, UserRound, type LucideIcon } from "lucide-react";
import { signOut } from "@/app/actions/auth";
import { PageShell } from "@/components/site/page-shell";
import { Button, LinkButton } from "@/components/ui/button";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Account" };

function AccountAction({
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
      className="flex items-center gap-4 rounded-[22px] border border-surface-container-highest bg-surface-container-lowest px-4 py-3.5 transition-colors hover:bg-surface-container-low"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary-container/55 text-secondary">
        <Icon className="size-5" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="t-label block">{title}</span>
        <span className="t-body-md block text-[13px] text-on-surface-variant">{subtitle}</span>
      </span>
      <ChevronRight className="size-5 text-on-surface-variant" aria-hidden />
    </Link>
  );
}

export default async function AccountPage({ searchParams }: PageProps<"/account">) {
  const [user, sp] = await Promise.all([getSession(), searchParams]);

  return (
    <PageShell title="Account" width="max-w-[960px]">
      {sp.denied === "admin" && (
        <p
          role="alert"
          className="t-body-md mb-6 flex items-center gap-3 rounded-2xl border border-error/25 bg-error/8 p-4 text-error"
        >
          <ShieldAlert className="size-5 shrink-0" aria-hidden />
          The dashboard is for admins only. Sign in with an admin account to continue.
        </p>
      )}

      <section className="flex items-center gap-5 rounded-[32px] border border-surface-container-highest bg-surface-container-low p-7">
        <span className="grid size-[68px] shrink-0 place-items-center rounded-full bg-primary-container text-on-primary-container">
          {user ? <UserRound className="size-9" aria-hidden /> : <User className="size-9" aria-hidden />}
        </span>
        <div className="min-w-0">
          <h2 className="t-headline-md !text-2xl break-words sm:!text-[2rem]">
            {user ? user.name : "Guest Reality"}
          </h2>
          <p className="t-body-md mt-1 break-words text-on-surface-variant">
            {user ? user.email : "Sign in to save orders and paradoxes."}
          </p>
        </div>
      </section>

      <nav aria-label="Account" className="mt-6 flex flex-col gap-3">
        <AccountAction
          href="/orders"
          icon={History}
          title="Orders"
          subtitle="Review previous manifestations"
        />
        <AccountAction
          href="/support"
          icon={LifeBuoy}
          title="Existential Support"
          subtitle="Talk to a human (probably)"
        />
        {user?.role === "admin" && (
          <AccountAction
            href="/admin"
            icon={LayoutDashboard}
            title="Admin dashboard"
            subtitle="Products, orders, users and the home page"
          />
        )}
      </nav>

      <div className="mt-6">
        {user ? (
          <form action={signOut}>
            <Button type="submit" variant="outline" className="w-full">
              <LogOut className="size-5" aria-hidden /> Logout
            </Button>
          </form>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <LinkButton href="/signin" size="lg">
              Sign In
            </LinkButton>
            <LinkButton href="/signup" variant="outline" size="lg">
              Create Account
            </LinkButton>
          </div>
        )}
      </div>
    </PageShell>
  );
}
