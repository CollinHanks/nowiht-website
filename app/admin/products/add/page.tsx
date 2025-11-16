"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ProductForm from "@/components/admin/ProductForm";
import { useAdminStore } from "@/store/adminStore";

export default function AddProductPage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { isSidebarOpen } = useAdminStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <main
        className={`transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"
          }`}
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
              <p className="text-sm text-gray-600 mt-1">
                Create a new product in your catalog
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <ProductForm
                onCancel={() => router.push("/admin/products")}
                onSave={() => router.push("/admin/products")}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}