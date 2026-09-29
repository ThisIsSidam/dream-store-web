import { CategoryNav } from "@/components/site/category-nav";
import { MobileNav } from "@/components/site/mobile-nav";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SiteHeader />
      <CategoryNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <MobileNav />
    </>
  );
}
