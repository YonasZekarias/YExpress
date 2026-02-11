import { Clock, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import { OrderStats } from '@/types/order';

interface StatsGridProps {
  stats: OrderStats | null;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  if (!stats) return null;

  const items = [
    { label: "Pending", count: stats.pending, icon: <Clock className="w-5 h-5 text-yellow-600" />, bg: "bg-yellow-50 dark:bg-yellow-900/10" },
    { label: "Processing", count: stats.processing, icon: <Package className="w-5 h-5 text-blue-600" />, bg: "bg-blue-50 dark:bg-blue-900/10" },
    { label: "Shipped", count: stats.shipped, icon: <Truck className="w-5 h-5 text-purple-600" />, bg: "bg-purple-50 dark:bg-purple-900/10" },
    { label: "Delivered", count: stats.delivered, icon: <CheckCircle className="w-5 h-5 text-green-600" />, bg: "bg-green-50 dark:bg-green-900/10" },
    { label: "Cancelled", count: stats.cancelled, icon: <XCircle className="w-5 h-5 text-red-600" />, bg: "bg-red-50 dark:bg-red-900/10" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
      {items.map((item) => (
        <div key={item.label} className={`p-3 rounded-xl border border-transparent ${item.bg} flex flex-col items-center justify-center text-center gap-1`}>
          <div className="p-1.5 bg-white dark:bg-gray-800 rounded-full shadow-sm mb-1">{item.icon}</div>
          <div className="text-xl font-bold text-gray-900 dark:text-white leading-none">{item.count}</div>
          <div className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{item.label}</div>
        </div>
      ))}
    </div>
  );
}