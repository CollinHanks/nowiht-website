// middleware.ts
// NOWIHT Admin Login - FIXED Middleware Configuration
// NextAuth v5 + Next.js 16 + React 19 - PRODUCTS REDIRECT REMOVED

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

// ============================================
// CONFIGURATION
// ============================================

// Test password routes
const TEST_ROUTES = ['/test-loader'];
const TEST_PASSWORD = process.env.NEXT_PUBLIC_TEST_PASSWORD || 'nowiht2025';

// Admin routes (protected)
const ADMIN_PROTECTED = [
  '/admin',
  '/admin/products',
  '/admin/orders',
  '/admin/customers',
  '/admin/media',
  '/admin/inventory',
  '/admin/settings',
  '/admin/analytics',
  '/admin/blog',
  '/admin/categories',
  '/admin/metaobjects'
];

// Admin routes (public)
const ADMIN_PUBLIC = [
  '/admin/login',
  '/admin/forgot-password'
];

// Customer routes (protected)
const CUSTOMER_PROTECTED = [
  '/account',
  '/account/orders',
  '/account/settings',
  '/account/addresses'
];

// Customer routes (public)
const CUSTOMER_PUBLIC = [
  '/login',
  '/register',
  '/forgot-password'
];

// ============================================
// HELPER FUNCTIONS
// ============================================

function checkTestPassword(request: NextRequest): boolean {
  const password = request.cookies.get('test-auth')?.value;
  return password === TEST_PASSWORD;
}

// ============================================
// MAIN MIDDLEWARE
// ============================================

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files and API routes (except auth)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') && !pathname.startsWith('/api/auth') ||
    pathname.includes('.') // Files with extensions
  ) {
    return NextResponse.next();
  }

  // ============================================
  // 🔥 PRODUCTS REDIRECT REMOVED
  // Our route structure:
  // - /shop → All products
  // - /shop/[category] → Category page
  // - /product/[slug] → Product detail
  // No need for /products redirect!
  // ============================================

  // ============================================
  // TEST ROUTE PROTECTION
  // ============================================
  if (TEST_ROUTES.some(route => pathname.startsWith(route))) {
    if (!checkTestPassword(request)) {
      const url = request.nextUrl.clone();
      url.pathname = '/test-password';
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // ============================================
  // ADMIN ROUTE PROTECTION (NextAuth v5)
  // ============================================
  const isProtectedAdmin = ADMIN_PROTECTED.some(route => {
    if (route === '/admin') {
      return pathname === '/admin' || pathname === '/admin/';
    }
    return pathname.startsWith(route);
  });

  if (isProtectedAdmin) {
    try {
      // 🔥 CRITICAL FIX: Use NextAuth v5 auth() helper
      const session = await auth();

      // No session → redirect to login
      if (!session || !session.user) {
        console.log(`🔒 [MIDDLEWARE] No session for: ${pathname}`);
        const url = request.nextUrl.clone();
        url.pathname = '/admin/login';
        url.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(url);
      }

      // Check admin role
      if (session.user.role !== 'admin' && session.user.role !== 'super_admin') {
        console.log(`⛔ [MIDDLEWARE] Not admin role: ${session.user.role}`);
        const url = request.nextUrl.clone();
        url.pathname = '/account';
        return NextResponse.redirect(url);
      }

      // Super admin only routes
      if (pathname.startsWith('/admin/settings') && session.user.role !== 'super_admin') {
        console.log(`⛔ [MIDDLEWARE] Settings requires super_admin`);
        const url = request.nextUrl.clone();
        url.pathname = '/admin';
        return NextResponse.redirect(url);
      }

      console.log(`✅ [MIDDLEWARE] Admin access granted: ${session.user.email}`);
      return NextResponse.next();

    } catch (error) {
      console.error('❌ [MIDDLEWARE] Auth error:', error);
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('error', 'auth-failed');
      return NextResponse.redirect(url);
    }
  }

  // ============================================
  // ADMIN PUBLIC ROUTES
  // ============================================
  if (ADMIN_PUBLIC.some(route => pathname.startsWith(route))) {
    try {
      const session = await auth();

      // Already logged in → redirect to admin dashboard
      if (session?.user?.role === 'admin' || session?.user?.role === 'super_admin') {
        const url = request.nextUrl.clone();
        url.pathname = '/admin';
        return NextResponse.redirect(url);
      }
    } catch (error) {
      // Ignore errors on public routes
    }
    return NextResponse.next();
  }

  // ============================================
  // CUSTOMER ROUTE PROTECTION
  // ============================================
  const isProtectedCustomer = CUSTOMER_PROTECTED.some(route => pathname.startsWith(route));

  if (isProtectedCustomer) {
    try {
      const session = await auth();

      if (!session || !session.user) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(url);
      }

      return NextResponse.next();
    } catch (error) {
      console.error('❌ [MIDDLEWARE] Customer auth error:', error);
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  // ============================================
  // CUSTOMER PUBLIC ROUTES
  // ============================================
  if (CUSTOMER_PUBLIC.some(route => pathname.startsWith(route))) {
    try {
      const session = await auth();

      // Already logged in → redirect to account
      if (session?.user) {
        const url = request.nextUrl.clone();
        url.pathname = '/account';
        return NextResponse.redirect(url);
      }
    } catch (error) {
      // Ignore errors on public routes
    }
    return NextResponse.next();
  }

  // ============================================
  // DEFAULT: ALLOW ACCESS
  // ============================================
  return NextResponse.next();
}

// ============================================
// MATCHER CONFIGURATION
// ============================================

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};