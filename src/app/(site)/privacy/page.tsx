import { InfoPage } from "@/components/site/info-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Official Privacy Policy of Y-Combinonsense Marketplace Corp.",
};

export default function PrivacyPage() {
  return (
    <InfoPage
      title="Privacy Policy"
      intro="How we collect, store, and conspicuously ignore your personal data."
      sections={[
        {
          heading: "Information We Collect",
          body: "We collect only what is strictly necessary to route packages to your physical doorstep: name, shipping address, telephone number, and payment verification tokens. We do not track what you do with the Portable Hole after it leaves our possession.",
        },
        {
          heading: "Use of Cookies",
          body: "We use lightweight session cookies to ensure your cart survives between browser tabs. We do not use third-party behavioral trackers or psychological profiling algorithms.",
        },
        {
          heading: "Third-Party Logistics Sharing",
          body: "Your address is shared with our contracted freight carriers. Delivery couriers are legally bound to deliver the sealed box without opening it, smelling it, or asking philosophical questions about its weight.",
        },
        {
          heading: "Your Data Rights",
          body: "You have the right to request full erasure of your account and order history at any time. However, artifacts already delivered cannot be un-owned through digital database manipulation.",
        },
      ]}
    />
  );
}
