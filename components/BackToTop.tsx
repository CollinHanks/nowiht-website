"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* Back to Top Button - Hidden on Mobile (Bottom Nav present), Visible on Desktop */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-4 right-4 sm:bottom-5 sm:right-5 md:bottom-6 md:right-6 lg:bottom-6 lg:right-6 xl:bottom-7 xl:right-7 z-50 group transition-all duration-500 hidden lg:block ${isVisible
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        aria-label="Back to top - NOWIHT"
      >
        {/* Container with border and background */}
        <div className="relative">
          {/* Main button - Arithmetic responsive sizes */}
          <div className="w-12 h-12 xl:w-13 xl:h-13 bg-white border-2 border-black flex items-center justify-center transition-all duration-300 group-hover:bg-black group-hover:scale-110 group-hover:shadow-2xl">
            {/* Logo - Proportional to button size */}
            <div className="w-6 h-6 xl:w-6.5 xl:h-6.5 relative transition-all duration-300 group-hover:scale-110">
              <Image
                src="/nowiht-black-emblem-logo-for-back-to-top-button.png"
                alt="NOWIHT logo - Back to top button"
                fill
                className="object-contain transition-all duration-300 group-hover:brightness-0 group-hover:invert"
                sizes="24px"
              />
            </div>
          </div>

          {/* Animated border accent - red luxury detail */}
          <div className="absolute inset-0 border border-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-110"></div>
        </div>

        {/* Hover tooltip - only visible on large screens */}
        <div className="hidden xl:block absolute bottom-full right-0 mb-2 px-2.5 py-1 bg-black text-white text-[10px] tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none">
          BACK TO TOP
          <div className="absolute top-full right-3 w-0 h-0 border-l-3 border-r-3 border-t-3 border-transparent border-t-black"></div>
        </div>
      </button>
    </>
  );
}