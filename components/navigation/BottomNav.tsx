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
        "pb-safe" // Safe area for iPhone
      )}
    >
      {/* Premium Glassmorphism Container */}
      <div
        className={cn(
          "mx-2 mb-2",
          "bg-white/95 backdrop-blur-2xl",
          "border border-black/5",
          "rounded-[24px]",
          "shadow-[0_8px_30px_rgba(0,0,0,0.12)]",
          "overflow-hidden"
        )}
      >
        {/* Navigation Grid */}
        <div className="grid grid-cols-5 h-[70px]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.isActive;

            const content = (
              <div className="relative flex flex-col items-center justify-center h-full gap-1">
                {/* Icon with Badge */}
                <div className="relative">
                  <Icon
                    className={cn(
                      "w-6 h-6 transition-all duration-200",
                      isActive ? "stroke-[2.5] text-black" : "stroke-[1.8] text-gray-400"
                    )}
                  />

                  {/* Badge - ONLY if count > 0 */}
                  {isMounted && item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={cn(
                        "absolute -top-1 -right-2",
                        "flex items-center justify-center",
                        "min-w-[18px] h-[18px] px-1.5",
                        item.name === "Wishlist" ? "bg-red-600" : "bg-black",
                        "text-white text-[10px] font-bold leading-none",
                        "rounded-full",
                        "shadow-lg border-2 border-white"
                      )}
                    >
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  )}
                </div>

                {/* Label - Clean, uppercase, NO numbers */}
                <span
                  className={cn(
                    "text-[9px] uppercase tracking-[0.8px] font-semibold",
                    "transition-all duration-200",
                    isActive ? "text-black" : "text-gray-400"
                  )}
                >
                  {item.name}
                </span>

                {/* Active Indicator - Bottom line */}
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-[3px] bg-black rounded-t-full" />
                )}
              </div>
            );

            return item.onClick ? (
              // Cart Button
              <button
                key={item.name}
                onClick={item.onClick}
                className={cn(
                  "relative touch-manipulation",
                  "active:scale-95 active:bg-black/5",
                  "transition-all duration-200 ease-out"
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
                  "relative touch-manipulation",
                  "active:scale-95 active:bg-black/5",
                  "transition-all duration-200 ease-out"
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