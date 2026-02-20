'use client';

import { Package, Layers } from 'lucide-react';

interface ProductTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function ProductTabs({ activeTab, setActiveTab }: ProductTabsProps) {
  return (
    <div className="flex bg-white dark:bg-gray-800 p-1 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <button 
        onClick={() => setActiveTab('products')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'products' ? 'bg-black text-white dark:bg-white dark:text-black shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
      >
        <span className="flex items-center gap-2"><Package className="w-4 h-4" /> Products</span>
      </button>
      <button 
        onClick={() => setActiveTab('categories')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'categories' ? 'bg-black text-white dark:bg-white dark:text-black shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
      >
        <span className="flex items-center gap-2"><Layers className="w-4 h-4" /> Categories</span>
      </button>
    </div>
  );
}