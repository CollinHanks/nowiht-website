// app/api/user/preferences/route.ts
// Get and update user email preferences

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

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
// GET: Fetch user preferences
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

    // Get preferences (create if not exists)
    let { data: preferences, error: prefError } = await supabaseAdmin
      .from('user_preferences')
      .select('*')
      .eq('user_id', userData.id)
      .single();

    // If preferences don't exist, create default ones
    if (prefError || !preferences) {
      const { data: newPreferences, error: createError } = await supabaseAdmin
        .from('user_preferences')
        .insert({
          user_id: userData.id,
          order_updates: true,
          newsletter: true,
          promotions: false,
          sms_notifications: false,
        })
        .select()
        .single();

      if (createError) {
        console.error('❌ Create preferences error:', createError);
        return NextResponse.json(
          { error: 'Failed to create preferences' },
          { status: 500 }
        );
      }

      preferences = newPreferences;
    }

    console.log('✅ Fetched preferences');

    return NextResponse.json({
      orderUpdates: preferences.order_updates,
      newsletter: preferences.newsletter,
      promotions: preferences.promotions,
      smsNotifications: preferences.sms_notifications,
    });
  } catch (error) {
    console.error('🚨 GET preferences exception:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════
// PUT: Update user preferences
// ═══════════════════════════════════════════════════════════════
export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { orderUpdates, newsletter, promotions, smsNotifications } = body;

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

    console.log('📧 Updating preferences for:', session.user.email);

    // Check if preferences exist
    const { data: existingPrefs } = await supabaseAdmin
      .from('user_preferences')
      .select('id')
      .eq('user_id', userData.id)
      .single();

    if (existingPrefs) {
      // Update existing preferences
      const { error: updateError } = await supabaseAdmin
        .from('user_preferences')
        .update({
          order_updates: orderUpdates,
          newsletter: newsletter,
          promotions: promotions,
          sms_notifications: smsNotifications,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userData.id);

      if (updateError) {
        console.error('❌ Update error:', updateError);
        return NextResponse.json(
          { error: 'Failed to update preferences' },
          { status: 500 }
        );
      }
    } else {
      // Create new preferences
      const { error: createError } = await supabaseAdmin
        .from('user_preferences')
        .insert({
          user_id: userData.id,
          order_updates: orderUpdates,
          newsletter: newsletter,
          promotions: promotions,
          sms_notifications: smsNotifications,
        });

      if (createError) {
        console.error('❌ Create error:', createError);
        return NextResponse.json(
          { error: 'Failed to create preferences' },
          { status: 500 }
        );
      }
    }

    console.log('✅ Preferences updated successfully');

    return NextResponse.json({
      success: true,
      message: 'Preferences updated successfully',
    });
  } catch (error) {
    console.error('🚨 PUT preferences exception:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}