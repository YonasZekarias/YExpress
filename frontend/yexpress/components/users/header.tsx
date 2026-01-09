"use client";

import { Menu, Search, Bell } from "lucide-react";
import { usePathname } from "next/navigation";
import ProfileDropdown from "../common/profileDropdown";
import { ModeToggle } from "../common/modeToggle";

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
    <header className="sticky top-0 z-30 h-16 px-8 flex items-center justify-between
      bg-white/80 dark:bg-slate-900/80 backdrop-blur
      border-b border-slate-200 dark:border-slate-700"
    >
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <button
          className="md:hidden p-2 rounded-lg
            text-slate-500 dark:text-slate-300
            hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>

        <h2 className="hidden md:block text-xl font-semibold capitalize
          text-slate-800 dark:text-slate-100"
        >
          {activeTab}
        </h2>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden md:block relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2
            text-slate-400 dark:text-slate-500"
          />
          <input
            type="text"
            placeholder="Search orders..."
            className="pl-10 pr-4 py-2 w-64 rounded-full text-sm
              bg-slate-50 dark:bg-slate-800
              border border-slate-200 dark:border-slate-700
              text-slate-800 dark:text-slate-100
              placeholder:text-slate-400 dark:placeholder:text-slate-500
              focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
          />
        </div>

        {/* Notifications */}
        <ModeToggle/>

        {/* Profile */}
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
