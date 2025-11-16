import { NextRequest, NextResponse } from "next/server";
import { CategoryService } from "@/lib/services/CategoryService";

/**
 * Categories API Routes
 * 
 * GET    /api/admin/categories - Get all categories
 * POST   /api/admin/categories - Create new category
 * PUT    /api/admin/categories - Update category
 * DELETE /api/admin/categories - Delete category
 */

// GET - Fetch all categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parentOnly = searchParams.get("parentOnly") === "true";
    const parentId = searchParams.get("parentId");

    let categories;

    if (parentOnly) {
      categories = await CategoryService.getParents();
    } else if (parentId) {
      categories = await CategoryService.getChildren(parentId);
    } else {
      categories = await CategoryService.getAll();
    }

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch categories",
      },
      { status: 500 }
    );
  }
}

// POST - Create new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation
    if (!body.name) {
      return NextResponse.json(
        {
          success: false,
          error: "Category name is required",
        },
        { status: 400 }
      );
    }

    const category = await CategoryService.create({
      name: body.name,
      slug: body.slug,
      description: body.description,
      image: body.image,
      parentId: body.parentId,
      seoTitle: body.seoTitle,
      seoDescription: body.seoDescription,
      status: body.status || "active",
      sortOrder: body.sortOrder || 0,
    });

    return NextResponse.json({
      success: true,
      data: category,
      message: "Category created successfully",
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create category",
      },
      { status: 500 }
    );
  }
}

// PUT - Update category
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Category ID is required",
        },
        { status: 400 }
      );
    }

    const category = await CategoryService.update(body.id, {
      name: body.name,
      slug: body.slug,
      description: body.description,
      image: body.image,
      parentId: body.parentId,
      seoTitle: body.seoTitle,
      seoDescription: body.seoDescription,
      status: body.status,
      sortOrder: body.sortOrder,
    });

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: "Category not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
      message: "Category updated successfully",
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update category",
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete category
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Category ID is required",
        },
        { status: 400 }
      );
    }

    await CategoryService.delete(id);

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete category",
      },
      { status: 500 }
    );
  }
}