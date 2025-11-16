'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

/**
 * NOWIHT - 500 Server Error Page
 * 
 * Next.js Error Boundary Component
 * Catches all server-side errors and displays luxury error UI
 * 
 * Features:
 * - Minimal luxury design (Black/White/Red)
 * - Retry functionality
 * - Home page navigation
 * - Error details (dev mode only)
 * - Smooth animations
 * - Fully responsive
 * - SEO meta tags
 * 
 * CRITICAL: No <html>, <head>, <body> tags!
 * Layout.tsx provides these. This only renders the error UI.
 */

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to monitoring service (Sentry, LogRocket, etc.)
    console.error('500 Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center">
        {/* Animated Error Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            duration: 0.8,
            type: 'spring',
            stiffness: 200,
            damping: 20
          }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            {/* Pulsing background circle */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.1, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="absolute inset-0 bg-red-600 rounded-full blur-2xl"
            />

            {/* Error icon */}
            <div className="relative bg-black dark:bg-white rounded-full p-8">
              <AlertTriangle
                className="w-16 h-16 sm:w-20 sm:h-20 text-red-600"
                strokeWidth={1.5}
              />
            </div>
          </div>
        </motion.div>

        {/* Error Code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h1 className="text-7xl sm:text-8xl lg:text-9xl font-light tracking-tighter text-black dark:text-white mb-2">
            500
          </h1>
          <div className="h-px w-24 sm:w-32 bg-black dark:bg-white mx-auto mb-4" />
          <p className="text-sm sm:text-base tracking-[0.2em] uppercase text-gray-600 dark:text-gray-400">
            Server Error
          </p>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12 space-y-4"
        >
          <h2 className="text-2xl sm:text-3xl font-light text-black dark:text-white">
            Something went wrong
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
            We encountered an unexpected error. Our team has been notified and is working on a fix.
          </p>

          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === 'development' && (
            <motion.details
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-left"
            >
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-black dark:hover:text-white transition-colors">
                Technical Details (Dev Mode)
              </summary>
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded text-xs font-mono text-left overflow-auto">
                <p className="text-red-600 dark:text-red-400 mb-2">
                  <strong>Error:</strong> {error.message}
                </p>
                {error.digest && (
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong>Digest:</strong> {error.digest}
                  </p>
                )}
                {error.stack && (
                  <pre className="mt-2 text-gray-500 dark:text-gray-400 text-xs whitespace-pre-wrap">
                    {error.stack}
                  </pre>
                )}
              </div>
            </motion.details>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {/* Retry Button */}
          <button
            onClick={reset}
            className="group relative w-full sm:w-auto px-8 py-4 bg-black dark:bg-white text-white dark:text-black overflow-hidden transition-all duration-300 hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white"
          >
            <span className="relative z-10 flex items-center justify-center gap-2 text-sm tracking-wider uppercase">
              <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              Try Again
            </span>

            {/* Hover effect */}
            <motion.div
              className="absolute inset-0 bg-red-600"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </button>

          {/* Home Button */}
          <Link
            href="/"
            className="group relative w-full sm:w-auto px-8 py-4 border border-black dark:border-white text-black dark:text-white overflow-hidden transition-all duration-300 hover:text-white dark:hover:text-black"
          >
            <span className="relative z-10 flex items-center justify-center gap-2 text-sm tracking-wider uppercase">
              <Home className="w-4 h-4" />
              Back to Home
            </span>

            {/* Hover effect */}
            <motion.div
              className="absolute inset-0 bg-black dark:bg-white"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </Link>
        </motion.div>

        {/* Support Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Need help?
          </p>
          <Link
            href="/contact"
            className="text-sm text-black dark:text-white hover:text-red-600 dark:hover:text-red-600 transition-colors underline underline-offset-4"
          >
            Contact our support team
          </Link>
        </motion.div>

        {/* Error Code Reference */}
        {error.digest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6"
          >
            <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">
              Error ID: {error.digest}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}