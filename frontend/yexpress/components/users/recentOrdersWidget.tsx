"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  CheckCircle,
  Truck,
  Clock,
  ChevronRight,
  XCircle,
  Package,
  AlertCircle,
  Loader2
} from "lucide-react";

// Define the interface based on your Mongoose Model
interface Product {
  _id: string;
  name: string;
  images: string[]; // Assuming your Product model has an array of images
}

interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  createdAt: string;
  totalAmount: number;
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: OrderItem[];
}

// Map your model's lowercase statuses to visual styles
const statusStyles: Record<string, string> = {
  delivered:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  shipped:
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400",
  processing:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  cancelled:
    "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400",
  pending:
    "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-400",
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered": return <CheckCircle className="w-3.5 h-3.5" />;
    case "shipped": return <Truck className="w-3.5 h-3.5" />;
    case "processing": return <Clock className="w-3.5 h-3.5" />;
    case "cancelled": return <XCircle className="w-3.5 h-3.5" />;
    case "pending": default: return <Package className="w-3.5 h-3.5" />;
  }
};

const RecentOrdersWidget = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        // Fetch sorted by newest
        const { data } = await axios.get(
          `${API_URL}/user/orders?sort=newest&limit=5`, 
          { withCredentials: true }
        );

        if (data.success) {
          // Take the first 5 if the API doesn't support the limit param natively yet
          setOrders(data.data.slice(0, 5));
        }
      } catch (err) {
        console.error("Error fetching recent orders:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentOrders();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 h-full flex flex-col justify-center items-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500 text-sm">Loading recent orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center h-full flex flex-col justify-center items-center">
        <AlertCircle className="w-10 h-10 text-rose-500 mb-3" />
        <p className="text-slate-600 dark:text-slate-400">Unable to load orders.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
          Recent Orders
        </h3>
        <Link 
          href="/users/orders" 
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition"
        >
          View all
        </Link>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto grow">
        {orders.length === 0 ? (
          <div className="p-10 text-center flex flex-col items-center justify-center h-64">
            <Package className="w-12 h-12 text-slate-300 mb-3" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">No orders found</p>
            <p className="text-slate-400 text-sm mt-1">Your recent purchases will appear here.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-500 dark:text-slate-400 font-semibold">
              <tr>
                <th className="px-6 py-4 text-left">Order</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-right">Total</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {orders.map((order) => {
                // 1. Get the first product image safely
                const firstItem = order.items?.[0];
                // Check if product is populated and has images, otherwise use placeholder
                const itemImage = firstItem?.product?.images?.[0] || "/images/placeholder-product.jpg";
                
                // 2. Format Date (using createdAt from model)
                const date = new Date(order.createdAt).toLocaleDateString("en-US", {
                  month: "short", day: "numeric", year: "numeric"
                });

                // 3. Status Capitalization for Display
                const displayStatus = order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1);
                
                return (
                  <tr
                    key={order._id}
                    className="group hover:bg-slate-50/60 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    {/* Order Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="relative w-10 h-10 mr-3 shrink-0">
                          <img
                            src={itemImage}
                            alt="Product"
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm bg-slate-100"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://via.placeholder.com/40?text=?";
                            }}
                          />
                          {order.items.length > 1 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                              +{order.items.length - 1}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-100 truncate max-w-[100px] sm:max-w-[140px]">
                            #{order._id.slice(-6).toUpperCase()}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {date}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusStyles[order.orderStatus] || statusStyles.pending}`}
                      >
                        {getStatusIcon(order.orderStatus)}
                        {displayStatus}
                      </span>
                    </td>

                    {/* Total (Using totalAmount) */}
                    <td className="px-6 py-4 text-right font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      ${order.totalAmount.toFixed(2)}
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-center">
                      <Link href={`/users/orders/${order._id}`}>
                        <button className="p-2 rounded-full text-slate-400 hover:text-indigo-600 dark:text-slate-500 dark:hover:text-indigo-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 transition">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RecentOrdersWidget;