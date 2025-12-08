'use client';
import React from "react";
import UserSidebar from "@/components/users/userSidebar";
import Header from "@/components/users/header";
import { useState, ReactNode, ReactElement, cloneElement } from "react";

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  memberSince: string;
}

const mockUser: UserProfile = {
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  avatar: "https://ui-avatars.com/api/?name=Alex+Johnson&background=6366f1&color=fff",
  memberSince: "Jan 2023",
};

const UserLayout = ({ children }: { children: ReactNode }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  interface UserChildProps {
  mockUser: UserProfile;
}

const childrenWithProps = React.Children.map(children, (child) => {
  if (React.isValidElement<UserChildProps>(child)) {
    return React.cloneElement(child, { mockUser });
  }
  return child;
});
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      <UserSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          activeTab={activeTab}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {childrenWithProps}
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
