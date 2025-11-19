'use client';

// app/admin/login/page.tsx
// NOWIHT Admin Login - FIXED VERSION
// 🔥 This fixes the 3-day login issue

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const callbackUrl = searchParams.get('callbackUrl') || '/admin';
  const urlError = searchParams.get('error');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset error
    setError('');
    setLoading(true);

    console.log('🔐 [LOGIN] Attempting login:', { email, callbackUrl });

    try {
      // 🔥 CRITICAL FIX: Proper signIn call with error handling
      const result = await signIn('credentials', {
        email: email.trim(),
        password: password,
        loginType: 'admin',
        redirect: false,
        callbackUrl,
      });

      console.log('📝 [LOGIN] SignIn result:', result);

      // Handle errors
      if (result?.error) {
        console.error('❌ [LOGIN] SignIn error:', result.error);

        // Map error messages
        let errorMessage = 'Invalid email or password';

        if (result.error === 'CredentialsSignin') {
          errorMessage = 'Invalid email or password';
        } else if (result.error === 'Configuration') {
          errorMessage = 'Authentication system error. Please contact support.';
        } else if (result.error === 'AccessDenied') {
          errorMessage = 'Access denied. You do not have admin permissions.';
        } else {
          errorMessage = result.error;
        }

        setError(errorMessage);
        setLoading(false);
        return;
      }

      // Success!
      if (result?.ok) {
        console.log('✅ [LOGIN] Login successful, redirecting...');

        // 🔥 CRITICAL FIX: Use window.location for hard redirect
        // This ensures cookies are properly set and middleware runs
        window.location.href = callbackUrl;
      } else {
        // Unexpected case
        console.error('⚠️ [LOGIN] Unexpected result:', result);
        setError('Login failed. Please try again.');
        setLoading(false);
      }

    } catch (err) {
      console.error('❌ [LOGIN] Catch error:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-light tracking-[0.3em] mb-2">NOWIHT</h1>
          <p className="text-sm text-gray-600 uppercase tracking-[0.2em] font-light">
            Admin Access
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-light mb-6 tracking-wide">Sign In</h2>

          {/* Error Messages */}
          {(error || urlError) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-600 font-medium">
                  {error || (urlError === 'CredentialsSignin' ? 'Invalid credentials' : urlError)}
                </p>
                {urlError && (
                  <p className="text-xs text-red-500 mt-1">
                    Error code: {urlError}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="email"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
                  placeholder="kursat@nowiht.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="current-password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="mr-2 w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <a
                href="/admin/forgot-password"
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-xs text-gray-600 mb-2 font-medium">
              📋 Your Admin Credentials:
            </p>
            <div className="text-xs text-gray-500 font-mono space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Email:</span>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('kursat@nowiht.com');
                    navigator.clipboard.writeText('kursat@nowiht.com');
                  }}
                  className="text-black hover:underline"
                >
                  kursat@nowiht.com
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Pass:</span>
                <button
                  type="button"
                  onClick={() => {
                    setPassword('K1324rst*1');
                    navigator.clipboard.writeText('K1324rst*1');
                  }}
                  className="text-black hover:underline"
                >
                  K1324rst*1
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Click to copy and fill
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Protected by NextAuth v5 • Supabase Backend
        </p>
      </div>
    </div>
  );
}