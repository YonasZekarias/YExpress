"use client";

import { ShoppingBag, Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 pt-20 pb-10 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                 <ShoppingBag className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-slate-100">YExpress</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              A comprehensive e-commerce ecosystem connecting customers with their favorite products and empowering admins with total control.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="#" className="hover:text-indigo-600 transition">Marketplace</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition">Admin Dashboard</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition">Order Tracking</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition">Inventory</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="#" className="hover:text-indigo-600 transition">About Us</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition">Support</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition">Documentation</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="#" className="hover:text-indigo-600 transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200 pt-8 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            © {new Date().getFullYear()} YExpress Inc. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <div className="w-5 h-5 bg-slate-300 dark:bg-slate-700 rounded-full hover:bg-indigo-600 transition cursor-pointer"><Facebook/></div>
            <div className="w-5 h-5 bg-slate-300 dark:bg-slate-700 rounded-full hover:bg-indigo-600 transition cursor-pointer"><Twitter/></div>
            <div className="w-5 h-5 bg-slate-300 dark:bg-slate-700 rounded-full hover:bg-indigo-600 transition cursor-pointer"><Instagram/></div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;