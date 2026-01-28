'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, ShoppingCart, Heart, Share2 } from 'lucide-react';
import { Product, Variant } from '@/types/product';

interface ProductViewProps {
  product: Product;
  variants: Variant[];
  priceRange: { min: number; max: number };
}

// 1. Helper to fix image paths (Safe for seed data)
const getImageUrl = (photo?: string): string => {
  if (!photo) return '/placeholder.jpg';
  if (photo.startsWith('http') || photo.startsWith('/')) {
    return photo;
  }
  return '/placeholder.jpg';
};

export default function ProductView({ product, variants, priceRange }: ProductViewProps) {

  const validPhotos = product.photo?.length 
    ? product.photo.map(getImageUrl) 
    : ['/placeholder.png'];

  const [selectedImage, setSelectedImage] = useState(validPhotos[0]);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

      <div className="space-y-4">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <Image
            src={selectedImage}
            alt={product.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        {validPhotos.length > 1 && (
          <div className="grid grid-cols-4 gap-4">
            {validPhotos.map((photo, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(photo)}
                className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                  selectedImage === photo
                    ? 'border-black dark:border-white ring-1 ring-black dark:ring-white'
                    : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Image
                  src={photo}
                  alt={`View ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col">
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
          {product.category?.name || 'Category'}
        </p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
          {product.name}
        </h1>

        <div className="flex items-center mt-3 space-x-4">
          <div className="flex items-center text-yellow-400">
            <Star className="w-5 h-5 fill-current" />
            <span className="ml-1 text-sm font-medium text-gray-900 dark:text-gray-200">
              {product.averageRating.toFixed(1)}
            </span>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {product.ratingsCount} reviews
          </span>
        </div>

        <div className="mt-6">
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            ${priceRange.min === priceRange.max 
              ? priceRange.min.toFixed(2) 
              : `${priceRange.min.toFixed(2)} - $${priceRange.max.toFixed(2)}`
            }
          </p>
        </div>

        <div className="mt-6 prose prose-sm text-gray-600 dark:text-gray-300">
          <p>{product.description}</p>
        </div>

        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
          <div className="flex items-center space-x-4 mb-6">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-200">Quantity</span>
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
              >
                -
              </button>
              <span className="px-3 py-1 text-gray-900 dark:text-white font-medium border-x border-gray-300 dark:border-gray-600">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex-1 bg-black text-white dark:bg-white dark:text-black py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
            <button className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300">
              <Heart className="w-6 h-6" />
            </button>
            <button className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300">
              <Share2 className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}