import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// for logged in user
export const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "Unathorized access",
        success: false,
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }
    req.id = decoded.userId;
    req.user = await User.findById(decoded.userId).select("-password");
    next();
  } catch (error) {
    console.log("Authentication error", error);
    return res.status(401).json({
      message: "Authentication failed",
      success: false,
    });
  }
};

// for admin user
export const isAdmin = async (req, res, next) => {
  if (!req.user || req.user.role != "admin") {
    return res.status(403).json({
      message: "Admin access denied",
      success: false,
    });
  }
  next();
};

// for normal logged in user
export const isUser = async (req, res, next) => {
  if (!req.user || req.user.role != "user") {
    return res.status(403).json({
      message: "User acccess denied",
      success: false,
    });
  }
  next();
};
