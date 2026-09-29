import { SiteFooter } from "./footer";
import { SiteHeader } from "./header";
import { MobileNav } from "./mobile-nav";

/** Card with a red intro panel (md and up) and the form beside it, under the normal header. */
export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 sm:px-4 sm:py-8">
        <div className="mx-auto grid max-w-[820px] bg-white shadow-float md:grid-cols-[2fr_3fr]">
          <aside className="hidden flex-col bg-primary p-10 text-white md:flex">
            <p className="font-display text-3xl font-bold">{title}</p>
            <p className="mt-4 text-lg text-white/80">{subtitle}</p>
          </aside>
          <div className="p-6 pb-24 sm:p-10">{children}</div>
        </div>
      </main>
      <SiteFooter />
      <MobileNav />
    </>
  );
}
