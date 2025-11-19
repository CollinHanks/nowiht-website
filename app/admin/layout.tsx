// app/admin/layout.tsx
// NOWIHT E-Commerce - Admin Layout
// 🔥 Wraps all admin pages with sidebar and auth checks

import { Metadata } from 'next';
import AdminSidebar from '@/components/admin/AdminSidebar';

// ============================================
// METADATA
// ============================================
export const metadata: Metadata = {
  title: {
    default: 'Admin Panel | NOWIHT',
    template: '%s | Admin | NOWIHT',
  },
  description: 'NOWIHT E-Commerce Admin Panel',
  robots: {
    index: false, // Don't index admin pages
    follow: false,
  },
};

// ============================================
// ADMIN LAYOUT COMPONENT
// ============================================
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Sidebar - Persistent across all admin pages */}
      <AdminSidebar />

      {/* Main Content Area */}
      {children}
    </div>
  );
}