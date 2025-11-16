"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

/**
 * NOWIHT Page Loader
 * - 2 logos sequential fade animation
 * - Dark mode support (auto-detects system preference)
 * - Louis Vuitton aesthetic: minimal, elegant
 */
export default function PageLoader() {
  const [currentLogo, setCurrentLogo] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Dark mode detection
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    // Logo 1 → Logo 2 transition
    const timer = setTimeout(() => {
      setCurrentLogo(2);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed inset-0 z-[9999] flex items-center justify-center ${isDarkMode ? "bg-black" : "bg-white"
        }`}
    >
      <AnimatePresence mode="wait">
        {currentLogo === 1 ? (
          <motion.div
            key="logo-1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative w-16 h-16 md:w-20 md:h-20"
          >
            <Image
              src="/logos/logo-1.png"
              alt="NOWIHT"
              fill
              className={`object-contain ${isDarkMode ? "invert" : ""}`}
              priority
            />
          </motion.div>
        ) : (
          <motion.div
            key="logo-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative w-48 h-12 md:w-64 md:h-16"
          >
            <Image
              src="/logos/logo-2.png"
              alt="NOWIHT"
              fill
              className={`object-contain ${isDarkMode ? "invert" : ""}`}
              priority
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}