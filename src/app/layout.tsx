import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Work_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { siteConfig } from "@/config/site";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} - ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export const viewport: Viewport = {
  themeColor: "#fbf8ff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${jakarta.variable} ${workSans.variable}`}>
      <body className="flex min-h-dvh flex-col">
        {children}
        <Toaster position="bottom-center" offset={{ bottom: 88 }} mobileOffset={{ bottom: 96 }} closeButton />
      </body>
    </html>
  );
}
