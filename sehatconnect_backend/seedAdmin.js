import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";

dotenv.config({ path: "./.env" });

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
  tls: true,
});


    const existingAdmin = await Admin.findOne({
      email: "admin@sehatconnect.com",
    });

    if (existingAdmin) {
      console.log("Admin already exists ✅");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await Admin.create({
      name: "Admin",
      email: "admin@sehatconnect.com",
      password: hashedPassword,
    });

    console.log("Admin created successfully ✅");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();
