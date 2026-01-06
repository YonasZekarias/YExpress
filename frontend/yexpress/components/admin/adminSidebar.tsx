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
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <aside
  className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white border border-slate-200
    transition-transform duration-300 ease-in-out
    ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
>

        {/* Inner content */}
        <div className="flex flex-col justify-between h-full p-6">
          {/* Top: Brand + Navigation */}
          <div>
            {/* Brand */}
            <div className="flex items-center space-x-2 mb-10 font-bold text-2xl tracking-wider">
              <div className="bg-indigo-500 p-1.5 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span>YExpress</span>
              <button
                className="md:hidden ml-auto text-slate-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>
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
                        ? "bg-indigo-100 text-indigo-800 shadow-lg shadow-indigo-500/30"
                        : "text-black-200 hover:bg-slate-100"
                    }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Bottom: Logout */}
          <div className="mt-5 pt-6 border-t border-slate-800 w-full">
            <button
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 
                         hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
