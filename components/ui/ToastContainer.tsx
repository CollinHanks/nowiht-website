"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Toast as ToastType, useToastStore } from "@/store/toastStore";

/**
 * NOWIHT Toast Component
 * 
 * Luxury Design:
 * - White background (elegant)
 * - Black text (high contrast)
 * - Minimal accents (success: subtle line, error: red line)
 * - Clean typography (IBM Plex Mono)
 * - No icons except close (X)
 * - Smooth animations
 * - Mobile responsive
 */

interface ToastProps {
  toast: ToastType;
}

const Toast = ({ toast }: ToastProps) => {
  const removeToast = useToastStore((state) => state.removeToast);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (toast.persistent) return;

    const duration = toast.duration || 4000;
    const interval = 50; // Update every 50ms
    const decrement = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev - decrement;
        return next <= 0 ? 0 : next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [toast.duration, toast.persistent]);

  // Accent color based on type (minimal)
  const getAccentColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-black'; // Subtle black line
      case 'error':
        return 'bg-red-600'; // Red accent
      case 'warning':
        return 'bg-gray-600'; // Gray accent
      case 'info':
        return 'bg-black'; // Black accent
      default:
        return 'bg-black';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="relative bg-white border border-gray-200 shadow-2xl w-full max-w-sm overflow-hidden"
    >
      {/* Progress bar */}
      {!toast.persistent && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gray-100">
          <motion.div
            className={`h-full ${getAccentColor()}`}
            initial={{ width: "100%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.05, ease: "linear" }}
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          {/* Text content */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <p className="text-sm font-medium text-black mb-1 leading-tight">
              {toast.title}
            </p>

            {/* Message */}
            {toast.message && (
              <p className="text-xs text-gray-600 leading-relaxed">
                {toast.message}
              </p>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 text-gray-400 hover:text-black transition-colors"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className={`h-px ${getAccentColor()} opacity-20`} />
    </motion.div>
  );
};

/**
 * Toast Container
 * Manages and displays all active toasts
 * 
 * Position:
 * - Desktop: top-right
 * - Mobile: top-center
 */
export default function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div
      className="fixed top-4 right-4 left-4 sm:left-auto z-[9999] pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex flex-col gap-3 pointer-events-auto">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}