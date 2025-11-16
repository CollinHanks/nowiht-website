// app/register/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!agreeToTerms) {
      setError("Please agree to the Terms & Conditions");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      console.log("📝 Registering user...");

      // Call registration API
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          subscribeNewsletter,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("❌ Registration error:", data.error);
        setError(data.error || "Registration failed");
        setIsLoading(false);
        return;
      }

      console.log("✅ Registration successful!");
      setSuccess(true);

      // Auto-login after 2 seconds
      setTimeout(async () => {
        console.log("🔐 Auto-login...");
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          loginType: "customer",
          redirect: false,
        });

        if (result?.ok) {
          router.push("/account");
          router.refresh();
        }
      }, 2000);
    } catch (error) {
      console.error("🚨 Registration exception:", error);
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  // Success screen
  if (success) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white flex items-center justify-center">
          <div className="max-w-md mx-auto px-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-light tracking-tight mb-3">
              Account Created!
            </h1>
            <p className="text-gray-600 mb-8">
              Welcome to NOWIHT. Redirecting to your account...
            </p>
            <div className="animate-pulse">
              <div className="h-1 w-48 bg-black mx-auto"></div>
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
                Create Account
              </h1>
              <p className="text-sm text-gray-600 tracking-wide">
                Join NOWIHT and enjoy exclusive benefits
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium mb-2 tracking-wide">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      required
                      disabled={isLoading}
                      className="w-full pl-12 pr-4 py-3.5 border border-gray-300 text-sm tracking-wide focus:outline-none focus:border-black transition-colors disabled:bg-gray-50"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium mb-2 tracking-wide">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-3.5 border border-gray-300 text-sm tracking-wide focus:outline-none focus:border-black transition-colors disabled:bg-gray-50"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 tracking-wide">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    disabled={isLoading}
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 text-sm tracking-wide focus:outline-none focus:border-black transition-colors disabled:bg-gray-50"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2 tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimum 8 characters"
                    required
                    minLength={8}
                    disabled={isLoading}
                    className="w-full pl-12 pr-12 py-3.5 border border-gray-300 text-sm tracking-wide focus:outline-none focus:border-black transition-colors disabled:bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 tracking-wide">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    required
                    disabled={isLoading}
                    className="w-full pl-12 pr-12 py-3.5 border border-gray-300 text-sm tracking-wide focus:outline-none focus:border-black transition-colors disabled:bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="text-xs text-gray-600 space-y-1 bg-gray-50 p-4 rounded">
                <p className="font-medium mb-2">Password must contain:</p>
                <ul className="space-y-1 ml-4">
                  <li>• At least 8 characters</li>
                  <li>• At least one uppercase letter (recommended)</li>
                  <li>• At least one number (recommended)</li>
                </ul>
              </div>

              {/* Terms Agreement */}
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    required
                    disabled={isLoading}
                    className="w-4 h-4 mt-0.5 border-gray-300 rounded text-black focus:ring-black"
                  />
                  <span className="text-sm text-gray-700 tracking-wide">
                    I agree to the{" "}
                    <Link href="/terms" className="text-black hover:text-gray-600 underline">
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy-policy" className="text-black hover:text-gray-600 underline">
                      Privacy Policy
                    </Link>
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subscribeNewsletter}
                    onChange={(e) => setSubscribeNewsletter(e.target.checked)}
                    disabled={isLoading}
                    className="w-4 h-4 mt-0.5 border-gray-300 rounded text-black focus:ring-black"
                  />
                  <span className="text-sm text-gray-700 tracking-wide">
                    Subscribe to our newsletter for exclusive offers and updates
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !agreeToTerms}
                className="w-full py-4 bg-black text-white text-sm font-medium tracking-widest hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>CREATING ACCOUNT...</span>
                ) : (
                  <>
                    <span>CREATE ACCOUNT</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Sign In Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 tracking-wide">
                Already have an account?{" "}
                <Link href="/login" className="text-black font-medium hover:text-gray-600 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}