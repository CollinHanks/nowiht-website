"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Home, ShoppingBag, Heart, User, Grid } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMounted, setIsMounted] = useState(false);

  const { getItemCount, toggleCart } = useCartStore();
  const { getItemCount: getWishlistCount } = useWishlistStore();

  const itemCount = getItemCount();
  const wishlistCount = getWishlistCount();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ============================================
  // 🔥 HIDE BOTTOM NAV IN ADMIN & DESKTOP
  // ============================================
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      name: "Shop",
      href: "/shop",
      icon: Grid,
      isActive: pathname.startsWith("/shop"),
    },
    {
      name: "Wishlist",
      href: "/wishlist",
      icon: Heart,
      isActive: pathname === "/wishlist",
      badge: wishlistCount,
    },
    {
      name: "Cart",
      href: "#",
      icon: ShoppingBag,
      isActive: false,
      badge: itemCount,
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        toggleCart();
      },
    },
    {
      name: "Account",
      href: session ? "/account" : "/login",
      icon: User,
      isActive: pathname.startsWith("/account") || pathname === "/login",
    },
  ];

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40",
        "lg:hidden", // Only show on mobile
        "pb-safe" // Safe area for iPhone notch
      )}
    >
      {/* Glassmorphism Container */}
      <div
        className={cn(
          "mx-4 mb-4",
          "bg-white/80 backdrop-blur-xl",
          "border border-gray-200/50",
          "rounded-2xl",
          "shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
          "overflow-hidden"
        )}
      >
        {/* Navigation Items */}
        <div className="flex items-center justify-around h-[72px] px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.isActive;

            return item.onClick ? (
              // Cart Button
              <button
                key={item.name}
                onClick={item.onClick}
                className={cn(
                  "relative flex flex-col items-center justify-center",
                  "w-[64px] h-[64px]",
                  "rounded-xl",
                  "transition-all duration-300 ease-out",
                  "touch-manipulation",
                  "active:scale-90",
                  isActive
                    ? "text-black"
                    : "text-gray-500 active:bg-gray-50"
                )}
              >
                {/* Active Indicator - Top Line */}
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-black rounded-full" />
                )}

                {/* Icon Container */}
                <div className="relative mb-1">
                  <Icon
                    className={cn(
                      "w-6 h-6 transition-all duration-300",
                      isActive ? "stroke-[2]" : "stroke-[1.5]"
                    )}
                  />

                  {/* Badge - Cart */}
                  {isMounted && item.badge && item.badge > 0 && (
                    <span
                      className={cn(
                        "absolute -top-1.5 -right-1.5",
                        "flex items-center justify-center",
                        "min-w-[18px] h-[18px] px-1",
                        "bg-black text-white",
                        "text-[10px] font-semibold",
                        "rounded-full",
                        "shadow-sm"
                      )}
                    >
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </div>

                {/* Label */}
                <span
                  className={cn(
                    "text-[11px] font-medium tracking-wide",
                    "transition-all duration-300",
                    isActive ? "opacity-100 font-semibold" : "opacity-70"
                  )}
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  {item.name}
                </span>
              </button>
            ) : (
              // Regular Link
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center justify-center",
                  "w-[64px] h-[64px]",
                  "rounded-xl",
                  "transition-all duration-300 ease-out",
                  "touch-manipulation",
                  "active:scale-90",
                  isActive
                    ? "text-black"
                    : "text-gray-500 active:bg-gray-50"
                )}
              >
                {/* Active Indicator - Top Line */}
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-black rounded-full" />
                )}

                {/* Icon Container */}
                <div className="relative mb-1">
                  <Icon
                    className={cn(
                      "w-6 h-6 transition-all duration-300",
                      isActive ? "stroke-[2]" : "stroke-[1.5]"
                    )}
                  />

                  {/* Badge - Wishlist */}
                  {isMounted && item.badge && item.badge > 0 && (
                    <span
                      className={cn(
                        "absolute -top-1.5 -right-1.5",
                        "flex items-center justify-center",
                        "min-w-[18px] h-[18px] px-1",
                        "bg-red-600 text-white",
                        "text-[10px] font-semibold",
                        "rounded-full",
                        "shadow-sm"
                      )}
                    >
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </div>

                {/* Label */}
                <span
                  className={cn(
                    "text-[11px] font-medium tracking-wide",
                    "transition-all duration-300",
                    isActive ? "opacity-100 font-semibold" : "opacity-70"
                  )}
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}