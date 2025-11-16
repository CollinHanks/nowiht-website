"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

/**
 * Cookie Consent Banner v3
 * 
 * Features:
 * - Compact design (smaller on all devices)
 * - Smart algorithm (6 months expiry, 30 days for rejected)
 * - Test button (development only)
 * - Auto re-prompt after expiry
 */

declare global {
  interface Window {
    gtag?: (
      command: 'consent' | 'config' | 'event' | 'set',
      targetOrAction: string,
      params?: {
        [key: string]: any;
        analytics_storage?: 'granted' | 'denied';
        ad_storage?: 'granted' | 'denied';
        ad_user_data?: 'granted' | 'denied';
        ad_personalization?: 'granted' | 'denied';
      }
    ) => void;
  }
}

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface CookieConsent {
  preferences: CookiePreferences;
  timestamp: string;
  expiryDate: string;
  action: 'accepted' | 'rejected' | 'customized';
}

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  // Development only: Show test button
  const isDevelopment = process.env.NODE_ENV === 'development';

  useEffect(() => {
    checkCookieConsent();
  }, []);

  const checkCookieConsent = () => {
    const consentData = localStorage.getItem("nowiht-cookie-consent");

    if (!consentData) {
      // First time visitor - show banner after 1 second
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }

    try {
      const consent: CookieConsent = JSON.parse(consentData);
      const now = new Date();
      const expiryDate = new Date(consent.expiryDate);

      // Check if consent has expired
      if (now >= expiryDate) {
        // Expired - show banner again
        localStorage.removeItem("nowiht-cookie-consent");
        setIsVisible(true);
      }
      // If not expired, banner stays hidden
    } catch (error) {
      // Invalid data - clear and show banner
      localStorage.removeItem("nowiht-cookie-consent");
      setIsVisible(true);
    }
  };

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    saveCookiePreferences(allAccepted, 'accepted');
  };

  const handleRejectAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    saveCookiePreferences(onlyNecessary, 'rejected');
  };

  const handleSavePreferences = () => {
    saveCookiePreferences(preferences, 'customized');
  };

  const saveCookiePreferences = (
    prefs: CookiePreferences,
    action: 'accepted' | 'rejected' | 'customized'
  ) => {
    const now = new Date();

    // Calculate expiry date based on action
    let expiryDate: Date;
    if (action === 'accepted' || action === 'customized') {
      // Accepted/Customized: 6 months (180 days)
      expiryDate = new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000);
    } else {
      // Rejected: 30 days (ask again sooner)
      expiryDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    }

    const consentData: CookieConsent = {
      preferences: prefs,
      timestamp: now.toISOString(),
      expiryDate: expiryDate.toISOString(),
      action: action,
    };

    localStorage.setItem("nowiht-cookie-consent", JSON.stringify(consentData));
    setIsVisible(false);

    // Enable/disable tracking
    if (prefs.analytics) {
      enableAnalytics();
    }
    if (prefs.marketing) {
      enableMarketing();
    }
  };

  const enableAnalytics = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
      });
    }
  };

  const enableMarketing = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
      });
    }
  };

  // Development only: Reset cookie consent for testing
  const handleResetConsent = () => {
    localStorage.removeItem("nowiht-cookie-consent");
    window.location.reload();
  };

  if (!isVisible) {
    // Show reset button in development mode (bottom-left corner)
    if (isDevelopment) {
      return (
        <button
          onClick={handleResetConsent}
          className="fixed bottom-4 left-4 z-[998] px-3 py-2 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
          title="Reset Cookie Consent (Dev Only)"
        >
          🍪 Reset
        </button>
      );
    }
    return null;
  }

  return (
    <>
      {/* Overlay (mobile only) */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] md:hidden"
        onClick={() => !showDetails && handleRejectAll()}
      />

      {/* Cookie Banner - Compact Size */}
      <div className="fixed bottom-0 left-0 right-0 md:bottom-4 md:left-auto md:right-4 md:max-w-sm z-[1000] animate-slide-up">
        <div className="bg-black border-t md:border-2 border-white/20 md:border-white/30 shadow-2xl md:rounded-lg overflow-hidden">
          <div className="p-4 md:p-6">
            {/* Close Button (Desktop) */}
            <button
              onClick={handleRejectAll}
              className="hidden md:block absolute top-3 right-3 text-white/60 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Logo - Smaller */}
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 md:w-14 md:h-14 relative">
                <Image
                  src="/logos/cookie-consent-logo.png"
                  alt="NOWIHT"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Title - Smaller */}
            <h3 className="text-base md:text-lg font-light text-white text-center mb-2">
              Cookie Preferences
            </h3>

            {/* Divider - Thinner */}
            <div className="w-8 h-px bg-white/30 mx-auto mb-4" />

            {/* Description - Shorter */}
            <p className="text-xs md:text-sm text-white/80 text-center mb-5 leading-relaxed">
              We use cookies to enhance your experience and analyze traffic.
            </p>

            {/* Cookie Details (Expandable) - Compact */}
            {showDetails && (
              <div className="space-y-3 mb-5 pb-5 border-b border-white/20">
                {/* Necessary */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium text-white mb-0.5">
                      Necessary
                    </p>
                    <p className="text-[10px] text-white/60">
                      Required. Cannot be disabled.
                    </p>
                  </div>
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-10 h-5 bg-white rounded-full relative">
                      <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-black rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Analytics */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium text-white mb-0.5">
                      Analytics
                    </p>
                    <p className="text-[10px] text-white/60">
                      Understand visitor interactions.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setPreferences((prev) => ({
                        ...prev,
                        analytics: !prev.analytics,
                      }))
                    }
                    className="flex-shrink-0 mt-0.5"
                  >
                    <div
                      className={`w-10 h-5 rounded-full relative transition-colors ${preferences.analytics ? "bg-white" : "bg-white/30"
                        }`}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${preferences.analytics
                            ? "right-0.5 bg-black"
                            : "left-0.5 bg-white/60"
                          }`}
                      />
                    </div>
                  </button>
                </div>

                {/* Marketing */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium text-white mb-0.5">
                      Marketing
                    </p>
                    <p className="text-[10px] text-white/60">
                      Personalized ads.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setPreferences((prev) => ({
                        ...prev,
                        marketing: !prev.marketing,
                      }))
                    }
                    className="flex-shrink-0 mt-0.5"
                  >
                    <div
                      className={`w-10 h-5 rounded-full relative transition-colors ${preferences.marketing ? "bg-white" : "bg-white/30"
                        }`}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${preferences.marketing
                            ? "right-0.5 bg-black"
                            : "left-0.5 bg-white/60"
                          }`}
                      />
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Actions - Compact */}
            <div className="space-y-2">
              {showDetails ? (
                <>
                  <button
                    onClick={handleSavePreferences}
                    className="w-full px-6 py-3 bg-white text-black text-xs tracking-[0.2em] uppercase hover:bg-white/90 transition-all font-medium"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="w-full px-6 py-3 border border-white/30 text-white text-xs tracking-[0.2em] uppercase hover:bg-white/10 transition-all font-medium"
                  >
                    Back
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleAcceptAll}
                    className="w-full px-6 py-3 bg-white text-black text-xs tracking-[0.2em] uppercase hover:bg-white/90 transition-all font-medium"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={() => setShowDetails(true)}
                    className="w-full px-6 py-3 border border-white/30 text-white text-xs tracking-[0.2em] uppercase hover:bg-white/10 transition-all font-medium"
                  >
                    Customize
                  </button>
                  <button
                    onClick={handleRejectAll}
                    className="w-full text-xs text-white/60 hover:text-white transition-colors font-medium"
                  >
                    Reject All
                  </button>
                </>
              )}
            </div>

            {/* Privacy Links - Compact */}
            <div className="mt-5 pt-4 border-t border-white/20">
              <p className="text-[10px] text-white/60 text-center leading-relaxed">
                <Link
                  href="/privacy-policy"
                  className="text-white underline hover:text-white/80 transition-colors"
                >
                  Privacy
                </Link>
                {" · "}
                <Link
                  href="/cookie-policy"
                  className="text-white underline hover:text-white/80 transition-colors"
                >
                  Cookies
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}