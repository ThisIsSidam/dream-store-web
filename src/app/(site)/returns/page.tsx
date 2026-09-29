import { InfoPage } from "@/components/site/info-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns Policy",
  description:
    "Official 30-Day Question Period and Return Protocols for Y-Combinonsense.",
};

export default function ReturnsPage() {
  return (
    <InfoPage
      title="Returns Policy"
      intro="Our straightforward, 30-day policy for questionable merchandise."
      sections={[
        {
          heading: "The 30-Day Question Period",
          body: "If an item turns out to be more normal than expected upon arrival, you have 30 calendar days to initiate a return. Products must be returned in their original, bewildered packaging with all unnecessary certificates and documentation intact.",
        },
        {
          heading: "Irreversible Goods & Exceptions",
          body: "Certain products cannot be refunded due to fundamental physics. Extra Tuesdays that have already been lived cannot be re-inserted into the Gregorian timeline. Micro-singularities cannot be accepted if the event horizon has breached containment. Premium Nothing must test at zero moles of gas upon intake inspection.",
        },
        {
          heading: "Emotional Support Bricks",
          body: "Bricks may be returned within 30 days, although our return rate is less than 0.14% because customers report feeling profound guilt when attempting to put the brick back in a cardboard box.",
        },
        {
          heading: "Refund Processing",
          body: "Once our logistics depot verifies that your returned item has not developed unexpected sentience, your original payment method will be credited within 3–5 business days.",
        },
      ]}
    />
  );
}
