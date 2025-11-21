"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShoppingBag, Search, User, Heart, ChevronRight, Mail, Phone, LogOut, Package } from "lucide-react";
import { BRAND_NAME, MAIN_NAVIGATION, CATEGORIES } from "@/lib/constants";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { cn } from "@/lib/utils";
import SearchModal from "@/components/search/SearchModal";

export default function Header() {
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  // ✅ SSR-SAFE: Optional chaining + default values to prevent destructuring errors
  const { data: session = null, status = "loading" } = useSession() || {};

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showMobileSearchIcon, setShowMobileSearchIcon] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false); // User dropdown

  const { getItemCount, toggleCart } = useCartStore();
  const { getItemCount: getWishlistCount } = useWishlistStore();

  const itemCount = getItemCount();
  const wishlistCount = getWishlistCount();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);
      setShowMobileSearchIcon(scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  const isTransparent = isHomepage && !isScrolled;
  const logoSrc = isTransparent ? "/images/logo-white.png" : "/images/logo-black.png";
  const textColor = isTransparent ? "text-white" : "text-black";
  const hoverColor = isTransparent ? "hover:text-gray-200" : "hover:text-gray-600";

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out",
          "hidden lg:block",
          isTransparent
            ? "bg-transparent h-20"
            : "bg-white/95 backdrop-blur-md shadow-sm h-16"
        )}
      >
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12 h-full flex items-center justify-between">
          {/* LEFT SIDE */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
              className={cn(
                "flex items-center gap-2 transition-all duration-300 hover:scale-105",
                textColor,
                hoverColor
              )}
            >
              <Menu className="w-5 h-5" />
              <span className="text-sm font-medium tracking-wide">Menu</span>
            </button>

            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
              className={cn(
                "flex items-center gap-2 transition-all duration-300 hover:scale-105",
                textColor,
                hoverColor
              )}
            >
              <Search className="w-5 h-5" />
              <span className="text-sm font-medium tracking-wide">Search</span>
            </button>
          </div>

          {/* CENTER - Logo */}
          <Link
            href="/"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <Image
              src={logoSrc}
              alt={BRAND_NAME}
              width={isTransparent ? 140 : 120}
              height={isTransparent ? 40 : 32}
              priority
              className="transition-all duration-500"
            />
          </Link>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-6">
            {/* User Icon with Dropdown */}
            <div className="relative">
              {status === "loading" ? (
                <div className={cn("w-5 h-5 rounded-full animate-pulse bg-gray-300")} />
              ) : session ? (
                <>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    aria-label="Account"
                    className={cn(
                      "transition-all duration-300 hover:scale-105",
                      textColor,
                      hoverColor
                    )}
                  >
                    <User className="w-5 h-5" />
                  </button>

                  {/* User Dropdown */}
                  {showUserDropdown && (
                    <div className="absolute right-0 top-8 w-56 bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden z-50">
                      <div className="p-4 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {session.user?.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {session.user?.email || ""}
                        </p>
                      </div>
                      <div className="py-2">
                        <Link
                          href="/account"
                          onClick={() => setShowUserDropdown(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          <span>My Account</span>
                        </Link>
                        <Link
                          href="/account/orders"
                          onClick={() => setShowUserDropdown(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Package className="w-4 h-4" />
                          <span>Orders</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href="/login"
                  aria-label="Login"
                  className={cn(
                    "transition-all duration-300 hover:scale-105",
                    textColor,
                    hoverColor
                  )}
                >
                  <User className="w-5 h-5" />
                </Link>
              )}
            </div>

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className={cn(
                "relative transition-all duration-300 hover:scale-105",
                textColor,
                hoverColor
              )}
            >
              <Heart className="w-5 h-5" />
              {isMounted && wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-semibold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <button
              onClick={toggleCart}
              aria-label="Cart"
              className={cn(
                "relative transition-all duration-300 hover:scale-105",
                textColor,
                hoverColor
              )}
            >
              <ShoppingBag className="w-5 h-5" />
              {isMounted && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-semibold text-white">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm h-16 lg:hidden">
        <div className="h-full flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
              className="flex items-center justify-center w-11 h-11 text-black hover:bg-gray-50 rounded-lg transition-colors touch-manipulation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div
              className={cn(
                "transition-all duration-300 ease-in-out",
                showMobileSearchIcon
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              )}
            >
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search"
                className="flex items-center justify-center w-11 h-11 text-black hover:bg-gray-50 rounded-lg transition-colors touch-manipulation"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          <Link
            href="/"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <Image
              src="/images/logo-black.png"
              alt={BRAND_NAME}
              width={100}
              height={28}
              priority
            />
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href={session ? "/account" : "/login"}
              className="flex items-center justify-center w-11 h-11 text-black hover:bg-gray-50 rounded-lg transition-colors touch-manipulation"
              aria-label="Account"
            >
              <User className="w-5 h-5" />
            </Link>

            <button
              onClick={toggleCart}
              className="relative flex items-center justify-center w-11 h-11 text-black hover:bg-gray-50 rounded-lg transition-colors touch-manipulation"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {isMounted && itemCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] font-semibold text-white">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[100] transform transition-transform duration-500 ease-out shadow-2xl overflow-y-auto",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 lg:p-8 border-b border-gray-100">
            <h2 className="text-xl font-semibold tracking-tight">Menu</h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 p-6 lg:p-8">
            <div className="mb-8">
              <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4 font-semibold">
                Shop by Category
              </h3>
              <div className="space-y-1">
                {CATEGORIES.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/shop/${category.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group flex items-center justify-between py-3 px-3 -mx-3 rounded-lg text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-50 transition-all duration-300"
                  >
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      {category.name}
                    </span>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="my-6 border-t border-gray-200" />

            <div className="mb-8">
              <div className="space-y-1">
                {MAIN_NAVIGATION.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group flex items-center justify-between py-3.5 px-3 -mx-3 rounded-lg text-base font-medium text-black hover:bg-gray-50 transition-all duration-300"
                  >
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      {item.name}
                    </span>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="my-6 border-t border-gray-200" />

            {/* Account Links */}
            <div className="space-y-1">
              {session ? (
                <>
                  <div className="px-3 py-2 text-xs text-gray-500 font-medium">
                    {session.user?.name || "User"}
                  </div>
                  <Link
                    href="/account"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group flex items-center gap-3 py-3 px-3 -mx-3 text-sm text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-all"
                  >
                    <User className="w-4 h-4" />
                    <span>My Account</span>
                  </Link>
                  <Link
                    href="/account/orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group flex items-center gap-3 py-3 px-3 -mx-3 text-sm text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-all"
                  >
                    <Package className="w-4 h-4" />
                    <span>Orders</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full group flex items-center gap-3 py-3 px-3 -mx-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group flex items-center gap-3 py-3 px-3 -mx-3 text-sm text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-all"
                  >
                    <User className="w-4 h-4" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group flex items-center gap-3 py-3 px-3 -mx-3 text-sm bg-black text-white hover:bg-gray-800 rounded-lg transition-all"
                  >
                    <span>Create Account</span>
                  </Link>
                </>
              )}
              <Link
                href="/wishlist"
                onClick={() => setIsMobileMenuOpen(false)}
                className="group flex items-center gap-3 py-3 px-3 -mx-3 text-sm text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-all"
              >
                <Heart className="w-4 h-4" />
                <span>Wishlist</span>
                {isMounted && wishlistCount > 0 && (
                  <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </div>
          </nav>

          <div className="border-t border-gray-100 p-6 lg:p-8 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Can we help you?</h3>

            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 p-4 mb-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 group"
            >
              <Mail className="w-5 h-5" />
              <div className="flex-1">
                <div className="font-medium">Contact Us</div>
                <div className="text-xs text-gray-300">We're here to help 24/7</div>
              </div>
              <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>

            <div className="space-y-2">
              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-sm text-gray-600 hover:text-black transition-colors py-2"
              >
                About NOWIHT
              </Link>
              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-sm text-gray-600 hover:text-black transition-colors py-2"
              >
                Sustainability
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors py-2"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>+1 (805) 802 29 31</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[90] transition-opacity duration-500"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Close dropdown when clicking outside */}
      {showUserDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserDropdown(false)}
        />
      )}

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}