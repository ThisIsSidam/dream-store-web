import { AccountDashboard } from "@/components/site/account-dashboard";
import { PageShell } from "@/components/site/page-shell";
import { getSession } from "@/lib/auth/session";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Your Account",
  description: "Account overview and marketplace activity.",
};

export default async function AccountPage() {
  const user = await getSession().catch(() => null);

  if (!user) {
    redirect("/signin?next=/account");
  }

  return (
    <PageShell>
      <AccountDashboard
        userName={user.name}
        userEmail={user.email}
        userRole={user.role}
      />
    </PageShell>
  );
}
