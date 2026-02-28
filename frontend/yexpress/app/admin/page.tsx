"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DollarSign, ShoppingBag, Users, Package, Loader2 } from "lucide-react";
import StatsCard from "@/components/admin/statsCard";
import AdminOrdersTable from "@/components/admin/adminOrdersTable";
import InventoryWidget from "@/components/admin/inventoryWidget";
import Loading from "../loading";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Adjust URL if your API prefix is different (e.g., /api/admin/dashboard/stats)
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard/stats`, {
           withCredentials: true 
        });
        
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Loading/>
    );
  }

  // Format currency
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  // Helper for trend direction
  const getTrend = (value: number) => value >= 0 ? 'up' : 'down';
  const formatChange = (value: number) => `${Math.abs(value).toFixed(1)}%`;

  return (
    <div className="space-y-8 bg-background dark:bg-slate-900 min-h-screen p-6">
      
      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue (Month)"
          value={formatMoney(stats?.revenue?.value || 0)}
          change={formatChange(stats?.revenue?.change || 0)}
          trend={getTrend(stats?.revenue?.change || 0)}
          icon={<DollarSign className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />}
        />
        <StatsCard
          title="Total Orders"
          value={stats?.orders?.value || 0}
          change={formatChange(stats?.orders?.change || 0)}
          trend={getTrend(stats?.orders?.change || 0)}
          icon={<ShoppingBag className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />}
        />
        <StatsCard
          title="Total Customers"
          value={stats?.customers?.value || 0}
          change={formatChange(stats?.customers?.change || 0)}
          trend={getTrend(stats?.customers?.change || 0)}
          icon={<Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
        />
        <StatsCard
          title="Pending Orders"
          value={stats?.pending?.value || 0}
          change="Live" // Pending orders are usually a live count, not a historical comparison
          trend="up"
          icon={<Package className="w-6 h-6 text-amber-600 dark:text-amber-400" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* You can pass props here if you want to make this dynamic too later */}
          <AdminOrdersTable /> 
        </div>
        <div>
          {/* Pass the low stock data fetched from the stats endpoint */}
          <InventoryWidget products={stats?.lowStock || []} />
        </div>
      </div>
    </div>
  );
}