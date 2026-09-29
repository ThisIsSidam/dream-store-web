import type { Metadata } from "next";
import { Alchemy } from "@/components/site/home/alchemy";
import { InfoPage } from "@/components/site/info-page";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Our process" };

export default function AboutPage() {
  return (
    <>
      <InfoPage
        title="Our Process"
        intro="How we capture feelings, bottle experiences, and ship them across the void."
        sections={[
          {
            heading: `Who is ${siteConfig.companyName}?`,
            body: "We package the unpackageable. Every product on this site is sourced from a very reputable corner of reality, certified by a penguin, and delivered to you with as little physics as possible.",
          },
          {
            id: "reality-loop",
            heading: "The Reality Loop",
            body: "You wish, we capture, we bottle, you own. Then, occasionally, you wish again. It is a closed loop and we are extremely proud of it.",
          },
        ]}
      />
      <Alchemy />
    </>
  );
}
