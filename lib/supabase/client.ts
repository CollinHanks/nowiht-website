// lib/supabase/client.ts
// NOWIHT E-Commerce - Supabase Client (FIXED)
// 🔥 FIXED: Better service role key handling for server-side

import { createClient } from '@supabase/supabase-js';

// ============================================
// ENVIRONMENT VALIDATION
// ============================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '❌ Missing Supabase environment variables. Check .env.local file:\n' +
    `NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✅' : '❌'}\n` +
    `NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✅' : '❌'}`
  );
}

// ============================================
// PUBLIC CLIENT (Client-side & Server-side read operations)
// ============================================

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Disable session persistence for now
    autoRefreshToken: false,
  },
});

// ============================================
// ADMIN CLIENT (Server-side only - write operations)
// ============================================

/**
 * Get service role key from environment
 * Try multiple possible env variable names for compatibility
 */
const getServiceRoleKey = (): string | undefined => {
  // Server-side only check
  if (typeof window !== 'undefined') {
    console.warn('⚠️ Service role key should never be accessed on client-side!');
    return undefined;
  }

  // Try different env variable names
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY; // Fallback (not recommended)

  return key;
};

const supabaseServiceKey = getServiceRoleKey();

// Log status (server-side only, development only)
if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🔑 Supabase Service Key:', supabaseServiceKey ? '✅ Found' : '❌ Missing');

  if (!supabaseServiceKey) {
    console.error(
      '❌ SUPABASE_SERVICE_ROLE_KEY not found!\n' +
      'Add this to your .env.local:\n' +
      'SUPABASE_SERVICE_ROLE_KEY=your_service_role_key'
    );
  }
}

/**
 * Admin client for server-side operations requiring elevated privileges
 * Returns null if service key is not available
 */
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
  : null;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Test database connection
 */
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('count')
      .limit(1);

    if (error) throw error;

    return {
      success: true,
      message: '✅ Connected to Supabase successfully'
    };
  } catch (error) {
    console.error('❌ Supabase connection error:', error);
    return {
      success: false,
      message: 'Failed to connect to Supabase',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Check if admin client is available
 */
export function hasAdminAccess(): boolean {
  return supabaseAdmin !== null;
}

/**
 * Get admin client with safety check
 * Throws error if not available
 */
export function requireAdmin() {
  if (!supabaseAdmin) {
    throw new Error(
      '❌ Admin access not available. SUPABASE_SERVICE_ROLE_KEY is required for this operation.'
    );
  }
  return supabaseAdmin;
}