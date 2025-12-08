interface Order {
  id: string;
  date: string;
  total: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: number;
  image: string; 
}

import { CheckCircle,Truck,Clock,ChevronRight } from "lucide-react";
const mockOrders: Order[] = [
  { id: "#ORD-7782", date: "Oct 24, 2023", total: "$124.50", status: "Shipped", items: 3, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=100&q=80" },
  { id: "#ORD-7781", date: "Oct 12, 2023", total: "$54.00", status: "Delivered", items: 1, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=80" },
  { id: "#ORD-7750", date: "Sep 30, 2023", total: "$289.99", status: "Processing", items: 4, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=100&q=80" },
];

const RecentOrdersWidget = () => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
      <h3 className="font-bold text-slate-900 text-lg">Recent Orders</h3>
      <button className="text-indigo-600 text-sm font-medium hover:text-indigo-800">View All</button>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
          <tr>
            <th className="px-6 py-4 text-left">Order ID</th>
            <th className="px-6 py-4 text-left">Date</th>
            <th className="px-6 py-4 text-left">Status</th>
            <th className="px-6 py-4 text-right">Total</th>
            <th className="px-6 py-4 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {mockOrders.map((order) => (
            <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                   <img src={order.image} alt="Product" className="w-10 h-10 rounded-lg object-cover mr-3 shadow-sm border border-slate-200" />
                   <span className="font-medium text-slate-900">{order.id}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">{order.date}</td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'Processing' ? 'bg-amber-100 text-amber-800' : 
                    'bg-slate-100 text-slate-800'
                  }
                `}>
                  {order.status === 'Delivered' && <CheckCircle className="w-3 h-3 mr-1" />}
                  {order.status === 'Shipped' && <Truck className="w-3 h-3 mr-1" />}
                  {order.status === 'Processing' && <Clock className="w-3 h-3 mr-1" />}
                  {order.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-slate-900 font-semibold text-right">{order.total}</td>
              <td className="px-6 py-4 text-center">
                 <button className="text-slate-400 hover:text-indigo-600 transition">
                    <ChevronRight className="w-5 h-5 mx-auto" />
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
