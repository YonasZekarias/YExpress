"use client";

import {
  Package,
  Truck,
  Heart,
  MapPin,
  CreditCard,
} from "lucide-react";

import RecentOrdersWidget from "@/components/users/recentOrdersWidget";
import StatCard from "@/components/users/statCard";
import useAuthStore from "@/store/authStore";

const Overview = () => {
  const { username } = useAuthStore();

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Welcome back,{" "}
          <span className="text-indigo-600 dark:text-indigo-400">{username}</span> 👋
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
            value="24"
            icon={<Package className="w-6 h-6 text-indigo-600" />}
            color="bg-indigo-50 dark:bg-indigo-900/20"
          />
          <StatCard
            title="Pending Delivery"
            value="2"
            icon={<Truck className="w-6 h-6 text-amber-600" />}
            color="bg-amber-50 dark:bg-amber-900/20"
          />
          <StatCard
            title="Wishlist Items"
            value="12"
            icon={<Heart className="w-6 h-6 text-rose-600" />}
            color="bg-rose-50 dark:bg-rose-900/20"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="xl:col-span-2">
            <RecentOrdersWidget />
          </div>

          {/* Address & Payment */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col bg-white dark:bg-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
                Quick Info
              </h3>
              <button className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition">
                Manage
              </button>
            </div>

            <div className="space-y-4">
              {/* Address */}
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 transition">
                <MapPin className="w-5 h-5 text-slate-400 dark:text-slate-300 mt-1" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    Home Address
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    1234 Market Street, Apt 5B <br />
                    San Francisco, CA 94103 <br />
                    United States
                  </p>
                </div>
              </div>

              {/* Payment */}
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 transition">
                <CreditCard className="w-5 h-5 text-slate-400 dark:text-slate-300 mt-1" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    Default Payment
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                    Visa ••••{" "}
                    <span className="font-mono font-semibold">4242</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Optional CTA */}
            <button className="mt-6 w-full py-2.5 rounded-xl text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-800 transition">
              Update details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
