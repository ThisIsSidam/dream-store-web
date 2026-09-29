import type { Metadata } from "next";
import { InfoPage } from "@/components/site/info-page";

export const metadata: Metadata = { title: "Impossible returns" };

export default function ReturnsPage() {
  return (
    <InfoPage
      title="Impossible Returns"
      intro="Changed your mind? Reality is flexible. Our return policy, less so."
      sections={[
        {
          heading: "Feelings",
          body: "Feelings are non-returnable once felt. If you experience a feeling other than the one purchased, contact Void Support and we will happily investigate.",
        },
        {
          heading: "Pending orders",
          body: "Cancel a pending order from its checkout page and your items are released immediately. Orders that are not paid for within ten minutes are cancelled automatically.",
        },
        {
          heading: "Broken bottles",
          body: "Please vacate the room immediately, then get in touch. The concentrated absurdity may cause temporary spontaneous accordion-playing.",
        },
        {
          heading: "Placeholder",
          body: "This page is a stand-in. Replace it with your real returns policy before launch.",
        },
      ]}
    />
  );
}
