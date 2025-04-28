import express from "express";
import { createOrder, listOrders, userOrders, getOrderDetail, updateOrderStatus } from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/create", createOrder);
router.get("/list", adminAuth, listOrders);
router.get("/user", userOrders);
router.get("/detail", getOrderDetail);
router.post("/update-status", adminAuth, updateOrderStatus); // New route for updating order status

export default router;
