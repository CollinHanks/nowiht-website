'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ FIXED: Redirect to /admin (not /admin/dashboard)
  const callbackUrl = searchParams.get('callbackUrl') || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.error('🔐 [PRODUCTION DEBUG] Attempting admin login...');
      console.error('📧 [PRODUCTION DEBUG] Email:', email);
      console.error('🔑 [PRODUCTION DEBUG] LoginType: admin');

      const result = await signIn('credentials', {
        email,
        password,
        loginType: 'admin', // ✅ CRITICAL: This was missing!
        redirect: false,
        callbackUrl,
      });

      console.error('📊 [PRODUCTION DEBUG] Login result:', JSON.stringify(result));

      if (result?.error) {
        console.error('❌ [PRODUCTION DEBUG] Login error:', result.error);
        setError('Invalid email or password');
        setLoading(false);
      } else if (result?.ok) {
        console.error('✅ [PRODUCTION DEBUG] Login successful! Redirecting to:', callbackUrl);
        console.error('🔄 [PRODUCTION DEBUG] Calling router.push()...');
        // Small delay to ensure session is set
        setTimeout(() => {
          console.error('⏰ [PRODUCTION DEBUG] Timeout complete, pushing route...');
          router.push(callbackUrl);
          router.refresh();
        }, 100);
      } else {
        console.error('⚠️ [PRODUCTION DEBUG] Unexpected result state:', result);
      }
    } catch (err) {
      console.error('🚨 [PRODUCTION DEBUG] Login exception:', err);
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light tracking-wider mb-2">NOWIHT</h1>
          <p className="text-sm text-gray-600 uppercase tracking-widest">Admin Access</p>
        </div>

        {/* Login Form */}
        <div className="bg-white border rounded-lg p-8">
          <h2 className="text-2xl font-light mb-6">Sign In</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  placeholder="kursat@nowiht.com"
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>

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
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  placeholder="••••••••"
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <a href="/admin/forgot-password" className="text-sm text-gray-600 hover:text-black">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-xs text-gray-600 mb-2 font-medium">Your Admin Credentials:</p>
            <p className="text-xs text-gray-500 font-mono">
              Email: kursat@nowiht.com<br />
              Password: K1324rst*1
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