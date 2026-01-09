import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  ShoppingBag,
  X,
} from "lucide-react";
import useAuthStore from "@/store/authStore";
import { useRouter, usePathname } from "next/navigation";
import LogoutAlert from "../common/logoutAlert";
import UserInfo from "../common/userInfo";

const UserSidebar = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const menuItems = [
    { id: "overview", label: "Overview", icon: <User className="w-5 h-5" /> },
    { id: "orders", label: "Orders", icon: <Package className="w-5 h-5" /> },
    { id: "profile", label: "Profile", icon: <User className="w-5 h-5" /> },
    { id: "products", label: "Products", icon: <Package className="w-5 h-5" /> },
    { id: "cart", label: "Wishlist", icon: <Heart className="w-5 h-5" /> },
    { id: "addresses", label: "Addresses", icon: <MapPin className="w-5 h-5" /> },
    { id: "payment", label: "Payment Methods", icon: <CreditCard className="w-5 h-5" /> },
  ];

  const { username, email, avatar } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const currentTab = pathname?.split("/users/")[1] || "overview";

  return (
    <>
      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64
        bg-white dark:bg-slate-900
        border-r border-slate-200 dark:border-slate-700
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Brand */}
          <div className="flex items-center space-x-2 mb-10 font-bold text-2xl text-indigo-600 dark:text-indigo-400">
            <ShoppingBag className="w-8 h-8" />
            <span>YExpress</span>
            <button
              className="md:hidden ml-auto text-slate-400 dark:text-slate-500"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User Info */}
          <UserInfo avatar={avatar} username={username ?? ""} email={email ?? ""} />
          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  router.push(`/users/${item.id}`);
                  setIsMobileMenuOpen(false);
                }}
                className={`relative w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all
                  ${
                    currentTab === item.id
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
            ))}
          </nav>

          {/* Logout */}
          <div className="pt-6 mt-auto border-t border-slate-100 dark:border-slate-700">
            <LogoutAlert />
          </div>
        </div>
      </aside>
    </>
  );
};

export default UserSidebar;
