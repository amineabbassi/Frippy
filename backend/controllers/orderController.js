import Order from "../models/orderModel.js";
import Stripe from "stripe";
import Razorpay from "razorpay";
import mongoose from "mongoose";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Ensure this is loaded from .env
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Ensure this is loaded from .env
});

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { user, firstName, lastName, mobile, items, total, address, paymentMethod, paymentDetails } = req.body;

    // Validate required fields
    if (!user || !firstName || !lastName || !mobile || !items || !total || !address || !paymentMethod) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    // Check if items is an array
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Items array is required and cannot be empty." });
    }

    // Validate and convert productId to ObjectId
    const updatedItems = items.map(item => {
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        throw new Error(`Invalid productId: ${item.productId}`);
      }
      return {
        ...item,
        productId: new mongoose.Types.ObjectId(item.productId),
      };
    });

    // Handle payment validation
    if (paymentMethod === "stripe") {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentDetails.paymentIntentId);
      if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({ success: false, message: "Stripe payment not completed" });
      }
    } else if (paymentMethod === "razorpay") {
      const paymentVerification = await razorpay.payments.fetch(paymentDetails.razorpayPaymentId);
      if (!paymentVerification || paymentVerification.status !== "captured") {
        return res.status(400).json({ success: false, message: "Razorpay payment not completed" });
      }
    }

    // Create the order
    const order = new Order({
      user,
      firstName, // Store first name
      lastName, // Store last name
      mobile, // Store mobile number
      items: updatedItems,
      total,
      address, // Store delivery address
      status: paymentMethod === "cod" ? "pending" : "paid",
    });
    await order.save();

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error("Error in createOrder:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all orders (admin)
export const listOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get orders for a user
export const userOrders = async (req, res) => {
  try {
    const { user } = req.query;
    const orders = await Order.find({ user }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single order details by orderId
export const getOrderDetail = async (req, res) => {
  try {
    const { orderId } = req.query;
    if (!orderId) {
      return res.status(400).json({ success: false, message: "Missing orderId." });
    }
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Error in getOrderDetail:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    // Validate input
    if (!orderId || !status) {
      return res.status(400).json({ success: false, message: "Order ID and status are required." });
    }

    // Find and update the order
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true } // Return the updated document
    );

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    res.status(200).json({ success: true, message: "Order status updated successfully.", order });
  } catch (error) {
    console.error("Error updating order status:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
