'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { format } from 'date-fns'; // You might need to install: npm install date-fns
import { Package, Clock, CheckCircle, XCircle, ChevronRight, ShoppingBag,Calendar,Truck} from 'lucide-react';

// --- Interfaces ---
interface OrderStats {
  pending: number;
  processing: number;
  delivered: number;
  shipped: number;
}

interface OrderItem {
  product: { name: string; photo: string[] };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // --- Fetch Data ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const orderRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/orders`, { withCredentials: true });
        const statsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/orders/stats`, { withCredentials: true });

        if (orderRes.data.success) setOrders(orderRes.data.data);

        if (statsRes.data.success) setStats(statsRes.data.data);
        
      } catch (error) {
        console.log("Failed to fetch orders", error);
      } 
    };

    fetchData();
  }, []);

  // --- Helper: Status Colors ---
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

  // --- Helper: Filter Logic ---
  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.orderStatus === activeTab);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-20">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Orders</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Track and manage your recent purchases.</p>
      </div>

      {/* --- 1. Stats Grid --- */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard 
            label="Pending" 
            count={stats.pending} 
            icon={<Clock className="w-5 h-5 text-yellow-600" />} 
            bg="bg-yellow-50 dark:bg-yellow-900/10" 
          />
          <StatCard 
            label="Processing" 
            count={stats.processing} 
            icon={<Package className="w-5 h-5 text-blue-600" />} 
            bg="bg-blue-50 dark:bg-blue-900/10" 
          />
            <StatCard 
              label="Shipped" 
              count={stats.shipped} 
              icon={<Truck className="w-5 h-5 text-purple-600" />} 
              bg="bg-purple-50 dark:bg-purple-900/10" 
            />
          <StatCard 
            label="Delivered" 
            count={stats.delivered} 
            icon={<CheckCircle className="w-5 h-5 text-green-600" />} 
            bg="bg-green-50 dark:bg-green-900/10" 
          />
        </div>
      )}

      {/* --- 2. Filter Tabs --- */}
      <div className="flex overflow-x-auto pb-4 gap-2 mb-6 scrollbar-hide">
        {['all', 'pending', 'processing', 'delivered', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab 
                ? 'bg-black text-white dark:bg-white dark:text-black' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* --- 3. Orders List --- */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No orders found</h3>
            <p className="text-gray-500">You haven't placed any orders with this status yet.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div 
              key={order._id} 
              className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  
                  {/* Order Header Info */}
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <Package className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        Order #{order._id.slice(-6).toUpperCase()}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                           <Calendar className="w-3.5 h-3.5" />
                           {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                        </span>
                        <span>•</span>
                        <span>{order.items.length} Items</span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Price */}
                  <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus.toUpperCase()}
                    </span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-100 dark:bg-gray-700 mb-6" />

                {/* Items Preview */}
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-3 overflow-hidden">
                    {order.items.slice(0, 4).map((item, idx) => (
                      <div key={idx} className="relative w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 overflow-hidden">
                         {/* Fallback image logic or use Next Image if you have valid URLs */}
                         <img 
                           src={item.product?.photo?.[0] || '/placeholder.jpg'} 
                           alt="product" 
                           className="w-full h-full object-cover" 
                         />
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300">
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>

                  <Link 
                    href={`/users/orders/${order._id}`}
                    className="flex items-center gap-1 text-sm font-medium text-black dark:text-white hover:underline"
                  >
                    View Details <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// --- Helper Component for Stats ---
function StatCard({ label, count, icon, bg }: { label: string, count: number, icon: any, bg: string }) {
  return (
    <div className={`p-4 rounded-xl border border-transparent ${bg} flex flex-col items-center justify-center text-center gap-2`}>
      <div className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{count}</div>
        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</div>
      </div>
    </div>
  );
}