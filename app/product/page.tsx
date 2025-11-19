// app/product/page.tsx
// NOWIHT E-Commerce - Products List Page
// 🔥 Shows all products from Supabase

import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';

// ============================================
// METADATA
// ============================================
export const metadata: Metadata = {
  title: 'All Products | NOWIHT',
  description: 'Discover our complete collection of premium luxury products for women.',
};

// ============================================
// PRODUCT INTERFACE
// ============================================
interface Product {
  id: string;
  name: string;
  slug: string;
  price: string;
  compare_at_price?: string;
  images: string[];
  category: string;
  in_stock: boolean;
  is_new: boolean;
  is_on_sale: boolean;
}

// ============================================
// FETCH PRODUCTS (Server Component)
// ============================================
async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// ============================================
// PRODUCTS LIST PAGE
// ============================================
export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="py-20 md:py-32 border-b border-gray-200">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-6">
            ALL PRODUCTS
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Discover our complete collection of premium luxury products.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6">
          {products.length === 0 ? (
            // Empty State
            <div className="text-center py-20">
              <p className="text-xl text-gray-600 mb-4">No products found.</p>
              <Link
                href="/"
                className="inline-block px-8 py-3 bg-black text-white hover:bg-gray-800 transition-colors"
              >
                BACK TO HOME
              </Link>
            </div>
          ) : (
            // Products Grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="group"
                >
                  {/* Product Card */}
                  <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden mb-4">
                    {/* Image */}
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.is_new && (
                        <span className="px-3 py-1 bg-black text-white text-xs tracking-wider">
                          NEW
                        </span>
                      )}
                      {product.is_on_sale && (
                        <span className="px-3 py-1 bg-red-600 text-white text-xs tracking-wider">
                          SALE
                        </span>
                      )}
                      {!product.in_stock && (
                        <span className="px-3 py-1 bg-gray-800 text-white text-xs tracking-wider">
                          OUT OF STOCK
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-2">
                    {/* Category */}
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      {product.category}
                    </p>

                    {/* Name */}
                    <h3 className="text-base font-light group-hover:text-red-600 transition-colors">
                      {product.name}
                    </h3>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-light">
                        ${parseFloat(product.price).toFixed(2)}
                      </span>
                      {product.compare_at_price && parseFloat(product.compare_at_price) > parseFloat(product.price) && (
                        <span className="text-sm text-gray-400 line-through">
                          ${parseFloat(product.compare_at_price).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}