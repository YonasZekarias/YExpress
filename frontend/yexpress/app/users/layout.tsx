"use client";

import React, { ReactNode, useState } from "react";
import UserSidebar from "@/components/users/userSidebar";
import Header from "@/components/users/header";

/* Types */
interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  memberSince: string;
}

interface UserLayoutProps {
  children: ReactNode;
}

/* Mock user (can be replaced by auth data later) */
const mockUser: UserProfile = {
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  avatar:
    "https://ui-avatars.com/api/?name=Alex+Johnson&background=6366f1&color=fff",
  memberSince: "Jan 2023",
};

const UserLayout = ({ children }: UserLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /* Inject mockUser into children if they accept it */
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, {
        mockUser,
      });
    }
    return child;
  });

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
          {childrenWithProps}
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
