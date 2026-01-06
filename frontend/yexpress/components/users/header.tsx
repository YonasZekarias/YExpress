import { Menu, Search, Bell } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import LogoutAlert from "../common/logoutAlert";
const useAuthStore = require("@/store/authStore").default;

const Header = ({
  setIsMobileMenuOpen,
}: {
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const pathname = usePathname()
  const activeTab = pathname?.split('/users/')[1] || 'overview';
  const router = useRouter();
  const { avatar, username, email, phone, role, createdAt, logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
    router.push("/");
  };

  const memberSince = createdAt
    ? new Date(createdAt).toLocaleDateString(undefined, {
        month: "short",
        year: "numeric",
      })
    : "Unknown";

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
        {/* Search Bar */}
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
        <div className="relative" ref={dropdownRef}>
          {/* Trigger */}
          <div
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="h-8 w-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs cursor-pointer"
          >
            <img src={avatar} alt="Profile" className="w-7 h-7 rounded-full" />
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-md shadow-lg z-50 py-2">
              {/* User Info */}
              <div className="px-4 py-2 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <img
                    src={avatar}
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-slate-800">
                      {username || "User"}
                    </p>
                    <p className="text-sm text-slate-500">{email}</p>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  {role ? `Role: ${role}` : ""}
                </p>
                {phone && (
                  <p className="text-xs text-slate-400">Phone: {phone}</p>
                )}
                <p className="text-xs text-slate-400">Member since: {memberSince}</p>
              </div>

              {/* Actions */}
              <button
                onClick={() => {
                  router.push("/users/profile");
                  setIsDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 rounded-lg transition-colors"
              >
                Profile
              </button>
              <LogoutAlert />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
