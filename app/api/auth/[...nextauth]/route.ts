// app/api/auth/[...nextauth]/route.ts
// NextAuth v5 Route Handler for NOWIHT Admin Authentication

import { handlers } from '@/lib/auth';

// Export GET and POST handlers from NextAuth
export const { GET, POST } = handlers;

// Runtime configuration (optional)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';