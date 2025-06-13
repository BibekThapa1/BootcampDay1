import express, { Router } from "express";
import { isAdmin, isAuth } from "../middleware/auth.middleware.js";
import {
  editProfile,
  getAllUser,
  getMyInfo,
  getProfile,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controllers.js";
import upload from "../middleware/multer.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.patch("/profile/edit", isAuth, editProfile);
router.get("/profile/:id", isAuth, getProfile);
router.get("/all", isAuth, isAdmin, getAllUser);
router.get("/getMyInfo", isAuth, getMyInfo);

export default router;
