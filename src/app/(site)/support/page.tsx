import type { Metadata } from "next";
import { InfoPage } from "@/components/site/info-page";
import { LinkButton } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Help & support" };

export default function SupportPage() {
  return (
    <InfoPage
      title="Help & support"
      intro="Questions about an order or a product? Start here."
      sections={[
        {
          heading: "Orders and payments",
          body: "Find all your orders under Account → Orders. Orders that are not paid for within ten minutes are cancelled and their items go back on the shelf.",
        },
        {
          heading: "Contact us",
          body: "Include your order number so we can find your order quickly.",
        },
        ...(siteConfig.supportEmail
          ? []
          : [
              {
                heading: "Placeholder",
                body: "This page is a stand-in. Set supportEmail in src/config/site.ts to show real contact details.",
              },
            ]),
      ]}
    >
      {siteConfig.supportEmail && (
        <div>
          <LinkButton href={`mailto:${siteConfig.supportEmail}`} size="xl">
            Email {siteConfig.supportEmail}
          </LinkButton>
        </div>
      )}
    </InfoPage>
  );
}
