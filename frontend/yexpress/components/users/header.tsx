"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import ProfileDropdown from "../common/profileDropdown";
import { ModeToggle } from "../common/modeToggle";
// Changed from 'require' to standard import
import useAuthStore from "@/store/authStore"; 

const Header = ({
  setIsMobileMenuOpen,
}: {
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const pathname = usePathname();
  
  // Get data from store
  const { avatar, username, email, phone, role, createdAt } = useAuthStore();

  // Smart Page Title Logic
  const getPageTitle = (path: string | null) => {
    if (!path) return "Overview";

    // 1. Define manual overrides for specific paths if you want exact control
    const titleMap: Record<string, string> = {
      "/users/dashboard": "Dashboard",
      "/users/profile": "My Profile",
      "/users/settings": "Account Settings",
    };

    if (titleMap[path]) return titleMap[path];

    // 2. Dynamic Fallback: Get the last segment
    // e.g., "/users/orders/details" -> "Details"
    const segments = path.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1];

    if (!lastSegment) return "Overview";

    // 3. Clean up the text (remove hyphens, capitalize words)
    // e.g., "order-history" -> "Order History"
    return lastSegment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const pageTitle = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-30 h-16 px-6 sm:px-8 flex items-center justify-between
      bg-white/80 dark:bg-slate-900/80 backdrop-blur-md
      border-b border-slate-200 dark:border-slate-800 transition-colors duration-200"
    >
      {/* LEFT: Mobile Menu Trigger & Page Title */}
      <div className="flex items-center gap-4">
        <button
          className="md:hidden p-2 -ml-2 rounded-lg
            text-slate-500 dark:text-slate-400
            hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>

        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          {pageTitle}
        </h1>
      </div>

      {/* RIGHT: Actions (Search removed) */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <ModeToggle />

        {/* Vertical Divider for visual structure */}
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

        {/* Profile */}
        <ProfileDropdown
          avatar={avatar}
          username={username ?? undefined}
          email={email ?? undefined}
          phone={phone}
          role={role}
          createdAt={createdAt}
        />
      </div>
    </header>
  );
};

export default Header;