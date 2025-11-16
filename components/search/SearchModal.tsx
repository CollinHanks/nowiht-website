"use client";

import { useState, useEffect, useRef } from "react";
import { X, Search, Clock, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { searchProducts, POPULAR_SEARCHES } from "@/lib/search";
import { CATEGORIES } from "@/lib/constants";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem("recentSearches");
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
      // Auto-focus input
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Live search with improved logic
  useEffect(() => {
    if (query.length > 1) {
      setIsSearching(true);
      // Debounce search
      const timer = setTimeout(() => {
        const searchResults = searchProducts(query, 6);
        setResults(searchResults);
        setIsSearching(false);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setIsSearching(false);
    }
  }, [query]);

  // Save search to recent
  const saveSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    const updated = [
      searchQuery,
      ...recentSearches.filter((s) => s !== searchQuery),
    ].slice(0, 5);

    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  // Handle search submit
  const handleSearch = () => {
    if (query.trim()) {
      saveSearch(query);
      onClose();
      window.location.href = `/shop?search=${encodeURIComponent(query)}`;
    }
  };

  // Clear recent searches
  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  // ESC to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative h-full flex flex-col">
        {/* Header */}
        <div className="border-b border-white/10">
          <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 md:py-6 flex items-center gap-3 md:gap-4">
            {/* Search Input */}
            <div className="flex-1 flex items-center gap-3 bg-white/5 border border-white/20 px-4 md:px-6 py-3 md:py-4 focus-within:border-white/40 transition-colors">
              <Search className="w-5 h-5 text-white/60 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search for products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 bg-transparent text-white placeholder:text-white/40 outline-none text-base md:text-lg"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="text-white/60 hover:text-white transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-3 text-white/60 hover:text-white hover:bg-white/5 transition-colors flex-shrink-0"
              aria-label="Close search"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8">
            {/* Loading State */}
            {isSearching && (
              <div className="text-center py-8">
                <div className="inline-block w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <p className="text-white/60 text-sm mt-3">Searching...</p>
              </div>
            )}

            {/* Search Results */}
            {!isSearching && query && results.length > 0 && (
              <div className="mb-8 md:mb-12">
                <h3 className="text-white/60 text-xs md:text-sm uppercase tracking-wider mb-4 md:mb-6">
                  Products ({results.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      onClick={() => {
                        saveSearch(query);
                        onClose();
                      }}
                      className="group"
                    >
                      <div className="relative aspect-[3/4] mb-3 overflow-hidden bg-white/5">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <h4 className="text-white text-sm font-medium mb-1 group-hover:text-white/70 transition-colors line-clamp-1">
                        {product.name}
                      </h4>
                      <p className="text-white/60 text-sm">${product.price}</p>
                      {/* Show relevance score in dev mode */}
                      {process.env.NODE_ENV === "development" && (
                        <p className="text-white/30 text-xs mt-1">
                          Score: {product.relevance.toFixed(2)}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {!isSearching && query && results.length === 0 && (
              <div className="text-center py-8 md:py-12">
                <Search className="w-10 h-10 md:w-12 md:h-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-white text-lg md:text-xl mb-2">No results found for "{query}"</h3>
                <p className="text-white/60 mb-6 text-sm md:text-base">
                  Try searching with different keywords or browse our categories
                </p>
                <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
                  {CATEGORIES.slice(0, 6).map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/shop/${cat.slug}`}
                      onClick={onClose}
                      className="px-3 md:px-4 py-2 border border-white/20 text-white text-xs md:text-sm hover:bg-white/5 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Searches */}
            {!query && recentSearches.length > 0 && (
              <div className="mb-6 md:mb-8">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <h3 className="text-white/60 text-xs md:text-sm uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Recent Searches
                  </h3>
                  <button
                    onClick={clearRecent}
                    className="text-white/40 text-xs hover:text-white/60 transition-colors"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => setQuery(search)}
                      className="px-3 md:px-4 py-2 bg-white/5 border border-white/10 text-white text-xs md:text-sm hover:bg-white/10 hover:border-white/20 transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            {!query && (
              <div>
                <h3 className="text-white/60 text-xs md:text-sm uppercase tracking-wider mb-4 md:mb-6 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Popular Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => setQuery(search)}
                      className="px-3 md:px-4 py-2 bg-white/5 border border-white/10 text-white text-xs md:text-sm hover:bg-white/10 hover:border-white/20 transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Hint */}
        <div className="border-t border-white/10 px-4 md:px-6 py-3 md:py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-white/40">
            <span className="hidden sm:inline">Press ESC to close</span>
            <span>Press ENTER to search</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}