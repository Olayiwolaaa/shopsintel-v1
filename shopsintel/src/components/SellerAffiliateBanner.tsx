"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function SellerAffiliateBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 inset-x-0 bg-white dark:bg-gray-800 shadow-md py-3 px-6 flex items-center justify-between z-50">
      <div className="flex-1 pr-4">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          🎉 Join the largest TikTok Shop seller and affiliate platform{" "}
          <a
            href="https://selleraffiliate.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-semibold text-blue-600 dark:text-blue-400"
          >
            Seller Affiliate
          </a>
        </p>
      </div>
      <div className="flex space-x-4">
        <Button onClick={() => setIsVisible(false)} variant="outline">
          Dismiss
        </Button>
      </div>
    </div>
  );
}
