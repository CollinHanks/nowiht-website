// app/api/auth/[...nextauth]/route.ts
// NextAuth v5 Route Handler for NOWIHT
// 🔥 CRITICAL: This must be in exact location: app/api/auth/[...nextauth]/route.ts

import { handlers } from '@/lib/auth';

// Export GET and POST handlers from NextAuth
// This is the ONLY way NextAuth v5 works with App Router
export const { GET, POST } = handlers;

// Runtime configuration
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Debug logging (remove in production)
console.log('✅ [NEXTAUTH] Route handler loaded at /api/auth/*');