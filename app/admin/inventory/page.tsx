'use client';

import { useState, useEffect } from 'react';
import { Package, AlertTriangle, TrendingDown, CheckCircle, Upload, RefreshCcw, Download } from 'lucide-react';

interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  stock: number;
  alert_level: number;
  status: string;
  inventory_status?: string;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [adjustments, setAdjustments] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/inventory');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error('Failed to load inventory');
        setProducts([]);
      }
    } catch (error) {
      console.error('Error loading inventory:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStockAdjustment = async (productId: string) => {
    const adjustmentValue = adjustments[productId];
    if (!adjustmentValue) return;

    const adjustment = parseInt(adjustmentValue);
    if (isNaN(adjustment)) return;

    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          adjustment,
          reason: 'Manual adjustment'
        })
      });

      if (response.ok) {
        await loadInventory();
        setAdjustments(prev => ({ ...prev, [productId]: '' }));
      } else {
        alert('Failed to update stock');
      }
    } catch (error) {
      console.error('Stock adjustment failed:', error);
      alert('Stock adjustment failed');
    }
  };

  const exportCSV = () => {
    const csvContent = [
      ['SKU', 'Product', 'Price', 'Stock', 'Alert Level', 'Status'].join(','),
      ...products.map(p => [
        p.sku,
        `"${p.name}"`,
        p.price,
        p.stock,
        p.alert_level,
        p.inventory_status || 'unknown'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    if (filter === 'low_stock') return product.stock > 0 && product.stock <= product.alert_level;
    if (filter === 'out_of_stock') return product.stock === 0;
    if (filter === 'in_stock') return product.stock > product.alert_level;
    return true;
  });

  // Calculate stats
  const stats = {
    total: products.length,
    inStock: products.filter(p => p.stock > p.alert_level).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock <= p.alert_level).length,
    outOfStock: products.filter(p => p.stock === 0).length
  };

  const getStatusBadge = (product: Product) => {
    if (product.stock === 0) {
      return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">Out of Stock</span>;
    }
    if (product.stock <= product.alert_level) {
      return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">Low Stock</span>;
    }
    return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">In Stock</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCcw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light tracking-wide">INVENTORY MANAGEMENT</h1>
        <p className="text-gray-600 mt-2">Track stock levels, manage alerts, and monitor inventory</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold mt-1">{stats.total}</p>
            </div>
            <Package className="h-8 w-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Stock</p>
              <p className="text-2xl font-bold mt-1 text-green-600">{stats.inStock}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold mt-1 text-yellow-600">{stats.lowStock}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold mt-1 text-red-600">{stats.outOfStock}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg border mb-6">
        <div className="p-4 border-b flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded transition ${filter === 'all' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setFilter('in_stock')}
              className={`px-4 py-2 rounded transition ${filter === 'in_stock' ? 'bg-green-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
            >
              In Stock ({stats.inStock})
            </button>
            <button
              onClick={() => setFilter('low_stock')}
              className={`px-4 py-2 rounded transition ${filter === 'low_stock' ? 'bg-yellow-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
            >
              Low Stock ({stats.lowStock})
            </button>
            <button
              onClick={() => setFilter('out_of_stock')}
              className={`px-4 py-2 rounded transition ${filter === 'out_of_stock' ? 'bg-red-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
            >
              Out of Stock ({stats.outOfStock})
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={exportCSV}
              className="px-4 py-2 border rounded hover:bg-gray-50 flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button
              onClick={loadInventory}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              <RefreshCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4">SKU</th>
                <th className="text-left p-4">Product</th>
                <th className="text-center p-4">Price</th>
                <th className="text-center p-4">Stock</th>
                <th className="text-center p-4">Alert Level</th>
                <th className="text-center p-4">Status</th>
                <th className="text-center p-4">Adjust Stock</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-mono text-sm">{product.sku}</td>
                    <td className="p-4">
                      <div className="font-medium">{product.name}</div>
                    </td>
                    <td className="p-4 text-center">${product.price}</td>
                    <td className="p-4 text-center">
                      <span className={`font-bold ${product.stock === 0 ? 'text-red-600' :
                          product.stock <= product.alert_level ? 'text-yellow-600' :
                            'text-green-600'
                        }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="p-4 text-center">{product.alert_level}</td>
                    <td className="p-4 text-center">{getStatusBadge(product)}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <input
                          type="number"
                          value={adjustments[product.id] || ''}
                          onChange={(e) => setAdjustments(prev => ({
                            ...prev,
                            [product.id]: e.target.value
                          }))}
                          placeholder="+/-"
                          className="w-20 px-2 py-1 border rounded text-sm"
                        />
                        <button
                          onClick={() => handleStockAdjustment(product.id)}
                          disabled={!adjustments[product.id]}
                          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Update
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}