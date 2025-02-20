import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {
  ClerkProvider,
  SignIn,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shopsintel",
  description:
    "Find trending products, live creators and your competitors shops",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body
          className={`${inter.className} bg-background text-foreground text-white`}
        >
          <main className="flex flex-col items-center justify-center min-h-screen pt-8">
            <header className="mb-4">
              <SignedIn>
                <UserButton showName />
              </SignedIn>
            </header>
            <SignedOut>
              <SignIn routing="hash" />
            </SignedOut>
            <SignedIn>{children}</SignedIn>
          </main>
          <footer className="border-t border-gray-800 py-4 text-center text-sm text-muted-foreground">
            © 2025 ViralCntrl. All rights reserved.
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}