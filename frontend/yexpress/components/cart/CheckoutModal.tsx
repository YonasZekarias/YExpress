'use client';

import { useState } from 'react';
import { X, Truck, Wallet } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  total: number;
}

const chapaCurrency =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_CHAPA_CURRENCY) ||
  'ETB';

export default function CheckoutModal({ isOpen, onClose, onSubmit, total }: CheckoutModalProps) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    country: '',
    phone: '',
    paymentMethod: 'cash_on_delivery' as 'cash_on_delivery' | 'chapa',
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      shippingAddress: {
        fullName: formData.fullName,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        phone: formData.phone,
      },
      paymentMethod: formData.paymentMethod,
    };
    await onSubmit(payload);
    setLoading(false);
  };

  const isChapa = formData.paymentMethod === 'chapa';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-bold dark:text-white">Checkout</h2>
          <button type="button" onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
            
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

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Payment Method</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className={`cursor-pointer border p-4 rounded-xl flex items-center gap-3 transition-all ${formData.paymentMethod === 'cash_on_delivery' ? 'border-black bg-black/5 ring-1 ring-black dark:border-white dark:bg-white/10' : 'border-gray-200 dark:border-gray-700'}`}>
                  <input type="radio" name="paymentMethod" value="cash_on_delivery" checked={formData.paymentMethod === 'cash_on_delivery'} onChange={handleChange} className="hidden" />
                  <Truck className="w-5 h-5" />
                  <span className="font-medium text-sm">Cash on Delivery</span>
                </label>

                <label className={`cursor-pointer border p-4 rounded-xl flex items-center gap-3 transition-all ${formData.paymentMethod === 'chapa' ? 'border-black bg-black/5 ring-1 ring-black dark:border-white dark:bg-white/10' : 'border-gray-200 dark:border-gray-700'}`}>
                  <input type="radio" name="paymentMethod" value="chapa" checked={formData.paymentMethod === 'chapa'} onChange={handleChange} className="hidden" />
                  <Wallet className="w-5 h-5" />
                  <span className="font-medium text-sm">Chapa</span>
                </label>
              </div>
              {isChapa && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  You will be redirected to Chapa. The charge uses your store total in{' '}
                  <span className="font-semibold">{chapaCurrency}</span> (set on the server as{' '}
                  <code className="text-[10px]">CHAPA_CURRENCY</code>). Align catalog prices with that currency.
                </p>
              )}
            </div>
          </form>
        </div>

        <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-xl font-bold dark:text-white">
              {isChapa
                ? `${chapaCurrency} ${total.toFixed(2)}`
                : `$${total.toFixed(2)}`}
            </p>
          </div>
          <button 
            type="submit" 
            form="checkout-form"
            disabled={loading}
            className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
          >
            {loading
              ? 'Processing...'
              : isChapa
                ? 'Continue to payment'
                : 'Place order'}
          </button>
        </div>

      </div>
    </div>
  );
}
