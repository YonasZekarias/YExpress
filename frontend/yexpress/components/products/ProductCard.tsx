import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

// Helper to fix image paths or return placeholder for seed data
const getImageUrl = (photo?: string): string => {
  // 1. If no photo, return placeholder
  if (!photo) return '/placeholder.jpg';
  
  // 2. If it's a real URL (http) or a local file path (/), use it
  if (photo.startsWith('http') || photo.startsWith('/')) {
    return photo;
  }

  // 3. If it is seed data like "phone-1" or "prodt-1", return placeholder
  // (Or you could map these to specific files later if you have them)
  return '/placeholder.jpg';
};

export default function ProductCard({ product }: ProductCardProps) {
  // Safe Image Handling
  const rawPhoto = product.photo && product.photo.length > 0 ? product.photo[0] : undefined;
  const mainImage = getImageUrl(rawPhoto);

  return (
    <Link href={`/users/products/${product._id}`} className="group block">
      <div className="
        relative border rounded-lg overflow-hidden transition-all shadow-sm hover:scale-105  duration-300
        bg-white border-gray-200
        dark:bg-gray-800 dark:border-gray-700
      ">
        
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category Label */}
          <p className="text-xs font-medium uppercase tracking-wide mb-1 
            text-gray-500 dark:text-gray-400">
            {product.category?.name || 'Uncategorized'}
          </p>
          
          {/* Product Name */}
          <h3 className="text-lg font-semibold truncate 
            text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {product.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center mt-2">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm text-gray-600 dark:text-gray-300">
              {product.averageRating.toFixed(1)} ({product.ratingsCount})
            </span>
          </div>

          {/* Footer: Price & Button */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {/* Check if minPrice exists */}
              {product.minPrice !== undefined && product.minPrice !== null && product.minPrice > 0
                ? `$${product.minPrice.toFixed(2)}` 
                : <span className="text-sm font-medium text-blue-600 dark:text-blue-400">View Options</span>
              }
            </span>
            
            <button className="text-sm font-medium px-4 py-2 rounded-md transition-colors
              bg-black text-white hover:bg-gray-800
              dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              View
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}