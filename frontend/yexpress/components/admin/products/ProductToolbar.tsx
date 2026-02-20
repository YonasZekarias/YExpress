'use client';

import { Search, Filter, Plus } from 'lucide-react';
import { Category } from '@/types/admin';

interface ProductToolbarProps {
  search: string;
  setSearch: (v: string) => void;
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
  categories: Category[];
  onAddProduct: () => void;
}

export default function ProductToolbar({
  search, setSearch,
  selectedCategory, setSelectedCategory,
  categories,
  onAddProduct
}: ProductToolbarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-3">
      {/* Search Bar */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search products by name or description..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow shadow-sm"
        />
      </div>

      {/* Category Filter */}
      <div className="relative min-w-[200px]">
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none shadow-sm appearance-none cursor-pointer"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Add Button */}
      <button 
        onClick={onAddProduct}
        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm whitespace-nowrap"
      >
        <Plus className="w-4 h-4" /> Add Product
      </button>
    </div>
  );
}