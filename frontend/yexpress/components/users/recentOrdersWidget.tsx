import {
  CheckCircle,
  Truck,
  Clock,
  ChevronRight,
} from "lucide-react";

interface Order {
  id: string;
  date: string;
  total: string;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  items: number;
  image: string;
}

const mockOrders: Order[] = [
  {
    id: "#ORD-7782",
    date: "Oct 24, 2023",
    total: "$124.50",
    status: "Shipped",
    items: 3,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "#ORD-7781",
    date: "Oct 12, 2023",
    total: "$54.00",
    status: "Delivered",
    items: 1,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "#ORD-7750",
    date: "Sep 30, 2023",
    total: "$289.99",
    status: "Processing",
    items: 4,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=100&q=80",
  },
];

const statusStyles = {
  Delivered:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  Shipped:
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400",
  Processing:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  Cancelled:
    "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400",
};

const RecentOrdersWidget = () => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
    {/* Header */}
    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
        Recent Orders
      </h3>
      <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition">
        View all
      </button>
    </div>

    {/* Table */}
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-500 dark:text-slate-400 font-semibold">
          <tr>
            <th className="px-6 py-4 text-left">Order</th>
            <th className="px-6 py-4 text-left">Date</th>
            <th className="px-6 py-4 text-left">Status</th>
            <th className="px-6 py-4 text-right">Total</th>
            <th className="px-6 py-4 text-center">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {mockOrders.map((order) => (
            <tr
              key={order.id}
              className="group hover:bg-slate-50/60 dark:hover:bg-slate-800/60 transition-colors"
            >
              {/* Order */}
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <img
                    src={order.image}
                    alt="Product"
                    className="w-10 h-10 rounded-xl object-cover mr-3 border border-slate-200 dark:border-slate-700 shadow-sm"
                  />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {order.id}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {order.items} items
                    </p>
                  </div>
                </div>
              </td>

              {/* Date */}
              <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                {order.date}
              </td>

              {/* Status */}
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusStyles[order.status]}`}
                >
                  {order.status === "Delivered" && (
                    <CheckCircle className="w-3.5 h-3.5" />
                  )}
                  {order.status === "Shipped" && (
                    <Truck className="w-3.5 h-3.5" />
                  )}
                  {order.status === "Processing" && (
                    <Clock className="w-3.5 h-3.5" />
                  )}
                  {order.status}
                </span>
              </td>

              {/* Total */}
              <td className="px-6 py-4 text-right font-semibold text-slate-900 dark:text-slate-100">
                {order.total}
              </td>

              {/* Action */}
              <td className="px-6 py-4 text-center">
                <button className="p-2 rounded-full text-slate-400 hover:text-indigo-600 dark:text-slate-500 dark:hover:text-indigo-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 transition">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default RecentOrdersWidget;
