"use client"; // Required for client-side effects

import type React from "react";
import { useEffect, useState } from "react";
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
import posthog from "posthog-js";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shopsintel",
  description:
    "Find trending products, live creators and your competitors' shops",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    posthog.init("phc_k6Ktnu0aghWkkdqfK7CgUTVqaNTTpxefZrKmybm6Y9L", {
      api_host: "https://eu.i.posthog.com",
      autocapture: false, // Disable autocapture until consent is given
      loaded: (ph) => {
        if (consent !== "true") {
          ph.opt_out_capturing();
        }
      },
    });

    if (consent === null) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    posthog.opt_in_capturing();
    localStorage.setItem("cookie_consent", "true");
    setShowBanner(false);
  };

  const rejectCookies = () => {
    posthog.opt_out_capturing();
    localStorage.setItem("cookie_consent", "false");
    setShowBanner(false);
  };

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

          {/* Cookie Consent Banner */}
          {showBanner && (
            <div className="fixed bottom-4 left-4 right-4 bg-gray-900 text-white p-4 rounded-lg flex justify-between items-center shadow-lg">
              <p className="text-sm">
                We use cookies to improve your experience. Do you accept?
              </p>
              <div className="space-x-2">
                <button
                  onClick={acceptCookies}
                  className="bg-green-500 px-3 py-1 rounded"
                >
                  Accept
                </button>
                <button
                  onClick={rejectCookies}
                  className="bg-red-500 px-3 py-1 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          )}
        </body>
      </html>
    </ClerkProvider>
  );
}
