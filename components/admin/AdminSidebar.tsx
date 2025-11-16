"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FolderTree,
  Upload,
  Settings,
  ChevronLeft,
  ChevronRight,
  Image,
  Warehouse,
  Layers,
  LogOut, // NEW: Logout icon
} from "lucide-react";
import { useAdminStore } from "@/store/adminStore";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, toggleSidebar } = useAdminStore();

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Products",
      href: "/admin/products",
      icon: Package,
    },
    {
      label: "Orders",
      href: "/admin/orders",
      icon: ShoppingBag,
    },
    {
      label: "Categories",
      href: "/admin/categories",
      icon: FolderTree,
    },
    {
      label: "MetaObjects",
      href: "/admin/metaobjects",
      icon: Layers,
    },
    {
      label: "Inventory",
      href: "/admin/inventory",
      icon: Warehouse,
    },
    {
      label: "Media",
      href: "/admin/media",
      icon: Image,
    },
    {
      label: "Bulk Import",
      href: "/admin/products/import",
      icon: Upload,
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      await signOut({ callbackUrl: "/admin/login" });
    }
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen bg-black text-white transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-20"
          }`}
      >
        {/* Header */}
        <div className="flex h-20 items-center justify-between border-b border-gray-800 px-4">
          {isSidebarOpen && (
            <Link href="/admin" className="text-xl font-bold tracking-wider">
              NOWIHT
            </Link>
          )}
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-2 hover:bg-gray-800 transition-colors"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 space-y-1 px-3 pb-32">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 transition-all ${active
                    ? "bg-red-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  } ${!isSidebarOpen && "justify-center"}`}
                title={!isSidebarOpen ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && (
                  <>
                    <span className="text-sm font-medium flex-1">
                      {item.label}
                    </span>
                    {item.badge !== undefined && (
                      <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button - ABOVE FOOTER */}
        <div className="absolute bottom-20 left-0 right-0 px-3">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 rounded-lg px-3 py-3 text-gray-400 hover:bg-red-600 hover:text-white transition-all ${!isSidebarOpen && "justify-center"
              }`}
            title={!isSidebarOpen ? "Logout" : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && (
              <span className="text-sm font-medium">Logout</span>
            )}
          </button>
        </div>

        {/* Footer */}
        {isSidebarOpen && (
          <div className="absolute bottom-0 left-0 right-0 border-t border-gray-800 p-4">
            <div className="text-xs text-gray-500">
              <p className="font-semibold text-white mb-1">Admin Panel</p>
              <p>Version 1.0.0</p>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}