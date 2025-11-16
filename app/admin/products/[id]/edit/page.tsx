"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ProductForm from "@/components/admin/ProductForm";
import { ProductService } from "@/lib/services/ProductService";
import { useAdminStore } from "@/store/adminStore";
import type { Product } from "@/types";

export default function EditProductPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const router = useRouter();
  const params = useParams();
  const { isSidebarOpen } = useAdminStore();

  const productId = params.id as string;

  useEffect(() => {
    setMounted(true);
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const data = await ProductService.getById(productId);
      if (data) {
        setProduct(data);
      } else {
        alert("Product not found");
        router.push("/admin/products");
      }
    } catch (error) {
      console.error("Error loading product:", error);
      alert("Failed to load product");
      router.push("/admin/products");
    } finally {
      setLoading(false);
    }
  };

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
              <h1 className="text-2xl font-bold text-gray-900">
                {loading ? "Loading..." : `Edit: ${product?.name}`}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Update product information
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          <div className="max-w-5xl mx-auto">
            {loading ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-black" />
                <p className="text-sm text-gray-600 mt-4">Loading product...</p>
              </div>
            ) : product ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <ProductForm
                  product={product}
                  onCancel={() => router.push("/admin/products")}
                  onSave={() => router.push("/admin/products")}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <p className="text-gray-600">Product not found</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}