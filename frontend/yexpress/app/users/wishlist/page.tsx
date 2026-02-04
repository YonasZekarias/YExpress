import { cookies } from 'next/headers';
import Link from 'next/link';
import ProductCard from '@/components/products/ProductCard';
import axios from 'axios';

// Helper to get wishlist items
async function getWishlistItems() {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.toString();

    if (!allCookies) return [];

    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/wishlist`, {
      headers: { Cookie: allCookies }
    });

    if (res.data && res.data.success) {
      return res.data.data;
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch wishlist", error);
    return [];
  }
}

export default async function WishlistPage() {
  const wishlistProducts = await getWishlistItems();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-[60vh]">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Wishlist</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
        
        {wishlistProducts.length > 0 && (
          <Link 
            href="/users/products" 
            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Continue Shopping &rarr;
          </Link>
        )}
      </div>

      {wishlistProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistProducts.map((product: any) => (
            <ProductCard 
              key={product._id} 
              product={product} 
              // Always true because we are ON the wishlist page
              initialWishlistState={true} 
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <svg 
              className="w-8 h-8 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your wishlist is empty</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6 max-w-sm text-center">
            Items you love and want to save for later will appear here.
          </p>
          <Link 
            href="/users/products" 
            className="px-6 py-2.5 bg-black text-white dark:bg-white dark:text-black rounded-lg font-medium transition-transform active:scale-95"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
}