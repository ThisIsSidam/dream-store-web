import type { Metadata, Viewport } from "next";
// Modern sans-serif system font stack ensures zero network dependency and instant loading

import { siteConfig } from "@/config/site";
import { getSession } from "@/lib/auth/session";
import { StoreProvider } from "@/lib/client/store";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} - ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Memoised per request, so pages that also ask for the session share this call.
  const session = await getSession();

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="flex min-h-dvh flex-col bg-surface text-on-surface antialiased">
        <StoreProvider signedIn={Boolean(session)}>
          {children}
          <Toaster
            position="bottom-center"
            offset={{ bottom: 88 }}
            mobileOffset={{ bottom: 96 }}
            closeButton
          />
        </StoreProvider>
      </body>
    </html>
  );
}
