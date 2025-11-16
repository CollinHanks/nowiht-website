"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Youtube, Mail, ChevronDown } from "lucide-react";
import { BRAND_NAME, SITE_INFO } from "@/lib/constants";
import { useState } from "react";

// X (Twitter) Icon
const XIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Payment Icons - COLORFUL (no grayscale!)
const PaymentIcons = () => {
  const icons = [
    { name: "visa", label: "Visa" },
    { name: "mastercard", label: "Mastercard" },
    { name: "amex", label: "American Express" },
    { name: "paypal", label: "PayPal" },
    { name: "maestro", label: "Maestro" }
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {icons.map((icon) => (
        <div
          key={icon.name}
          className="group relative w-12 h-7 bg-white rounded-sm overflow-hidden flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:scale-105"
          title={icon.label}
        >
          <Image
            src={`/images/payment/${icon.name}.png`}
            alt={icon.label}
            width={48}
            height={28}
            className="object-contain p-0.5 group-hover:scale-110 transition-transform duration-300"
            unoptimized
          />
        </div>
      ))}
    </div>
  );
};

// Footer Menus - 4 COLUMNS - UPDATED MY ORDER LINKS
const FOOTER_MENUS = {
  "CUSTOMER CARE": [
    { name: "Contact Us", href: "/contact" },
    { name: "FAQ's", href: "/faq" },
    { name: "Legal Notice", href: "/legal-notice" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Return Policy", href: "/return-policy" },
    { name: "Shipping Information", href: "/shipping" },
    { name: "Terms & Conditions", href: "/terms" },
  ],
  "ECOLOGIC": [
    { name: "Community & Impact", href: "/ecologic/community-impact" },
    { name: "Eco-Friendly Materials", href: "/ecologic/eco-friendly-materials" },
    { name: "Ethical Manufacturing", href: "/ecologic/ethical-manufacturing" },
    { name: "Our Carbon Footprint", href: "/ecologic/carbon-footprint" },
    { name: "Sustainability Vision", href: "/ecologic/sustainability-vision" },
    { name: "Zero-Waste Production", href: "/ecologic/zero-waste-production" },
  ],
  "EXPLORE MORE": [
    { name: "About Us", href: "/about" },
    { name: "Join Our Team", href: "/careers" },
    { name: "News & Updates", href: "/news" },
    { name: "Share & Earn", href: "/referral" },
    { name: "Size Guide", href: "/size-guide" },
    { name: "Gift Cards", href: "/gift-cards" },
  ],
  "MY ORDER": [
    { name: "Track Your Order", href: "/my-order/track" },
    { name: "View Cart", href: "/cart" },
    { name: "My Account", href: "/account" },
    { name: "Return & Refund", href: "/my-order/return" },
    { name: "Check Your Order", href: "/my-order/check" },
    { name: "Order Support", href: "/my-order/support" },
  ],
} as const;

const SOCIAL_MEDIA = {
  instagram: "https://instagram.com/the_nowiht",
  facebook: "https://facebook.com/nowiht",
  x: "https://x.com/the_nowiht",
  youtube: "https://youtube.com/@nowiht",
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("EN");
  const [currency, setCurrency] = useState("USD");

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("Newsletter subscription:", email);
    setIsSubscribed(true);
    setEmail("");
    setIsLoading(false);
    
    setTimeout(() => setIsSubscribed(false), 4000);
  };

  return (
    <footer className="bg-black text-white font-ibm-plex-mono">
      {/* Main Footer Content - CLEAN & MODERN */}
      <div className="max-w-[1920px] mx-auto px-6 md:px-10 lg:px-16 xl:px-20 py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link 
              href="/" 
              className="inline-block mb-5 transition-opacity hover:opacity-80 duration-300"
            >
              <Image
                src="/images/logo-white.png"
                alt={BRAND_NAME}
                width={120}
                height={36}
                className="h-auto"
                priority
              />
            </Link>
            
            {/* FULL DESCRIPTION */}
            <p className="text-[11px] text-gray-400 leading-relaxed mb-6 font-light">
              {SITE_INFO.description}
            </p>
            
            {/* Social Media Icons */}
            <div className="flex gap-2.5">
              <a
                href={SOCIAL_MEDIA.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 flex items-center justify-center border border-gray-700 hover:border-white hover:bg-white hover:text-black transition-all duration-300 group"
              >
                <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a
                href={SOCIAL_MEDIA.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 flex items-center justify-center border border-gray-700 hover:border-white hover:bg-white hover:text-black transition-all duration-300 group"
              >
                <Facebook className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a
                href={SOCIAL_MEDIA.x}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="w-10 h-10 flex items-center justify-center border border-gray-700 hover:border-white hover:bg-white hover:text-black transition-all duration-300 group"
              >
                <div className="group-hover:scale-110 transition-transform duration-300">
                  <XIcon />
                </div>
              </a>
              <a
                href={SOCIAL_MEDIA.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-10 h-10 flex items-center justify-center border border-gray-700 hover:border-white hover:bg-white hover:text-black transition-all duration-300 group"
              >
                <Youtube className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              </a>
            </div>
          </div>

          {/* 4 Menu Columns - CLEAN TYPOGRAPHY */}
          {Object.entries(FOOTER_MENUS).map(([title, links]) => (
            <div key={title} className="lg:col-span-1">
              {/* BOLD WHITE HEADER */}
              <h3 className="text-[11px] font-bold uppercase tracking-wider mb-4 text-white">
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[12px] text-gray-300 hover:text-white transition-colors duration-300 inline-block font-normal"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-gray-800">
        <div className="max-w-[1920px] mx-auto px-6 md:px-10 lg:px-16 xl:px-20 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-base font-normal tracking-wide mb-2">
              Join Our Exclusive Community
            </h2>
            <p className="text-xs text-gray-400 font-light mb-5">
              Subscribe for early access to new collections, exclusive offers, and style inspiration.
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 items-center justify-center max-w-xl mx-auto">
              <div className="relative flex-1 w-full">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  disabled={isLoading || isSubscribed}
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-gray-700 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-gray-500 focus:bg-white/10 hover:bg-white/[0.07] transition-all duration-300 disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || isSubscribed}
                className="px-8 py-3 bg-white text-black text-sm font-medium uppercase tracking-wider hover:bg-gray-200 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap w-full sm:w-auto"
              >
                {isLoading ? "..." : isSubscribed ? "✓ Subscribed" : "Subscribe"}
              </button>
            </form>
            
            {isSubscribed && (
              <p className="text-xs text-green-400 mt-4">
                Welcome to NOWIHT! Check your inbox for exclusive offers.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-[1920px] mx-auto px-6 md:px-10 lg:px-16 xl:px-20 py-5">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-5">
            
            {/* Left - Copyright */}
            <p className="text-[10px] text-gray-500 font-light text-center lg:text-left">
              © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
            </p>

            {/* Center - Language & Currency */}
            <div className="flex items-center gap-4">
              <div className="relative group">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="appearance-none bg-transparent text-[11px] text-gray-400 hover:text-white pr-5 cursor-pointer focus:outline-none font-light transition-colors duration-300"
                >
                  <option value="EN" className="bg-black">English (EN)</option>
                  <option value="FR" className="bg-black">Français (FR)</option>
                  <option value="DE" className="bg-black">Deutsch (DE)</option>
                  <option value="ES" className="bg-black">Español (ES)</option>
                </select>
                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 group-hover:text-gray-300 pointer-events-none transition-colors duration-300" />
              </div>

              <span className="text-gray-700 text-xs">|</span>

              <div className="relative group">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="appearance-none bg-transparent text-[11px] text-gray-400 hover:text-white pr-5 cursor-pointer focus:outline-none font-light transition-colors duration-300"
                >
                  <option value="USD" className="bg-black">USD $</option>
                  <option value="EUR" className="bg-black">EUR €</option>
                  <option value="GBP" className="bg-black">GBP £</option>
                  <option value="CAD" className="bg-black">CAD $</option>
                </select>
                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 group-hover:text-gray-300 pointer-events-none transition-colors duration-300" />
              </div>
            </div>

            {/* Right - Payment Icons (COLORFUL!) */}
            <div className="hidden lg:block">
              <PaymentIcons />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}