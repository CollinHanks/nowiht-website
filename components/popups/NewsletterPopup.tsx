"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";

/**
 * NOWIHT Newsletter Popup - V2.1 (FIXED)
 * 
 * FIXES:
 * - ✅ useEffect dependency array fixed
 * - ✅ useRef for scroll handler
 * - ✅ Proper cleanup
 */
export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // useRef to track isOpen without causing re-renders
  const isOpenRef = useRef(false);

  // Update ref when isOpen changes
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  // Main popup logic - runs once on mount
  useEffect(() => {
    // 🔧 DEV MODE: Skip popup if flag set
    const devMode = localStorage.getItem("nowiht-dev-mode");
    if (devMode === "true") {
      console.log("📝 Newsletter popup disabled (dev mode)");
      return;
    }

    // Check if already shown
    const hasShown = localStorage.getItem("nowiht-newsletter-shown");
    if (hasShown) return;

    let autoCloseTimeout: NodeJS.Timeout;

    // Show after 5 seconds
    const showTimer = setTimeout(() => {
      setIsOpen(true);
      localStorage.setItem("nowiht-newsletter-shown", "true");

      // ✅ AUTO-CLOSE: 5 seconds after opening
      autoCloseTimeout = setTimeout(() => {
        setIsOpen(false);
      }, 5000);
    }, 5000);

    // ✅ EXIT INTENT: Mouse leave detection
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        clearTimeout(showTimer);
        setIsOpen(true);
        localStorage.setItem("nowiht-newsletter-shown", "true");

        // Auto-close after 5s
        autoCloseTimeout = setTimeout(() => {
          setIsOpen(false);
        }, 5000);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(autoCloseTimeout);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []); // ✅ Empty dependency array - runs once

  // Scroll handler - separate useEffect
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      // Use ref instead of state to avoid dependency issue
      if (isOpenRef.current) {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          setIsOpen(false);
        }, 300);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(scrollTimeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // ✅ Empty dependency array - stable

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    // TODO: Replace with actual API call
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => {
        handleClose();
      }, 2000);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] flex items-center justify-center p-4"
          />

          {/* Popup - FIXED POSITIONING */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative bg-white pointer-events-auto w-full max-w-[500px] md:max-w-[900px] max-h-[90vh] overflow-hidden shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white transition-colors rounded-full"
                aria-label="Close newsletter popup"
              >
                <X size={20} className="text-black" />
              </button>

              {/* Content */}
              <div className="grid md:grid-cols-2 min-h-[400px] md:min-h-[500px]">
                {/* LEFT: Image - MOBILE VISIBLE */}
                <div className="relative bg-gray-100 min-h-[200px] md:min-h-full">
                  <Image
                    src="/newsletter/newsletter-popup-1.jpg"
                    alt="NOWIHT Newsletter"
                    fill
                    className="object-cover"
                    quality={90}
                    priority
                  />
                </div>

                {/* RIGHT: Content */}
                <div className="flex flex-col justify-center p-6 md:p-12">
                  {status === "success" ? (
                    // Success State
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center space-y-4"
                    >
                      <div className="w-12 h-12 md:w-16 md:h-16 mx-auto border-2 border-black rounded-full flex items-center justify-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <svg
                            className="w-6 h-6 md:w-8 md:h-8 text-black"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </motion.div>
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-light mb-2">Welcome to NOWIHT</h3>
                        <p className="text-xs md:text-sm text-gray-600">
                          You're now part of our community
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    // Form State
                    <>
                      <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
                        <div>
                          <h2 className="text-2xl md:text-3xl font-light tracking-tight mb-2 md:mb-3">
                            Join the NOWIHT<br />Community
                          </h2>
                          <p className="text-xs md:text-sm text-gray-600 font-light leading-relaxed">
                            Be first to know about new collections and exclusive access.
                          </p>
                        </div>
                        <div className="w-12 h-px bg-black"></div>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                        <div>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="EMAIL ADDRESS"
                            className="w-full px-4 py-3 md:py-4 border border-gray-300 focus:border-black focus:outline-none text-xs md:text-sm tracking-wide placeholder:text-gray-400 transition-colors"
                            required
                            disabled={status === "loading"}
                          />
                          {status === "error" && (
                            <p className="text-xs text-red-600 mt-2">
                              Please enter a valid email address
                            </p>
                          )}
                        </div>

                        <button
                          type="submit"
                          disabled={status === "loading"}
                          className="w-full px-6 py-3 md:px-8 md:py-4 bg-black text-white text-xs md:text-sm tracking-[0.2em] uppercase font-light 
                                     hover:bg-black/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed
                                     flex items-center justify-center gap-3"
                        >
                          {status === "loading" ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Subscribing...</span>
                            </>
                          ) : (
                            "Subscribe"
                          )}
                        </button>
                      </form>

                      <p className="text-xs text-gray-500 text-center mt-4 md:mt-6 font-light">
                        No spam, ever. Unsubscribe anytime.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}