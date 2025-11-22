// components/layout/ConditionalHeader.tsx
// 🔥 CRITICAL FIX: Wrapper that only renders Header on non-admin routes
// ✅ Solves: Header showing in /admin/* routes

"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";

export default function ConditionalHeader() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ============================================
  // 🔥 CRITICAL: HIDE HEADER IN ADMIN ROUTES
  // ============================================
  // Don't render anything until client-side mounted (prevents hydration mismatch)
  if (!mounted) {
    return null;
  }

  // Don't render Header in admin routes
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return <Header />;
}