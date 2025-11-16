// app/api/user/update/route.ts
// Update user profile (name, phone, address)

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth'; // ✅ NextAuth v5 uses auth()
import { createClient } from '@supabase/supabase-js';

// Service role key for backend operations
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

export async function PUT(request: Request) {
  try {
    // Check authentication (NextAuth v5)
    const session = await auth();

    if (!session?.user?.email) {
      console.log('❌ Unauthorized: No session');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, phone, address } = body;

    console.log('📝 Updating user profile:', session.user.email);

    // Update user in database
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({
        name,
        phone,
        address: JSON.stringify(address), // Store as JSON
        updated_at: new Date().toISOString(),
      })
      .eq('email', session.user.email)
      .select()
      .single();

    if (error) {
      console.error('❌ Update error:', error);
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    console.log('✅ Profile updated successfully');

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
      },
    });
  } catch (error) {
    console.error('🚨 Update exception:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}