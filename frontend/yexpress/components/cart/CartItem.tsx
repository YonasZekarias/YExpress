'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, X } from 'lucide-react';
import { CartItem as CartItemType } from '@/types/cart'; // You might need to define this type or use 'any' temporarily

interface CartItemProps {
  item: CartItemType;
  isUpdating: boolean;
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemove: (itemId: string) => void;
}

export default function CartItem({ item, isUpdating, onUpdateQuantity, onRemove }: CartItemProps) {
  // Determine display data (Product vs Variant)
  const product = item.product;
  const variant = item.variant;
  
  // Safety check: if product was deleted from DB but still in cart
  if (!product) return null; 

  const name = product.name;
  const price = variant ? variant.price : item.price; // Use cart cached price or current variant price
  const image = (product?.photo?.[0] || product.photo?.[0] || '/placeholder.jpg');
  
  // Attributes text (e.g., "Color: Red, Size: M")
  const variantText = variant?.attributes?.map((attr: any) => 
    `${attr.attribute.name || attr.attribute}: ${attr.value.value || attr.value}`
  ).join(', ');

  const maxStock = variant ? variant.stock : product.stock;
  const isOutOfStock = maxStock === 0;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
      {/* Image */}
      <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
        <Image 
          src={image.startsWith('http') ? image : '/placeholder.jpg'} 
          alt={name} 
          fill 
          className="object-cover" 
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-xs font-bold uppercase">Sold Out</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link href={`/users/products/${product._id}`} className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 truncate block">
          {name}
        </Link>
        {variantText && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{variantText}</p>
        )}
        <p className="text-sm font-medium text-gray-900 dark:text-gray-200 mt-1">
          ${price.toFixed(2)}
        </p>
      </div>

      {/* Actions (Quantity & Remove) */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mt-4 sm:mt-0">
        {/* Quantity Control */}
        <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
          <button
            onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
            disabled={isUpdating || item.quantity <= 1}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
            disabled={isUpdating || item.quantity >= maxStock}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Total for this line */}
        <div className="text-right min-w-20 hidden sm:block">
          <p className="font-bold text-gray-900 dark:text-white">
            ${(price * item.quantity).toFixed(2)}
          </p>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemove(item._id)}
          disabled={isUpdating}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          title="Remove item"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}