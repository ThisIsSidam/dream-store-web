import type { Metadata } from "next";
import { InfoPage } from "@/components/site/info-page";
import { LinkButton } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

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
