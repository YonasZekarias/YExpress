"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { MoreVertical, Loader2, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import router for redirection
import { format } from "date-fns"; 

// Define interface based on your Mongoose Order Model
interface Order {
  _id: string;
  user: {
    firstName?: string;
    lastName?: string;
    email?: string;
  } | string | null; // User might be an ID string, an object, or null
  createdAt: string;
  totalAmount: number;
  orderStatus: string;
}

const statusClasses: Record<string, string> = {
  delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  shipped: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  processing: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function AdminOrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Initialize router

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Fetching from your actual endpoint
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/orders`,
          { withCredentials: true }
        );

        if (data.success && Array.isArray(data.data)) {
          // FIX: Access 'data.data' instead of 'data.orders'
          // We only take the first 5 for the dashboard widget
          setOrders(data.data.slice(0, 5));
        }
      } catch (error) {
        console.error("Failed to fetch recent orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (e) {
      return "N/A";
    }
  };

  // Handle Row Click
  const handleRowClick = (orderId: string) => {
    router.push(`/admin/orders/${orderId}`);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <h3 className="font-bold text-gray-900 dark:text-white text-lg">Recent Orders</h3>
        <Link 
          href="/admin/orders" 
          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium transition-colors"
        >
          View All
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800 text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold bg-gray-50/50 dark:bg-slate-800/30">
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Amount</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {orders.length === 0 ? (
               <tr>
                 <td colSpan={6} className="px-6 py-8 text-center text-gray-500 text-sm">
                   No recent orders found.
                 </td>
               </tr>
            ) : (
              orders.map((order) => (
                <tr 
                  key={order._id} 
                  onClick={() => handleRowClick(order._id)} // Click entire row to navigate
                  className="group hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  
                  {/* ID */}
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white text-sm whitespace-nowrap">
                    #{order._id.slice(-6).toUpperCase()}
                  </td>

                  {/* Customer */}
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {/* Safe check: user might be null or just an ID string depending on population */}
                        {typeof order.user === 'object' && order.user !== null 
                          ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() || 'Guest'
                          : 'User'}
                      </span>
                      <span className="text-xs text-gray-400 hidden group-hover:block transition-all">
                        {typeof order.user === 'object' && order.user?.email}
                      </span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {formatDate(order.createdAt)}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        statusClasses[order.orderStatus.toLowerCase()] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white text-right">
                    {formatCurrency(order.totalAmount)}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); 
                        handleRowClick(order._id);
                      }}
                      className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-2 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
                    >
                      <Eye className="w-4 h-4" />
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