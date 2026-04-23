import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";     
import Admin from "../models/Admin.js";   

// ===================== LOGIN USER =====================
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    //  Find user in DB
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email" });

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    //  Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "User login successful", token, email: user.email });
  } catch (error) {
    console.error("LoginUser Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===================== LOGIN ADMIN =====================
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid email" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Admin login successful", token, email: admin.email });
  } catch (error) {
    console.error("LoginAdmin Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
