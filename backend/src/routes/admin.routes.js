import { Router } from "express";
import { isAdmin, isAuth } from "../middleware/auth.middleware.js";
import {
  getAllOrders,
  getDashboardStats,
  getNewOrdersCount,
  getPendingOrdersCount,
  updateOrderStatus,
} from "../controllers/admin.controllers.js";

const router = Router();

router.get("/orders",isAuth, isAdmin, getAllOrders);
router.get("/orders/new",isAuth, isAdmin, getNewOrdersCount);
router.get("/orders/pending-count",isAuth, isAdmin, getPendingOrdersCount);
router.get("/dashboard-stats",isAuth, isAdmin, getDashboardStats);
router.put("/orders/:orderId",isAuth, isAdmin, updateOrderStatus);

export default router;
