"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Search,
  Grid3x3,
  List,
  Download,
  Trash2,
  Copy,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  HardDrive,
  FolderOpen,
  Loader2,
  Tag,
  AlertTriangle,
  Edit2
} from "lucide-react";
import { useToast } from "@/store/toastStore";
import { MediaService, type MediaItem as MediaServiceItem } from "@/lib/services/MediaService";
import { useAdminStore } from "@/store/adminStore";
import SeoMetadataModal from '@/components/admin/SeoMetadataModal';

type ViewMode = "grid" | "list";
type SortOption = "newest" | "oldest" | "name" | "size";

interface MediaFile extends MediaServiceItem { }

export default function AdminMediaPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<MediaFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [previewImage, setPreviewImage] = useState<MediaFile | null>(null);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const { isSidebarOpen } = useAdminStore();

  // SEO Modal states
  const [seoModalOpen, setSeoModalOpen] = useState(false);
  const [selectedFileForSeo, setSelectedFileForSeo] = useState<MediaFile | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalSize: 0,
    withAltText: 0,
    needsSeo: 0,
  });

  useEffect(() => {
    setMounted(true);
    loadInitialData();
  }, []);

  useEffect(() => {
    if (mounted) {
      loadFiles();
    }
  }, [selectedCategory, mounted]);

  useEffect(() => {
    filterAndSortFiles();
  }, [files, searchQuery, sortBy]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      await loadFiles();
    } catch (error) {
      console.error("Error loading initial data:", error);
      toast.error("Failed to load media library");
    } finally {
      setLoading(false);
    }
  };

  const loadFiles = async () => {
    try {
      // Use MediaService.listMedia() instead of listImages()
      const mediaItems = await MediaService.listMedia(
        selectedCategory !== "all" ? { category: selectedCategory } : undefined
      );

      setFiles(mediaItems);

      // Calculate stats
      const totalSize = mediaItems.reduce((sum, file) => sum + file.size, 0);
      const withAltText = mediaItems.filter(f => f.metadata?.alt_text).length;
      const needsSeo = mediaItems.filter(
        f => !f.metadata?.alt_text || !f.metadata?.seo_filename
      ).length;

      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(
          mediaItems
            .map(f => f.metadata?.category)
            .filter(Boolean) as string[]
        )
      );

      setCategories(["all", ...uniqueCategories]);
      setStats({
        totalFiles: mediaItems.length,
        totalSize,
        withAltText,
        needsSeo,
      });
    } catch (error) {
      console.error("Error loading files:", error);
      toast.error("Failed to load files");
    }
  };

  const filterAndSortFiles = () => {
    let filtered = [...files];

    if (searchQuery) {
      filtered = filtered.filter((file) =>
        file.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.metadata?.alt_text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.metadata?.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "name":
          return a.filename.localeCompare(b.filename);
        case "size":
          return b.size - a.size;
        default:
          return 0;
      }
    });

    setFilteredFiles(filtered);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      handleUpload(selectedFiles);
    }
  };

  const handleUpload = async (filesToUpload: File[]) => {
    const validFiles: File[] = [];

    for (const file of filesToUpload) {
      const validation = MediaService.validateImage(file);
      if (!validation.valid) {
        toast.error(`${file.name}: ${validation.error}`);
      } else {
        validFiles.push(file);
      }
    }

    if (validFiles.length === 0) return;

    setUploading(true);
    setUploadProgress({ current: 0, total: validFiles.length });

    try {
      // Upload files one by one with progress tracking
      const uploadedFiles = await MediaService.uploadMultiple(validFiles);

      toast.success(`Uploaded ${uploadedFiles.length} images`);
      await loadFiles();
    } catch (error) {
      console.error("Error uploading:", error);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      setUploadProgress({ current: 0, total: 0 });
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      handleUpload(droppedFiles);
    }
  };

  const handleSelectFile = (fileId: string) => {
    const newSelection = new Set(selectedFiles);
    if (newSelection.has(fileId)) {
      newSelection.delete(fileId);
    } else {
      newSelection.add(fileId);
    }
    setSelectedFiles(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedFiles.size === filteredFiles.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(filteredFiles.map((f) => f.id)));
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
  };

  const handleDownload = async (file: MediaFile) => {
    try {
      const response = await fetch(file.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Download started");
    } catch (error) {
      console.error("Error downloading:", error);
      toast.error("Download failed");
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!confirm("Delete this image? This action cannot be undone.")) return;

    try {
      const success = await MediaService.deleteMedia(fileId);
      if (success) {
        toast.success("Image deleted");
        await loadFiles();
        setSelectedFiles(new Set());
      } else {
        toast.error("Delete failed");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Delete failed");
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedFiles.size === 0) return;
    if (!confirm(`Delete ${selectedFiles.size} images? This action cannot be undone.`)) return;

    try {
      const ids = Array.from(selectedFiles);
      const deletedCount = await MediaService.deleteMultiple(ids);

      toast.success(`Deleted ${deletedCount} images`);
      await loadFiles();
      setSelectedFiles(new Set());
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Delete failed");
    }
  };

  const handleDownloadSelected = async () => {
    const selected = filteredFiles.filter((f) => selectedFiles.has(f.id));
    for (const file of selected) {
      await handleDownload(file);
    }
  };

  const handleOpenPreview = (file: MediaFile) => {
    setPreviewImage(file);
    const index = filteredFiles.findIndex((f) => f.id === file.id);
    setCurrentPreviewIndex(index);
  };

  const handleClosePreview = () => {
    setPreviewImage(null);
  };

  const handlePrevImage = () => {
    if (currentPreviewIndex > 0) {
      const prevFile = filteredFiles[currentPreviewIndex - 1];
      setPreviewImage(prevFile);
      setCurrentPreviewIndex(currentPreviewIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (currentPreviewIndex < filteredFiles.length - 1) {
      const nextFile = filteredFiles[currentPreviewIndex + 1];
      setPreviewImage(nextFile);
      setCurrentPreviewIndex(currentPreviewIndex + 1);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />

      
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-light">Media Library</h1>
                <p className="text-sm text-gray-600 mt-1">Manage your product images and SEO settings</p>
              </div>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 bg-black text-white px-6 py-3 hover:bg-gray-800 transition-all disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading {uploadProgress.current}/{uploadProgress.total}
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload Images
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wider">Total Files</p>
                  <p className="text-2xl font-light">{stats.totalFiles}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <HardDrive className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wider">Total Size</p>
                  <p className="text-2xl font-light">{formatFileSize(stats.totalSize)}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wider">With Alt Text</p>
                  <p className="text-2xl font-light">{stats.withAltText}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wider">Needs SEO</p>
                  <p className="text-2xl font-light">{stats.needsSeo}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${selectedCategory === category
                    ? "bg-black text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                  }`}
              >
                <FolderOpen className="w-4 h-4" />
                {category === "all" ? "All Images" : category}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 py-3 border-t bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search images, alt text, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm"
              />
            </div>

            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-black text-white" : "bg-white hover:bg-gray-50"}`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 border-l ${viewMode === "list" ? "bg-black text-white" : "bg-white hover:bg-gray-50"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name A-Z</option>
              <option value="size">Size (Largest)</option>
            </select>

            <button
              onClick={handleSelectAll}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm transition-colors"
            >
              {selectedFiles.size === filteredFiles.length ? "Deselect All" : "Select All"}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {selectedFiles.size > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t bg-black text-white overflow-hidden"
            >
              <div className="px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">{selectedFiles.size} selected</span>
                  <button
                    onClick={handleDownloadSelected}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-sm transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={handleDeleteSelected}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
                <button
                  onClick={() => setSelectedFiles(new Set())}
                  className="p-1.5 hover:bg-white/10 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>


      <main className="p-6">
        <AnimatePresence>
          {(isDragging || uploading) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`mb-6 border-2 border-dashed rounded-lg p-8 text-center transition-all ${isDragging ? "border-black bg-gray-100" : "border-gray-300"
                }`}
            >
              {uploading ? (
                <div className="space-y-4">
                  <Loader2 className="w-12 h-12 animate-spin mx-auto text-black" />
                  <div>
                    <p className="text-lg font-medium">
                      Uploading {uploadProgress.current} of {uploadProgress.total}
                    </p>
                    <div className="w-full max-w-md mx-auto mt-4 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-black h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(uploadProgress.current / uploadProgress.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-12 h-12 mx-auto text-gray-400" />
                  <p className="text-lg font-medium">Drop images here to upload</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {filteredFiles.length === 0 ? (
          <div className="bg-white border rounded-lg p-16 text-center">
            <ImageIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-lg text-gray-600 mb-2">
              {searchQuery ? "No images found" : "No images yet"}
            </p>
            <p className="text-sm text-gray-500">
              {searchQuery ? "Try adjusting your search" : "Upload your first image to get started"}
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredFiles.map((file) => (
              <motion.div
                key={file.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`group relative bg-white border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-xl ${selectedFiles.has(file.id) ? "ring-2 ring-black" : ""
                  }`}
              >
                {/* SEO Warning Badge */}
                {(!file.metadata?.alt_text || !file.metadata?.seo_filename) && (
                  <div className="absolute top-2 right-2 z-10 bg-amber-500 text-white p-1 rounded" title="Missing SEO data">
                    <AlertTriangle className="w-3 h-3" />
                  </div>
                )}

                <div className="absolute top-2 left-2 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectFile(file.id);
                    }}
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${selectedFiles.has(file.id)
                        ? "bg-black border-black"
                        : "bg-white border-gray-300 opacity-0 group-hover:opacity-100"
                      }`}
                  >
                    {selectedFiles.has(file.id) && <Check className="w-4 h-4 text-white" />}
                  </button>
                </div>

                <div className="aspect-square relative bg-gray-100" onClick={() => handleOpenPreview(file)}>
                  <Image
                    src={file.url}
                    alt={file.metadata?.alt_text || file.filename}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFileForSeo(file);
                        setSeoModalOpen(true);
                      }}
                      className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                      title="SEO Settings"
                    >
                      <Tag className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyUrl(file.url);
                      }}
                      className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(file);
                      }}
                      className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(file.id);
                      }}
                      className="p-2 bg-white rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-3">
                  <p className="text-xs font-medium truncate mb-1" title={file.filename}>
                    {file.metadata?.seo_filename || file.filename}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatFileSize(file.size)}</span>
                    {file.width && file.height && <span>{file.width}×{file.height}</span>}
                  </div>
                  {file.metadata?.tags && file.metadata.tags.length > 0 && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {file.metadata.tags.slice(0, 2).map((tag, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 px-1 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="w-12 px-4 py-3">
                    <button
                      onClick={handleSelectAll}
                      className="w-5 h-5 rounded border-2 border-gray-300 flex items-center justify-center hover:border-black transition-colors"
                    >
                      {selectedFiles.size === filteredFiles.length && <Check className="w-4 h-4" />}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Preview</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Alt Text</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Size</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Dimensions</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Date</th>
                  <th className="w-32 px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50 group">
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleSelectFile(file.id)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${selectedFiles.has(file.id) ? "bg-black border-black" : "border-gray-300 hover:border-black"
                          }`}
                      >
                        {selectedFiles.has(file.id) && <Check className="w-4 h-4 text-white" />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div
                        className="w-12 h-12 relative rounded overflow-hidden cursor-pointer"
                        onClick={() => handleOpenPreview(file)}
                      >
                        <Image
                          src={file.url}
                          alt={file.metadata?.alt_text || file.filename}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium">{file.metadata?.seo_filename || file.filename}</p>
                      {file.metadata?.tags && (
                        <div className="flex gap-1 mt-1">
                          {file.metadata.tags.slice(0, 2).map((tag, idx) => (
                            <span key={idx} className="text-xs bg-gray-100 px-1 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {file.metadata?.alt_text ? (
                        <p className="text-sm text-gray-600 max-w-xs truncate" title={file.metadata.alt_text}>
                          {file.metadata.alt_text}
                        </p>
                      ) : (
                        <span className="text-sm text-amber-600 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Missing
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{formatFileSize(file.size)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {file.width && file.height ? `${file.width}×${file.height}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{new Date(file.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setSelectedFileForSeo(file);
                            setSeoModalOpen(true);
                          }}
                          className="p-2 hover:bg-gray-100 rounded transition-colors"
                          title="SEO Settings"
                        >
                          <Tag className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleCopyUrl(file.url)}
                          className="p-2 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownload(file)}
                          className="p-2 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(file.id)}
                          className="p-2 hover:bg-red-50 text-red-600 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onClick={handleClosePreview}
          >
            <button
              onClick={handleClosePreview}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
            >
              <X className="w-6 h-6" />
            </button>

            {currentPreviewIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {currentPreviewIndex < filteredFiles.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            <div className="max-w-7xl max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
              <Image
                src={previewImage.url}
                alt={previewImage.metadata?.alt_text || previewImage.filename}
                width={previewImage.width || 1000}
                height={previewImage.height || 1000}
                className="object-contain max-h-[80vh]"
              />

              <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white p-4 backdrop-blur">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{previewImage.metadata?.seo_filename || previewImage.filename}</p>
                    <p className="text-sm text-gray-300">
                      {formatFileSize(previewImage.size)} • {previewImage.width}×{previewImage.height}
                      {previewImage.metadata?.alt_text && (
                        <span className="ml-2">• Alt: {previewImage.metadata.alt_text}</span>
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedFileForSeo(previewImage);
                        setSeoModalOpen(true);
                        handleClosePreview();
                      }}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded transition-colors text-sm"
                    >
                      Edit SEO
                    </button>
                    <button
                      onClick={() => handleCopyUrl(previewImage.url)}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded transition-colors text-sm"
                    >
                      Copy URL
                    </button>
                    <button
                      onClick={() => handleDownload(previewImage)}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded transition-colors text-sm"
                    >
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEO Metadata Modal */}
      {seoModalOpen && selectedFileForSeo && (
        <SeoMetadataModal
          file={selectedFileForSeo}
          isOpen={seoModalOpen}
          onClose={() => {
            setSeoModalOpen(false);
            setSelectedFileForSeo(null);
          }}
          onSave={() => {
            setSeoModalOpen(false);
            setSelectedFileForSeo(null);
            loadFiles(); // Reload to show updated metadata
            toast.success("SEO metadata saved successfully");
          }}
        />
      )}
    </div>
  );
}
