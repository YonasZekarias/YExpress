"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation"; // Import usePathname
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Settings,
  X,
} from "lucide-react";
import useAuthStore from "@/store/authStore";
import LogoutAlert from "../common/logoutAlert";
import UserInfo from "../common/userInfo";

const AdminSidebar = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: {
  // We removed activeTab props because we calculate it automatically now
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const pathname = usePathname(); // Get current URL path
  const { username, email, avatar } = useAuthStore();

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: "/admin", // Explicit path definition
    },
    {
      id: "products",
      label: "Products",
      icon: <ShoppingBag className="w-5 h-5" />,
      path: "/admin/products",
    },
    { 
      id: "orders", 
      label: "Orders", 
      icon: <Package className="w-5 h-5" />,
      path: "/admin/orders",
    },
    {
      id: "customers",
      label: "Customers",
      icon: <Users className="w-5 h-5" />,
      path: "/admin/customers",
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="w-5 h-5" />,
      path: "/admin/settings",
    },
  ];

  // Helper to check if a tab is active
  const isActive = (itemPath: string) => {
    // Exact match for dashboard (root admin path)
    if (itemPath === "/admin") {
      return pathname === "/admin";
    }
    // StartsWith check for other routes (e.g., /admin/orders/123 starts with /admin/orders)
    return pathname.startsWith(itemPath);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/40 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64
        bg-white dark:bg-slate-900
        border-r border-slate-200 dark:border-slate-700
        transition-transform duration-300 ease-in-out
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col justify-between h-full p-6">
          <div>
            {/* Brand */}
            <div className="flex items-center space-x-2 mb-10 text-indigo-600 font-bold text-2xl">
              <ShoppingBag className="w-8 h-8" />
              <span>YExpress</span>
              <button
                className="md:hidden ml-auto text-slate-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Admin Info */}
            <UserInfo
              avatar={avatar ?? ""}
              username={username ?? ""}
              email={email ?? ""}
            />

            {/* Navigation */}
            <nav className="space-y-2 flex flex-col">
              {menuItems.map((item) => {
                const active = isActive(item.path);
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      router.push(item.path);
                    }}
                    className={`relative w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all
                    ${
                      active
                        ? `
                          bg-indigo-50 dark:bg-indigo-500/10
                          text-indigo-700 dark:text-indigo-300
                          before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2
                          before:h-6 before:w-1 before:rounded-r
                          before:bg-indigo-600 dark:before:bg-indigo-400
                        `
                        : `
                          text-slate-600 dark:text-slate-400
                          hover:bg-slate-50 dark:hover:bg-slate-800
                          hover:text-slate-900 dark:hover:text-slate-200
                        `
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="mt-5 pt-6 border-t border-slate-200 dark:border-slate-700">
            <LogoutAlert />
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;