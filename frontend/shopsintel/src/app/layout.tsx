"use client";
import type React from "react";
import { useState } from "react";
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
import Pagination from "./components/Pagination"; // Adjust path as needed

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
  const [currentPage, setCurrentPage] = useState(1);

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

            {currentPage < 3 ? (
              children
            ) : (
              <>
                <SignedOut>
                  <SignIn routing="hash" />
                </SignedOut>
                <SignedIn>{children}</SignedIn>
              </>
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={currentPage + 9}
              onPageChange={setCurrentPage}
            />
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
