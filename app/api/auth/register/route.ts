// app/api/auth/register/route.ts
// ═══════════════════════════════════════════════════════════════
// 🔐 NOWIHT - USER REGISTRATION API
// Phase 10: Email System Integration - Welcome Email
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { EmailService } from '@/lib/services/EmailService';
import bcrypt from 'bcryptjs';

interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

/**
 * POST /api/auth/register
 * Register a new user and send welcome email
 */
export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();

    // ───────────────────────────────────────────────────────────────
    // ✅ VALIDATE INPUT
    // ───────────────────────────────────────────────────────────────

    if (!body.email || !body.password || !body.firstName || !body.lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength (min 8 chars)
    if (body.password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // ───────────────────────────────────────────────────────────────
    // 🔍 CHECK IF USER EXISTS
    // ───────────────────────────────────────────────────────────────

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', body.email.toLowerCase())
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // ───────────────────────────────────────────────────────────────
    // 🔒 HASH PASSWORD
    // ───────────────────────────────────────────────────────────────

    const hashedPassword = await bcrypt.hash(body.password, 10);

    // ───────────────────────────────────────────────────────────────
    // 👤 CREATE USER
    // ───────────────────────────────────────────────────────────────

    const userData = {
      email: body.email.toLowerCase(),
      password: hashedPassword,
      first_name: body.firstName,
      last_name: body.lastName,
      phone: body.phone || null,
      is_active: true,
      email_verified: false, // Can be verified later via email
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: user, error: createError } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();

    if (createError || !user) {
      console.error('❌ User creation error:', createError);
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    // ───────────────────────────────────────────────────────────────
    // 📧 SEND WELCOME EMAIL
    // ───────────────────────────────────────────────────────────────

    try {
      await EmailService.sendWelcomeEmail({
        to: body.email,
        name: body.firstName,
      });
      console.log('✅ Welcome email sent:', body.email);
    } catch (emailError) {
      console.error('⚠️  Welcome email failed (non-blocking):', emailError);
      // Don't fail registration if email fails
    }

    // ───────────────────────────────────────────────────────────────
    // ✅ SUCCESS RESPONSE
    // ───────────────────────────────────────────────────────────────

    return NextResponse.json({
      success: true,
      message: 'Registration successful! Welcome email sent.',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Registration error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}