import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

const seedAdmin = async () => {
  try {
    const adminEmail = "admin@gmail.com";
    const adminPassword = "admin123";
    const existingAdmin = await User.findOne({
      email: adminEmail,
      role: "admin",
    });
    if (existingAdmin) {
      console.log("Admin already exists.");
      return;
    }
    const admin = new User({
      name: "Admin",
      username: "admin",
      email: adminEmail,
      password: adminPassword,
      phone: "9800000000",
      role: "admin",
    });
    await admin.save();
    console.log("Admin user seeded successfully!");
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

export default seedAdmin;
