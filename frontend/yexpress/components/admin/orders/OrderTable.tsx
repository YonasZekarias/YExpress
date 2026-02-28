'use client';

import { Eye, CreditCard, Banknote } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

interface Order {
  _id: string;
  user: {
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null;
  createdAt: string;
  totalAmount: number;
  orderStatus: string;
  paymentInfo: {
    method: string;
    status: string;
  };
}

interface OrderTableProps {
  orders: Order[];
  loading: boolean;
}

const statusClasses: Record<string, string> = {
  delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  shipped: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  processing: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function OrderTable({ orders, loading }: OrderTableProps) {
  const router = useRouter();

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const formatDate = (date: string) => {
      try { return format(new Date(date), "MMM dd, yyyy • HH:mm"); }
      catch { return "N/A"; }
  };

  const getPaymentIcon = (method: string) => {
      if (method === 'cash_on_delivery') return <Banknote className="w-3 h-3" />;
      return <CreditCard className="w-3 h-3" />;
  };

  if (loading) {
      return <div className="p-12 text-center text-gray-500">Loading orders...</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm mt-6">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Order ID</th>
              <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Customer</th>
              <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Date</th>
              <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Payment</th>
              <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>
              <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300 text-right">Total</th>
              <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {orders.length === 0 ? (
              <tr><td colSpan={7} className="p-8 text-center text-gray-500">No orders found.</td></tr>
            ) : (
              orders.map((order) => (
                <tr 
                    key={order._id} 
                    onClick={() => router.push(`/admin/orders/${order._id}`)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">
                    #{order._id.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">
                        {order.user ? `${order.user.firstName} ${order.user.lastName}` : "Guest User"}
                    </div>
                    <div className="text-xs text-gray-500">{order.user?.email || "No email"}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2">
                        <span className={`p-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300`}>
                            {getPaymentIcon(order.paymentInfo.method)}
                        </span>
                        <span className="capitalize text-gray-700 dark:text-gray-300">{order.paymentInfo.method.replace(/_/g, ' ')}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusClasses[order.orderStatus] || "bg-gray-100 text-gray-800"}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-gray-900 dark:text-white">
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        <Eye className="w-5 h-5" />
                    </button>
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