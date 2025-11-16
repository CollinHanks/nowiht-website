"use client";

import { Edit, Trash2, Eye, EyeOff } from "lucide-react";
import type { Category } from "@/lib/services/CategoryService";

interface CategoriesTableProps {
  categories: Category[];
  loading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

function CategoriesTable({
  categories,
  loading,
  onEdit,
  onDelete,
}: CategoriesTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12">
        <div className="text-center">
          <div className="text-gray-400 mb-2">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No categories found
          </h3>
          <p className="text-sm text-gray-600">
            Try adjusting your search or filter criteria
          </p>
        </div>
      </div>
    );
  }

  const organizedCategories = organizeCategories(categories);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Products
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                SEO
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {organizedCategories.map((item) => (
              <CategoryRow
                key={item.category.id}
                category={item.category}
                level={item.level}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-gray-200">
        {organizedCategories.map((item) => (
          <CategoryCard
            key={item.category.id}
            category={item.category}
            level={item.level}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

function CategoryRow({
  category,
  level,
  onEdit,
  onDelete,
}: {
  category: Category;
  level: number;
  onEdit: (cat: Category) => void;
  onDelete: (id: string) => void;
}) {
  const hasSEO = category.seoTitle && category.seoDescription;

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3" style={{ paddingLeft: `${level * 24}px` }}>
          {category.image && (
            <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div>
            <div className="text-sm font-medium text-gray-900">{category.name}</div>
            {category.description && (
              <div className="text-xs text-gray-600 truncate max-w-xs">
                {category.description}
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
          {category.slug}
        </code>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-900">{category.productCount}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 py-1 text-xs font-medium uppercase tracking-wider rounded border ${category.status === "active"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-gray-50 text-gray-700 border-gray-200"
            }`}
        >
          {category.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {hasSEO ? (
          <Eye className="w-4 h-4 text-green-600" />
        ) : (
          <EyeOff className="w-4 h-4 text-gray-400" />
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onEdit(category)}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => onDelete(category.id)}
            className="p-2 hover:bg-red-50 rounded transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function CategoryCard({
  category,
  level,
  onEdit,
  onDelete,
}: {
  category: Category;
  level: number;
  onEdit: (cat: Category) => void;
  onDelete: (id: string) => void;
}) {
  const hasSEO = category.seoTitle && category.seoDescription;

  return (
    <div
      className="p-4 hover:bg-gray-50 transition-colors"
      style={{ paddingLeft: `${16 + level * 16}px` }}
    >
      <div className="flex items-start gap-3">
        {category.image && (
          <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 mb-1">
                {category.name}
              </div>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                {category.slug}
              </code>
            </div>
            <span
              className={`px-2 py-1 text-xs font-medium uppercase tracking-wider rounded border ml-2 ${category.status === "active"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-gray-50 text-gray-700 border-gray-200"
                }`}
            >
              {category.status}
            </span>
          </div>

          {category.description && (
            <p className="text-xs text-gray-600 mb-2 line-clamp-2">
              {category.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
            <span>{category.productCount} products</span>
            <span className="flex items-center gap-1">
              {hasSEO ? (
                <>
                  <Eye className="w-3 h-3 text-green-600" />
                  SEO
                </>
              ) : (
                <>
                  <EyeOff className="w-3 h-3 text-gray-400" />
                  No SEO
                </>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(category)}
              className="flex items-center gap-2 px-3 py-1.5 bg-black text-white text-xs rounded hover:bg-gray-800 transition-colors"
            >
              <Edit className="w-3 h-3" />
              Edit
            </button>
            <button
              onClick={() => onDelete(category.id)}
              className="flex items-center gap-2 px-3 py-1.5 border border-red-300 text-red-600 text-xs rounded hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function organizeCategories(categories: Category[]) {
  const result: { category: Category; level: number }[] = [];

  const addCategory = (cat: Category, level: number) => {
    result.push({ category: cat, level });

    const children = categories.filter((c) => c.parentId === cat.id);
    children.forEach((child) => addCategory(child, level + 1));
  };

  const parents = categories.filter((c) => !c.parentId);
  parents.forEach((parent) => addCategory(parent, 0));

  return result;
}

export default CategoriesTable;