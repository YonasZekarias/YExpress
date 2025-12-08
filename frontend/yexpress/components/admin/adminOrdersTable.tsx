"use client";

import { MoreVertical } from "lucide-react";
interface Order {
  id: string;
  customer: string;
  date: string;
  amount: string;
  status: "Pending" | "Completed" | "Cancelled";
}
interface Product {
  id: string;
  name: string;
  price: string;
  stock: number;
  category: string;
}
const mockRecentOrders: Order[] = [
  {
    id: "#ORD-001",
    customer: "Sarah Smith",
    date: "Today, 10:23 AM",
    amount: "$120.00",
    status: "Pending",
  },
  {
    id: "#ORD-002",
    customer: "Michael Brown",
    date: "Yesterday",
    amount: "$85.50",
    status: "Completed",
  },
  {
    id: "#ORD-003",
    customer: "Emily Davis",
    date: "Yesterday",
    amount: "$210.00",
    status: "Completed",
  },
  {
    id: "#ORD-004",
    customer: "James Wilson",
    date: "Oct 24",
    amount: "$45.00",
    status: "Cancelled",
  },
];

const AdminOrdersTable = () => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
      <h3 className="font-bold text-slate-900">Recent Orders</h3>
      <button className="text-indigo-600 text-sm font-medium hover:text-indigo-800">
        View All
      </button>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
          <tr>
            <th className="px-6 py-4 text-left">Order ID</th>
            <th className="px-6 py-4 text-left">Customer</th>
            <th className="px-6 py-4 text-left">Date</th>
            <th className="px-6 py-4 text-left">Status</th>
            <th className="px-6 py-4 text-right">Amount</th>
            <th className="px-6 py-4 text-center"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {mockRecentOrders.map((order) => (
            <tr
              key={order.id}
              className="hover:bg-slate-50/50 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                {order.id}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {order.customer}
              </td>
              <td className="px-6 py-4 text-sm text-slate-500">{order.date}</td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${
                    order.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : order.status === "Pending"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-slate-100 text-slate-800"
                  }
                `}
                >
                  {order.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-slate-900 font-semibold text-right">
                {order.amount}
              </td>
              <td className="px-6 py-4 text-center">
                <button className="text-slate-400 hover:text-indigo-600">
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
export default AdminOrdersTable