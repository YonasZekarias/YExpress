'use client';

import { Edit, Trash2, Tags, Package } from 'lucide-react';
import { Product } from '@/types/admin';

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
  onClearFilters?: () => void;
}

export default function ProductTable({ products, loading, onEdit, onDelete, onClearFilters }: ProductTableProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Product</th>
              <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Category</th>
              <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Variants</th>
              <th className="px-6 py-4 text-right font-semibold text-gray-700 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500 dark:text-gray-400">Loading inventory...</td></tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-12 text-center text-gray-500 dark:text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                     <Package className="w-8 h-8 opacity-20" />
                     <p>No products found matching your filters.</p>
                     {onClearFilters && (
                       <button onClick={onClearFilters} className="text-blue-500 hover:underline text-xs">Clear Filters</button>
                     )}
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900 dark:text-white">{product.name}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-xs truncate max-w-[200px]">{product.description}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      {typeof product.category === 'object' ? product.category?.name : 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex flex-col gap-1">
                       <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                         <Tags className="w-3 h-3" />
                         {/* @ts-ignore */}
                         {product.ProductVariant?.length || 0} Variants
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => onEdit(product)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => onDelete(product._id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}