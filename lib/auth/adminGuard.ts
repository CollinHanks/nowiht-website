// lib/auth/adminGuard.ts
// ═══════════════════════════════════════════════════════════════
// 🔒 NOWIHT - Admin Guard (NextAuth v5 Compatible)
// Modern app-level authentication checks for admin routes
// ═══════════════════════════════════════════════════════════════

import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

/**
 * Admin user interface
 */
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super_admin' | 'customer';
  image?: string | null;
}

/**
 * Get current admin user from session
 * Returns null if not authenticated or not admin
 * 
 * @example
 * const admin = await getCurrentAdmin();
 * if (!admin) return redirect('/admin/login');
 */
export async function getCurrentAdmin(): Promise<AdminUser | null> {
  try {
    const session = await auth();

    if (!session?.user) {
      return null;
    }

    // Check if user has admin role
    const isAdminRole =
      session.user.role === 'admin' ||
      session.user.role === 'super_admin';

    if (!isAdminRole) {
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role as 'admin' | 'super_admin',
      image: session.user.image || null,
    };
  } catch (error) {
    console.error('❌ [ADMIN GUARD] getCurrentAdmin failed:', error);
    return null;
  }
}

/**
 * Check if current user is admin (without redirect)
 * Returns true if admin, false otherwise
 * 
 * @example
 * const hasAccess = await isAdmin();
 * if (!hasAccess) return <AccessDenied />;
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const session = await auth();

    if (!session?.user?.role) {
      return false;
    }

    return (
      session.user.role === 'admin' ||
      session.user.role === 'super_admin'
    );
  } catch (error) {
    console.error('❌ [ADMIN GUARD] isAdmin check failed:', error);
    return false;
  }
}

/**
 * Check if current user is super admin
 * 
 * @example
 * const isSuperAdmin = await checkSuperAdmin();
 * if (!isSuperAdmin) return <Forbidden />;
 */
export async function isSuperAdmin(): Promise<boolean> {
  try {
    const session = await auth();
    return session?.user?.role === 'super_admin';
  } catch (error) {
    console.error('❌ [ADMIN GUARD] isSuperAdmin check failed:', error);
    return false;
  }
}

/**
 * Require admin access - redirects to login if not admin
 * Use in Server Components and Server Actions
 * 
 * @param callbackUrl - Optional URL to redirect back after login
 * @throws Redirects to login page if not authenticated
 * @returns Admin user object
 * 
 * @example
 * // In Server Component
 * export default async function AdminPage() {
 *   const admin = await requireAdmin();
 *   return <div>Welcome {admin.name}</div>;
 * }
 */
export async function requireAdmin(callbackUrl?: string): Promise<AdminUser> {
  const admin = await getCurrentAdmin();

  if (!admin) {
    const url = callbackUrl
      ? `/admin/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
      : '/admin/login';

    redirect(url);
  }

  return admin;
}

/**
 * Require super admin access - redirects if not super admin
 * 
 * @param callbackUrl - Optional URL to redirect back
 * @throws Redirects to admin dashboard if not super admin
 * @returns Admin user object
 * 
 * @example
 * export default async function SettingsPage() {
 *   const admin = await requireSuperAdmin();
 *   return <div>Settings</div>;
 * }
 */
export async function requireSuperAdmin(callbackUrl?: string): Promise<AdminUser> {
  const admin = await requireAdmin(callbackUrl);

  if (admin.role !== 'super_admin') {
    redirect('/admin');
  }

  return admin;
}

/**
 * API Route wrapper for admin-only endpoints
 * Automatically handles authentication and authorization
 * 
 * @example
 * // app/api/admin/products/route.ts
 * export const GET = withAdminAuth(async (req, admin) => {
 *   // admin is guaranteed to be authenticated
 *   return NextResponse.json({ success: true, user: admin.email });
 * });
 */
export function withAdminAuth(
  handler: (req: Request, admin: AdminUser) => Promise<Response>
) {
  return async (req: Request) => {
    try {
      const admin = await getCurrentAdmin();

      if (!admin) {
        return NextResponse.json(
          {
            success: false,
            error: 'Unauthorized: Admin access required',
          },
          { status: 401 }
        );
      }

      return await handler(req, admin);
    } catch (error) {
      console.error('❌ [ADMIN GUARD] withAdminAuth error:', error);

      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Authentication failed',
        },
        { status: 401 }
      );
    }
  };
}

/**
 * API Route wrapper for super admin-only endpoints
 * 
 * @example
 * export const DELETE = withSuperAdminAuth(async (req, admin) => {
 *   // Only super admins can reach here
 *   return NextResponse.json({ success: true });
 * });
 */
export function withSuperAdminAuth(
  handler: (req: Request, admin: AdminUser) => Promise<Response>
) {
  return async (req: Request) => {
    try {
      const admin = await getCurrentAdmin();

      if (!admin) {
        return NextResponse.json(
          {
            success: false,
            error: 'Unauthorized: Admin access required',
          },
          { status: 401 }
        );
      }

      if (admin.role !== 'super_admin') {
        return NextResponse.json(
          {
            success: false,
            error: 'Forbidden: Super admin access required',
          },
          { status: 403 }
        );
      }

      return await handler(req, admin);
    } catch (error) {
      console.error('❌ [ADMIN GUARD] withSuperAdminAuth error:', error);

      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Authentication failed',
        },
        { status: 401 }
      );
    }
  };
}

// ============================================
// HELPER: Check current user's role
// ============================================

/**
 * Get current user's role (works for both admin and customer)
 * 
 * @returns User role or null if not authenticated
 */
export async function getCurrentUserRole(): Promise<string | null> {
  try {
    const session = await auth();
    return session?.user?.role || null;
  } catch (error) {
    console.error('❌ [ADMIN GUARD] getCurrentUserRole failed:', error);
    return null;
  }
}

/**
 * Check if user has specific role
 * 
 * @param role - Role to check
 * @returns True if user has the role
 */
export async function hasRole(role: string): Promise<boolean> {
  try {
    const currentRole = await getCurrentUserRole();
    return currentRole === role;
  } catch (error) {
    console.error('❌ [ADMIN GUARD] hasRole check failed:', error);
    return false;
  }
}

console.log('✅ [ADMIN GUARD] NextAuth v5 compatible guards loaded');