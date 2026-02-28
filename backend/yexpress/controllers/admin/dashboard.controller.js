const Order = require('../../models/Order'); // Adjust path to your models
const User = require('../../models/User');
const ProductVariant = require('../../models/productVariant');
const Product = require('../../models/Product');

exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    // Get start of current month
    const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    // Get start of last month
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    // Get end of last month
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    // --- 1. TOTAL REVENUE (Based on non-cancelled orders) ---
    // We calculate "This Month" vs "Last Month"
    const revenueStats = await Order.aggregate([
      {
        $match: {
          orderStatus: { $ne: 'cancelled' }, // Exclude cancelled orders
          createdAt: { $gte: startOfLastMonth } // Only look at last 2 months
        }
      },
      {
        $group: {
          _id: { 
            month: { $month: "$createdAt" }, 
            year: { $year: "$createdAt" } 
          },
          totalRevenue: { $sum: "$totalAmount" },
        }
      }
    ]);

    // Extract values
    const thisMonthRev = revenueStats.find(r => r._id.month === (today.getMonth() + 1))?.totalRevenue || 0;
    const lastMonthRev = revenueStats.find(r => r._id.month === (startOfLastMonth.getMonth() + 1))?.totalRevenue || 0;
    
    // Calculate % change
    const revenueChange = lastMonthRev === 0 ? (thisMonthRev > 0 ? 100 : 0) : ((thisMonthRev - lastMonthRev) / lastMonthRev) * 100;


    // --- 2. TOTAL ORDERS ---
    const totalOrders = await Order.countDocuments({ orderStatus: { $ne: 'cancelled' } });
    
    // Orders % Change
    const thisMonthOrders = await Order.countDocuments({ 
        orderStatus: { $ne: 'cancelled' },
        createdAt: { $gte: startOfThisMonth } 
    });
    const lastMonthOrders = await Order.countDocuments({ 
        orderStatus: { $ne: 'cancelled' },
        createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } 
    });
    
    const orderChange = lastMonthOrders === 0 ? (thisMonthOrders > 0 ? 100 : 0) : ((thisMonthOrders - lastMonthOrders) / lastMonthOrders) * 100;


    // --- 3. NEW CUSTOMERS (Role: 'user') ---
    const totalCustomers = await User.countDocuments({ role: 'user' });
    
    const thisMonthCustomers = await User.countDocuments({ 
        role: 'user', 
        createdAt: { $gte: startOfThisMonth } 
    });
    const lastMonthCustomers = await User.countDocuments({ 
        role: 'user', 
        createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } 
    });

    const customerChange = lastMonthCustomers === 0 ? (thisMonthCustomers > 0 ? 100 : 0) : ((thisMonthCustomers - lastMonthCustomers) / lastMonthCustomers) * 100;


    // --- 4. PENDING ORDERS ---
    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });


    // --- 5. LOW STOCK INVENTORY ---
    // Since stock is in ProductVariant, we find variants with stock < 10
    const lowStockVariants = await ProductVariant.find({ stock: { $lt: 10 } })
        .populate('product', 'name photo') // Populate parent product name and photo
        .limit(5)
        .sort({ stock: 1 }); // Show lowest stock first

    // Format low stock for the widget
    const formattedLowStock = lowStockVariants.map(v => ({
        id: v._id,
        name: v.product ? v.product.name : 'Unknown Product',
        stock: v.stock,
        price: v.price,
        image: v.product && v.product.photo && v.product.photo.length > 0 ? v.product.photo[0] : null
    }));


    // --- RESPONSE ---
    res.status(200).json({
      success: true,
      data: {
        revenue: { value: thisMonthRev, change: revenueChange.toFixed(1) },
        orders: { value: totalOrders, change: orderChange.toFixed(1) },
        customers: { value: totalCustomers, change: customerChange.toFixed(1) },
        pending: { value: pendingOrders, change: 0 }, // Pending is live state
        lowStock: formattedLowStock
      }
    });

  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};