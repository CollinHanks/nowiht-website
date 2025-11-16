"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface HomepageSearchBarProps {
  onSearchClick: () => void;
}

export default function HomepageSearchBar({ onSearchClick }: HomepageSearchBarProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // INSTANT HIDE: Scroll biraz yapınca direkt gizle (30px threshold)
          if (currentScrollY > 30) {
            setIsVisible(false);
          } else {
            setIsVisible(true);
          }

          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed left-0 right-0 z-40 lg:hidden",
        "top-16", // Mobile header height (h-16 = 64px)
        // SMOOTH TRANSITION: Fast duration + smooth easing
        "transition-all duration-300 ease-in-out",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-8 pointer-events-none" // Biraz daha fazla translate
      )}
    >
      <div className="max-w-[1920px] mx-auto px-4 py-3 bg-white border-b border-gray-100 shadow-sm">
        <button
          onClick={onSearchClick}
          className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-all duration-300 touch-manipulation"
        >
          <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <span className="text-sm text-gray-500 text-left flex-1">
            Search for products...
          </span>
        </button>
      </div>
    </div>
  );
}