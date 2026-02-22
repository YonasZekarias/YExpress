'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useTransition } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming you have a cn utility, if not, standard strings work

interface Category {
  _id: string;
  name: string;
}

interface SearchAndFilterProps {
  categories: Category[];
  isLoading?: boolean; // New prop to force skeleton state if parent is fetching categories
}

export default function SearchAndFilter({ categories, isLoading = false }: SearchAndFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition(); // Tracks URL update status

  // Local state
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  
  // Note: We sync these with URL params to ensure they update if the URL changes externally
  const selectedCategory = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';

  // Update URL function wrapped in startTransition
  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    if (key !== 'page') {
      params.set('page', '1');
    }

    // Wrap the navigation in startTransition to track loading state
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== (searchParams.get('search') || '')) {
        updateFilters('search', searchTerm);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 1. Show Skeleton if parent says we are loading initial data
  if (isLoading) {
    return <SearchAndFilterSkeleton />;
  }

  return (
    <div className="p-4 mb-6 shadow-sm">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        
        {/* 1. Search Bar */}
        <div className="relative flex-1 w-full">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </div>
          
          <input 
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isPending}
            className={`w-full pl-10 pr-10 py-2.5 rounded-lg border bg-transparent 
              focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none transition-all
              dark:border-slate-700 dark:text-white dark:placeholder-slate-500
              ${isPending ? 'opacity-70 cursor-wait' : ''}`}
          />
          
          {searchTerm && !isPending && (
            <button 
              onClick={() => {
                setSearchTerm('');
                updateFilters('search', '');
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
            </button>
          )}
        </div>

        {/* 2. Category Dropdown */}
        <div className="w-full md:w-48 relative">
          <select 
            value={selectedCategory}
            onChange={(e) => updateFilters('category', e.target.value)}
            disabled={isPending}
            className={`w-full px-3 py-2.5 rounded-lg border bg-transparent appearance-none
              focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none transition-all
              dark:border-slate-700 dark:text-white cursor-pointer
              ${isPending ? 'opacity-70 cursor-wait' : ''}`}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          {/* Custom chevron or loader for dropdown could go here */}
        </div>

        {/* 3. Sort Dropdown */}
        <div className="w-full md:w-48">
          <select 
            value={sort}
            onChange={(e) => updateFilters('sort', e.target.value)}
            disabled={isPending}
            className={`w-full px-3 py-2.5 rounded-lg border bg-transparent appearance-none
              focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none transition-all
              dark:border-slate-700 dark:text-white cursor-pointer
              ${isPending ? 'opacity-70 cursor-wait' : ''}`}
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Best Rating</option>
          </select>
        </div>

      </div>
    </div>
  );
}


export function SearchAndFilterSkeleton() {
  return (
    <div className="p-4 mb-6 bg-white dark:bg-slate-950 rounded-xl border dark:border-slate-800 shadow-sm animate-pulse">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        
        {/* Search Bar Skeleton */}
        <div className="flex-1 w-full h-11 bg-slate-200 dark:bg-slate-800 rounded-lg" />

        {/* Category Dropdown Skeleton */}
        <div className="w-full md:w-48 h-11 bg-slate-200 dark:bg-slate-800 rounded-lg" />

        {/* Sort Dropdown Skeleton */}
        <div className="w-full md:w-48 h-11 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        
      </div>
    </div>
  );
}