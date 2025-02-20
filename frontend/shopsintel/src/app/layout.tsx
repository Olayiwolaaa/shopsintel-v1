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

interface RootLayoutProps {
  children: React.ReactNode;
  page: number; // Add page prop to determine which page we're on
}

export default function RootLayout({ children, page }: RootLayoutProps) {

  if (page >=3){
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
        </body>
      </html>
    </ClerkProvider>
  }
  else{
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-background text-foreground text-white`}
      >
        {children}
      </body>
    </html>;
  }
}