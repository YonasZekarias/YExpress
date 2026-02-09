'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, X } from 'lucide-react';
import { CartItem as CartItemType } from '@/types/cart'; 

interface CartItemProps {
  item: CartItemType;
  isUpdating: boolean;
  itemId: string;
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemove: (itemId: string) => void;
}

export default function CartItem({ item, isUpdating, onUpdateQuantity, onRemove, itemId }: CartItemProps) {
  const product = item.product;
  const variant = item.variant;
  
  if (!product) return null; 

  const name = product.name;
  const price = variant ? variant.price : item.price;
  const image = (product?.photo?.[0] || product.photo?.[0] || '/placeholder.jpg');
  
  // Format attributes (Color: Red)
  const variantText = variant?.attributes?.map((attr: any) => 
    `${attr.attribute.name || attr.attribute}: ${attr.value.value || attr.value}`
  ).join(', ');

  const maxStock = variant ? variant.stock : product.stock;
  
  // Calculate total for this specific item
  const itemTotal = price * item.quantity;

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all overflow-hidden">
      
      {/* --- Desktop & Tablet Layout (Horizontal) --- */}
      <div className="hidden sm:flex items-center gap-6 p-4">
        {/* Image */}
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-600">
          <Image 
            src={image.startsWith('http') ? image : '/placeholder.jpg'} 
            alt={name} 
            fill 
            className="object-cover" 
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <Link href={`/users/products/${product._id}`} className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 line-clamp-1">
            {name}
          </Link>
          {variantText && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{variantText}</p>
          )}
          <div className="mt-1 font-medium text-gray-900 dark:text-gray-200">
            ${price.toFixed(2)}
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg">
          <button
            onClick={() => onUpdateQuantity(itemId, item.quantity - 1)}
            disabled={isUpdating || item.quantity <= 1}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(itemId, item.quantity + 1)}
            disabled={isUpdating} // Removed maxStock check temporarily if stock data is unreliable
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Line Total */}
        <div className="w-24 text-right font-bold text-gray-900 dark:text-white">
          ${itemTotal.toFixed(2)}
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemove(item._id)}
          disabled={isUpdating}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* --- Mobile Layout (Grid) --- */}
      <div className="sm:hidden flex flex-col p-4 gap-4">
        <div className="flex gap-4">
          {/* Image */}
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-600">
             <Image 
              src={image.startsWith('http') ? image : '/placeholder.jpg'} 
              alt={name} 
              fill 
              className="object-cover" 
            />
          </div>
          
          {/* Info */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <Link href={`/users/products/${product._id}`} className="font-semibold text-gray-900 dark:text-white line-clamp-2 leading-tight">
                {name}
              </Link>
              {variantText && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{variantText}</p>
              )}
            </div>
            <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
               ${price.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Bottom Row: Controls & Total */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
           {/* Quantity */}
           <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg h-9">
              <button
                onClick={() => onUpdateQuantity(itemId, item.quantity - 1)}
                disabled={isUpdating || item.quantity <= 1}
                className="px-3 h-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
              <button
                onClick={() => onUpdateQuantity(itemId, item.quantity + 1)}
                disabled={isUpdating}
                className="px-3 h-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <Plus className="w-3 h-3" />
              </button>
           </div>

           <div className="flex items-center gap-4">
              <span className="font-bold text-gray-900 dark:text-white">
                ${itemTotal.toFixed(2)}
              </span>
              <button
                onClick={() => onRemove(item._id)}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-5 h-5" />
              </button>
           </div>
        </div>
      </div>

    </div>
  );
}