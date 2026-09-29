import { connection } from "next/server";
import { BannerCarousel } from "@/components/site/home/banner-carousel";
import { CategoryStrip } from "@/components/site/home/category-strip";
import { HomeSection } from "@/components/site/home/home-section";
import { Newsletter } from "@/components/site/home/newsletter";
import { getBanners, getCategories, getSections } from "@/lib/api/catalog";

export default async function HomePage() {
  // Render per request; the catalogue calls below are still cached for 60s.
  await connection();
  const [banners, categories, sections] = await Promise.all([
    getBanners(),
    getCategories(),
    getSections(),
  ]);

  return (
    <>
      <CategoryStrip categories={categories} />
      <BannerCarousel banners={banners} />
      <div className="mx-auto mt-3 flex max-w-[1280px] flex-col gap-3 pb-6 sm:px-4">
        {sections.map((section) => (
          <HomeSection key={section._id} section={section} />
        ))}
      </div>
      <Newsletter />
    </>
  );
}
