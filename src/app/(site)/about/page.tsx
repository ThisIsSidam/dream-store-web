import type { Metadata } from "next";
import { InfoPage } from "@/components/site/info-page";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "About us" };

export default function AboutPage() {
  return (
    <InfoPage
      title="About us"
      intro={`${siteConfig.companyName} sells things you won't find anywhere else.`}
      sections={[
        {
          heading: `Who is ${siteConfig.companyName}?`,
          body: "We stock bottled experiences, certified feelings and other essentials for the discerning absurd-ist. Every product on this site is sourced from a very reputable corner of reality.",
        },
        {
          heading: "How ordering works",
          body: "Add what you like to your cart, check out, and pay within ten minutes. We hold your items for that long, then put them back on the shelf.",
        },
      ]}
    />
  );
}
