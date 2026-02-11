'use client';

import { useState } from 'react';
import { X, CreditCard, Truck, Banknote } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  total: number;
}

export default function CheckoutModal({ isOpen, onClose, onSubmit, total }: CheckoutModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    country: '',
    phone: '',
    paymentMethod: 'cash_on_delivery'
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Construct payload for backend
    const payload = {
      shippingAddress: {
        fullName: formData.fullName,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        phone: formData.phone,
      },
      paymentMethod: formData.paymentMethod
    };
    await onSubmit(payload);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-bold dark:text-white">Checkout</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"><X className="w-5 h-5" /></button>
        </div>

        {/* Body (Scrollable) */}
        <div className="p-6 overflow-y-auto">
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Shipping Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Shipping Address</h3>
              <div className="grid grid-cols-2 gap-4">
                <input required name="fullName" placeholder="Full Name" onChange={handleChange} className="col-span-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border-none outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" />
                <input required name="address" placeholder="Address" onChange={handleChange} className="col-span-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border-none outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" />
                <input required name="city" placeholder="City" onChange={handleChange} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border-none outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" />
                <input required name="country" placeholder="Country" onChange={handleChange} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border-none outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" />
                <input required name="phone" placeholder="Phone Number" onChange={handleChange} className="col-span-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border-none outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" />
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Payment Method</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className={`cursor-pointer border p-4 rounded-xl flex items-center gap-3 transition-all ${formData.paymentMethod === 'cash_on_delivery' ? 'border-black bg-black/5 ring-1 ring-black dark:border-white dark:bg-white/10' : 'border-gray-200 dark:border-gray-700'}`}>
                  <input type="radio" name="paymentMethod" value="cash_on_delivery" checked={formData.paymentMethod === 'cash_on_delivery'} onChange={handleChange} className="hidden" />
                  <Truck className="w-5 h-5" />
                  <span className="font-medium text-sm">Cash on Delivery</span>
                </label>

                <label className={`cursor-pointer border p-4 rounded-xl flex items-center gap-3 transition-all ${formData.paymentMethod === 'card' ? 'border-black bg-black/5 ring-1 ring-black dark:border-white dark:bg-white/10' : 'border-gray-200 dark:border-gray-700'}`}>
                  <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === 'card'} onChange={handleChange} className="hidden" />
                  <CreditCard className="w-5 h-5" />
                  <span className="font-medium text-sm">Credit Card</span>
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500">Total Amount</p>
            <p className="text-xl font-bold dark:text-white">${total.toFixed(2)}</p>
          </div>
          <button 
            type="submit" 
            form="checkout-form"
            disabled={loading}
            className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </div>

      </div>
    </div>
  );
}