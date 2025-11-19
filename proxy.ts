// proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

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
  const isProtectedAdmin = ADMIN_PROTECTED_ROUTES.some(route => {
    if (route === '/admin') {
      return pathname === '/admin' || pathname === '/admin/';
    }
    return pathname.startsWith(route);
  });

  if (isProtectedAdmin) {
    try {
      // 🔥 FIX: getToken() will automatically use NextAuth v5 cookie names
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET
      });

      if (!token) {
        console.log(`🔒 [PROXY] No token for: ${pathname}, redirecting to login`);
        const url = request.nextUrl.clone();
        url.pathname = '/admin/login';
        url.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(url);
      }

      if (token.role !== 'admin' && token.role !== 'super_admin') {
        console.log(`⛔ [PROXY] Not an admin role: ${token.role}`);
        const url = request.nextUrl.clone();
        url.pathname = '/account';
        return NextResponse.redirect(url);
      }

      if (pathname.startsWith('/admin/settings') && token.role !== 'super_admin') {
        console.log(`⛔ [PROXY] Insufficient permissions for settings`);
        const url = request.nextUrl.clone();
        url.pathname = '/admin';
        return NextResponse.redirect(url);
      }

      console.log(`✅ [PROXY] Authorized: ${pathname}, role: ${token.role}`);
    } catch (error) {
      console.error('[PROXY] Auth check error:', error);
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
        console.log(`↩️ [PROXY] Already logged in as admin, redirecting to dashboard`);
        const url = request.nextUrl.clone();
        url.pathname = '/admin';
        return NextResponse.redirect(url);
      }
    } catch (error) {
      // Continue to login page
    }
  }

  // === CUSTOMER ROUTE PROTECTION ===
  const isProtectedCustomer = CUSTOMER_PROTECTED_ROUTES.some(route => {
    if (route === '/account') {
      return pathname === '/account' || pathname === '/account/';
    }
    return pathname.startsWith(route);
  });

  if (isProtectedCustomer) {
    try {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET
      });

      if (!token) {
        console.log(`🔒 [PROXY] No token for customer route: ${pathname}`);
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(url);
      }

      if (token.role === 'admin' || token.role === 'super_admin') {
        console.log(`⛔ [PROXY] Admin trying to access customer area`);
        const url = request.nextUrl.clone();
        url.pathname = '/admin';
        return NextResponse.redirect(url);
      }

      console.log(`✅ [PROXY] Customer authorized: ${pathname}`);
    } catch (error) {
      console.error('[PROXY] Customer auth check error:', error);
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
        console.log(`↩️ [PROXY] Already logged in as customer`);
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

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};