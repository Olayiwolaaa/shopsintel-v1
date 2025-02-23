import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { FaReddit, FaGlobe } from "react-icons/fa";
import { SiDiscord } from "react-icons/si";
import CookieBanner from "@/components/CookieBanner";
import SellerAffiliateBanner from "@/components/SellerAffiliateBanner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Genzsearch",
  description:
    "Tiktok data",
  icons: {
    icon: [
      {
        url: "/favicon.icon",
        href: "/favicon.icon",
      }
    ]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-background text-foreground text-white`}
      >
        <header className="w-full">
          <SellerAffiliateBanner />
        </header>
        <main className="flex flex-col items-center justify-center min-h-screen pt-8">
          {children}
        </main>
        <CookieBanner />
        <footer className="border-t border-gray-800 py-4 text-center text-sm text-muted-foreground">
          <div className="flex justify-center items-center space-x-4 mb-2">
            <a
              href="https://www.reddit.com/r/TikTokshop/"
              target="_blank"
              className="hover:text-primary transition-colors"
            >
              <FaReddit className="h-6 w-6" />
            </a>
            <a
              href="https://discord.gg/PqGBpXDUxc"
              target="_blank"
              className="hover:text-primary transition-colors"
            >
              <SiDiscord className="h-6 w-6" />
            </a>
            <a
              href="https://viralcntrl.com/"
              target="_blank"
              className="hover:text-primary transition-colors"
            >
              <FaGlobe className="h-6 w-6" />
            </a>
          </div>
          <div>Powered by Viralcntrl.</div>
        </footer>
      </body>
    </html>
  );
}
