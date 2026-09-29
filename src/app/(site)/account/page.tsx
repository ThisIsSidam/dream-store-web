import { AccountDashboard } from "@/components/site/account-dashboard";
import { PageShell } from "@/components/site/page-shell";
import { getSession } from "@/lib/auth/session";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Account",
  description: "Account overview and questionable marketplace activity.",
};

export default async function AccountPage() {
  const user = await getSession().catch(() => null);

  return (
    <PageShell>
      <AccountDashboard
        userName={user?.name || "Arthur Dent"}
        userEmail={user?.email || "arthur@questionable.market"}
      />
    </PageShell>
  );
}
