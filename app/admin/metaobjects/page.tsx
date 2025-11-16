// app/admin/metaobjects/page.tsx
// NOWIHT MetaObjects Management - WITH EXCEL IMPORT/EXPORT
// Louis Vuitton aesthetic: minimal, elegant, professional

'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Search, ChevronUp, ChevronDown, Check, X, Download, Upload as UploadIcon } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useAdminStore } from '@/store/adminStore';
import type { MetaObject, MetaObjectType, CreateMetaObjectRequest } from '@/types';

type TabType = 'color' | 'size' | 'material' | 'fabric';

const TABS: { id: TabType; label: string }[] = [
  { id: 'color', label: 'COLORS' },
  { id: 'size', label: 'SIZES' },
  { id: 'material', label: 'MATERIALS' },
  { id: 'fabric', label: 'FABRICS' },
];

export default function MetaObjectsPage() {
  const { isSidebarOpen } = useAdminStore();
  const [activeTab, setActiveTab] = useState<TabType>('color');
  const [metaobjects, setMetaobjects] = useState<Record<TabType, MetaObject[]>>({
    color: [],
    size: [],
    material: [],
    fabric: [],
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MetaObject | null>(null);
  const [stats, setStats] = useState({ color: 0, size: 0, material: 0, fabric: 0 });
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [formData, setFormData] = useState<CreateMetaObjectRequest & { code?: string }>({
    type: 'color',
    name: '',
    value: '',
    code: '',
    is_active: true,
    sort_order: 999,
  });

  // Fetch all metaobjects
  const fetchMetaObjects = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/metaobjects');
      const result = await response.json();

      if (result.success) {
        setMetaobjects(result.data);
        setStats(result.stats);
      }
    } catch (error) {
      console.error('Error fetching metaobjects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetaObjects();
  }, []);

  // Reset selection when tab changes
  useEffect(() => {
    setSelectedItems(new Set());
  }, [activeTab]);

  // Open modal for create
  const handleCreate = () => {
    setEditingItem(null);
    setFormData({
      type: activeTab,
      name: '',
      code: '',
      value: activeTab === 'color' ? '#000000' : '',
      is_active: true,
      sort_order: 999,
    });
    setIsModalOpen(true);
  };

  // Open modal for edit
  const handleEdit = (item: MetaObject) => {
    setEditingItem(item);
    setFormData({
      type: item.type,
      name: item.name,
      code: (item as any).code || '',
      value: item.value || '',
      is_active: item.is_active,
      sort_order: item.sort_order,
    });
    setIsModalOpen(true);
  };

  // Save (create or update)
  const handleSave = async () => {
    try {
      // Auto-generate code if empty
      let code = formData.code?.trim() || '';
      if (!code) {
        code = formData.name.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5);
      }

      const payload = { ...formData, code };

      if (editingItem) {
        // Update
        const response = await fetch(`/api/admin/metaobjects?id=${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.error);

        alert('✓ Updated successfully');
      } else {
        // Create
        const response = await fetch('/api/admin/metaobjects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.error);

        alert('✓ Created successfully');
      }

      setIsModalOpen(false);
      fetchMetaObjects();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  // Delete single item
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item?')) return;

    try {
      const response = await fetch(`/api/admin/metaobjects?id=${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error);

      alert('✓ Deleted successfully');
      fetchMetaObjects();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) return;
    if (!confirm(`Delete ${selectedItems.size} items?`)) return;

    try {
      const promises = Array.from(selectedItems).map(id =>
        fetch(`/api/admin/metaobjects?id=${id}`, { method: 'DELETE' })
      );

      await Promise.all(promises);
      alert(`✓ Deleted ${selectedItems.size} items`);
      setSelectedItems(new Set());
      fetchMetaObjects();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  // Reorder (move up/down)
  const handleReorder = async (item: MetaObject, direction: 'up' | 'down') => {
    const items = getFilteredItems();
    const currentIndex = items.findIndex(i => i.id === item.id);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    try {
      const targetItem = items[targetIndex];

      await fetch(`/api/admin/metaobjects?id=${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, sort_order: targetItem.sort_order }),
      });

      await fetch(`/api/admin/metaobjects?id=${targetItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...targetItem, sort_order: item.sort_order }),
      });

      fetchMetaObjects();
    } catch (error) {
      console.error('Reorder error:', error);
    }
  };

  // Toggle selection
  const toggleSelection = (id: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Select all
  const toggleSelectAll = () => {
    const items = getFilteredItems();
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map(i => i.id)));
    }
  };

  // Download template
  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch('/api/admin/metaobjects/bulk?action=template');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'metaobjects-template.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download template error:', error);
      alert('Failed to download template');
    }
  };

  // Export all
  const handleExport = async () => {
    try {
      const response = await fetch('/api/admin/metaobjects/bulk');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `metaobjects-export-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export');
    }
  };

  // Import from file
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/metaobjects/bulk', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        alert(
          `✓ Import completed!\n\n` +
          `Inserted: ${result.summary.inserted}\n` +
          `Updated: ${result.summary.updated}\n` +
          `Skipped: ${result.summary.skipped}\n` +
          (result.errors ? `\nErrors: ${result.errors.join('\n')}` : '')
        );
        fetchMetaObjects();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      alert(`Import failed: ${error.message}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Filter by search
  const getFilteredItems = (): MetaObject[] => {
    const items = metaobjects[activeTab] || [];
    if (!searchQuery.trim()) return items;

    const query = searchQuery.toLowerCase();
    return items.filter(item =>
      item.name.toLowerCase().includes(query) ||
      ((item as any).code || '').toLowerCase().includes(query)
    );
  };

  const filteredItems = getFilteredItems();
  const hasSelection = selectedItems.size > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight uppercase font-mono">
                MetaObjects
              </h1>
              <p className="text-xs md:text-sm text-gray-600 mt-1 font-light">
                Product Attributes Management
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {/* Download Template */}
              <button
                onClick={handleDownloadTemplate}
                className="px-4 py-2 bg-gray-100 text-gray-900 text-xs md:text-sm font-medium uppercase tracking-wider hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Template
              </button>

              {/* Export */}
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-gray-100 text-gray-900 text-xs md:text-sm font-medium uppercase tracking-wider hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </button>

              {/* Import */}
              <label className="px-4 py-2 bg-blue-600 text-white text-xs md:text-sm font-medium uppercase tracking-wider hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer">
                <UploadIcon className="w-4 h-4" />
                {uploading ? 'Uploading...' : 'Import'}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={handleImport}
                  disabled={uploading}
                  className="hidden"
                />
              </label>

              {/* Add New */}
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-black text-white text-xs md:text-sm font-medium uppercase tracking-wider hover:bg-gray-900 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add New
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-4 md:px-6">
            <div className="flex gap-4 md:gap-8 overflow-x-auto">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 md:px-4 py-3 md:py-4 text-xs md:text-sm font-medium uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-gray-900'
                    }`}
                >
                  {tab.label}
                  <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded">
                    {stats[tab.id]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search & Bulk Actions */}
        <div className="px-4 md:px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeTab}s by name or code...`}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            {/* Bulk Actions */}
            {hasSelection && (
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium uppercase tracking-wider hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete ({selectedItems.size})
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
              <p className="mt-4 text-sm text-gray-600 font-light">Loading...</p>
            </div>
          ) : (
            <div className="bg-white rounded border border-gray-200 overflow-hidden">
              {/* Mobile: Card View */}
              <div className="md:hidden divide-y divide-gray-200">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, index) => (
                    <div key={item.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(item.id)}
                          onChange={() => toggleSelection(item.id)}
                          className="mt-1 w-4 h-4 border-gray-300 rounded focus:ring-black"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {activeTab === 'color' && item.value && (
                              <div
                                className="w-6 h-6 rounded border border-gray-300 flex-shrink-0"
                                style={{ backgroundColor: item.value }}
                              />
                            )}
                            <span className="text-sm font-medium text-gray-900 truncate">
                              {item.name}
                            </span>
                          </div>

                          {(item as any).code && (
                            <code className="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono mr-2">
                              {(item as any).code}
                            </code>
                          )}

                          {activeTab === 'color' && item.value && (
                            <code className="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono">
                              {item.value}
                            </code>
                          )}

                          <div className="flex items-center gap-2 mt-2">
                            {item.is_active ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded">
                                <Check className="w-3 h-3" />
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                                <X className="w-3 h-3" />
                                Inactive
                              </span>
                            )}
                            <span className="text-xs text-gray-500">Order: {item.sort_order}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => handleReorder(item, 'up')}
                            disabled={index === 0}
                            className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-30"
                          >
                            <ChevronUp className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleReorder(item, 'down')}
                            disabled={index === filteredItems.length - 1}
                            className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-30"
                          >
                            <ChevronDown className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                          >
                            <Edit2 className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-12 text-center text-sm text-gray-500">
                    {searchQuery ? 'No results found' : `No ${activeTab}s yet`}
                  </div>
                )}
              </div>

              {/* Desktop: Table View */}
              <table className="hidden md:table w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={filteredItems.length > 0 && selectedItems.size === filteredItems.length}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 border-gray-300 rounded focus:ring-black"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    {activeTab === 'color' && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Color
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedItems.has(item.id)}
                            onChange={() => toggleSelection(item.id)}
                            className="w-4 h-4 border-gray-300 rounded focus:ring-black"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                            {(item as any).code || '-'}
                          </code>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {activeTab === 'color' && item.value && (
                              <div
                                className="w-8 h-8 rounded border border-gray-300"
                                style={{ backgroundColor: item.value }}
                              />
                            )}
                            <span className="text-sm font-medium text-gray-900">
                              {item.name}
                            </span>
                          </div>
                        </td>
                        {activeTab === 'color' && (
                          <td className="px-6 py-4">
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                              {item.value}
                            </code>
                          </td>
                        )}
                        <td className="px-6 py-4">
                          {item.is_active ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                              <Check className="w-3 h-3" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                              <X className="w-3 h-3" />
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {item.sort_order}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleReorder(item, 'up')}
                              disabled={index === 0}
                              className="p-2 hover:bg-gray-100 rounded transition-colors disabled:opacity-30"
                              title="Move up"
                            >
                              <ChevronUp className="w-4 h-4 text-gray-600" />
                            </button>
                            <button
                              onClick={() => handleReorder(item, 'down')}
                              disabled={index === filteredItems.length - 1}
                              className="p-2 hover:bg-gray-100 rounded transition-colors disabled:opacity-30"
                              title="Move down"
                            >
                              <ChevronDown className="w-4 h-4 text-gray-600" />
                            </button>
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-2 hover:bg-gray-100 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4 text-gray-600" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-2 hover:bg-red-50 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={activeTab === 'color' ? 7 : 6} className="px-6 py-12 text-center text-sm text-gray-500">
                        {searchQuery ? 'No results found' : `No ${activeTab}s yet. Click "Add New" to create one.`}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4 uppercase tracking-tight">
              {editingItem ? 'Edit' : 'Add New'} {activeTab}
            </h2>

            <div className="space-y-4">
              {/* Code */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Code (2-5 letters) *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase().slice(0, 5) })}
                  placeholder="e.g., BLK, COT, XS"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-mono uppercase"
                  maxLength={5}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to auto-generate from name
                </p>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={`e.g., ${activeTab === 'color' ? 'Black' :
                      activeTab === 'size' ? 'Extra Large' :
                        activeTab === 'material' ? 'Cotton' : 'Fleece'
                    }`}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              {/* Color Picker (only for colors) */}
              {activeTab === 'color' && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Hex Code *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.value || '#000000'}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.value || '#000000'}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      placeholder="#000000"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded font-mono text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>
              )}

              {/* Active Status */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 border-gray-300 rounded focus:ring-black"
                />
                <label htmlFor="is_active" className="text-sm text-gray-900">
                  Active
                </label>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lower numbers appear first
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-900 rounded hover:bg-gray-50 transition-colors uppercase text-sm tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.name.trim() || (activeTab === 'color' && !formData.value)}
                className="flex-1 px-4 py-2 bg-black text-white rounded hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase text-sm tracking-wider"
              >
                {editingItem ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}