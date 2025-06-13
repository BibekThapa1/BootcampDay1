import { Router } from "express";
import { isAdmin } from "../middleware/auth.middleware.js";
import {
  getAllOrders,
  getDashboardStats,
  getNewOrdersCount,
  getPendingOrdersCount,
  updateOrderStatus,
} from "../controllers/admin.controllers.js";

const router = Router();

router.get("/orders", isAdmin, getAllOrders);
router.get("/orders/new", isAdmin, getNewOrdersCount);
router.get("/orders/pending-count", isAdmin, getPendingOrdersCount);
router.get("/dashboard-stats", isAdmin, getDashboardStats);
router.put("/orders/:orderId", isAdmin, updateOrderStatus);

export default router;
