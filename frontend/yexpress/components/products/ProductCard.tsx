'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Plus, Heart } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  initialWishlistState?: boolean; 
}

const getImageUrl = (photo?: string): string => {
  if (!photo) return '/placeholder.jpg';
  if (photo.startsWith('http') || photo.startsWith('/')) return photo;
  return '/placeholder.jpg';
};

const isNewArrival = (dateString?: string) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7;
};

export default function ProductCard({ product, initialWishlistState = false }: ProductCardProps) {
  
  // Initialize state from the passed prop
  const [isWishlisted, setIsWishlisted] = useState(initialWishlistState);
  const [loading, setLoading] = useState(false);

  // Sync state if the prop changes (important for search/filtering updates)
  useEffect(() => {
    setIsWishlisted(initialWishlistState);
  }, [initialWishlistState]);

  const mainImage = getImageUrl(product.photo?.[0]);
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isNew = isNewArrival(product.createdAt);
  const displayPrice = product.price || 0;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();

    if (loading) return;
    setLoading(true);

    const previousState = isWishlisted;
    setIsWishlisted(!isWishlisted); // Optimistic Toggle

    try {
      await axios.post(
        `${API_URL}/user/wishlist`, 
        { productId: product._id },
        { withCredentials: true }
      );
      toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
    } catch (error) {
      setIsWishlisted(previousState); // Revert
      toast.error("Could not update wishlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link 
      href={`/users/products/${product._id}`} 
      className="group relative flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
        <div className="relative aspect-4/5 w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />

          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {isOutOfStock ? (
              <span className="bg-gray-900/90 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-sm backdrop-blur-sm">
                Sold Out
              </span>
            ) : (
              <>
                {isNew && (
                  <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-sm shadow-sm">
                    New
                  </span>
                )}
                {isLowStock && (
                  <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-sm shadow-sm">
                    Low Stock
                  </span>
                )}
              </>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistClick}
            className={`absolute top-3 right-3 z-20 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm transition-all duration-300 transform 
              ${isWishlisted ? 'opacity-100 scale-100 text-red-500' : 'opacity-0 scale-90 text-gray-400'} 
              group-hover:opacity-100 group-hover:scale-100 hover:bg-white hover:text-red-500`}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="p-4 flex flex-col flex-1">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            {product.category?.name || 'General'}
          </p>

          <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2 min-h-12 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center gap-1 mt-2 mb-3">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
              {product.averageRating?.toFixed(1) || '0.0'}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({product.ratingsCount || 0} reviews)
            </span>
          </div>

          <div className="mt-auto flex items-end justify-between pt-3 border-t border-gray-100 dark:border-gray-700/50">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {displayPrice > 0 ? `$${displayPrice.toFixed(2)}` : 'N/A'}
              </span>
            </div>
            
            {!isOutOfStock && (
               <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white flex items-center justify-center transition-colors group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black">
                 <Plus className="w-4 h-4" />
               </div>
            )}
          </div>
        </div>
    </Link>
  );
}