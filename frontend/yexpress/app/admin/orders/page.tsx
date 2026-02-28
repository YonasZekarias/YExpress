'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Package } from 'lucide-react';
import OrderToolbar from '@/components/admin/orders/OrderToolbar';
import OrderTable from '@/components/admin/orders/OrderTable';
import Pagination from '@/components/admin/products/Pagination'; // Reusing your existing pagination

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Pagination State
  const [cursors, setCursors] = useState<string[]>([]); // Stores IDs for previous pages
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [currentCursor, setCurrentCursor] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Fetch Orders Function
  const fetchOrders = async (cursorParam: string | null = null) => {
    setLoading(true);
    try {
      // Build query params
      const params: any = { limit: 10 };
      if (cursorParam) params.cursor = cursorParam;
      if (search) params.search = search; // Requires backend support or client-side filter
      
      // If filtering by status, use the status endpoint, else use generic endpoint
      let url = `${API_URL}/admin/orders`;
      if (statusFilter) {
          url = `${API_URL}/admin/orders/status/${statusFilter}`;
      }

      const { data } = await axios.get(url, { 
        params, 
        withCredentials: true 
      });

      if (data.success) {
        // Handle different response structures if status endpoint differs from all-orders
        const fetchedOrders = Array.isArray(data.data) ? data.data : [];
        setOrders(fetchedOrders);
        setNextCursor(data.nextCursor || null);
      }
    } catch (error) {
      console.error("Failed to load orders", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial Fetch & Filter Change
  useEffect(() => {
    // Reset pagination on filter change
    setCursors([]);
    setCurrentCursor(null);
    fetchOrders(null);
  }, [statusFilter, search]); // Re-run when filters change

  // Pagination Handlers
  const handleNext = () => {
    if (nextCursor) {
      setCursors([...cursors, currentCursor || '']);
      setCurrentCursor(nextCursor);
      fetchOrders(nextCursor);
    }
  };

  const handlePrev = () => {
    if (cursors.length > 0) {
      const prev = cursors[cursors.length - 1];
      setCursors(cursors.slice(0, -1));
      setCurrentCursor(prev || null);
      fetchOrders(prev || null);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <Package className="w-8 h-8 text-indigo-600" /> 
            Order Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 ml-11">
            View and manage customer orders
          </p>
        </div>

        {/* Toolbar */}
        <OrderToolbar 
          search={search} 
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onRefresh={() => fetchOrders(currentCursor)}
        />

        {/* Table Area */}
        <div className="flex flex-col">
           <OrderTable orders={orders} loading={loading} />
           
           {/* Pagination */}
           <Pagination 
             hasPrev={cursors.length > 0} 
             hasNext={!!nextCursor} 
             onPrev={handlePrev} 
             onNext={handleNext} 
             pageIndex={cursors.length} 
           />
        </div>

      </div>
    </div>
  );
}