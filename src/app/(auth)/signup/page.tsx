import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/site/auth-shell";
import { SignUpForm } from "@/components/site/auth-forms";
import { SignUpHero } from "@/components/site/auth-heroes";
import { getSession } from "@/lib/auth/session";
import { safeNext } from "@/lib/utils";

export const metadata: Metadata = { title: "Create account" };

export default async function SignUpPage({ searchParams }: PageProps<"/signup">) {
  const sp = await searchParams;
  const next = typeof sp.next === "string" ? safeNext(sp.next, "") : "";

  if (await getSession()) redirect(next || "/account");

  return <AuthShell hero={<SignUpHero />} form={<SignUpForm next={next || undefined} />} />;
}
