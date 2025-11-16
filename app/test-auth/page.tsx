"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

/**
 * Test Authentication Page - NOWIHT Luxury Design
 * Route: /test-auth
 * 
 * Password protection for test pages
 * Clean, minimal, professional design
 */
export default function TestAuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Set cookie and redirect
      document.cookie = `test-auth=${password}; path=/; max-age=86400`; // 24 hours

      // Small delay for cookie to set
      setTimeout(() => {
        router.push(redirect);
        router.refresh();
      }, 100);
    } catch (err) {
      setError("Authentication failed");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-black">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <Image
              src="/images/nowiht-logo-black-amblem.png"
              alt="NOWIHT"
              width={120}
              height={120}
              className="mx-auto dark:invert"
              priority
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-light tracking-[0.3em] uppercase mb-3">
            NOWIHT
          </h1>
          <div className="w-16 h-px bg-black dark:bg-white mx-auto mb-4" />
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-500">
            Development Access
          </p>
        </div>

        {/* Form Container */}
        <div className="border border-gray-200 dark:border-gray-800">
          <div className="p-8 md:p-12">
            <h2 className="text-lg md:text-xl font-light mb-2 text-center">
              Test Area Access
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-10 text-center">
              Enter password to continue
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs uppercase tracking-[0.2em] mb-3 text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-black dark:text-white text-sm focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  placeholder="Enter password"
                  required
                  autoFocus
                />
              </div>

              {error && (
                <div className="p-4 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20">
                  <p className="text-xs text-red-600 dark:text-red-400 text-center">
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-black dark:bg-white text-white dark:text-black text-xs tracking-[0.2em] uppercase hover:bg-black/90 dark:hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Authenticating..." : "Access"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Footer Info - Minimal */}
          <div className="border-t border-gray-200 dark:border-gray-800 px-8 md:px-12 py-6 bg-gray-50 dark:bg-gray-950/20">
            <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
              Protected development environment
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.push("/")}
            className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors"
          >
            Back to Homepage
          </button>
        </div>
      </div>
    </main>
  );
}