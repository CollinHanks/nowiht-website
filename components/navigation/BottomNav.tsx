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
      href: "#", // Cart opens via toggleCart
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
        "bg-white border-t border-gray-200",
        "shadow-[0_-4px_12px_rgba(0,0,0,0.08)]"
      )}
    >
      <div className="max-w-md mx-auto h-16 px-2">
        <div className="flex items-center justify-around h-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.isActive;

            return item.onClick ? (
              // Cart button
              <button
                key={item.name}
                onClick={item.onClick}
                className={cn(
                  "relative flex flex-col items-center justify-center",
                  "w-14 h-14 rounded-lg",
                  "transition-all duration-300 ease-out",
                  "touch-manipulation",
                  "active:scale-95",
                  isActive
                    ? "text-black"
                    : "text-gray-500 hover:text-black hover:bg-gray-50"
                )}
              >
                <div className="relative">
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-all duration-300",
                      isActive && "scale-110"
                    )}
                  />
                  {isMounted && item.badge && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] font-semibold text-white">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-medium mt-0.5 tracking-wide transition-all duration-300",
                    isActive ? "opacity-100" : "opacity-70"
                  )}
                >
                  {item.name}
                </span>
              </button>
            ) : (
              // Regular link
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center justify-center",
                  "w-14 h-14 rounded-lg",
                  "transition-all duration-300 ease-out",
                  "touch-manipulation",
                  "active:scale-95",
                  isActive
                    ? "text-black"
                    : "text-gray-500 hover:text-black hover:bg-gray-50"
                )}
              >
                <div className="relative">
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-all duration-300",
                      isActive && "scale-110"
                    )}
                  />
                  {isMounted && item.badge && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-semibold text-white">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-medium mt-0.5 tracking-wide transition-all duration-300",
                    isActive ? "opacity-100" : "opacity-70"
                  )}
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