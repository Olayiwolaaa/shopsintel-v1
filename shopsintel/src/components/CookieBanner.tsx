"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });
  const [isManaging, setIsManaging] = useState(false);

  useEffect(() => {
    const hasConsent = localStorage.getItem("cookie-consent");
    if (!hasConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    setPreferences({
      necessary: true,
      analytics: true,
      marketing: true,
    });
    localStorage.setItem(
      "cookie-consent",
      JSON.stringify({
        necessary: true,
        analytics: true,
        marketing: true,
      })
    );
    setIsVisible(false);
  };

  const handleRejectNonEssential = () => {
    setPreferences({
      necessary: true,
      analytics: false,
      marketing: false,
    });
    localStorage.setItem(
      "cookie-consent",
      JSON.stringify({
        necessary: true,
        analytics: false,
        marketing: false,
      })
    );
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem("cookie-consent", JSON.stringify(preferences));
    setIsVisible(false);
  };

  const togglePreference = (key: keyof typeof preferences) => {
    if (key !== "necessary") {
      setPreferences((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-xl mx-auto">
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Cookie Preferences</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsVisible(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            {!isManaging
              ? "We use cookies to enhance your browsing experience and analyze site traffic."
              : "Customize your cookie preferences"}
          </CardDescription>
        </CardHeader>

        {!isManaging ? (
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsManaging(true)}>
              Manage Preferences
            </Button>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={handleRejectNonEssential}>
                Reject Non-Essential
              </Button>
              <Button onClick={handleAcceptAll}>Accept All</Button>
            </div>
          </CardFooter>
        ) : (
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium">Necessary Cookies</h3>
                  <p className="text-xs text-muted-foreground">
                    Always enabled. These are essential for the website to
                    function properly.
                  </p>
                </div>
                <Switch
                  checked={preferences.necessary}
                  onCheckedChange={() => {}}
                  disabled
                />
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium">Analytics Cookies</h3>
                  <p className="text-xs text-muted-foreground">
                    Help us understand how users interact with our website.
                  </p>
                </div>
                <Switch
                  checked={preferences.analytics}
                  onCheckedChange={() => togglePreference("analytics")}
                />
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium">Marketing Cookies</h3>
                  <p className="text-xs text-muted-foreground">
                    Used to track visitors across websites to provide more
                    relevant ads.
                  </p>
                </div>
                <Switch
                  checked={preferences.marketing}
                  onCheckedChange={() => togglePreference("marketing")}
                />
              </div>
            </div>

            <CardFooter className="justify-between p-0 pt-4">
              <Button variant="outline" onClick={() => setIsManaging(false)}>
                Back
              </Button>
              <Button onClick={handleSavePreferences}>Save Preferences</Button>
            </CardFooter>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
