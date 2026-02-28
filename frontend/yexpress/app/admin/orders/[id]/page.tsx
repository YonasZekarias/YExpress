"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  Package, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Printer,
  Mail,
  Phone
} from "lucide-react";
import toast from "react-hot-toast";

// --- Types Matching Your Mongoose Model ---
interface OrderItem {
  product: {
    _id: string;
    name: string;
    photo: string[];
  };
  variant?: {
    _id: string;
    price: number;
  };
  quantity: number;
  price: number;
}

interface OrderDetail {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  } | null;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    country: string;
    postalCode?: string;
    phone?: string;
  };
  paymentInfo: {
    method: string;
    status: string;
    transactionId?: string;
  };
  orderStatus: string;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
  deliveredAt?: string;
}

const statusSteps = ["pending", "processing", "shipped", "delivered"];

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);



  // --- Fetch Order ---
  const fetchOrder = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/orders/${id}`, { withCredentials: true });
      if (data.success) {
        setOrder(data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load order details");
      router.push("/admin/orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  // --- Update Status Handler ---
  const handleStatusUpdate = async (newStatus: string) => {
    if (!order) return;
    setUpdatingStatus(true);
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/orders/${order._id}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      
      if (data.success) {
        setOrder({ ...order, orderStatus: newStatus }); // Optimistic update
        toast.success(`Order updated to ${newStatus}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // --- Formatters ---
  const formatMoney = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const formatDate = (dateString?: string) => 
    dateString ? new Date(dateString).toLocaleString() : "N/A";

  // --- Loading State ---
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (!order) return null;

  // --- Status Color Helper ---
  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
      case "shipped": return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
      case "processing": return "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
      default: return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Orders
          </button>
          
          <div className="flex gap-3">
             <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 dark:text-white rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Printer className="w-4 h-4" /> Print Invoice
             </button>
             {order.orderStatus !== 'cancelled' && (
                <button 
                    onClick={() => handleStatusUpdate('cancelled')}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                >
                    <XCircle className="w-4 h-4" /> Cancel Order
                </button>
             )}
          </div>
        </div>

        {/* Title Section & Status Controller */}
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div>
            <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order #{order._id.slice(-6).toUpperCase()}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                </span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" /> Placed on {formatDate(order.createdAt)}
            </p>
          </div>

          {/* Status Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-gray-100 dark:border-gray-800 w-full lg:w-auto">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Change Status:</span>
            <div className="flex gap-2 flex-wrap">
                {statusSteps.map((step) => (
                    <button
                        key={step}
                        onClick={() => handleStatusUpdate(step)}
                        disabled={updatingStatus || order.orderStatus === step || order.orderStatus === 'cancelled'}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all border 
                            ${order.orderStatus === step 
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-200 dark:ring-indigo-900' 
                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-300 hover:text-indigo-600'
                            }
                            disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                    >
                        {step}
                    </button>
                ))}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Items */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Package className="w-5 h-5 text-indigo-500" /> Order Items
                        </h3>
                        <span className="text-sm text-gray-500">{order.items.length} items</span>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {order.items.map((item, index) => (
                            <div key={index} className="p-6 flex gap-4 items-center hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                                {/* Product Image */}
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden shrink-0 border border-gray-200 dark:border-gray-700">
                                    {item.product?.photo?.[0] ? (
                                        <img src={item.product.photo[0]} alt={item.product.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                                    )}
                                </div>
                                {/* Product Details */}
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 dark:text-white">{item.product?.name || "Unknown Product"}</h4>
                                    {item.variant && <p className="text-xs text-gray-500 mt-1">Variant ID: {item.variant._id.slice(-4)}</p>}
                                </div>
                                {/* Price Calculation */}
                                <div className="text-right">
                                    <p className="font-medium text-gray-900 dark:text-white">{formatMoney(item.price)}</p>
                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                </div>
                                <div className="text-right font-bold text-gray-900 dark:text-white min-w-20">
                                    {formatMoney(item.price * item.quantity)}
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Totals Section */}
                    <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center text-sm mb-2">
                            <span className="text-gray-500">Subtotal</span>
                            <span className="font-medium text-gray-900 dark:text-white">{formatMoney(order.totalAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm mb-4">
                            <span className="text-gray-500">Shipping</span>
                            <span className="font-medium text-gray-900 dark:text-white">Free</span> {/* Adjust logic if you add shipping cost */}
                        </div>
                        <div className="flex justify-between items-center text-lg font-bold pt-4 border-t border-gray-200 dark:border-gray-700">
                            <span className="text-gray-900 dark:text-white">Total</span>
                            <span className="text-indigo-600 dark:text-indigo-400">{formatMoney(order.totalAmount)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Customer & Info */}
            <div className="space-y-6">
                
                {/* Customer Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                            <MapPin className="w-4 h-4" />
                        </div>
                        Customer Details
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="mt-1"><Mail className="w-4 h-4 text-gray-400" /></div>
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {order.user?.firstName} {order.user?.lastName}
                                </p>
                                <p className="text-xs text-gray-500 break-all">{order.user?.email}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="mt-1"><Phone className="w-4 h-4 text-gray-400" /></div>
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {order.shippingAddress.phone || "N/A"}
                                </p>
                            </div>
                        </div>
                        <hr className="border-gray-100 dark:border-gray-700" />
                        <div>
                            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2">Shipping Address</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                {order.shippingAddress.address}<br/>
                                {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br/>
                                {order.shippingAddress.country}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Payment Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                            <CreditCard className="w-4 h-4" />
                        </div>
                        Payment Info
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Method</span>
                            <span className="font-medium capitalize text-gray-900 dark:text-white">
                                {order.paymentInfo.method.replace(/_/g, ' ')}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Status</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                                order.paymentInfo.status === 'paid' 
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            }`}>
                                {order.paymentInfo.status}
                            </span>
                        </div>
                        {order.paymentInfo.transactionId && (
                            <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Transaction ID</p>
                                <p className="text-xs font-mono bg-gray-100 dark:bg-gray-900 p-2 rounded text-gray-600 dark:text-gray-400 break-all">
                                    {order.paymentInfo.transactionId}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Delivered Info (Conditional) */}
                {order.orderStatus === 'delivered' && (
                    <div className="bg-green-50 dark:bg-green-900/10 rounded-2xl border border-green-100 dark:border-green-800/30 p-6">
                        <div className="flex items-center gap-3 text-green-700 dark:text-green-400 mb-2">
                            <CheckCircle className="w-5 h-5" />
                            <h3 className="font-bold">Delivered</h3>
                        </div>
                        <p className="text-sm text-green-600 dark:text-green-500/80">
                            Order was delivered on <strong>{formatDate(order.deliveredAt)}</strong>
                        </p>
                    </div>
                )}

            </div>
        </div>
      </div>
    </div>
  );
}