"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Heart, ChevronRight, Loader2, AlertCircle } from "lucide-react";

interface Category {
  name: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  // Category can be a string ID or a populated Object depending on your API
  category?: string | Category; 
}

const RecentWishlistWidget = () => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const { data } = await axios.get(`${API_URL}/user/wishlist`, {
          withCredentials: true,
        });

        if (data.success) {
          // Limit to top 3 items
          setWishlistItems(data.data.slice(0, 3));
        }
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  // Helper to safely get category name
  const getCategoryName = (category: string | Category | undefined) => {
    if (!category) return "Product";
    if (typeof category === 'object' && category !== null && 'name' in category) {
      return category.name;
    }
    if (typeof category === 'string') {
      return category;
    }
    return "Product";
  };

  if (loading) {
    return (
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800 h-full flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800 h-full flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-8 h-8 text-rose-500 mb-2" />
        <p className="text-sm text-slate-500">Failed to load wishlist.</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
            My Wishlist
          </h3>
        </div>
        <Link
          href="/dashboard/wishlist"
          className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition"
        >
          View all
        </Link>
      </div>

      {/* Content */}
      <div className="grow">
        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-8 text-center">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-3">
              <Heart className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Your wishlist is empty
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
              Save items you love here.
            </p>
            <Link
              href="/shop"
              className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-semibold hover:bg-indigo-100 transition"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {wishlistItems.map((product) => (
              <Link 
                href={`/users/products/${product._id}`} 
                key={product._id}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition group"
              >
                {/* Image */}
                <div className="relative w-14 h-14 shrink-0">
                  <img
                    src={product.images?.[0] || "/placeholder.jpg"}
                    alt={typeof product.name === 'string' ? product.name : 'Product'}
                    className="w-full h-full object-cover rounded-lg border border-slate-200 dark:border-slate-600"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/56";
                    }}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {/* Ensure name is a string */}
                    {typeof product.name === 'string' ? product.name : 'Unknown Product'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                     {/* FIXED: Safely get category string */}
                     {getCategoryName(product.category)}
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                    ${product.price?.toFixed(2) || "0.00"}
                  </p>
                </div>

                {/* Arrow */}
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition" />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      {wishlistItems.length > 0 && (
        <Link href="/users/wishlist">
            <button className="mt-6 w-full py-2.5 rounded-xl text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-800 transition">
            See all items
            </button>
        </Link>
      )}
    </div>
  );
};

export default RecentWishlistWidget;