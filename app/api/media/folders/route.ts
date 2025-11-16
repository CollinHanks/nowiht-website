// app/api/media/folders/route.ts
// API endpoint for listing available media folders

import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Predefined folders used in the app
    const folders = [
      "products",
      "categories",
      "banners",
      "blog",
      "lookbook",
    ];

    return NextResponse.json({
      success: true,
      folders,
    });
  } catch (error: any) {
    console.error("Error listing folders:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}