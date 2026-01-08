"use client";
import React from "react";
import { Search, Menu } from "lucide-react";
import useAuthStore from "@/store/authStore";
import ProfileDropdown from "../common/profileDropdown";
import { ModeToggle } from "../common/modeToggle";
const AdminHeader = ({
  activeTab,
  setIsMobileMenuOpen,
}: {
  activeTab: string;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { avatar, username, email, phone, role, createdAt } = useAuthStore();
  return (
    <header className="bg-background border-b border-border h-16 px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center">
        <button
          className="mr-4 md:hidden text-muted-foreground hover:text-foreground"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold text-foreground capitalize hidden md:block">
          {activeTab}
        </h2>
      </div>

      <div className="flex items-center space-x-6">
        {/* Search Bar */}
        <div className="hidden md:flex relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search anything..."
            className="
          pl-10 pr-4 py-2 rounded-full
          border border-input
          text-sm
          bg-muted
          text-foreground
          placeholder:text-muted-foreground
          focus:outline-none
          focus:ring-2
          focus:ring-ring
          w-64
        "
          />
        </div>

        <ModeToggle />

        <ProfileDropdown
          avatar={avatar}
          username={username ?? "Admin"}
          email={email ?? "Admin"}
          phone={phone}
          role={role}
          createdAt={createdAt}
        />
      </div>
    </header>
  );
};

export default AdminHeader;
