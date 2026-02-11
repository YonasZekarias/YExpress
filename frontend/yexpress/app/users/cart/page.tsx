'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-hot-toast'; 
import { ShoppingCart, ArrowLeft, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation'; 

// Components
import CartItem from '@/components/cart/CartItem';
import OrderSummary from '@/components/cart/OrderSummary';
import ConfirmModal from '@/components/cart/ConfirmModal'; 
import CheckoutModal from '@/components/cart/CheckoutModal'; 

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Modal States
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; type: 'delete' | 'clear' | null; id?: string }>({ open: false, type: null });
  const [checkoutOpen, setCheckoutOpen] = useState(false); // New Checkout Modal state

  const fetchCart = () => {
    axios.get(`${API_URL}/user/cart`, { withCredentials: true })
      .then(res => res.data.success && setCart(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCart(); }, []);

  // --- Handlers ---
  const handleUpdateQty = async (itemId: string, qty: number) => {
    if (qty < 1) return;
    setUpdating(true);
    try {
      await axios.put(`${API_URL}/user/cart/item/${itemId}`, { quantity: qty }, { withCredentials: true });
      fetchCart();
    } catch (e: any) { toast.error("Failed to update"); } 
    finally { setUpdating(false); }
  };

  const handleRemoveAction = async () => {
    try {
      const url = confirmModal.type === 'delete' ? `/item/${confirmModal.id}` : '';
      await axios.delete(`${API_URL}/user/cart${url}`, { withCredentials: true });
      toast.success(confirmModal.type === 'delete' ? "Item removed" : "Cart cleared");
      confirmModal.type === 'clear' ? setCart({ items: [], totalPrice: 0 }) : fetchCart();
      setConfirmModal({ open: false, type: null });
    } catch (e) { toast.error("Action failed"); }
  };

  // --- The Actual Checkout Submission ---
  const submitOrder = async (formData: any) => {
    try {
      await axios.post(`${API_URL}/user/orders`, formData, { withCredentials: true });
      toast.success("Order placed successfully!");
      setCheckoutOpen(false);
      router.push('/users/orders');
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Checkout failed");
    }
  };

  if (loading) return <div className="h-[60vh] flex center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div></div>;

  if (!cart?.items?.length) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center flex flex-col items-center">
      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6"><ShoppingCart className="w-10 h-10 text-gray-400" /></div>
      <h1 className="text-2xl font-bold dark:text-white">Your cart is empty</h1>
      <Link href="/users/products" className="mt-6 px-8 py-3 bg-black text-white rounded-lg hover:opacity-90">Start Shopping</Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-32">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold dark:text-white">Shopping Cart</h1>
        <button onClick={() => setConfirmModal({ open: true, type: 'clear' })} className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-md text-sm flex gap-2">
           <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">Clear Cart</span>
        </button>
      </div>

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Items (Spans 2 columns on desktop) */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item: any) => (
            <CartItem 
              key={item._id} 
              item={item} 
              isUpdating={updating} 
              onUpdateQuantity={handleUpdateQty} 
              onRemove={() => setConfirmModal({ open: true, type: 'delete', id: item._id })} 
            />
          ))}
          <Link href="/users/products" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mt-4">
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>

        {/* Right Col: Summary (Spans 1 column) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
             <OrderSummary 
                subtotal={cart.totalPrice} 
                itemCount={cart.items.length} 
                isCheckingOut={false} 
                onCheckout={() => setCheckoutOpen(true)} // Opens Modal
              />
          </div>
        </div>
      </div>

      {/* Modals */}
      <ConfirmModal 
        isOpen={confirmModal.open} 
        onClose={() => setConfirmModal({ ...confirmModal, open: false })} 
        onConfirm={handleRemoveAction} 
        title="Are you sure?" 
        description="This action cannot be undone." 
        variant="danger" 
      />

      <CheckoutModal 
        isOpen={checkoutOpen} 
        onClose={() => setCheckoutOpen(false)} 
        onSubmit={submitOrder} 
        total={cart.totalPrice}
      />
    </div>
  );
}