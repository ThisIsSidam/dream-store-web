import { InfoPage } from "@/components/site/info-page";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support & FAQs",
  description:
    "Official customer assistance and frequently questioned inquiries.",
};

export default function SupportPage() {
  return (
    <InfoPage
      title="Customer Support &amp; FAQs"
      intro="Answers to common questions regarding our catalog of questionable necessities."
      sections={[
        {
          heading: "Can I open the black hole inside my home?",
          body: "Yes, provided you do not introduce ferromagnetic keys, small pets, or existential regrets within 30 centimeters of the intake aperture. The containment field requires standard 110V/240V household current and should not be plugged into faulty extension cords.",
        },
        {
          heading: "What if my Extra Tuesday occurs on a Monday?",
          body: "This indicates minor calendar desynchronization. Please check your system timezone or verify that you did not live Tuesday twice without realizing it. If the issue persists, our temporal dispatch team will issue a 1-day chronological credit.",
        },
        {
          heading: "How do I care for my Emotional Support Brick?",
          body: "The brick requires very little. It does not need to be fed, watered, or walked. We recommend wiping it down with a dry cloth once a month and placing it in a prominent area where its steadfast density can be silently observed.",
        },
        {
          heading: "What if my Bottled Echo begins to hum at night?",
          body: "A faint harmonic resonance at 440Hz is normal during high atmospheric humidity. If the echo begins speaking in full grammatical sentences, please tighten the cork stopper and place the bottle inside an acoustic sleeve.",
        },
        {
          heading: "How do I contact human support?",
          body: `Our support team operates Monday through Friday (and on Extra Tuesdays) from 09:00 to 18:00 UTC. Inquiries can be directed to ${siteConfig.supportEmail || "support@y-combinonsense.com"}. We respond to all correspondence with complete seriousness.`,
        },
      ]}
    />
  );
}
