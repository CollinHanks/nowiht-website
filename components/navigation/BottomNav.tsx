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
      badgeColor: "bg-red-600",
    },
    {
      name: "Cart",
      href: "#",
      icon: ShoppingBag,
      isActive: false,
      badge: itemCount,
      badgeColor: "bg-black",
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
          "mx-3 mb-3",
          "bg-white/90 backdrop-blur-xl",
          "border border-gray-200/60",
          "rounded-[20px]",
          "shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
          "overflow-hidden"
        )}
      >
        {/* Navigation Items */}
        <div className="flex items-center justify-around h-[68px] px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.isActive;

            const content = (
              <>
                {/* Active Indicator - Subtle Top Line */}
                {isActive && (
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-black rounded-full" />
                )}

                {/* Icon Container */}
                <div className="relative">
                  <Icon
                    className={cn(
                      "w-[22px] h-[22px] transition-all duration-300",
                      isActive ? "stroke-[2.5]" : "stroke-[1.5]"
                    )}
                  />

                  {/* Badge - ONLY when count > 0 */}
                  {isMounted && item.badge && item.badge > 0 && (
                    <span
                      className={cn(
                        "absolute -top-1.5 -right-1.5",
                        "flex items-center justify-center",
                        "min-w-[17px] h-[17px] px-1",
                        item.badgeColor,
                        "text-white",
                        "text-[9px] font-bold leading-none",
                        "rounded-full",
                        "shadow-lg",
                        "border-[1.5px] border-white"
                      )}
                    >
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  )}
                </div>

                {/* Label - Clean, NO numbers here! */}
                <span
                  className={cn(
                    "text-[9.5px] font-medium tracking-[0.5px] uppercase",
                    "transition-all duration-300",
                    isActive ? "opacity-100 font-semibold" : "opacity-55"
                  )}
                >
                  {item.name}
                </span>
              </>
            );

            return item.onClick ? (
              // Cart Button
              <button
                key={item.name}
                onClick={item.onClick}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1.5",
                  "w-16 h-16",
                  "rounded-xl",
                  "transition-all duration-300 ease-out",
                  "touch-manipulation",
                  "active:scale-90",
                  isActive
                    ? "text-black"
                    : "text-gray-500 active:bg-gray-50/80"
                )}
              >
                {content}
              </button>
            ) : (
              // Regular Link
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1.5",
                  "w-16 h-16",
                  "rounded-xl",
                  "transition-all duration-300 ease-out",
                  "touch-manipulation",
                  "active:scale-90",
                  isActive
                    ? "text-black"
                    : "text-gray-500 active:bg-gray-50/80"
                )}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}