import StatsCard from "@/components/admin/statsCard";
import AdminOrdersTable from "@/components/admin/adminOrdersTable";
import InventoryWidget from "@/components/admin/inventoryWidget";
import { DollarSign, ShoppingBag, Users, Package } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8 bg-background dark:bg-slate-900 min-h-screen p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value="$45,231"
          change="+20.1%"
          trend="up"
          icon={<DollarSign className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />}
        />
        <StatsCard
          title="Total Orders"
          value="1,205"
          change="+4.5%"
          trend="up"
          icon={<ShoppingBag className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />}
        />
        <StatsCard
          title="New Customers"
          value="340"
          change="+12.2%"
          trend="up"
          icon={<Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
        />
        <StatsCard
          title="Pending Orders"
          value="12"
          change="-2.5%"
          trend="down"
          icon={<Package className="w-6 h-6 text-amber-600 dark:text-amber-400" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AdminOrdersTable />
        </div>
        <div>
          <InventoryWidget />
        </div>
      </div>
    </div>
  );
}
