"use client";
import { useState } from "react";
import AdminSidebar from "@/components/admin/adminSidebar";
import AdminHeader from "@/components/admin/adminHeader";
import { ThemeProvider } from "@/components/ui/theme-provider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background text-black">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          activeTab={activeTab}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        <main className="flex-1 p-4 md:p-8 md:ml-64 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
