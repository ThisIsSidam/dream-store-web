import type { Metadata } from "next";
import { InfoPage } from "@/components/site/info-page";

export const metadata: Metadata = { title: "Privacy void" };

export default function PrivacyPage() {
  return (
    <InfoPage
      title="Privacy Void"
      intro="What happens in the void stays in the void. Mostly."
      sections={[
        {
          heading: "What we keep",
          body: "Your name, email address and order history, so that you can sign in and see your receipts. Passwords are stored hashed, never in plain text.",
        },
        {
          heading: "Your cart",
          body: "If you shop without an account, a random identifier in a cookie keeps your cart between visits. Sign up and the cart comes with you.",
        },
        {
          heading: "Placeholder",
          body: "This page is a stand-in. Replace it with your real privacy policy before launch.",
        },
      ]}
    />
  );
}
