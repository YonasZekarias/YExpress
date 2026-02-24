import { Clock, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import { OrderStats } from '@/types/order';

interface StatsGridProps {
  stats: OrderStats | null;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  if (!stats) return null;

  const items = [
    { 
      label: "Pending", 
      count: stats.pending, 
      icon: <Clock className="w-6 h-6" />, 
      // Amber theme: Warm and alert
      styles: "bg-amber-50 text-amber-600 border-amber-200 shadow-amber-200 dark:bg-amber-900/20 dark:border-amber-800 " 
    },
    { 
      label: "Processing", 
      count: stats.processing, 
      icon: <Package className="w-6 h-6" />, 
      // Blue theme: Professional and active
      styles: "bg-blue-50 text-blue-600 border-blue-200 shadow-blue-200 dark:bg-blue-900/20 dark:border-blue-800 "
    },
    { 
      label: "Shipped", 
      count: stats.shipped, 
      icon: <Truck className="w-6 h-6" />, 
      // Indigo theme: Deep and moving
      styles: "bg-indigo-50 text-indigo-600 border-indigo-200 shadow-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800 "
    },
    { 
      label: "Delivered", 
      count: stats.delivered, 
      icon: <CheckCircle className="w-6 h-6" />, 
      // Emerald theme: Success and crisp
      styles: "bg-emerald-50 text-emerald-600 border-emerald-200 shadow-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800"
    },
    { 
      label: "Cancelled", 
      count: stats.cancelled, 
      icon: <XCircle className="w-6 h-6" />, 
      // Rose theme: Softer red, distinct
      styles: "bg-rose-50 text-rose-600 border-rose-200 shadow-rose-200 dark:bg-rose-900/20 dark:border-rose-800"
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
      {items.map((item) => (
        <div 
          key={item.label} 
          // The magic happens here: shadow-[3px_3px_0px_0px_currentColor] simulates the border
          className={`
            relative p-4 rounded-xl border transition-transform hover:-translate-y-1
            flex flex-col items-center justify-center text-center gap-2
            shadow-[3px_3px_0px_0px_currentColor] 
            ${item.styles}
          `}
        >
          {/* Icon Container */}
          <div className="p-2 bg-white/60 dark:bg-black/20 rounded-full backdrop-blur-sm">
            {item.icon}
          </div>
          
          {/* Stats */}
          <div className="flex flex-col">
            <span className="text-2xl font-black leading-none tracking-tight">
              {item.count}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-80 mt-1">
              {item.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}