// app/forgot-password/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Password reset requested for:", email);
    setIsSuccess(true);
    setIsLoading(false);
  };

  if (isSuccess) {
    return (
      <>
        <Header />

        <main className="min-h-screen bg-white">
          <div className="pt-32 pb-20 md:pt-40 md:pb-28">
            <div className="max-w-md mx-auto px-6 text-center">
              {/* Success Icon */}
              <div className="mb-8">
                <CheckCircle className="w-20 h-20 mx-auto text-green-600" />
              </div>

              {/* Success Message */}
              <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-4">
                Check Your Email
              </h1>
              <p className="text-base text-gray-600 tracking-wide mb-8 leading-relaxed">
                We've sent password reset instructions to <strong>{email}</strong>. Please check your inbox and follow the link to reset your password.
              </p>

              {/* Instructions */}
              <div className="bg-gray-50 p-6 rounded-lg mb-8 text-left">
                <h3 className="text-sm font-semibold mb-3">What to do next:</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-black mt-0.5">1.</span>
                    <span>Check your email inbox (and spam folder)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black mt-0.5">2.</span>
                    <span>Click the reset link in the email</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black mt-0.5">3.</span>
                    <span>Create your new password</span>
                  </li>
                </ul>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <Link
                  href="/login"
                  className="block w-full py-4 bg-black text-white text-sm font-medium tracking-widest hover:bg-gray-900 transition-colors"
                >
                  BACK TO LOGIN
                </Link>
                
                <button
                  onClick={() => setIsSuccess(false)}
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                >
                  Didn't receive the email? Try again
                </button>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white">
        <div className="pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="max-w-md mx-auto px-6">
            {/* Back Link */}
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to login</span>
            </Link>

            {/* Logo */}
            <div className="text-center mb-12">
              <Link href="/" className="inline-block">
                <Image
                  src="/images/logo-black.png"
                  alt="NOWIHT"
                  width={140}
                  height={42}
                  className="mx-auto mb-8"
                />
              </Link>
              <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-3">
                Forgot Password?
              </h1>
              <p className="text-sm text-gray-600 tracking-wide leading-relaxed">
                No worries! Enter your email address and we'll send you instructions to reset your password.
              </p>
            </div>

            {/* Reset Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 tracking-wide">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 text-sm tracking-wide focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-black text-white text-sm font-medium tracking-widest hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>SENDING...</span>
                ) : (
                  <>
                    <span>SEND RESET LINK</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Info Box */}
            <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-lg">
              <p className="text-sm text-blue-900 leading-relaxed">
                <strong>Note:</strong> The reset link will be valid for 1 hour. If you don't receive an email within a few minutes, please check your spam folder.
              </p>
            </div>

            {/* Help Section */}
            <div className="mt-8 pt-8 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600 mb-3">Still having trouble?</p>
              <Link
                href="/contact"
                className="text-sm text-black hover:text-gray-600 transition-colors underline"
              >
                Contact our support team
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}