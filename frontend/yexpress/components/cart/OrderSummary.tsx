'use client';

import { ArrowRight, ShoppingBag } from 'lucide-react';

interface OrderSummaryProps {
  subtotal: number;
  isCheckingOut: boolean;
  onCheckout: () => void;
  itemCount: number;
}

export default function OrderSummary({ subtotal, isCheckingOut, onCheckout, itemCount }: OrderSummaryProps) {
  const shipping = 0; // Or calculate based on subtotal
  const tax = subtotal * 0.0; // Example: 0% tax for now
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Subtotal ({itemCount} items)</span>
          <span className="font-medium text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Shipping</span>
          <span className="text-green-600 font-medium">Free</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        
        <div className="h-px bg-gray-200 dark:bg-gray-700 my-4" />
        
        <div className="flex justify-between items-center">
          <span className="text-base font-bold text-gray-900 dark:text-white">Total</span>
          <span className="text-xl font-bold text-gray-900 dark:text-white">${total.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={onCheckout}
        disabled={isCheckingOut || itemCount === 0}
        className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-lg font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isCheckingOut ? (
           <span className="animate-pulse">Processing...</span>
        ) : (
           <>
             Checkout <ArrowRight className="w-4 h-4" />
           </>
        )}
      </button>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
        <ShoppingBag className="w-3 h-3" />
        <span>Secure Checkout</span>
      </div>
    </div>
  );
}