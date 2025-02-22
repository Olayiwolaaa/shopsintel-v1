"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { usePostHog } from "posthog-js/react";
import { useAuth, useUser } from "@clerk/nextjs"

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (!posthog || !posthog.__loaded) return; // Ensure PostHog is ready

    let url = window.origin + pathname;
    if (searchParams.toString()) {
      url = `${url}?${searchParams.toString()}`;
    }

    posthog.capture("$pageview", { $current_url: url });

    return () => {
      posthog.capture("$pageleave", { $current_url: url });
    };
  }, [pathname, searchParams, posthog]);

  useEffect(() => {
    const { isSignedIn, user } = useUser(); // Call useUser() outside useEffect

    if (!posthog) return; // Ensure posthog is initialized

    if (isSignedIn && user && !posthog.has_opted_out_capturing()) {
      posthog.identify(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
        username: user.username,
      });
    } else if (!isSignedIn && posthog.has_opted_out_capturing()) {
      posthog.reset();
    }
  }, [isSignedIn, userId, user, posthog]); // Correct dependency array

  return null;
}

export default function SuspendedPostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  );
}
