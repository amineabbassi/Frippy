import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

export const getDashboardStats = async (req, res) => {
  try {
    console.log("Fetching dashboard stats..."); // Debug log

    // Get counts with error handling
    const [totalOrders, totalProducts, totalUsers] = await Promise.all([
      Order.countDocuments().catch(err => {
        console.error("Error counting orders:", err);
        return 0;
      }),
      Product.countDocuments().catch(err => {
        console.error("Error counting products:", err);
        return 0;
      }),
      User.countDocuments().catch(err => {
        console.error("Error counting users:", err);
        return 0;
      })
    ]);

    console.log("Counts fetched:", { totalOrders, totalProducts, totalUsers }); // Debug log

    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(); // Using lean() for better performance

    console.log("Recent orders fetched:", recentOrders.length); // Debug log

    // Get sales statistics
    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total: { $sum: "$total" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 7 }
    ]);

    console.log("Order stats fetched:", orderStats.length); // Debug log

    const response = {
      success: true,
      data: {
        totalOrders,
        totalProducts,
        totalUsers,
        recentOrders,
        orderStats
      }
    };

    console.log("Sending response"); // Debug log
    res.json(response);
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
