import type { Metadata } from "next";
import { InfoPage } from "@/components/site/info-page";

export const metadata: Metadata = { title: "Existential support" };

export default function SupportPage() {
  return (
    <InfoPage
      title="Existential Support"
      intro="Questions about an order, a bottle, or the nature of being? We're here for at least one of those."
      sections={[
        {
          heading: "Orders and payments",
          body: "Find every receipt under Account → Orders. Orders that are not paid for within ten minutes are cancelled and their items go back on the shelf.",
        },
        {
          heading: "Talk to a human (probably)",
          body: "Support hours are whenever the penguin is awake. Leave your question with your order number and we will find you - in this dimension or another.",
        },
        {
          heading: "Placeholder",
          body: "This page is a stand-in. Add your real support contact details before launch.",
        },
      ]}
    />
  );
}
