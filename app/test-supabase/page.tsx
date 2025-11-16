// app/test-supabase/page.tsx
// Supabase connection test page

import { testConnection } from '@/lib/supabase/client';
import { getAllCategories, getAllProducts } from '@/lib/supabase/products';

export const dynamic = 'force-dynamic';

export default async function TestSupabasePage() {
  // Test connection
  const connectionTest = await testConnection();

  // Get categories
  const categories = await getAllCategories();

  // Get products
  const products = await getAllProducts();

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-white/20 pb-6">
          <h1 className="text-4xl font-light tracking-wider mb-2">
            SUPABASE CONNECTION TEST
          </h1>
          <p className="text-white/60 text-sm tracking-wide">
            Testing backend integration for NOWIHT
          </p>
        </div>

        {/* Connection Status */}
        <div className="border border-white/20 p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm tracking-wide">CONNECTION STATUS</span>
            <span
              className={`px-4 py-1 text-xs tracking-wider ${connectionTest.success
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}
            >
              {connectionTest.success ? 'CONNECTED' : 'FAILED'}
            </span>
          </div>
          <p className="text-white/60 text-sm">{connectionTest.message}</p>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/20 pb-2">
            <h2 className="text-xl font-light tracking-wider">CATEGORIES</h2>
            <span className="text-sm text-white/60">
              {categories.length} found
            </span>
          </div>
          {categories.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {categories.map((cat: any) => (
                <div
                  key={cat.id}
                  className="border border-white/20 p-4 hover:border-white/40 transition"
                >
                  <h3 className="text-sm font-medium tracking-wide">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-white/60 mt-1">{cat.slug}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/60 text-sm">No categories found</p>
          )}
        </div>

        {/* Products */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/20 pb-2">
            <h2 className="text-xl font-light tracking-wider">PRODUCTS</h2>
            <span className="text-sm text-white/60">
              {products.length} found
            </span>
          </div>
          {products.length > 0 ? (
            <div className="space-y-4">
              {products.map((product: any) => (
                <div
                  key={product.id}
                  className="border border-white/20 p-4 hover:border-white/40 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-medium tracking-wide">
                        {product.name}
                      </h3>
                      <p className="text-xs text-white/60 mt-1">
                        {product.category} • {product.slug}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-light">₺{product.price}</p>
                      <span
                        className={`text-xs px-2 py-0.5 mt-1 inline-block ${product.status === 'published'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                          }`}
                      >
                        {product.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/60 text-sm">
              No products found. Let&apos;s add some!
            </p>
          )}
        </div>

        {/* Environment Check */}
        <div className="border border-white/20 p-6 space-y-2 bg-white/5">
          <h2 className="text-sm tracking-wide font-medium mb-3">
            ENVIRONMENT VARIABLES
          </h2>
          <div className="space-y-1 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-white/60">NEXT_PUBLIC_SUPABASE_URL:</span>
              <span
                className={
                  process.env.NEXT_PUBLIC_SUPABASE_URL
                    ? 'text-green-400'
                    : 'text-red-400'
                }
              >
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ SET' : '✗ MISSING'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">
                NEXT_PUBLIC_SUPABASE_ANON_KEY:
              </span>
              <span
                className={
                  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
                    ? 'text-green-400'
                    : 'text-red-400'
                }
              >
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
                  ? '✓ SET'
                  : '✗ MISSING'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">SUPABASE_SERVICE_ROLE_KEY:</span>
              <span
                className={
                  process.env.SUPABASE_SERVICE_ROLE_KEY
                    ? 'text-green-400'
                    : 'text-red-400'
                }
              >
                {process.env.SUPABASE_SERVICE_ROLE_KEY
                  ? '✓ SET'
                  : '✗ MISSING'}
              </span>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="pt-6 border-t border-white/20">
          <a
            href="/"
            className="text-sm tracking-wider text-white/60 hover:text-white transition"
          >
            &larr; BACK TO HOME
          </a>
        </div>
      </div>
    </div>
  );
}