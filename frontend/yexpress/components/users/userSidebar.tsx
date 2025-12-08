import { User, Package,Heart, MapPin, CreditCard,ShoppingBag,X,LogOut } from "lucide-react";
import { mockUser } from "@/data/mockUser";
const {useRouter} = require("next/navigation");

const UserSidebar = ({ activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen }
    : {activeTab: string, setActiveTab: React.Dispatch<React.SetStateAction<string>>, isMobileMenuOpen: boolean, setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <User className="w-5 h-5" /> },
    { id: 'orders', label: 'Orders', icon: <Package className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
    { id: 'products', label: 'Products', icon: <Package className="w-5 h-5" /> },
    { id: 'cart', label: 'Wishlist', icon: <Heart className="w-5 h-5" /> },
    { id: 'addresses', label: 'Addresses', icon: <MapPin className="w-5 h-5" /> },
    { id: 'payment', label: 'Payment Methods', icon: <CreditCard className="w-5 h-5" /> },
  ];
  const router = useRouter();
  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        md:relative md:transform-none md:z-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 h-full flex flex-col">
          {/* Logo / Brand Area */}
          <div className="flex items-center space-x-2 mb-10 text-indigo-600 font-bold text-2xl">
             <ShoppingBag className="w-8 h-8" />
             <span>YExpress</span>
             <button className="md:hidden ml-auto text-slate-400" onClick={() => setIsMobileMenuOpen(false)}>
               <X className="w-6 h-6" />
             </button>
          </div>

          {/* User Brief */}
          <div className="flex items-center p-3 mb-8 bg-slate-50 rounded-xl border border-slate-100">
            <img src={mockUser.avatar} alt="Profile" className="w-10 h-10 rounded-full mr-3" />
            <div className="overflow-hidden">
              <p className="font-semibold text-slate-900 truncate">{mockUser.name}</p>
              <p className="text-xs text-slate-500 truncate">{mockUser.email}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { router.push(`/users/${item.id}`); setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors
                  ${activeTab === item.id 
                    ? 'bg-indigo-50 text-indigo-700 shadow-lg shadow-indigo-500/30' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="pt-6 border-t border-slate-100 mt-auto">
            <button className="w-full flex items-center px-4 py-3 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
export default UserSidebar;