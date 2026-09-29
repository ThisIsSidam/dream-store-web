import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s · Dashboard" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  // Redirects to /signin when signed out, and away from /admin for non-admins.
  const user = await requireAdmin();
  return <AdminShell user={user}>{children}</AdminShell>;
}
