import type { Metadata } from "next";
import { InfoPage } from "@/components/site/info-page";

export const metadata: Metadata = { title: "Returns" };

export default function ReturnsPage() {
  return (
    <InfoPage
      title="Returns"
      intro="How cancellations and returns work."
      sections={[
        {
          heading: "Pending orders",
          body: "Cancel a pending order from its checkout page and your items are released immediately. Orders that are not paid for within ten minutes are cancelled automatically.",
        },
        {
          heading: "Placeholder",
          body: "This page is a stand-in for your returns policy: how long customers have, what can be returned and how refunds are paid. Replace it before launch.",
        },
      ]}
    />
  );
}
