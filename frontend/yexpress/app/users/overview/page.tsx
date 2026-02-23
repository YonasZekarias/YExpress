"use client";

import { Package, Truck, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/authStore";
import { getUserStats } from "@/services/user.service";

// Components
import RecentOrdersWidget from "@/components/users/recentOrdersWidget";
import RecentWishlistWidget from "@/components/users/RecentWishlistWidget"; 
import StatCard from "@/components/users/statCard";

const Overview = () => {
  const { username } = useAuthStore();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    wishListCount: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getUserStats();
        // Ensure we handle the response structure correctly
        if (response.data) {
             setStats(response.data);
        }
      } catch (error) {
        console.log("Error fetching user stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Welcome back,{" "}
          <span className="text-indigo-600 dark:text-indigo-400">
            {username}
          </span>{" "}
          👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xl">
          Here’s a quick snapshot of your account activity and recent updates.
        </p>
      </div>

      {/* Content */}
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Orders"
            value={stats.totalOrders.toString()}
            icon={<Package className="w-6 h-6 text-indigo-600" />}
            color="bg-indigo-50 dark:bg-indigo-900/20"
          />
          <StatCard
            title="Pending Delivery"
            value={stats.pendingOrders.toString()}
            icon={<Truck className="w-6 h-6 text-amber-600" />}
            color="bg-amber-50 dark:bg-amber-900/20"
          />
          <StatCard
            title="Wishlist Items"
            value={stats.wishListCount.toString()}
            icon={<Heart className="w-6 h-6 text-rose-600" />}
            color="bg-rose-50 dark:bg-rose-900/20"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Recent Orders (Left Column - Spans 2) */}
          <div className="xl:col-span-2 h-full">
            <RecentOrdersWidget />
          </div>

          {/* Wishlist Widget (Right Column - Spans 1) */}
          <div className="h-full">
            <RecentWishlistWidget />
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Overview;