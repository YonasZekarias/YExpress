"use client";

import { MoreVertical } from "lucide-react";

interface Order {
  id: string;
  customer: string;
  date: string;
  amount: string;
  status: "Pending" | "Completed" | "Cancelled";
}

const mockRecentOrders: Order[] = [
  { id: "#ORD-001", customer: "Sarah Smith", date: "Today, 10:23 AM", amount: "$120.00", status: "Pending" },
  { id: "#ORD-002", customer: "Michael Brown", date: "Yesterday", amount: "$85.50", status: "Completed" },
  { id: "#ORD-003", customer: "Emily Davis", date: "Yesterday", amount: "$210.00", status: "Completed" },
  { id: "#ORD-004", customer: "James Wilson", date: "Oct 24", amount: "$45.00", status: "Cancelled" },
];

const statusClasses = {
  Completed: "bg-green-100 dark:bg-green-800/30 text-green-800 dark:text-green-300",
  Pending: "bg-amber-100 dark:bg-amber-800/30 text-amber-800 dark:text-amber-300",
  Cancelled: "bg-muted text-foreground/70 dark:bg-muted/50 dark:text-muted-foreground",
};

const AdminOrdersTable = () => (
  <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
    <div className="p-6 border-b border-border flex justify-between items-center">
      <h3 className="font-bold text-foreground">Recent Orders</h3>
      <button className="text-primary hover:text-primary/80 text-sm font-medium">
        View All
      </button>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-muted text-xs uppercase text-muted-foreground font-semibold">
          <tr>
            <th className="px-6 py-4 text-left">Order ID</th>
            <th className="px-6 py-4 text-left">Customer</th>
            <th className="px-6 py-4 text-left">Date</th>
            <th className="px-6 py-4 text-left">Status</th>
            <th className="px-6 py-4 text-right">Amount</th>
            <th className="px-6 py-4 text-center"></th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {mockRecentOrders.map((order) => (
            <tr key={order.id} className="hover:bg-muted/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-foreground">
                {order.id}
              </td>
              <td className="px-6 py-4 text-sm text-muted-foreground">
                {order.customer}
              </td>
              <td className="px-6 py-4 text-sm text-muted-foreground">{order.date}</td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[order.status]}`}
                >
                  {order.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-foreground text-right">
                {order.amount}
              </td>
              <td className="px-6 py-4 text-center">
                <button className="text-muted-foreground hover:text-primary">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AdminOrdersTable;
