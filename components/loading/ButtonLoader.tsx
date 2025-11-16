"use client";

import { motion } from "framer-motion";

/**
 * NOWIHT Button Loader
 * - Loading state for buttons
 * - Minimal spinner animation
 * - Louis Vuitton aesthetic
 */

interface ButtonLoaderProps {
  size?: "sm" | "md" | "lg";
  color?: "black" | "white" | "red";
}

export default function ButtonLoader({
  size = "md",
  color = "black"
}: ButtonLoaderProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const colorClasses = {
    black: "border-black border-t-transparent",
    white: "border-white border-t-transparent",
    red: "border-red-600 border-t-transparent",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="inline-flex items-center justify-center"
    >
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} border-2 rounded-full animate-spin`}
      />
    </motion.div>
  );
}

/**
 * Button with Loading State
 * - Complete button component with loading
 */
interface LoadingButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  fullWidth?: boolean;
  className?: string;
}

export function LoadingButton({
  children,
  loading = false,
  disabled = false,
  onClick,
  variant = "primary",
  fullWidth = false,
  className = "",
}: LoadingButtonProps) {
  const baseClasses = "px-8 py-4 uppercase tracking-[0.2em] font-light text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: "bg-black text-white hover:bg-black/90",
    secondary: "bg-white text-black border border-black hover:bg-gray-50",
    outline: "bg-transparent text-black border border-black hover:bg-black hover:text-white",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-3">
          <ButtonLoader
            size="sm"
            color={variant === "primary" ? "white" : "black"}
          />
          <span>Processing...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}

/**
 * Icon Button with Loading
 * - For icon-only buttons (cart, wishlist)
 */
interface IconButtonLoaderProps {
  loading: boolean;
  icon: React.ReactNode;
  className?: string;
}

export function IconButtonLoader({
  loading,
  icon,
  className = ""
}: IconButtonLoaderProps) {
  return (
    <div className={`relative ${className}`}>
      {loading ? (
        <ButtonLoader size="sm" color="black" />
      ) : (
        icon
      )}
    </div>
  );
}