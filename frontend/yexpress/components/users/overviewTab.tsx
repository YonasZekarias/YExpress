"use client";

import {
  Package,
  Truck,
  Heart,
  MapPin,
  CreditCard,
} from "lucide-react";
import RecentOrdersWidget from "@/components/users/recentOrdersWidget";
import StatCard from "./statCard"

const OverviewTab = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Orders"
          value="24"
          icon={<Package className="w-6 h-6 text-indigo-600" />}
          color="bg-indigo-50"
        />
        <StatCard
          title="Pending Delivery"
          value="2"
          icon={<Truck className="w-6 h-6 text-amber-600" />}
          color="bg-amber-50"
        />
        <StatCard
          title="Wishlist Items"
          value="12"
          icon={<Heart className="w-6 h-6 text-rose-600" />}
          color="bg-rose-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RecentOrdersWidget />
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-900 text-lg">Default Address</h3>
            <button className="text-indigo-600 text-sm font-medium hover:text-indigo-800">
              Edit
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-xl">
              <MapPin className="w-5 h-5 text-slate-400 mt-1" />
              <div>
                <p className="font-semibold text-slate-900">Home</p>
                <p className="text-sm text-slate-600 mt-1">
                  1234 Market Street, Apt 5B <br />
                  San Francisco, CA 94103 <br />
                  United States
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-xl">
              <CreditCard className="w-5 h-5 text-slate-400 mt-1" />
              <div>
                <p className="font-semibold text-slate-900">Default Payment</p>
                <p className="text-sm text-slate-600 mt-1 flex items-center">
                  Visa ending in{" "}
                  <span className="font-mono font-bold mx-1">4242</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
