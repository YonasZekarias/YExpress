"use client";
import React from 'react';
import { Bell, Search,Menu, } from 'lucide-react';
const AdminHeader = ({ activeTab, setIsMobileMenuOpen }:{ activeTab: string; setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
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

          <div className="flex items-center space-x-6">
            {/* Search Bar */}
            <div className="hidden md:flex relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search anything..."
                className="pl-10 pr-4 py-2 rounded-full border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 bg-slate-50"
              />
            </div>

            {/* Notifications */}
            {/* <button className="relative text-slate-500 hover:bg-slate-100 rounded-full transition">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button> */}

            {/* Admin Profile */}
            <div className="flex items-center space-x-3 cursor-pointer mr-1.5">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-slate-900">
                  Admin
                </p>
                <p className="text-xs text-slate-500">Admin</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                <img
                  src="https://ui-avatars.com/api/?name=Admin+User&background=0f172a&color=fff"
                  alt="Admin"
                />
              </div>
            </div>
          </div>
        </header>
    );
}

export default AdminHeader;
