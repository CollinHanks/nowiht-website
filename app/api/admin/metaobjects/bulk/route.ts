// app/api/admin/metaobjects/bulk/route.ts
// NOWIHT MetaObjects Bulk Operations API
// Excel Import/Export & Template Generation

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import type { MetaObject, MetaObjectType } from '@/types';

// You'll need to install: npm install xlsx
// import * as XLSX from 'xlsx';

// ═══════════════════════════════════════════════════════════════
// GET /api/admin/metaobjects/bulk?action=template
// Download Excel template
// ═══════════════════════════════════════════════════════════════
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'template') {
      // Generate Excel template
      const templateData = generateTemplate();
      return new NextResponse(templateData, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="metaobjects-template.csv"',
        },
      });
    }

    // Export all metaobjects
    const { data, error } = await supabase
      .from('metaobjects')
      .select('*')
      .order('type', { ascending: true })
      .order('sort_order', { ascending: true });

    if (error) throw error;

    const csvData = exportToCSV(data || []);
    return new NextResponse(csvData, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="metaobjects-export.csv"',
      },
    });
  } catch (error: any) {
    console.error('Bulk export error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════
// POST /api/admin/metaobjects/bulk
// Import metaobjects from CSV/Excel
// ═══════════════════════════════════════════════════════════════
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Read file content
    const text = await file.text();
    const rows = parseCSV(text);

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Empty file' },
        { status: 400 }
      );
    }

    // Validate and transform data
    const validRows: any[] = [];
    const errors: string[] = [];

    rows.forEach((row, index) => {
      const lineNum = index + 2; // +2 because: 1-indexed + header row
      const validation = validateRow(row, lineNum);

      if (validation.valid) {
        validRows.push(validation.data);
      } else {
        errors.push(`Line ${lineNum}: ${validation.error}`);
      }
    });

    if (errors.length > 0 && validRows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No valid rows found',
          errors: errors.slice(0, 10) // Return first 10 errors
        },
        { status: 400 }
      );
    }

    // Insert valid rows
    const inserted: any[] = [];
    const updated: any[] = [];
    const skipped: string[] = [];

    for (const row of validRows) {
      try {
        // Check if exists (by type + code or type + name)
        const { data: existing } = await supabase
          .from('metaobjects')
          .select('id')
          .eq('type', row.type)
          .or(`code.eq.${row.code},name.eq.${row.name}`)
          .single();

        if (existing) {
          // Update existing
          const { error: updateError } = await supabase
            .from('metaobjects')
            .update({
              code: row.code,
              name: row.name,
              value: row.value || null,
              is_active: row.is_active,
              sort_order: row.sort_order,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existing.id);

          if (updateError) throw updateError;
          updated.push(row);
        } else {
          // Insert new
          const { error: insertError } = await supabase
            .from('metaobjects')
            .insert({
              type: row.type,
              code: row.code,
              name: row.name,
              value: row.value || null,
              is_active: row.is_active,
              sort_order: row.sort_order,
            });

          if (insertError) throw insertError;
          inserted.push(row);
        }
      } catch (err: any) {
        skipped.push(`${row.type}/${row.name}: ${err.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        total: validRows.length,
        inserted: inserted.length,
        updated: updated.length,
        skipped: skipped.length,
      },
      errors: errors.length > 0 ? errors.slice(0, 10) : undefined,
      skipped: skipped.length > 0 ? skipped.slice(0, 10) : undefined,
    });
  } catch (error: any) {
    console.error('Bulk import error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function generateTemplate(): string {
  const headers = ['Type', 'Code', 'Name', 'Value', 'Active', 'SortOrder'];
  const examples = [
    ['color', 'BLK', 'Black', '#000000', 'TRUE', '1'],
    ['color', 'WHT', 'White', '#FFFFFF', 'TRUE', '2'],
    ['color', 'GRY', 'Gray', '#808080', 'TRUE', '3'],
    ['color', 'RED', 'Red', '#DC2626', 'TRUE', '4'],
    ['size', 'XS', 'Extra Small', '', 'TRUE', '1'],
    ['size', 'SM', 'Small', '', 'TRUE', '2'],
    ['size', 'MD', 'Medium', '', 'TRUE', '3'],
    ['size', 'LG', 'Large', '', 'TRUE', '4'],
    ['size', 'XL', 'Extra Large', '', 'TRUE', '5'],
    ['size', 'XXL', '2X Large', '', 'TRUE', '6'],
    ['material', 'COT', 'Cotton', '', 'TRUE', '1'],
    ['material', 'POL', 'Polyester', '', 'TRUE', '2'],
    ['material', 'SPN', 'Spandex', '', 'TRUE', '3'],
    ['fabric', 'FLC', 'Fleece', '', 'TRUE', '1'],
    ['fabric', 'JER', 'Jersey', '', 'TRUE', '2'],
    ['fabric', 'FRE', 'French Terry', '', 'TRUE', '3'],
  ];

  return [headers, ...examples].map(row => row.join(',')).join('\n');
}

function exportToCSV(metaobjects: any[]): string {
  const headers = ['Type', 'Code', 'Name', 'Value', 'Active', 'SortOrder'];
  const rows = metaobjects.map(obj => [
    obj.type,
    obj.code || '',
    obj.name,
    obj.value || '',
    obj.is_active ? 'TRUE' : 'FALSE',
    obj.sort_order?.toString() || '999',
  ]);

  return [headers, ...rows].map(row =>
    row.map(cell => `"${cell}"`).join(',')
  ).join('\n');
}

function parseCSV(text: string): any[] {
  const lines = text.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const rows: any[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    const row: any = {};

    headers.forEach((header, index) => {
      row[header.toLowerCase()] = values[index] || '';
    });

    rows.push(row);
  }

  return rows;
}

function validateRow(row: any, lineNum: number): { valid: boolean; data?: any; error?: string } {
  // Required fields
  if (!row.type) {
    return { valid: false, error: 'Type is required' };
  }
  if (!row.name) {
    return { valid: false, error: 'Name is required' };
  }

  // Validate type
  const validTypes: MetaObjectType[] = ['color', 'size', 'material', 'fabric'];
  if (!validTypes.includes(row.type.toLowerCase())) {
    return { valid: false, error: `Invalid type: ${row.type}` };
  }

  // Validate color hex
  if (row.type.toLowerCase() === 'color' && row.value) {
    if (!/^#[0-9A-Fa-f]{6}$/.test(row.value)) {
      return { valid: false, error: `Invalid hex color: ${row.value}` };
    }
  }

  // Parse active
  const active = row.active?.toUpperCase() === 'TRUE' || row.active === '1';

  // Parse sort_order
  const sortOrder = parseInt(row.sortorder || row.sort_order || '999') || 999;

  // Generate code if missing
  let code = row.code?.toUpperCase() || '';
  if (!code) {
    // Auto-generate code from name
    code = row.name.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5);
  }

  return {
    valid: true,
    data: {
      type: row.type.toLowerCase() as MetaObjectType,
      code,
      name: row.name,
      value: row.value || null,
      is_active: active,
      sort_order: sortOrder,
    },
  };
}