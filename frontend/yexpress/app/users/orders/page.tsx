'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { ShoppingBag } from 'lucide-react';
import { Order, OrderStats } from '@/types/order';

// Components
import StatsGrid from '@/components/orders/StatsGrid';
import FilterBar from '@/components/orders/FilterBar';
import OrderCard from '@/components/orders/OrderCard';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Fetch Stats
  useEffect(() => {
    axios.get(`${API_URL}/user/orders/stats`, { withCredentials: true })
      .then(res => res.data.success && setStats(res.data.data))
      .catch(err => console.error("Stats error", err));
  }, []);

  // Fetch Orders
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeTab !== 'all') params.append('status', activeTab);
        params.append('sort', sortBy);

        const { data } = await axios.get(`${API_URL}/user/orders?${params.toString()}`, { withCredentials: true });
        if (data.success) setOrders(data.data);
      } catch (error) {
        console.error("Fetch orders error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [activeTab, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Orders</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Track and manage your recent purchases.</p>
      </div>

      <StatsGrid stats={stats} />

      <FilterBar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        sortBy={sortBy} 
        setSortBy={setSortBy} 
      />

      <div className="space-y-4">
        {loading ? (
           <div className="space-y-4 animate-pulse">
             {[1,2,3].map(i => <div key={i} className="h-40 bg-gray-100 dark:bg-gray-800 rounded-xl" />)}
           </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No orders found</h3>
            <p className="text-gray-500">Try changing your filters.</p>
          </div>
        ) : (
          orders.map((order) => <OrderCard key={order._id} order={order} />)
        )}
      </div>
    </div>
  );
}