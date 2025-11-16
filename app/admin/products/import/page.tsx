"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ExcelUploader from "@/components/admin/ExcelUploader";
import { ProductService } from "@/lib/services/ProductService";
import { useAdminStore } from "@/store/adminStore";
import { Button } from "@/components/ui/Button";

export default function ImportProductsPage() {
  const [mounted, setMounted] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importComplete, setImportComplete] = useState(false);
  const [importedCount, setImportedCount] = useState(0);
  const router = useRouter();
  const { isSidebarOpen, setProducts } = useAdminStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleImport = async (products: any[]) => {
    setImporting(true);
    try {
      const imported = await ProductService.bulkCreate(products);
      setImportedCount(imported.length);
      setImportComplete(true);

      // Refresh product list in store
      const allProducts = await ProductService.getAll();
      setProducts(allProducts);

      // Show success for 2 seconds then redirect
      setTimeout(() => {
        router.push("/admin/products");
      }, 2000);
    } catch (error) {
      console.error("Error importing products:", error);
      alert("Failed to import products. Please try again.");
    } finally {
      setImporting(false);
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
                Bulk Import Products
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Upload an Excel file to import multiple products at once
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            {importing ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-black mb-4" />
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  Importing Products...
                </p>
                <p className="text-sm text-gray-600">
                  Please wait while we process your file
                </p>
              </div>
            ) : importComplete ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  Import Successful!
                </p>
                <p className="text-sm text-gray-600 mb-6">
                  {importedCount} product{importedCount !== 1 ? "s" : ""} imported successfully
                </p>
                <p className="text-xs text-gray-500">
                  Redirecting to products page...
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <ExcelUploader
                  onImport={handleImport}
                  onCancel={() => router.push("/admin/products")}
                />
              </div>
            )}

            {/* Help Section */}
            {!importing && !importComplete && (
              <div className="mt-6 bg-gray-50 rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Import Guidelines
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-black font-semibold mt-0.5">01</span>
                    <span>Download the Excel template and fill in your product data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black font-semibold mt-0.5">02</span>
                    <span>Required fields: Name, Category, Price</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black font-semibold mt-0.5">03</span>
                    <span>For colors and sizes, use comma-separated values (e.g., "Black,White,Gray")</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black font-semibold mt-0.5">04</span>
                    <span>For image URLs, provide comma-separated links to product images</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black font-semibold mt-0.5">05</span>
                    <span>If there are validation errors, download the error report to fix issues</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}