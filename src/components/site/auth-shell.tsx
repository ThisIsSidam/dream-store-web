import Link from "next/link";
import { siteConfig } from "@/config/site";
import { SiteFooter } from "./footer";

/** Two-column frame for /signin and /signup: hero on the left, form card on the right. */
export function AuthShell({ hero, form }: { hero: React.ReactNode; form: React.ReactNode }) {
  return (
    <>
      <div className="mx-auto w-full max-w-[1280px] px-6 pt-6">
        <Link href="/" className="t-headline-md !text-2xl font-extrabold text-primary">
          {siteConfig.companyName}
        </Link>
      </div>
      <main className="mx-auto mt-6 grid w-full max-w-[1280px] flex-1 items-center gap-10 px-6 pb-20 lg:grid-cols-[52fr_48fr]">
        {hero}
        {form}
      </main>
      <SiteFooter />
    </>
  );
}

export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[34px] border border-surface-container-highest/55 bg-surface/90 p-6 shadow-[0_22px_44px_color-mix(in_srgb,var(--color-primary)_12%,transparent)] sm:p-8">
      {children}
    </div>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="t-body-md mb-4 rounded-[20px] border border-error/25 bg-error/8 p-3.5 text-sm text-error">
      {message}
    </p>
  );
}
