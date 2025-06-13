import express, { Router } from "express";
import { isAuth } from "../middleware/auth.middleware.js";
import {
  addToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../controllers/cart.controllers.js";

const router = Router();

router.get("/", isAuth, getCart);
router.post("/add", isAuth, addToCart);
router.put("/update", isAuth, updateCartItem);
router.delete("/remove/:productId", isAuth, removeCartItem);
router.delete("/clear", isAuth, clearCart);

export default router;
