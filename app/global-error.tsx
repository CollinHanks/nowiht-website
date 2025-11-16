'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertTriangle, Home } from 'lucide-react';

/**
 * NOWIHT - Global Error Page
 * 
 * Catches errors in root layout and provides recovery UI
 * This is a special Next.js file that handles app-wide errors
 * 
 * Difference from error.tsx:
 * - error.tsx: Route-specific errors
 * - global-error.tsx: Root layout errors (rare)
 */

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('Global Error:', error);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <title>Error | NOWIHT</title>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body className="font-mono antialiased">
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
          <div className="max-w-lg w-full text-center">
            {/* Error Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="flex justify-center mb-8"
            >
              <div className="bg-black rounded-full p-6">
                <AlertTriangle className="w-12 h-12 text-red-600" strokeWidth={1.5} />
              </div>
            </motion.div>

            {/* Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4 mb-8"
            >
              <h1 className="text-4xl font-light text-black">
                Something went wrong
              </h1>
              <p className="text-gray-600">
                An unexpected error occurred. Please try again.
              </p>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <button
                onClick={reset}
                className="w-full px-6 py-3 bg-black text-white text-sm uppercase tracking-wider hover:bg-red-600 transition-colors"
              >
                Try Again
              </button>

              <Link
                href="/"
                className="block w-full px-6 py-3 border border-black text-black text-sm uppercase tracking-wider hover:bg-black hover:text-white transition-all"
              >
                <span className="flex items-center justify-center gap-2">
                  <Home className="w-4 h-4" />
                  Go Home
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </body>
    </html>
  );
}