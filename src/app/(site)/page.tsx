import { connection } from "next/server";
import { Alchemy } from "@/components/site/home/alchemy";
import { BannerCarousel } from "@/components/site/home/banner-carousel";
import { CategoryStrip } from "@/components/site/home/category-strip";
import { Faq } from "@/components/site/home/faq";
import { Hero } from "@/components/site/home/hero";
import { HomeSection } from "@/components/site/home/home-section";
import { Newsletter } from "@/components/site/home/newsletter";
import { Testimonials } from "@/components/site/home/testimonials";
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
      <Hero />
      <BannerCarousel banners={banners} />
      <CategoryStrip categories={categories} />
      {sections.map((section, index) => (
        <HomeSection key={section._id} section={section} index={index} />
      ))}
      <Alchemy />
      <Testimonials />
      <Faq />
      <Newsletter />
    </>
  );
}
