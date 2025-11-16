// lib/supabase/client.ts
// Supabase client initialization for NOWIHT E-Commerce

import { createClient } from '@supabase/supabase-js';

// Environment variables validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  );
}

// Create Supabase client (public - for client-side)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // We're not using auth yet
  },
});

// Create Supabase admin client (for server-side operations)
// FIXED: Check for service role key properly
const getSupabaseServiceKey = () => {
  // Try both with and without NEXT_PUBLIC prefix
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ||
    ''
  );
};

const supabaseServiceKey = getSupabaseServiceKey();

// Log for debugging (remove in production)
if (typeof window === 'undefined') {
  // Server-side only
  console.log('🔐 Supabase Admin Key Status:', supabaseServiceKey ? '✅ Found' : '❌ Missing');
}

export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
  : null;

// Helper function to check connection
export async function testConnection() {
  try {
    const { data, error } = await supabase.from('categories').select('count');
    if (error) throw error;
    return { success: true, message: 'Connected to Supabase successfully' };
  } catch (error) {
    console.error('Supabase connection error:', error);
    return { success: false, message: 'Failed to connect to Supabase' };
  }
}