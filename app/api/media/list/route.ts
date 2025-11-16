// app/api/media/list/route.ts
// API endpoint for listing files in a folder

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/client";

const BUCKET_NAME = "product-images";

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: "Admin client not initialized" },
        { status: 500 }
      );
    }

    // Get folder from query params
    const searchParams = request.nextUrl.searchParams;
    const folder = searchParams.get("folder") || "products";

    // List files in folder
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .list(folder, {
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) throw error;

    // Format files
    const files = data
      .filter((file) => file.name !== ".emptyFolderPlaceholder")
      .map((file) => {
        const url = supabaseAdmin!.storage
          .from(BUCKET_NAME)
          .getPublicUrl(`${folder}/${file.name}`).data.publicUrl;

        return {
          id: `${folder}/${file.name}`,
          name: file.name,
          url,
          size: file.metadata?.size || 0,
          type: file.metadata?.mimetype || "image/jpeg",
          folder,
          createdAt: file.created_at || new Date().toISOString(),
        };
      });

    return NextResponse.json({
      success: true,
      files,
    });
  } catch (error: any) {
    console.error("Error listing files:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}