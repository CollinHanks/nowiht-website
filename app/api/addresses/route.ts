// app/api/addresses/route.ts
// GET: List all addresses for current user
// POST: Create new address

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';
import type { Address, CreateAddressRequest } from '@/types';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// ═══════════════════════════════════════════════════════════════
// GET: List all addresses
// ═══════════════════════════════════════════════════════════════
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user ID
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get all addresses for this user
    const { data, error } = await supabaseAdmin
      .from('addresses')
      .select('*')
      .eq('user_id', userData.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Fetch addresses error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch addresses' },
        { status: 500 }
      );
    }

    console.log('✅ Fetched addresses:', data?.length || 0);

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('🚨 GET addresses exception:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════
// POST: Create new address
// ═══════════════════════════════════════════════════════════════
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body: CreateAddressRequest = await request.json();

    // Validate required fields
    if (!body.label || !body.first_name || !body.last_name || !body.street || !body.city || !body.state || !body.zip || !body.country) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user ID
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create address
    const { data, error } = await supabaseAdmin
      .from('addresses')
      .insert({
        user_id: userData.id,
        label: body.label,
        first_name: body.first_name,
        last_name: body.last_name,
        phone: body.phone || null,
        street: body.street,
        street_line2: body.street_line2 || null,
        city: body.city,
        state: body.state,
        zip: body.zip,
        country: body.country,
        is_default: body.is_default || false,
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Create address error:', error);
      return NextResponse.json(
        { error: 'Failed to create address' },
        { status: 500 }
      );
    }

    console.log('✅ Address created:', data.id);

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('🚨 POST address exception:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}