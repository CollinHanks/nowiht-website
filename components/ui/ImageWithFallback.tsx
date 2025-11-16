"use client";

import { useState } from "react";
import Image from "next/image";
import ProductPlaceholder from "./ProductPlaceholder";

interface ImageWithFallbackProps {
  src: string | undefined | null;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  placeholderText?: string;
}

export default function ImageWithFallback({
  src,
  alt,
  className = "",
  fill = false,
  width,
  height,
  priority = false,
  sizes,
  placeholderText = "NOWIHT",
}: ImageWithFallbackProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Show placeholder if no src or error
  if (!src || imageError) {
    return (
      <div className="relative w-full h-full">
        <ProductPlaceholder
          className="w-full h-full"
          text={placeholderText}
        />
      </div>
    );
  }

  return (
    // 🔥 FIXED: Added w-full h-full to wrapper
    <div className="relative w-full h-full">
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}

      {/* Actual image */}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        priority={priority}
        sizes={sizes}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImageError(true);
          setIsLoading(false);
        }}
        unoptimized={true}
      />
    </div>
  );
}