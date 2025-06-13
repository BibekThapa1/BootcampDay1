import mongoose from "mongoose";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  console.log("Entered here");
  try {
    const { username, email, password, phone } = req.body;
    if (!username || !email || !password || !phone) {
      return res.status(401).json({
        message: "All fields are required",
        success: false,
      });
    }
    const existingUserEmail = await User.findOne({ email });
    if (existingUserEmail) {
      return res.status(401).json({
        message: "Email already exists",
        success: false,
      });
    }
    const existingUserName = await User.findOne({ username });
    if (existingUserName) {
      return res.status(401).json({
        message: "Email already exists",
        success: false,
      });
    }
    let user = await User.create({
      username,
      email,
      password,
      phone,
    });
    if (!user) {
      return res.status(500).json({
        message: "Internal server error",
        success: false,
      });
    }
    res.status(201).json({
      message: "Successfully account created",
      success: true,
    });
  } catch (error) {
    console.log("User registration failed", error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: "Email and password are required",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
        success: false,
      });
    }
    let passwordIsCorrect = await user.comparePassword(password);
    if (!passwordIsCorrect) {
      return res.status(401).json({
        message: "Invalid credentials ",
        success: false,
      });
    }

    const token = await jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2d",
      }
    );
    console.log(user);
    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      phone: user.phone,
    };

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: true,
        maxAge: 1 * 24 * 60 * 60 * 1000,
        secure: false,
      })
      .json({
        message: `welcome back ${user.username}`,
        success: true,
        user: userData,
      });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logoutUser = async (req, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "Successfully logged out",
      success: true,
    });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user id",
        success: false,
      });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.error("Error retrieving user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const editProfile = async (req, res) => {
  try {
    const { username, email, phone } = req.body;
    const userId = req.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    user.username = username || user.username;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    await user.save();

    let userInfo = await User.findById(user._id).select("-password");
    return res.status(200).json({
      message: "Profile updated",
      success: true,
      user: userInfo,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllUser = async (req, res) => {
  if (!req.user || req.user.role != "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access denied",
    });
  }
  try {
    const users = await User.find().select("-password");
    res.json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

const getMyInfo = async (req, res) => {
  try {
    const user = await User.findById(req.id);
    return res.status(200).json({
      message: "Successfully achieved",
      user,
      success:true
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Error occured achieved",
    });
  }
};

export {
  registerUser,
  loginUser,
  editProfile,
  logoutUser,
  getAllUser,
  getProfile,
  getMyInfo
};
