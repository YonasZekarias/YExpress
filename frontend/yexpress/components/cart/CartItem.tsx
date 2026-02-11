'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';

// Helper for repeated Quantity UI
const QtyControl = ({ qty, update, updating }: { qty: number, update: (n: number) => void, updating: boolean }) => (
  <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg h-9 sm:h-auto">
    <button onClick={() => update(qty - 1)} disabled={updating || qty <= 1} className="px-2 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"><Minus className="w-3 h-3 sm:w-4 sm:h-4" /></button>
    <span className="w-8 sm:w-10 text-center text-sm font-medium">{qty}</span>
    <button onClick={() => update(qty + 1)} disabled={updating} className="px-2 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"><Plus className="w-3 h-3 sm:w-4 sm:h-4" /></button>
  </div>
);

export default function CartItem({ item, isUpdating, onUpdateQuantity, onRemove }: any) {
  const { product, variant, quantity, price: basePrice } = item;
  if (!product) return null;

  const price = variant?.price ?? basePrice;
  const image ='/placeholder.jpg'; //will edit it later
  const name = product.name;
  const variantText = variant?.attributes?.map((a: any) => `${a.attribute.name}: ${a.value.value}`).join(', ');
  const total = price * quantity;
  const updateQty = (n: number) => onUpdateQuantity(item._id, n);

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
      {/* --- Desktop --- */}
      <div className="hidden sm:flex items-center gap-6 p-4">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-600">
          <Image src={image} alt={name} fill className="object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <Link href={`/users/products/${product._id}`} className="font-semibold dark:text-white hover:text-blue-600 truncate block">{name}</Link>
          {variantText && <p className="text-sm text-gray-500 mt-1">{variantText}</p>}
          <div className="mt-1 font-medium dark:text-gray-200">${price.toFixed(2)}</div>
        </div>
        <QtyControl qty={quantity} update={updateQty} updating={isUpdating} />
        <div className="w-24 text-right font-bold dark:text-white">${total.toFixed(2)}</div>
        <button onClick={() => onRemove(item._id)} disabled={isUpdating} className="p-2 text-gray-400 hover:text-red-600"><Trash2 className="w-5 h-5" /></button>
      </div>

      {/* --- Mobile --- */}
      <div className="sm:hidden flex flex-col p-4 gap-4">
        <div className="flex gap-4">
          <div className="relative h-20 w-20 shrink-0 rounded-md border overflow-hidden"><Image src={image} alt={name} fill className="object-cover" /></div>
          <div className="flex-1 min-w-0">
            <Link href={`/users/products/${product._id}`} className="font-semibold dark:text-white line-clamp-2">{name}</Link>
            <p className="text-xs text-gray-500 mt-1">{variantText}</p>
            <p className="font-bold mt-1 dark:text-white">${price.toFixed(2)}</p>
          </div>
        </div>
        <div className="flex justify-between items-center pt-3 border-t dark:border-gray-700">
           <QtyControl qty={quantity} update={updateQty} updating={isUpdating} />
           <div className="flex items-center gap-4">
              <span className="font-bold dark:text-white">${total.toFixed(2)}</span>
              <button onClick={() => onRemove(item._id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
           </div>
        </div>
      </div>
    </div>
  );
}