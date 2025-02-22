"use client";

import { useState, useEffect } from "react";
import posthog from "posthog-js";
import { Button } from "@/components/ui/button";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const consentGiven = localStorage.getItem("cookie_consent");
    if (consentGiven) {
      setIsVisible(false);
    }
  }, []);

  const handleAccept = () => {
    posthog.capture("cookie_consent", { consented: true });
    localStorage.setItem("cookie_consent", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 bg-white dark:bg-gray-800 shadow-md py-3 px-6 flex items-center justify-between">
      <div className="flex-1 pr-4">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          We use cookies to enhance your experience. By continuing to visit this
          site you agree to our use of cookies.
        </p>
      </div>
      <div className="flex space-x-4">
        <Button onClick={handleAccept} variant="default">
          Accept
        </Button>
      </div>
    </div>
  );
}
