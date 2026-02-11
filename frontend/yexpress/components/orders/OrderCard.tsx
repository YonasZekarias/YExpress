import Link from 'next/link';
import { format } from 'date-fns';
import { Package, Calendar, ChevronRight } from 'lucide-react';
import { Order } from '@/types/order';

export default function OrderCard({ order }: { order: Order }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500';
      case 'processing': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-500';
      case 'shipped': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-500';
      case 'delivered': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-500';
      case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-500';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <Package className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Order #{order._id.slice(-6).toUpperCase()}</h3>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {format(new Date(order.createdAt), 'MMM dd, yyyy')}</span>
                <span>•</span>
                <span>{order.items.length} Items</span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.orderStatus)}`}>{order.orderStatus.toUpperCase()}</span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="h-px bg-gray-100 dark:bg-gray-700 mb-6" />

        {/* Footer (Images & Link) */}
        <div className="flex items-center justify-between">
          <div className="flex -space-x-3 overflow-hidden">
            {order.items.slice(0, 4).map((item, idx) => (
              <div key={idx} className="relative w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 overflow-hidden">
                 <img src={item.product?.photo?.[0] || '/placeholder.jpg'} alt="product" className="w-full h-full object-cover" />
              </div>
            ))}
            {order.items.length > 4 && (
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 bg-gray-100 text-xs font-medium">+{order.items.length - 4}</div>
            )}
          </div>
          <Link href={`/users/orders/${order._id}`} className="flex items-center gap-1 text-sm font-medium hover:underline">View Details <ChevronRight className="w-4 h-4" /></Link>
        </div>
      </div>
    </div>
  );
}