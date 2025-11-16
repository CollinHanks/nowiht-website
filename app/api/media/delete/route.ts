// app/api/media/delete/route.ts
// API endpoint for deleting files from storage

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/client";

const BUCKET_NAME = "product-images";

export async function DELETE(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: "Admin client not initialized" },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { paths } = body;

    if (!paths || !Array.isArray(paths) || paths.length === 0) {
      return NextResponse.json(
        { success: false, error: "No file paths provided" },
        { status: 400 }
      );
    }

    // Delete files
    const { error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .remove(paths);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      deleted: paths.length,
    });
  } catch (error: any) {
    console.error("Error deleting files:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}