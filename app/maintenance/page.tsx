'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Mail, Check, AlertCircle, Instagram, Twitter, Facebook } from 'lucide-react';

/**
 * NOWIHT - Maintenance Mode Page
 * 
 * Displays when site is under maintenance
 * 
 * Features:
 * - Countdown timer to estimated completion
 * - Email notification signup
 * - Social media links
 * - Minimal luxury design
 * - Smooth animations
 * - Fully responsive
 * - Brand logo
 * 
 * Usage:
 * - Set NEXT_PUBLIC_MAINTENANCE_MODE=true in .env
 * - Add middleware check to redirect to /maintenance
 * - Set NEXT_PUBLIC_MAINTENANCE_END_TIME=ISO_DATE in .env
 */

// Set maintenance end time (change this or use env variable)
const MAINTENANCE_END = process.env.NEXT_PUBLIC_MAINTENANCE_END_TIME || 
  new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(); // 4 hours from now

export default function MaintenancePage() {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  const [email, setEmail] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Countdown timer
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(MAINTENANCE_END).getTime() - Date.now();

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor(difference / (1000 * 60 * 60)),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  // Email notification signup
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSubmitStatus('error');
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setSubmitStatus('loading');
    setErrorMessage('');

    try {
      // TODO: Replace with actual API call
      // await fetch('/api/maintenance-notifications', {
      //   method: 'POST',
      //   body: JSON.stringify({ email }),
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSubmitStatus('success');
      setEmail('');
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  // Social media links
  const socialLinks = [
    { name: 'Instagram', icon: Instagram, url: 'https://instagram.com/nowiht' },
    { name: 'Twitter', icon: Twitter, url: 'https://twitter.com/nowiht' },
    { name: 'Facebook', icon: Facebook, url: 'https://facebook.com/nowiht' },
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 pt-8"
        >
          <Link href="/" className="inline-block">
            <Image
              src="/images/logo-black.png"
              alt="NOWIHT"
              width={180}
              height={40}
              className="mx-auto"
              priority
            />
          </Link>
        </motion.div>

        {/* Main Content */}
        <div className="text-center space-y-8">
          {/* Animated Clock Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              duration: 0.8,
              type: 'spring',
              stiffness: 150,
              damping: 15
            }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              {/* Pulsing background */}
              <motion.div
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.05, 0.2]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="absolute inset-0 bg-black rounded-full blur-3xl"
              />
              
              {/* Clock icon */}
              <div className="relative bg-white border-2 border-black rounded-full p-8">
                <Clock 
                  className="w-16 h-16 sm:w-20 sm:h-20 text-black" 
                  strokeWidth={1.5}
                />
              </div>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-black">
              We'll be back soon
            </h1>
            <div className="h-px w-32 sm:w-48 bg-black mx-auto" />
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              We're currently performing scheduled maintenance to improve your experience. 
              We'll be back online shortly.
            </p>
          </motion.div>

          {/* Countdown Timer */}
          {timeLeft && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="py-8"
            >
              <p className="text-xs sm:text-sm tracking-[0.2em] uppercase text-gray-500 mb-6">
                Estimated time remaining
              </p>
              
              <div className="flex justify-center gap-4 sm:gap-8">
                {/* Hours */}
                <div className="text-center">
                  <motion.div
                    key={timeLeft.hours}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-black text-white w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-2"
                  >
                    <span className="text-2xl sm:text-3xl font-light">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                  </motion.div>
                  <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider">
                    Hours
                  </p>
                </div>

                {/* Minutes */}
                <div className="text-center">
                  <motion.div
                    key={timeLeft.minutes}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-black text-white w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-2"
                  >
                    <span className="text-2xl sm:text-3xl font-light">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                  </motion.div>
                  <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider">
                    Minutes
                  </p>
                </div>

                {/* Seconds */}
                <div className="text-center">
                  <motion.div
                    key={timeLeft.seconds}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-black text-white w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-2"
                  >
                    <span className="text-2xl sm:text-3xl font-light">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                  </motion.div>
                  <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider">
                    Seconds
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Email Notification Signup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-md mx-auto pt-8"
          >
            <p className="text-sm text-gray-600 mb-4">
              Get notified when we're back online
            </p>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={submitStatus === 'loading' || submitStatus === 'success'}
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>

              <AnimatePresence mode="wait">
                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 text-sm text-red-600"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}

                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 text-sm text-green-600"
                  >
                    <Check className="w-4 h-4" />
                    <span>Thank you! We'll notify you when we're back.</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={submitStatus === 'loading' || submitStatus === 'success'}
                className="w-full py-4 bg-black text-white text-sm tracking-wider uppercase hover:bg-red-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {submitStatus === 'loading' ? 'Subscribing...' : 
                 submitStatus === 'success' ? 'Subscribed!' : 
                 'Notify Me'}
              </button>
            </form>
          </motion.div>

          {/* Social Media Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="pt-12 border-t border-gray-200"
          >
            <p className="text-sm text-gray-600 mb-6">
              Stay connected with us
            </p>
            
            <div className="flex justify-center gap-6">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 border border-gray-300 flex items-center justify-center hover:border-black hover:bg-black hover:text-white transition-all duration-300 group"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" strokeWidth={1.5} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="pt-8"
          >
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} NOWIHT. All rights reserved.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}