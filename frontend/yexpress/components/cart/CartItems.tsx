import { ShoppingBag, Minus, Plus, Trash2, Loader2 } from "lucide-react";

interface CartItemsProps {
  items: any[];
  updatingId: string | null;
  onUpdate: (id: string, newQty: number) => void;
  onRemove: (id: string) => void;
}

export function CartItems({ items, updatingId, onUpdate, onRemove }: CartItemsProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-slate-800">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShoppingBag size={20} className="text-orange-500" />
          Order Summary
        </h2>
      </div>
      
      <div className="divide-y divide-gray-50 dark:divide-slate-800/50">
        {items.map((item) => (
          <div key={item._id} className="p-5 flex items-center justify-between group hover:bg-gray-50/50 dark:hover:bg-slate-800/20 transition-colors">
            <div className="flex-1 mr-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">{item.name}</h3>
              <p className="text-orange-600 font-bold">{item.price} <span className="text-xs text-orange-400">ETB</span></p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-xl p-1 shadow-inner">
                <button
                  disabled={updatingId === item._id || item.quantity <= 1}
                  onClick={() => onUpdate(item._id, item.quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30"
                >
                  <Minus size={14} strokeWidth={3} />
                </button>
                
                <span className="w-10 text-center font-bold text-slate-800 dark:text-white">
                  {updatingId === item._id ? <Loader2 size={14} className="animate-spin mx-auto" /> : item.quantity}
                </span>
                
                <button
                  disabled={updatingId === item._id}
                  onClick={() => onUpdate(item._id, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-slate-700"
                >
                  <Plus size={14} strokeWidth={3} />
                </button>
              </div>

              <button onClick={() => onRemove(item._id)} className="w-10 h-10 flex items-center justify-center rounded-full bg-red-50 dark:bg-red-900/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}