import { Router } from "express";
import { isAdmin, isAuth } from "../middleware/auth.middleware.js";
import {
  cancelOrder,
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  updateProductStock,
} from "../controllers/order.controllers.js";

const router = Router();

router.post("/", isAuth, createOrder);
router.get("/all", isAdmin, getAllOrders);
router.get("/my-orders", isAuth, getUserOrders);
router.patch("/:orderId/status", isAdmin, updateOrderStatus);
router.get("/:id", isAuth, getOrderById);
router.delete("/:id", isAdmin, deleteOrder);
router.put("/product/:id/stock", isAdmin, updateProductStock);
router.put("/:orderId/cancel", isAuth, cancelOrder);

export default router;
