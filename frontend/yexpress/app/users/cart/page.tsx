'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-hot-toast'; 
import { ShoppingCart, ArrowLeft, Trash2 } from 'lucide-react';

// Components
import CartItem from '@/components/cart/CartItem';
import OrderSummary from '@/components/cart/OrderSummary';
import ConfirmModal from '@/components/cart/ConfirmModal'; // Ensure this path is correct

export default function CartPage() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false); // For quantity updates
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // --- Modal State ---
  const [modalOpen, setModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: 'delete_item' | 'clear_cart';
    itemId?: string;
  } | null>(null);

  // --- 1. Fetch Cart ---
  const fetchCart = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/cart`, { withCredentials: true });
      if (res.data.success) {
        setCart(res.data.data);
      }
    } catch (error) {
      console.error("Fetch cart error", error);
      // Don't set cart to null on error if it was already loaded, just show toast? 
      // Actually, if 404/empty, controller returns empty structure now.
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
      // NOTE: Adjust endpoint if your route is different (e.g. /cart/item/:id)
      await axios.put(`${API_URL}/user/cart/item/${itemId}`, 
        { quantity: newQuantity },
        { withCredentials: true }
      );
      // Refresh cart to get accurate totals
      await fetchCart(); 
      toast.success("Quantity updated");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update quantity");
    } finally {
      setUpdating(false);
    }
  };

  // --- 3. Dialog Triggers ---
  
  // User clicks Trash icon on a specific item
  const openRemoveItemModal = (itemId: string) => {
    setPendingAction({ type: 'delete_item', itemId });
    setModalOpen(true);
  };

  // User clicks "Clear Cart" button
  const openClearCartModal = () => {
    setPendingAction({ type: 'clear_cart' });
    setModalOpen(true);
  };

  // --- 4. Execute Confirmed Action ---
  const handleConfirmAction = async () => {
    if (!pendingAction) return;

    setActionLoading(true);
    try {
      if (pendingAction.type === 'delete_item' && pendingAction.itemId) {
        // DELETE Single Item
        await axios.delete(`${API_URL}/user/cart/item/${pendingAction.itemId}`, { withCredentials: true });
        toast.success("Item removed");
        await fetchCart(); // Refresh list
      } 
      else if (pendingAction.type === 'clear_cart') {
        // DELETE Entire Cart
        await axios.delete(`${API_URL}/user/cart`, { withCredentials: true });
        toast.success("Cart cleared");
        setCart({ items: [], totalPrice: 0 }); // Instant UI clear
      }
      
      setModalOpen(false); // Close modal on success
      
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(false);
      setPendingAction(null); // Reset action
    }
  };

  // --- Loading State ---
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
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center text-center animate-in fade-in duration-500">
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
    <div className="max-w-7xl mx-auto py-8 pb-32">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Shopping Cart</h1>
        <div className="flex items-center justify-between sm:justify-end gap-4">
            <span className="text-gray-500 dark:text-gray-400">{cart.items.length} items</span>
            <button 
                onClick={openClearCartModal}
                disabled={cart.items.length === 0}
                className="text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-md transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Trash2 className="w-4 h-4" /> Clear Cart
            </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-12 relative">
        
        {/* Left: Cart Items List */}
        <div className="flex-1 space-y-4">
          <div className="space-y-4">
            {cart.items.map((item: any) => (
              <CartItem 
                key={item._id} 
                item={item} 
                itemId={item._id}
                isUpdating={updating}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={() => openRemoveItemModal(item._id)} // Triggers Modal
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
          <div className="sticky top-24">
             <OrderSummary 
                subtotal={cart.totalPrice} 
                itemCount={cart.items.length}
                isCheckingOut={false}
                onCheckout={() => toast.success("Proceeding to checkout...")} 
              />
          </div>
        </div>
      </div>

      {/* --- Confirmation Modal --- */}
      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmAction}
        loading={actionLoading}
        variant="danger"
        title={pendingAction?.type === 'clear_cart' ? "Clear Entire Cart?" : "Remove Item?"}
        description={pendingAction?.type === 'clear_cart' 
          ? "Are you sure you want to remove all items from your cart? This action cannot be undone." 
          : "Are you sure you want to remove this item? You can always add it back later."}
        confirmText={pendingAction?.type === 'clear_cart' ? "Clear Cart" : "Remove"}
        cancelText="Keep it"
      />

    </div>
  );
}