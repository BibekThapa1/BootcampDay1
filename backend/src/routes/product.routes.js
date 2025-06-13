import express, { Router } from "express";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/product.controllers.js";
import { isAdmin, isAuth } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";

const router = Router();

router.get("/", getAllProducts);
router.post("/",isAuth, isAdmin, upload.single("image"), addProduct);
router.patch("/:id",isAuth,isAdmin, updateProduct);
router.delete("/:id",isAuth, isAdmin, deleteProduct);
router.get("/:id", getProductById);

export default router
