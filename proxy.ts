// proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * NOWIHT - Proxy (Next.js 16 convention)
 * Handles:
 * 1. Password protection for test routes (/test-*)
 * 2. Admin authentication checks
 * 3. Customer authentication checks
 * 4. Maintenance mode redirects
 * 5. Rate limiting
 */

// Password-protected test routes
const PROTECTED_TEST_ROUTES = ['/test-loader'];
const TEST_PASSWORD = process.env.NEXT_PUBLIC_TEST_PASSWORD || 'nowiht2025';

// Admin routes
const ADMIN_PROTECTED_ROUTES = [
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

const ADMIN_PUBLIC_ROUTES = [
  '/admin/login',
  '/admin/forgot-password'
];

// Customer protected routes
const CUSTOMER_PROTECTED_ROUTES = [
  '/account',
  '/account/orders',
  '/account/settings',
  '/account/addresses',
];

const CUSTOMER_PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
];

function checkTestPassword(request: NextRequest): boolean {
  const password = request.cookies.get('test-auth')?.value;
  return password === TEST_PASSWORD;
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // === ADMIN ROUTE PROTECTION ===

  // Check if it's a protected admin route
  const isProtectedAdmin = ADMIN_PROTECTED_ROUTES.some(route => {
    if (route === '/admin') {
      return pathname === '/admin' || pathname === '/admin/';
    }
    return pathname.startsWith(route);
  });

  if (isProtectedAdmin) {
    try {
      // Check for NextAuth session
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET
      });

      if (!token) {
        console.log(`🔒 [ADMIN] No auth token, redirecting to login from: ${pathname}`);
        const url = request.nextUrl.clone();
        url.pathname = '/admin/login';
        url.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(url);
      }

      // Check if user has admin role
      if (token.role !== 'admin' && token.role !== 'super_admin') {
        console.log(`⛔ [ADMIN] Not an admin, redirecting to customer area`);
        const url = request.nextUrl.clone();
        url.pathname = '/account';
        return NextResponse.redirect(url);
      }

      // Check role for settings page
      if (pathname.startsWith('/admin/settings') && token.role !== 'super_admin') {
        console.log(`⛔ [ADMIN] Insufficient permissions for settings`);
        const url = request.nextUrl.clone();
        url.pathname = '/admin';
        return NextResponse.redirect(url);
      }

      console.log(`✅ [ADMIN] Authorized access to: ${pathname}`);
    } catch (error) {
      console.error('[ADMIN] Auth check error:', error);
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  // If already logged in as admin and trying to access admin login page
  const isPublicAdmin = ADMIN_PUBLIC_ROUTES.some(route => pathname.startsWith(route));

  if (isPublicAdmin) {
    try {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET
      });

      if (token && (token.role === 'admin' || token.role === 'super_admin')) {
        console.log(`↩️ [ADMIN] Already logged in, redirecting to dashboard`);
        const url = request.nextUrl.clone();
        url.pathname = '/admin';
        return NextResponse.redirect(url);
      }
    } catch (error) {
      // Continue to login page
    }
  }

  // === CUSTOMER ROUTE PROTECTION ===

  // Check if it's a protected customer route
  const isProtectedCustomer = CUSTOMER_PROTECTED_ROUTES.some(route => {
    if (route === '/account') {
      return pathname === '/account' || pathname === '/account/';
    }
    return pathname.startsWith(route);
  });

  if (isProtectedCustomer) {
    try {
      // Check for NextAuth session
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET
      });

      if (!token) {
        console.log(`🔒 [CUSTOMER] No auth token, redirecting to login from: ${pathname}`);
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(url);
      }

      // Check if user is a customer (not admin)
      if (token.role === 'admin' || token.role === 'super_admin') {
        console.log(`⛔ [CUSTOMER] Admin trying to access customer area, redirecting to admin`);
        const url = request.nextUrl.clone();
        url.pathname = '/admin';
        return NextResponse.redirect(url);
      }

      console.log(`✅ [CUSTOMER] Authorized access to: ${pathname}`);
    } catch (error) {
      console.error('[CUSTOMER] Auth check error:', error);
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  // If already logged in as customer and trying to access login/register page
  const isPublicCustomer = CUSTOMER_PUBLIC_ROUTES.some(route => pathname.startsWith(route));

  if (isPublicCustomer) {
    try {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET
      });

      if (token && token.role === 'customer') {
        console.log(`↩️ [CUSTOMER] Already logged in, redirecting to account`);
        const url = request.nextUrl.clone();
        url.pathname = '/account';
        return NextResponse.redirect(url);
      }
    } catch (error) {
      // Continue to login/register page
    }
  }

  // === TEST ROUTES PASSWORD PROTECTION ===
  const isProtectedTest = PROTECTED_TEST_ROUTES.some(route => pathname.startsWith(route));

  if (isProtectedTest) {
    if (!checkTestPassword(request)) {
      const url = request.nextUrl.clone();
      url.pathname = '/test-auth';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  // === MAINTENANCE MODE CHECK ===
  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';
  const maintenanceBypassRoutes = ['/maintenance', '/_next', '/api', '/favicon.ico', '/images'];

  if (isMaintenanceMode) {
    const shouldBypass = maintenanceBypassRoutes.some(route => pathname.startsWith(route));
    if (!shouldBypass && pathname !== '/maintenance') {
      const url = request.nextUrl.clone();
      url.pathname = '/maintenance';
      return NextResponse.redirect(url);
    }
  }

  // Continue normally
  return NextResponse.next();
}

// Config: Which routes to run proxy on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};