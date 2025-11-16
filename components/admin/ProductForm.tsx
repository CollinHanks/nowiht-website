"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Save, X, Plus, Trash2, Barcode } from "lucide-react";
import { Button } from "@/components/ui/Button";
import ImageUploader from "@/components/admin/ImageUploader";
import SearchableMultiSelect from "@/components/admin/SearchableMultiSelect";
import { ProductService } from "@/lib/services/ProductService";
import { CategoryService, type Category } from "@/lib/services/CategoryService";
import { MetaObjectService } from "@/lib/services/MetaObjectService";
import type { Product, MetaObject } from "@/types";

interface ProductFormProps {
  product?: Product;
  onSave?: (product: Product) => void;
  onCancel?: () => void;
}

// ✅ EAN-13 Validation
function validateEAN13(ean: string): boolean {
  if (!/^\d{13}$/.test(ean)) return false;

  const digits = ean.split('').map(Number);
  const checkDigit = digits.pop()!;

  let sum = 0;
  digits.forEach((digit, index) => {
    sum += digit * (index % 2 === 0 ? 1 : 3);
  });

  const calculatedCheck = (10 - (sum % 10)) % 10;
  return calculatedCheck === checkDigit;
}

// ✅ Generate Random EAN-13
function generateEAN13(): string {
  let ean = '';
  for (let i = 0; i < 12; i++) {
    ean += Math.floor(Math.random() * 10);
  }

  const digits = ean.split('').map(Number);
  let sum = 0;
  digits.forEach((digit, index) => {
    sum += digit * (index % 2 === 0 ? 1 : 3);
  });

  const checkDigit = (10 - (sum % 10)) % 10;
  return ean + checkDigit;
}

export default function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  // MetaObjects State
  const [availableColors, setAvailableColors] = useState<MetaObject[]>([]);
  const [availableSizes, setAvailableSizes] = useState<MetaObject[]>([]);
  const [availableMaterials, setAvailableMaterials] = useState<MetaObject[]>([]);
  const [availableFabrics, setAvailableFabrics] = useState<MetaObject[]>([]);
  const [metaObjectsLoading, setMetaObjectsLoading] = useState(true);

  // EAN-13 State
  const [ean13, setEan13] = useState(product?.ean13 || "");
  const [ean13Error, setEan13Error] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    sku: product?.sku || "",
    category: product?.category || "",
    price: product?.price || 0,
    compareAtPrice: product?.compareAtPrice || 0,
    stock: product?.stock || 0,
    seoTitle: product?.seoTitle || "",
    seoDescription: product?.seoDescription || "",
    status: product?.status || "draft",
    isNew: product?.isNew || false,
    isOnSale: product?.isOnSale || false,
  });

  const [images, setImages] = useState<string[]>(product?.images || []);

  // Selected MetaObjects (store names as strings)
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);

  const [careInstructions, setCareInstructions] = useState<string[]>(product?.care || []);
  const [features, setFeatures] = useState<string[]>(product?.features || []);
  const [newCareInstruction, setNewCareInstruction] = useState("");
  const [newFeature, setNewFeature] = useState("");

  // Load categories and metaobjects
  useEffect(() => {
    CategoryService.getAll().then(setCategories);
    loadMetaObjects();
  }, []);

  // Initialize selected values after metaobjects load
  useEffect(() => {
    if (product && availableSizes.length > 0) {
      // Initialize sizes
      if (product.sizes && Array.isArray(product.sizes)) {
        const sizeNames = product.sizes.map(s => typeof s === 'string' ? s : s);
        setSelectedSizes(sizeNames);
      }

      // Initialize colors
      if (product.colors && Array.isArray(product.colors)) {
        const colorNames = product.colors.map(c => {
          if (typeof c === 'string') return c;
          if (typeof c === 'object' && c !== null && 'name' in c) return c.name;
          return '';
        }).filter(Boolean);
        setSelectedColors(colorNames);
      }

      // Initialize material
      if (product.material) {
        setSelectedMaterials([product.material]);
      }
    }
  }, [product, availableSizes.length]);

  // Load MetaObjects from API
  const loadMetaObjects = async () => {
    setMetaObjectsLoading(true);
    try {
      const [colors, sizes, materials, fabrics] = await Promise.all([
        MetaObjectService.getByType('color'),
        MetaObjectService.getByType('size'),
        MetaObjectService.getByType('material'),
        MetaObjectService.getByType('fabric'),
      ]);

      setAvailableColors(colors.filter(c => c.is_active));
      setAvailableSizes(sizes.filter(s => s.is_active));
      setAvailableMaterials(materials.filter(m => m.is_active));
      setAvailableFabrics(fabrics.filter(f => f.is_active));
    } catch (error) {
      console.error('Error loading metaobjects:', error);
      alert('Failed to load product options. Please refresh the page.');
    } finally {
      setMetaObjectsLoading(false);
    }
  };

  // Validate EAN-13 on change
  const handleEAN13Change = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 13);
    setEan13(cleaned);

    if (cleaned.length === 13) {
      if (validateEAN13(cleaned)) {
        setEan13Error("");
      } else {
        setEan13Error("Invalid EAN-13 check digit");
      }
    } else if (cleaned.length > 0) {
      setEan13Error("EAN-13 must be exactly 13 digits");
    } else {
      setEan13Error("");
    }
  };

  // Auto-generate EAN-13
  const handleGenerateEAN13 = () => {
    const newEAN = generateEAN13();
    setEan13(newEAN);
    setEan13Error("");
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addCareInstruction = () => {
    if (newCareInstruction.trim()) {
      setCareInstructions(prev => [...prev, newCareInstruction.trim()]);
      setNewCareInstruction("");
    }
  };

  const removeCareInstruction = (index: number) => {
    setCareInstructions(prev => prev.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures(prev => [...prev, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== index));
  };

  const handleImagesChange = (newImages: string[]) => {
    setImages(newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      alert("Product name is required");
      return;
    }
    if (!formData.category) {
      alert("Please select a category");
      return;
    }
    if (formData.price <= 0) {
      alert("Price must be greater than 0");
      return;
    }

    // EAN-13 Validation
    if (ean13 && ean13.length === 13 && !validateEAN13(ean13)) {
      alert("Invalid EAN-13 barcode. Please check the number or generate a new one.");
      return;
    }

    setLoading(true);

    try {
      // Convert selected metaobjects back to their full objects
      const colorsData = selectedColors.map(name => {
        const color = availableColors.find(c => c.name === name);
        return color ? { name: color.name, hex: color.value || '#000000' } : { name, hex: '#000000' };
      });

      const productData: Partial<Product> = {
        ...formData,
        ean13: ean13 || undefined,
        images: images.length > 0 ? images : [],
        sizes: selectedSizes,
        colors: colorsData,
        material: selectedMaterials[0] || '',
        care: careInstructions,
        features,
        in_stock: formData.stock > 0,
      };

      let savedProduct;
      if (product?.id) {
        savedProduct = await ProductService.update(product.id, productData);
      } else {
        savedProduct = await ProductService.create(productData);
      }

      if (savedProduct) {
        alert('Product saved successfully!');
        onSave?.(savedProduct);
        router.push("/admin/products");
      }
    } catch (error) {
      console.error("❌ Error saving product:", error);
      alert(`Failed to save product: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 space-y-8 bg-white"
    >
      {/* Basic Information */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="e.g., Luxury Cotton Hoodie"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Detailed product description..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SKU
            </label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => handleInputChange("sku", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="AUTO"
            />
          </div>
        </div>

        {/* EAN-13 Barcode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            EAN-13 Barcode
          </label>
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="text"
                value={ean13}
                onChange={(e) => handleEAN13Change(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent font-mono ${ean13Error ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="1234567890123"
                maxLength={13}
              />
              {ean13Error && (
                <p className="text-xs text-red-600 mt-1">{ean13Error}</p>
              )}
            </div>
            <button
              type="button"
              onClick={handleGenerateEAN13}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              title="Generate random EAN-13"
            >
              <Barcode className="w-4 h-4" />
              Generate
            </button>
          </div>
        </div>
      </section>

      {/* Images */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Product Images</h3>
        <ImageUploader
          images={images}
          onChange={handleImagesChange}
          maxImages={8}
        />
      </section>

      {/* Pricing & Inventory */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Pricing & Inventory</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price *
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Compare at Price
            </label>
            <input
              type="number"
              value={formData.compareAtPrice}
              onChange={(e) => handleInputChange("compareAtPrice", parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock
            </label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => handleInputChange("stock", parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              min="0"
            />
          </div>
        </div>
      </section>

      {/* Sizes - Dynamic from MetaObjects */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Available Sizes</h3>
        {metaObjectsLoading ? (
          <div className="text-sm text-gray-500">Loading sizes...</div>
        ) : (
          <SearchableMultiSelect
            type="size"
            label="Sizes"
            options={availableSizes}
            selected={selectedSizes}
            onChange={setSelectedSizes}
            placeholder="Search or add sizes..."
            showColorDots={false}
          />
        )}
      </section>

      {/* Colors - Dynamic from MetaObjects */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Available Colors</h3>
        {metaObjectsLoading ? (
          <div className="text-sm text-gray-500">Loading colors...</div>
        ) : (
          <SearchableMultiSelect
            type="color"
            label="Colors"
            options={availableColors}
            selected={selectedColors}
            onChange={setSelectedColors}
            placeholder="Search or add colors..."
            showColorDots={true}
          />
        )}
      </section>

      {/* Materials - Dynamic from MetaObjects */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Material</h3>
        {metaObjectsLoading ? (
          <div className="text-sm text-gray-500">Loading materials...</div>
        ) : (
          <SearchableMultiSelect
            type="material"
            label="Material"
            options={availableMaterials}
            selected={selectedMaterials}
            onChange={(selected) => setSelectedMaterials(selected.slice(0, 1))}
            placeholder="Select material..."
            showColorDots={false}
          />
        )}
      </section>

      {/* Fabrics - Dynamic from MetaObjects */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Fabric Type</h3>
        {metaObjectsLoading ? (
          <div className="text-sm text-gray-500">Loading fabrics...</div>
        ) : (
          <SearchableMultiSelect
            type="fabric"
            label="Fabric"
            options={availableFabrics}
            selected={selectedFabrics}
            onChange={(selected) => setSelectedFabrics(selected.slice(0, 1))}
            placeholder="Select fabric..."
            showColorDots={false}
          />
        )}
      </section>

      {/* Care Instructions */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Care Instructions</h3>
        <div className="space-y-2">
          {careInstructions.map((instruction, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={instruction}
                readOnly
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
              <button
                type="button"
                onClick={() => removeCareInstruction(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newCareInstruction}
              onChange={(e) => setNewCareInstruction(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addCareInstruction())
              }
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Add care instruction"
            />
            <button
              type="button"
              onClick={addCareInstruction}
              className="p-2 bg-black text-white rounded hover:bg-gray-800"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Product Features</h3>
        <div className="space-y-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={feature}
                readOnly
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Add feature"
            />
            <button
              type="button"
              onClick={addFeature}
              className="p-2 bg-black text-white rounded hover:bg-gray-800"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* SEO */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">SEO</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SEO Title
          </label>
          <input
            type="text"
            value={formData.seoTitle}
            onChange={(e) => handleInputChange("seoTitle", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Leave empty to use product name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SEO Description
          </label>
          <textarea
            value={formData.seoDescription}
            onChange={(e) => handleInputChange("seoDescription", e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Leave empty to use product description"
          />
        </div>
      </section>

      {/* Status */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Status & Badges</h3>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isNew}
              onChange={(e) => handleInputChange("isNew", e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm">Mark as NEW</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isOnSale}
              onChange={(e) => handleInputChange("isOnSale", e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm">Mark as ON SALE</span>
          </label>
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" disabled={loading || !!ean13Error}>
          <Save className="w-4 h-4 mr-2" />
          {loading ? "Saving..." : product ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}