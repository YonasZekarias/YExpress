'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'sonner'; // or 'react-hot-toast'
import { ShoppingCart, ArrowLeft, Trash } from 'lucide-react';

import CartItem from '@/components/cart/CartItem';
import OrderSummary from '@/components/cart/OrderSummary';

export default function CartPage() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // --- 1. Fetch Cart ---
  const fetchCart = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/cart`, { withCredentials: true });
      if (res.data.success) {
        setCart(res.data.data);
      }
    } catch (error) {
      console.error("Fetch cart error", error);
      // Don't show error toast on 404 (empty cart), just set null
      setCart(null); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // --- 2. Update Quantity ---
  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setUpdating(true);
    try {
      // NOTE: Ensure your backend supports PUT /cart/items/:itemId
      await axios.put(`${API_URL}/cart/items/${itemId}`, 
        { quantity: newQuantity },
        { withCredentials: true }
      );
      // Optimistic update or refetch
      fetchCart(); 
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update quantity");
    } finally {
      setUpdating(false);
    }
  };

  // --- 3. Remove Item ---
  const handleRemoveItem = async (itemId: string) => {
    setUpdating(true);
    try {
      // NOTE: Ensure your backend supports DELETE /cart/items/:itemId
      await axios.delete(`${API_URL}/cart/items/${itemId}`, { withCredentials: true });
      toast.success("Item removed");
      fetchCart();
    } catch (error: any) {
      toast.error("Failed to remove item");
    } finally {
      setUpdating(false);
    }
  };

  // --- 4. Clear Cart ---
  const handleClearCart = async () => {
    if (!confirm("Are you sure you want to clear your entire cart?")) return;
    try {
      await axios.delete(`${API_URL}/cart`, { withCredentials: true });
      setCart(null);
      toast.success("Cart cleared");
    } catch (error) {
      toast.error("Failed to clear cart");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
      </div>
    );
  }

  // --- Empty State ---
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
          <ShoppingCart className="w-10 h-10 text-gray-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
          Looks like you haven't added anything to your cart yet. Explore our products and find something you love!
        </p>
        <Link 
          href="/users/products" 
          className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  // --- Main Render ---
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Shopping Cart</h1>
        <span className="text-gray-500 dark:text-gray-400">{cart.items.length} items</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left: Cart Items List */}
        <div className="flex-1 space-y-4">
          <div className="flex justify-end mb-2">
            <button 
              onClick={handleClearCart}
              className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
            >
              <Trash className="w-3 h-3" /> Clear Cart
            </button>
          </div>

          <div className="space-y-4">
            {cart.items.map((item: any) => (
              <CartItem 
                key={item._id} 
                item={item} 
                isUpdating={updating}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
              />
            ))}
          </div>
          
          <div className="mt-8">
            <Link href="/users/products" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:w-[380px] shrink-0">
          <OrderSummary 
            subtotal={cart.totalPrice} 
            itemCount={cart.items.length}
            isCheckingOut={false}
            onCheckout={() => toast.success("Proceeding to checkout...")} 
          />
        </div>
      </div>
    </div>
  );
}