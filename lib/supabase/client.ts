// lib/supabase/client.ts
// NOWIHT E-Commerce - Supabase Client (SECURE)
// 🔒 FIXED: No service key leak to client-side

import { createClient, SupabaseClient } from '@supabase/supabase-js';

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
// PUBLIC CLIENT (Client-side & Server-side)
// ============================================

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// ============================================
// ADMIN CLIENT (Server-side ONLY)
// ============================================

/**
 * Initialize admin client (server-side only)
 * Uses lazy initialization to avoid client-side execution
 */
let _adminClient: SupabaseClient | null = null;

function initAdminClient(): SupabaseClient | null {
  // 🔒 CRITICAL: Never run on client-side
  if (typeof window !== 'undefined') {
    return null;
  }

  // Already initialized
  if (_adminClient) {
    return _adminClient;
  }

  // Get service role key (server-side only)
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        '❌ SUPABASE_SERVICE_ROLE_KEY not found!\n' +
        'Add this to your .env.local:\n' +
        'SUPABASE_SERVICE_ROLE_KEY=your_service_role_key'
      );
    }
    return null;
  }

  // Create admin client
  _adminClient = createClient(supabaseUrl!, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  // Log success (development only)
  if (process.env.NODE_ENV === 'development') {
    console.log('🔑 Supabase Service Key: ✅ Found');
  }

  return _adminClient;
}

/**
 * Get admin client (lazy initialization)
 * Returns null on client-side
 */
export const supabaseAdmin: SupabaseClient | null = typeof window === 'undefined'
  ? initAdminClient()
  : null;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Check if admin client is available
 */
export function hasAdminAccess(): boolean {
  if (typeof window !== 'undefined') {
    return false; // Never true on client-side
  }
  return initAdminClient() !== null;
}

/**
 * Get admin client with safety check
 * Throws error if not available or called from client-side
 */
export function requireAdmin(): SupabaseClient {
  // 🔒 CRITICAL: Block client-side access
  if (typeof window !== 'undefined') {
    throw new Error('❌ requireAdmin() cannot be called from client-side!');
  }

  const admin = initAdminClient();

  if (!admin) {
    throw new Error(
      '❌ Admin access not available. SUPABASE_SERVICE_ROLE_KEY is required.'
    );
  }

  return admin;
}

/**
 * Test database connection (public client)
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