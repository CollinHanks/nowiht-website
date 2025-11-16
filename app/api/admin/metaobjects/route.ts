// app/api/admin/metaobjects/route.ts
// NOWIHT MetaObjects API - WITH CODE FIELD (FIXED UPDATE LOGIC)
// CRUD operations for colors, sizes, materials, fabrics

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import type { MetaObject, MetaObjectType, CreateMetaObjectRequest } from '@/types';

// ═══════════════════════════════════════════════════════════════
// GET /api/admin/metaobjects
// Fetch all metaobjects grouped by type
// ═══════════════════════════════════════════════════════════════
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as MetaObjectType | null;

    let query = supabase
      .from('metaobjects')
      .select('*')
      .order('sort_order', { ascending: true });

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Group by type
    const grouped: Record<MetaObjectType, MetaObject[]> = {
      color: [],
      size: [],
      material: [],
      fabric: [],
    };

    data?.forEach((item) => {
      if (item.type in grouped) {
        grouped[item.type as MetaObjectType].push(item as MetaObject);
      }
    });

    // Calculate stats
    const stats = {
      color: grouped.color.length,
      size: grouped.size.length,
      material: grouped.material.length,
      fabric: grouped.fabric.length,
    };

    return NextResponse.json({
      success: true,
      data: grouped,
      stats,
    });
  } catch (error: any) {
    console.error('GET metaobjects error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════
// POST /api/admin/metaobjects
// Create a new metaobject
// ═══════════════════════════════════════════════════════════════
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as CreateMetaObjectRequest & { code?: string };

    // Validation
    if (!body.type || !body.name) {
      return NextResponse.json(
        { success: false, error: 'Type and name are required' },
        { status: 400 }
      );
    }

    // Auto-generate code if not provided or empty
    let code = body.code?.trim().toUpperCase() || '';
    if (!code) {
      code = body.name.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5);
    }

    // Check if code already exists for this type
    if (code) {
      const { data: existing } = await supabase
        .from('metaobjects')
        .select('id')
        .eq('type', body.type)
        .eq('code', code)
        .single();

      if (existing) {
        return NextResponse.json(
          { success: false, error: `Code "${code}" already exists for ${body.type}` },
          { status: 400 }
        );
      }
    }

    // Insert
    const { data, error } = await supabase
      .from('metaobjects')
      .insert({
        type: body.type,
        code,
        name: body.name,
        value: body.value || null,
        metadata: body.metadata || null,
        is_active: body.is_active !== undefined ? body.is_active : true,
        sort_order: body.sort_order || 999,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error('POST metaobject error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════
// PUT /api/admin/metaobjects?id=xxx
// Update an existing metaobject
// ═══════════════════════════════════════════════════════════════
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json() as Partial<CreateMetaObjectRequest> & { code?: string };

    // Get current item to know its type
    const { data: current } = await supabase
      .from('metaobjects')
      .select('*')
      .eq('id', id)
      .single();

    if (!current) {
      return NextResponse.json(
        { success: false, error: 'MetaObject not found' },
        { status: 404 }
      );
    }

    // Build update object
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    // Update name
    if (body.name !== undefined && body.name.trim()) {
      updateData.name = body.name.trim();
    }

    // 🔧 FIX: Handle code update properly
    if (body.code !== undefined) {
      let code = body.code.trim().toUpperCase();

      // Auto-generate if empty
      if (!code && updateData.name) {
        code = updateData.name.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5);
      } else if (!code && current.name) {
        code = current.name.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5);
      }

      // Check uniqueness if code changed
      if (code && code !== current.code) {
        const { data: existing } = await supabase
          .from('metaobjects')
          .select('id')
          .eq('type', current.type)
          .eq('code', code)
          .neq('id', id)
          .single();

        if (existing) {
          return NextResponse.json(
            { success: false, error: `Code "${code}" already exists for this type` },
            { status: 400 }
          );
        }
      }

      updateData.code = code || null;
    }

    // Update value (for colors)
    if (body.value !== undefined) {
      updateData.value = body.value || null;
    }

    // Update metadata
    if (body.metadata !== undefined) {
      updateData.metadata = body.metadata;
    }

    // Update is_active
    if (body.is_active !== undefined) {
      updateData.is_active = body.is_active;
    }

    // Update sort_order
    if (body.sort_order !== undefined) {
      updateData.sort_order = body.sort_order;
    }

    const { data, error } = await supabase
      .from('metaobjects')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error('PUT metaobject error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════
// DELETE /api/admin/metaobjects?id=xxx
// Delete a metaobject
// ═══════════════════════════════════════════════════════════════
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('metaobjects')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    console.error('DELETE metaobject error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}