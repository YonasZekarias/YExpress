"use client";
import React from "react";
const { useRouter } = require("next/navigation");
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import useAuthStore from "@/store/authStore";
import LogoutAlert from "../common/logoutAlert";

const AdminSidebar = ({
  activeTab,
  setActiveTab,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const { username, email, avatar } = useAuthStore();

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: "products",
      label: "Products",
      icon: <ShoppingBag className="w-5 h-5" />,
    },
    { id: "orders", label: "Orders", icon: <Package className="w-5 h-5" /> },
    {
      id: "customers",
      label: "Customers",
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

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
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-card border border-border transition-transform duration-300 ease-in-out
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }`}
      >
        {/* Inner content */}
        <div className="flex flex-col justify-between h-full p-6">
          {/* Top: Brand + Navigation */}
          <div>
            {/* Brand */}
            <div className="flex items-center space-x-2 mb-10 text-indigo-600  font-bold text-2xl">
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
            <div className="flex items-center p-3 mb-8 bg-muted rounded-xl border border-border">
              <img
                src={avatar}
                alt="Profile"
                className="w-10 h-10 rounded-full mr-3"
              />
              <div className="overflow-hidden">
                <p className="font-semibold text-foreground truncate">
                  {username}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {email}
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2 flex flex-col">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                    router.push(
                      `/admin/${item.id === "dashboard" ? "" : item.id}`
                    );
                  }}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      activeTab === item.id
                        ? "bg-indigo-50 text-indigo-900 shadow-md dark:bg-indigo-900 dark:text-indigo-100 dark:shadow-lg dark:shadow-indigo-500/30"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  
                    }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Bottom: Logout */}
          <div className="mt-5 pt-6 border-t border-border">
            <LogoutAlert />
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
