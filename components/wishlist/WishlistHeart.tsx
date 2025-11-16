"use client";

import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { cn } from "@/lib/utils";

interface WishlistHeartProps {
  productId: string;
  product?: any; // Full product object for adding to wishlist
  size?: "sm" | "md" | "lg";
  className?: string;
  showToast?: boolean;
}

export default function WishlistHeart({
  productId,
  product,
  size = "md",
  className,
  showToast = true,
}: WishlistHeartProps) {
  const { isInWishlist, addItem, removeItem } = useWishlistStore();
  const isLiked = isInWishlist(productId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLiked) {
      removeItem(productId);
      if (showToast) {
        // Optional: Show toast notification
        console.log("Removed from wishlist");
      }
    } else {
      if (product) {
        addItem({
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          images: product.images,
          category: product.category,
          isOnSale: product.isOnSale,
          addedAt: new Date().toISOString(),
        });
        if (showToast) {
          // Optional: Show toast notification
          console.log("Added to wishlist");
        }
      }
    }
  };

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "group relative transition-all duration-300 hover:scale-110",
        className
      )}
      aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
    >
      {/* Background circle on hover */}
      <div className="absolute inset-0 -m-2 bg-white/80 backdrop-blur-sm rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
      
      {/* Heart icon */}
      <Heart
        className={cn(
          "relative transition-all duration-300",
          sizeClasses[size],
          isLiked
            ? "fill-red-600 stroke-red-600"
            : "fill-none stroke-current group-hover:stroke-red-600"
        )}
        strokeWidth={isLiked ? 0 : 2}
      />

      {/* Pulse animation when liked */}
      {isLiked && (
        <span className="absolute inset-0 -m-2 bg-red-600/20 rounded-full animate-ping" />
      )}
    </button>
  );
}