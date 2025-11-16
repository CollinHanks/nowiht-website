"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import PageLoader from "@/components/loading/PageLoader";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

/**
 * PageLoader Test Page
 * Route: /test-loader
 * 
 * Tests:
 * - 2 logo sequential animation (3 seconds)
 * - Dark mode support
 * - Smooth transitions
 * 
 * Protected by middleware password
 */
export default function PageLoaderTest() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check dark mode
    setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);

    // Simulate 3-second loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-20">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">
              Development Tool
            </p>
            <h1 className="text-4xl md:text-6xl font-light mb-6">
              PageLoader Test
            </h1>
            <div className="w-16 h-px bg-black dark:bg-white mx-auto mb-6" />
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Testing the loading animation with 2 logos sequential transition.
              Protected route accessible only with password.
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Features Card */}
            <div className="border border-gray-200 dark:border-gray-800 p-8">
              <h2 className="text-xl md:text-2xl font-light mb-6">
                Features
              </h2>
              <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-start gap-3">
                  <span className="text-black dark:text-white mt-0.5">01</span>
                  <p>Two logos sequential animation (1.2s each)</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-black dark:text-white mt-0.5">02</span>
                  <p>Automatic dark mode detection</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-black dark:text-white mt-0.5">03</span>
                  <p>Smooth fade-in/fade-out transitions</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-black dark:text-white mt-0.5">04</span>
                  <p>Color inversion based on theme</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-black dark:text-white mt-0.5">05</span>
                  <p>Password protected access</p>
                </div>
              </div>
            </div>

            {/* Current Status Card */}
            <div className="border border-gray-200 dark:border-gray-800 p-8">
              <h2 className="text-xl md:text-2xl font-light mb-6">
                Current Status
              </h2>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-500 mb-1">
                    Theme Detection
                  </p>
                  <p className="font-mono">
                    {isDarkMode ? "Dark Mode" : "Light Mode"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-500 mb-1">
                    Background Color
                  </p>
                  <p className="font-mono">
                    {isDarkMode ? "#000000 (Black)" : "#FFFFFF (White)"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-500 mb-1">
                    Logo Color
                  </p>
                  <p className="font-mono">
                    {isDarkMode ? "#FFFFFF (Inverted)" : "#000000 (Default)"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-500 mb-1">
                    Duration
                  </p>
                  <p className="font-mono">3000ms (3 seconds)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            {/* Reload Button */}
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-black dark:bg-white text-white dark:text-black text-sm tracking-[0.2em] uppercase hover:bg-black/90 dark:hover:bg-white/90 transition-all"
            >
              Test Again
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Check Mode Button */}
            <button
              onClick={() => {
                const mode = window.matchMedia("(prefers-color-scheme: dark)").matches
                  ? "Dark Mode"
                  : "Light Mode";
                alert(`Current Mode: ${mode}\n\nChange in: Windows Settings → Personalization → Colors`);
              }}
              className="flex items-center justify-center gap-3 px-8 py-4 border border-black dark:border-white text-black dark:text-white text-sm tracking-[0.2em] uppercase hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
            >
              Check Theme
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-16 border-t border-gray-200 dark:border-gray-800 pt-16">
            <h3 className="text-2xl font-light mb-8 text-center">
              How to Test Dark Mode
            </h3>
            <div className="max-w-2xl mx-auto space-y-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-start gap-3">
                <span className="text-black dark:text-white">01</span>
                <div>
                  <p className="text-black dark:text-white mb-2">
                    Open Windows Settings
                  </p>
                  <p>Press Win + I or search for "Settings"</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-black dark:text-white">02</span>
                <div>
                  <p className="text-black dark:text-white mb-2">
                    Go to Personalization
                  </p>
                  <p>Click on "Personalization" in the left sidebar</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-black dark:text-white">03</span>
                <div>
                  <p className="text-black dark:text-white mb-2">
                    Select Colors
                  </p>
                  <p>Choose "Dark" or "Light" mode, then reload this page</p>
                </div>
              </div>
            </div>
          </div>

          {/* Back Link */}
          <div className="text-center mt-16">
            <button
              onClick={() => router.push("/")}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors inline-flex items-center gap-2"
            >
              Back to Homepage
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}