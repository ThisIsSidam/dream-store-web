import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/site/auth-shell";
import { SignInForm } from "@/components/site/auth-forms";
import { SignInHero } from "@/components/site/auth-heroes";
import { getSession } from "@/lib/auth/session";
import { safeNext } from "@/lib/utils";

export const metadata: Metadata = { title: "Sign in" };

export default async function SignInPage({ searchParams }: PageProps<"/signin">) {
  const sp = await searchParams;
  const next = typeof sp.next === "string" ? safeNext(sp.next, "") : "";

  // Already signed in? Skip the form.
  if (await getSession()) redirect(next || "/account");

  return <AuthShell hero={<SignInHero />} form={<SignInForm next={next || undefined} />} />;
}
