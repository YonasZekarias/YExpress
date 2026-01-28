"use client"
import { ReactNode, useState } from "react";
import UserSidebar from "@/components/users/userSidebar";
import Header from "@/components/users/header";


interface UserLayoutProps {
  children: ReactNode;
}


const UserLayout = ({ children }: UserLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /* Inject mockUser into children if they accept it */
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex text-slate-900 dark:text-slate-100">
      {/* Sidebar */}
      <UserSidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main */}
      <div className="md:ml-64 flex-1 flex flex-col min-w-0">
        <Header setIsMobileMenuOpen={setIsMobileMenuOpen} />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
