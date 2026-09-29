import type { Metadata } from "next";
import { InfoPage } from "@/components/site/info-page";

export const metadata: Metadata = { title: "Privacy policy" };

export default function PrivacyPage() {
  return (
    <InfoPage
      title="Privacy policy"
      intro="What we collect and why."
      sections={[
        {
          heading: "What we keep",
          body: "Your name, email address and order history, so that you can sign in and see your orders. Passwords are stored hashed, never in plain text.",
        },
        {
          heading: "Your cart",
          body: "If you shop without an account, a random identifier in a cookie keeps your cart between visits. Sign up and the cart comes with you.",
        },
        {
          heading: "Cookies",
          body: "Signing in sets one session cookie, which the site can read but your browser scripts cannot, and it expires after seven days. Shopping as a guest sets one random identifier that lasts a year. We use no advertising or analytics cookies.",
        },
        {
          heading: "Newsletter",
          body: "If you subscribe, we store your email address and the date, and nothing else. You can ask us to remove it at any time.",
        },
        {
          heading: "Images",
          body: "Images are loaded from third-party hosts (Cloudinary and Google), so your browser contacts them to display the page.",
        },
        {
          heading: "Placeholder",
          body: "This page describes what the site does today. It is not a legal policy: add retention periods, your legal entity, how to exercise data rights and any payment provider once you have chosen one.",
        },
      ]}
    />
  );
}
