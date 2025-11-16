'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Smartphone, Zap } from 'lucide-react';
import Image from 'next/image';

/**
 * NOWIHT - PWA Install Prompt
 * Luxury "Add to Home Screen" prompt
 * 
 * CURRENTLY DISABLED - To enable, import this in layout.tsx
 */

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // ✅ FIX: localStorage kontrolü artık useEffect içinde (client-side)
    const dismissedTime = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissedTime && Date.now() - parseInt(dismissedTime) < 7 * 24 * 60 * 60 * 1000) {
      setIsDismissed(true);
      return;
    }

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) return;

    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // 5 saniye sonra göster
      setTimeout(() => setShowPrompt(true), 5000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // iOS cihazlarda 8 saniye sonra göster
    if (iOS) {
      setTimeout(() => setShowPrompt(true), 8000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  // Eğer daha önce dismiss edilmişse hiçbir şey gösterme
  if (isDismissed) return null;

  // Prompt gösterilmeyecekse hiçbir şey render etme
  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-4"
        onClick={handleDismiss}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full overflow-hidden shadow-2xl"
        >
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors z-10"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          <div className="bg-black text-white p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
              <Image
                src="/images/nowiht-logo-black-amblem.png"
                alt="NOWIHT"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">Install NOWIHT App</h3>
            <p className="text-sm text-gray-300">Get the full luxury experience</p>
          </div>

          <div className="p-6 space-y-4">
            <Feature icon={<Zap className="w-5 h-5" />} title="Lightning Fast" desc="Instant loading with offline support" />
            <Feature icon={<Smartphone className="w-5 h-5" />} title="Native App Feel" desc="Full-screen without browser" />
            <Feature icon={<Download className="w-5 h-5" />} title="Easy Access" desc="One tap from your home screen" />
          </div>

          <div className="p-6 pt-0 space-y-3">
            {!isIOS && deferredPrompt && (
              <button
                onClick={handleInstallClick}
                className="w-full py-4 bg-black text-white font-medium uppercase tracking-wider hover:bg-gray-900 transition-all rounded-lg"
              >
                Install Now
              </button>
            )}
            {isIOS && (
              <div className="text-center py-3 px-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-2">Tap <strong>Share</strong> then <strong>Add to Home Screen</strong></p>
              </div>
            )}
            <button
              onClick={handleDismiss}
              className="w-full py-3 text-sm text-gray-600 hover:text-black transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 flex-shrink-0 bg-black rounded-full flex items-center justify-center text-white">
        {icon}
      </div>
      <div>
        <p className="font-medium text-sm mb-1">{title}</p>
        <p className="text-xs text-gray-600">{desc}</p>
      </div>
    </div>
  );
}