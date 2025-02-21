"use client";

import { useEffect, useState } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import CookieBanner from "@/components/CookieBanner"; // Import the banner component
import PostHogPageView from "./PostHogPageView";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [consentGiven, setConsentGiven] = useState<boolean | null>(null);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");

    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      autocapture: false, // Disable tracking until consent is given
      capture_pageview: false, // We will handle this manually
      loaded: (ph) => {
        if (consent === "true") {
          ph.opt_in_capturing();
          setConsentGiven(true);
        } else {
          ph.opt_out_capturing();
          setConsentGiven(false);
        }
      },
    });
  }, []);

  const handleConsent = (accepted: boolean) => {
    if (accepted) {
      posthog.opt_in_capturing();
      localStorage.setItem("cookie_consent", "true");
      setConsentGiven(true);
    } else {
      posthog.opt_out_capturing();
      localStorage.setItem("cookie_consent", "false");
      setConsentGiven(false);
    }
  };

  return (
    <PHProvider client={posthog}>
      {/* {consentGiven === null && <CookieBanner onConsent={handleConsent} />} */}
      <PostHogPageView />
      {children}
    </PHProvider>
  );
}
