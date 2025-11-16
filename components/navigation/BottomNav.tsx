"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ShoppingBag, Heart, User } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { cn } from "@/lib/utils";

const navItems = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "Shop",
    href: "/shop",
    icon: ShoppingBag,
  },
  {
    name: "Wishlist",
    href: "/wishlist",
    icon: Heart,
    badge: "wishlist",
  },
  {
    name: "Cart",
    href: "/cart",
    icon: ShoppingBag,
    badge: "cart",
  },
  {
    name: "Account",
    href: "/account",
    icon: User,
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { items: cartItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();

  // Calculate item count from cart items
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const getBadgeCount = (badge: string | undefined) => {
    if (badge === "cart") return cartItemCount;
    if (badge === "wishlist") return wishlistItems.length;
    return 0;
  };

  return (
    <>
      {/* Spacer to prevent content being hidden behind bottom nav */}
      <div className="h-20 lg:hidden" />

      {/* Bottom Navigation - Mobile/Tablet Only */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 lg:hidden">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            const badgeCount = getBadgeCount(item.badge);

            return (
              <Link
                key={item.name}
                href={item.href}
                className="relative flex flex-col items-center justify-center flex-1 h-full group"
              >
                {/* Icon Container */}
                <div className="relative flex items-center justify-center">
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-colors duration-200",
                      isActive
                        ? "text-black"
                        : "text-gray-400 group-hover:text-gray-600"
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                  />

                  {/* Badge */}
                  {badgeCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-semibold text-white"
                    >
                      {badgeCount > 9 ? "9+" : badgeCount}
                    </motion.span>
                  )}
                </div>

                {/* Label */}
                <span
                  className={cn(
                    "mt-1 text-[10px] font-medium tracking-wide transition-colors duration-200",
                    isActive
                      ? "text-black"
                      : "text-gray-400 group-hover:text-gray-600"
                  )}
                >
                  {item.name}
                </span>

                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute -top-[1px] left-0 right-0 h-[2px] bg-black"
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}