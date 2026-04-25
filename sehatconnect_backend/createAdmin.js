import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "./models/Admin.js"; 

const MONGO_URI = "mongodb+srv://sehatconnect18_db_user:ANMsRlkVk8ls6aI8@sehatconnect.ivbnsjx.mongodb.net/sehatconnect?appName=sehatconnect";

mongoose.connect(MONGO_URI)
  .then(async () => {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: "admin@sehatconnect.com" });
    if (existingAdmin) {
      console.log("Admin already exists in DB");
      mongoose.disconnect();
      return;
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await Admin.create({
      name: "Super Admin",          // ✅ Required
      email: "admin@sehatconnect.com",
      password: hashedPassword,
      healthcareCenter: "SehatConnect HQ", // optional, can be empty
      location: "India",                 // optional
      phone: "0000000000",               // optional
    });

    console.log("✅ Admin created successfully in DB!");
    mongoose.disconnect();
  })
  .catch(err => console.error(err));
