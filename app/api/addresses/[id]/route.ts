// app/api/addresses/[id]/route.ts
// GET: Get single address
// PUT: Update address
// DELETE: Delete address
// FIXED: Next.js 16 - params is now Promise<{ id: string }>

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';
import type { UpdateAddressRequest } from '@/types';

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
// Helper: Verify address ownership
// ═══════════════════════════════════════════════════════════════
async function verifyAddressOwnership(addressId: string, userEmail: string) {
  // Get user ID
  const { data: userData, error: userError } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', userEmail)
    .single();

  if (userError || !userData) {
    return { error: 'User not found', userId: null };
  }

  // Check if address belongs to user
  const { data: addressData, error: addressError } = await supabaseAdmin
    .from('addresses')
    .select('*')
    .eq('id', addressId)
    .eq('user_id', userData.id)
    .single();

  if (addressError || !addressData) {
    return { error: 'Address not found or unauthorized', userId: userData.id };
  }

  return { error: null, userId: userData.id, address: addressData };
}

// ═══════════════════════════════════════════════════════════════
// GET: Get single address
// ═══════════════════════════════════════════════════════════════
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ FIXED: await params
    const { id } = await params;

    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { error, address } = await verifyAddressOwnership(id, session.user.email);

    if (error || !address) {
      return NextResponse.json(
        { error: error || 'Address not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(address);
  } catch (error) {
    console.error('🚨 GET address exception:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════
// PUT: Update address
// ═══════════════════════════════════════════════════════════════
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ FIXED: await params
    const { id } = await params;

    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body: UpdateAddressRequest = await request.json();

    // Verify ownership
    const { error: verifyError } = await verifyAddressOwnership(id, session.user.email);

    if (verifyError) {
      return NextResponse.json(
        { error: verifyError },
        { status: 404 }
      );
    }

    // Build update object (only include provided fields)
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (body.label !== undefined) updateData.label = body.label;
    if (body.first_name !== undefined) updateData.first_name = body.first_name;
    if (body.last_name !== undefined) updateData.last_name = body.last_name;
    if (body.phone !== undefined) updateData.phone = body.phone || null;
    if (body.street !== undefined) updateData.street = body.street;
    if (body.street_line2 !== undefined) updateData.street_line2 = body.street_line2 || null;
    if (body.city !== undefined) updateData.city = body.city;
    if (body.state !== undefined) updateData.state = body.state;
    if (body.zip !== undefined) updateData.zip = body.zip;
    if (body.country !== undefined) updateData.country = body.country;
    if (body.is_default !== undefined) updateData.is_default = body.is_default;

    // Update address
    const { data, error } = await supabaseAdmin
      .from('addresses')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Update address error:', error);
      return NextResponse.json(
        { error: 'Failed to update address' },
        { status: 500 }
      );
    }

    console.log('✅ Address updated:', id);

    return NextResponse.json(data);
  } catch (error) {
    console.error('🚨 PUT address exception:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════
// DELETE: Delete address
// ═══════════════════════════════════════════════════════════════
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ FIXED: await params
    const { id } = await params;

    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify ownership
    const { error: verifyError } = await verifyAddressOwnership(id, session.user.email);

    if (verifyError) {
      return NextResponse.json(
        { error: verifyError },
        { status: 404 }
      );
    }

    // Delete address
    const { error } = await supabaseAdmin
      .from('addresses')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Delete address error:', error);
      return NextResponse.json(
        { error: 'Failed to delete address' },
        { status: 500 }
      );
    }

    console.log('✅ Address deleted:', id);

    return NextResponse.json({ success: true, message: 'Address deleted successfully' });
  } catch (error) {
    console.error('🚨 DELETE address exception:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}