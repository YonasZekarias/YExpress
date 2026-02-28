import { AlertCircle } from "lucide-react";

// Define the type based on the API response we just built
interface LowStockItem {
  id: string;
  name: string;
  stock: number;
  price: number;
  image: string | null;
}

export default function InventoryWidget({ products }: { products: LowStockItem[] }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-900 dark:text-white">Low Stock Alert</h3>
        <span className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-xs font-bold px-2 py-1 rounded-full">
          {products.length} Items
        </span>
      </div>

      <div className="space-y-4">
        {products.length === 0 ? (
           <p className="text-sm text-gray-500 text-center py-4">No low stock items.</p>
        ) : (
          products.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  {item.image ? (
                     <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                     <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">N/A</div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate max-w-[120px]" title={item.name}>
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">${item.price}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span className="font-bold text-sm">{item.stock} left</span>
              </div>
            </div>
          ))
        )}
      </div>
      
      <button className="w-full mt-6 py-2 text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors">
        View Inventory
      </button>
    </div>
  );
}