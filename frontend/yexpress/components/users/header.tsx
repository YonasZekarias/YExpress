"use client";

import { Menu, Search, Bell } from "lucide-react";
import { usePathname } from "next/navigation";
import ProfileDropdown from "../common/profileDropdown";

const useAuthStore = require("@/store/authStore").default;

const Header = ({
  setIsMobileMenuOpen,
}: {
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const pathname = usePathname();
  const activeTab = pathname?.split("/users/")[1] || "overview";

  const { avatar, username, email, phone, role, createdAt } = useAuthStore();

  return (
    <header className="bg-white border-b border-slate-200 h-16 px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center">
        <button
          className="mr-4 md:hidden text-slate-500 hover:text-slate-700"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold text-slate-800 capitalize hidden md:block">
          {activeTab}
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="hidden md:flex relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search orders..."
            className="pl-10 pr-4 py-2 rounded-full border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Profile Dropdown */}
        <ProfileDropdown
          avatar={avatar}
          username={username}
          email={email}
          phone={phone}
          role={role}
          createdAt={createdAt}
        />
      </div>
    </header>
  );
};

export default Header;
